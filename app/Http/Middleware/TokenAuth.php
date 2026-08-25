<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class TokenAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken() ?? $request->cookie('auth_token');

        if (!$token) {
            if ($request->expectsJson()) {
                return response()->json(['success' => false, 'message' => 'Unauthenticated'], 401);
            }
            return redirect('/login');
        }

        $user = \App\Models\User::where('api_token', $token)
            ->orWhere('api_token', 'LIKE', '%' . $token . '%')
            ->get()
            ->first(function ($u) use ($token) {
                if (empty($u->api_token)) return false;
                if ($u->api_token === $token) return true;
                $tokens = json_decode($u->api_token, true);
                return is_array($tokens) && in_array($token, $tokens, true);
            });

        if (!$user) {
            if ($request->expectsJson()) {
                return response()->json(['success' => false, 'message' => 'Unauthenticated'], 401);
            }
            return redirect('/login');
        }

        Auth::login($user);

        /** @var \Symfony\Component\HttpFoundation\Response $response */
        $response = $next($request);

        // Keep session active indefinitely until user explicitly logs out (renew token cookie for 1 year = 525,600 minutes)
        $oneYearMinutes = 525600;
        if (method_exists($response, 'withCookie')) {
            $response->withCookie(cookie('auth_token', $token, $oneYearMinutes, null, null, false, false));
        } elseif (property_exists($response, 'headers') && $response->headers) {
            $response->headers->setCookie(cookie('auth_token', $token, $oneYearMinutes, null, null, false, false));
        }

        return $response;
    }
}
