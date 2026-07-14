<?php

declare(strict_types=1);

namespace App\Services\Video;

class JwtTokenGenerator
{
    /**
     * Generate a short-lived JSON Web Token (JWT).
     */
    public static function generate(array $payload, string $secret, int $expirationSeconds = 14400): string
    {
        $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
        
        $payload['exp'] = time() + $expirationSeconds;
        
        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode(json_encode($payload));
        
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        $base64UrlSignature = self::base64UrlEncode($signature);
        
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    /**
     * Verify and decode a JWT. Returns null if invalid or expired.
     */
    public static function verify(string $token, string $secret): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$base64UrlHeader, $base64UrlPayload, $base64UrlSignature] = $parts;

        // Verify signature
        $expectedSignature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        $calculatedSignature = self::base64UrlEncode($expectedSignature);

        if (!hash_equals($calculatedSignature, $base64UrlSignature)) {
            return null;
        }

        $payloadJson = base64_decode(str_replace(['-', '_'], ['+', '/'], $base64UrlPayload));
        $payload = json_decode($payloadJson, true);

        if (!$payload || !isset($payload['exp'])) {
            return null;
        }

        // Check expiration
        if (time() > (int) $payload['exp']) {
            return null;
        }

        return $payload;
    }

    private static function base64UrlEncode(string $data): string
    {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }
}
