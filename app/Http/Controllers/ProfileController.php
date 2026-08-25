<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\ProfileVerificationCode;
use App\Models\TrustedDevice;

class ProfileController extends Controller
{
    public function sendCode(Request $request)
    {
        $request->validate([
            'type' => 'required|in:email,password',
        ]);

        if ($request->type === 'email') {
            $request->validate([
                'email' => 'required|email|unique:users,email,' . Auth::id(),
            ]);
        } else {
            $request->validate([
                'current_password' => 'required|string',
                'password' => 'required|string|min:8|confirmed|different:current_password',
            ]);
        }

        $user = Auth::user();
        if ($request->type === 'email' && $request->email === $user->email) {
            return response()->json([
                'success' => false,
                'message' => 'Enter a different email address than your current one.',
            ], 422);
        }

        if ($request->type === 'password' && !Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Your current password is incorrect.',
            ], 422);
        }

        $code = sprintf('%06d', random_int(0, 999999));
        $data = $request->type === 'email'
            ? ['email' => $request->email]
            : ['password_hash' => Hash::make($request->password)];

        Cache::put('auth_code_' . $user->id, [
            'code' => $code,
            'type' => $request->type,
            'data' => $data,
        ], now()->addMinutes(15));

        $debugCode = null;
        try {
            Mail::to($user->email)->send(new ProfileVerificationCode(
                $code,
                $request->type === 'email' ? 'email address' : 'password'
            ));
        } catch (\Throwable $e) {
            Log::error('Verification email dispatch failed: ' . $e->getMessage());
            if (config('app.debug')) {
                $debugCode = $code;
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'A 6-digit verification code has been sent to your email (' . $user->email . ').',
            'debug_code' => $debugCode,
        ]);
    }

    public function verifyAndSave(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = Auth::user();
        $cached = Cache::get('auth_code_' . $user->id);

        if (!$cached || $cached['code'] !== $request->code) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired 6-digit verification code.'
            ], 400);
        }

        if ($cached['type'] === 'email') {
            $user->email = $cached['data']['email'];
        } else if ($cached['type'] === 'password') {
            $user->password = $cached['data']['password_hash'];
            
            // SECURITY: Revoke all trusted devices when password changes
            $user->trustedDevices()->delete();
        }

        $user->save();
        Cache::forget('auth_code_' . $user->id);

        $response = response()->json([
            'success' => true,
            'message' => $cached['type'] === 'password'
                ? 'Your password has been successfully updated! All trusted devices have been revoked.'
                : 'Your email address has been successfully updated!',
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ]
        ]);

        if ($cached['type'] === 'password') {
            $response->withCookie(cookie()->forget('trusted_device_token'));
        }

        return $response;
    }

    public function revokeTrustedDevices(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            $user->trustedDevices()->delete();
        }

        $response = response()->json([
            'success' => true,
            'message' => 'All trusted devices have been successfully revoked. Email verification will be required on your next login.',
        ]);

        return $response->withCookie(cookie()->forget('trusted_device_token'));
    }

    public function getTrustedDevices(Request $request)
    {
        $user = Auth::user();
        $devices = $user->trustedDevices()
            ->where('expires_at', '>', now())
            ->get(['id', 'device_name', 'ip_address', 'expires_at', 'created_at']);

        return response()->json([
            'success' => true,
            'trusted_devices' => $devices,
        ]);
    }
}
