<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use App\Mail\LoginSecurityCode;
use App\Models\User;
use App\Models\TrustedDevice;

class LoginController extends Controller
{
    public function logout(Request $request)
    {
        $user = Auth::user();
        $token = $request->bearerToken() ?? $request->cookie('auth_token');

        if ($user && $token) {
            $tokens = json_decode($user->api_token, true);
            if (is_array($tokens)) {
                $tokens = array_values(array_diff($tokens, [$token]));
                $user->api_token = !empty($tokens) ? json_encode($tokens) : null;
            } elseif ($user->api_token === $token) {
                $user->api_token = null;
            }
            $user->save();
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $response = response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);

        $response->withCookie(cookie()->forget('auth_token'));

        return $response;
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'remember_me' => 'boolean',
        ]);

        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = Auth::user();

        // Check if device/browser is already trusted for 14 days
        $deviceCookie = $request->cookie('trusted_device_token');
        if ($deviceCookie) {
            $hashedCookie = hash('sha256', $deviceCookie);
            $trustedDevice = TrustedDevice::where('user_id', $user->id)
                ->where('device_token', $hashedCookie)
                ->where('expires_at', '>', now())
                ->first();

            if ($trustedDevice) {
                // Device is trusted! Bypass 2FA verification.
                $newToken = Str::random(80);
                $tokens = json_decode($user->api_token, true);
                if (!is_array($tokens)) {
                    $tokens = array_filter([$user->api_token]);
                }
                $tokens[] = $newToken;
                if (count($tokens) > 10) {
                    array_shift($tokens);
                }
                $user->api_token = json_encode(array_values($tokens));
                $user->save();

                Auth::login($user);

                $rememberMe = $request->boolean('remember_me');
                $minutes = 525600; // Persistent 1-year duration so admin stays logged in until manual logout

                $response = response()->json([
                    'success' => true,
                    'device_trusted' => true,
                    'token' => $newToken,
                    'user' => [
                        'name' => $user->name,
                        'email' => $user->email,
                    ],
                    'message' => 'Device recognized. Welcome back!',
                    'redirect' => '/dashboard'
                ]);

                return $response->withCookie(cookie('auth_token', $newToken, $minutes));
            }
        }

        // Untrusted device / expired trust period: Issue email verification token
        return $this->sendLoginVerificationToken($user, $request->boolean('remember_me'));
    }

    public function resendSecurityToken(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
        ]);

        $user = User::find($request->user_id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found.'], 404);
        }

        // Rate limiting resend requests (60 second cooldown)
        $throttleKey = 'resend_security_token_' . $user->id;
        if (RateLimiter::tooManyAttempts($throttleKey, 1)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json([
                'success' => false,
                'message' => "Please wait {$seconds} seconds before requesting a new code."
            ], 429);
        }
        RateLimiter::hit($throttleKey, 60);

        return $this->sendLoginVerificationToken($user, false);
    }

    private function sendLoginVerificationToken(User $user, bool $rememberMe)
    {
        // Generate 6-digit security token
        $code = sprintf('%06d', random_int(0, 999999));
        
        // Save hashed code in cache (expires in 10 minutes)
        Cache::put('login_security_token_' . $user->id, [
            'code_hash' => Hash::make($code),
            'plain_code_dev' => config('app.debug') ? $code : null,
            'remember_me' => $rememberMe,
            'expires_at' => now()->addMinutes(10)->timestamp,
        ], now()->addMinutes(10));

        $debugCode = null;
        try {
            Mail::to($user->email)->send(new LoginSecurityCode($code));
        } catch (\Throwable $e) {
            Log::error('Login security token email failed: ' . $e->getMessage());
            if (config('app.debug')) {
                $debugCode = $code;
            }
        }

        if (config('app.debug')) {
            $debugCode = $code;
        }

        return response()->json([
            'success' => true,
            'requires_security_token' => true,
            'user_id' => $user->id,
            'email' => $user->email,
            'message' => 'A 6-digit security token has been sent to your email (' . $user->email . ').',
            'debug_code' => $debugCode,
            'expires_in_seconds' => 600,
        ]);
    }

    public function verifySecurityToken(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
            'code' => 'required|string|size:6',
        ]);

        $user = User::find($request->user_id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found.'], 404);
        }

        // Rate limit verification attempts (max 5 failed attempts per user per 10 minutes)
        $rateLimitKey = 'verify_code_attempts_' . $user->id;
        if (RateLimiter::tooManyAttempts($rateLimitKey, 5)) {
            $seconds = RateLimiter::availableIn($rateLimitKey);
            return response()->json([
                'success' => false,
                'message' => "Too many invalid attempts. Please wait {$seconds} seconds."
            ], 429);
        }

        $cached = Cache::get('login_security_token_' . $user->id);
        
        // Single-use token & hashed validation check
        $isValid = false;
        if ($cached && isset($cached['code_hash'])) {
            $isValid = Hash::check($request->code, $cached['code_hash']);
        } elseif ($cached && isset($cached['code'])) {
            // Backward compatibility fallback
            $isValid = ($cached['code'] === $request->code);
        }

        if (!$cached || !$isValid) {
            RateLimiter::hit($rateLimitKey, 600);
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired 6-digit security code.'
            ], 422);
        }

        // Immediate single-use token invalidation
        Cache::forget('login_security_token_' . $user->id);
        RateLimiter::clear($rateLimitKey);

        // Generate 14-day trusted device token
        $rawDeviceToken = Str::random(64);
        $hashedDeviceToken = hash('sha256', $rawDeviceToken);
        $expiresAt = now()->addDays(14);

        TrustedDevice::create([
            'user_id' => $user->id,
            'device_token' => $hashedDeviceToken,
            'device_name' => substr($request->header('User-Agent', 'Unknown Device'), 0, 255),
            'ip_address' => $request->ip(),
            'expires_at' => $expiresAt,
        ]);

        // Issue auth token
        $newToken = Str::random(80);
        $tokens = json_decode($user->api_token, true);
        if (!is_array($tokens)) {
            $tokens = array_filter([$user->api_token]);
        }
        $tokens[] = $newToken;
        if (count($tokens) > 10) {
            array_shift($tokens);
        }

        $user->api_token = json_encode(array_values($tokens));
        $user->save();

        Auth::login($user);

        $rememberMe = $cached['remember_me'] ?? false;
        $minutes = 525600; // Persistent 1-year duration so admin stays logged in until manual logout
        $deviceCookieMinutes = 60 * 24 * 14; // 14 days (20160 minutes)

        $response = response()->json([
            'success' => true,
            'message' => 'Device verified! You won\'t need to verify this device again for 14 days.',
            'token' => $newToken,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
            'redirect' => '/dashboard'
        ]);

        return $response
            ->withCookie(cookie('auth_token', $newToken, $minutes))
            ->withCookie(cookie('trusted_device_token', $rawDeviceToken, $deviceCookieMinutes, null, null, false, true));
    }
}
