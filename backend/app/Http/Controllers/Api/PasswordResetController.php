<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    /**
     * Send password reset link to user email.
     */
    public function sendResetLink(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);

        // Check if user exists first
        $userExists = \App\Models\User::where('email', $request->email)->exists();

        if ($userExists) {
            Password::sendResetLink(
                $request->only('email')
            );
        }

        // SECURITY: Return a generic message to prevent user enumeration attacks
        return response()->json([
            'message' => 'If that email exists, a reset link has been sent.'
        ], 200);
    }

    /**
     * Perform the actual password reset using the token.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        \Illuminate\Support\Facades\Log::debug('RESET-PASSWORD attempt', [
            'email' => $request->email,
            'token_length' => strlen($request->token ?? ''),
            'has_password' => !empty($request->password),
            'has_confirmation' => !empty($request->password_confirmation),
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        \Illuminate\Support\Facades\Log::debug('RESET-PASSWORD result', [
            'status' => $status,
            'is_reset' => $status === Password::PASSWORD_RESET,
        ]);

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => __($status)], 200)
            : response()->json(['email' => [__($status)]], 422);
    }
}
