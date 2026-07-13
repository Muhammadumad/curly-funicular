<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Ensure we only set headers on Response objects (not on binary file downloads etc. if not applicable, though standard Response has it)
        if (method_exists($response, 'header')) {
            $response->header('X-Frame-Options', 'DENY');
            $response->header('X-Content-Type-Options', 'nosniff');
            $response->header('X-XSS-Protection', '1; mode=block');
            // Only set HSTS in production with HTTPS
            if (app()->environment('production')) {
                $response->header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
            }
        }

        return $response;
    }
}
