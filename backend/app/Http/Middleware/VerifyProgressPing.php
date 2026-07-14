<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\ActivityLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyProgressPing
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 401);
        }

        // Cache session checks to reduce database load on high-frequency progress pings
        $cacheKey = "user_session_valid_{$user->id}";
        
        $cacheStore = \Illuminate\Support\Facades\Cache::store();
        $supportsTags = method_exists($cacheStore, 'tags');
        
        if ($supportsTags) {
            $taggedCache = \Illuminate\Support\Facades\Cache::tags(['user_'.$user->id]);
            if ($taggedCache->has($cacheKey)) {
                $taggedCache->put($cacheKey, true, 600);
            } else {
                if ($user->is_suspended) {
                    return response()->json([
                        'message' => 'Access denied. Account is suspended.',
                    ], 403);
                }
                $taggedCache->put($cacheKey, true, 600);
            }
        } else {
            if (\Illuminate\Support\Facades\Cache::has($cacheKey)) {
                // Laravel 13 touch() extends cache TTL in one underlying command
                \Illuminate\Support\Facades\Cache::touch($cacheKey, 600);
            } else {
                if ($user->is_suspended) {
                    return response()->json([
                        'message' => 'Access denied. Account is suspended.',
                    ], 403);
                }
                \Illuminate\Support\Facades\Cache::put($cacheKey, true, 600);
            }
        }

        // Validate payload contains required fields before checking logic
        if (!$request->has('lesson_id') || !$request->has('watch_time_seconds')) {
            return $next($request);
        }

        $watchTimeSeconds = (int) $request->input('watch_time_seconds');

        // 1. If watch time is 0 (e.g. manual status toggle or initialize), bypass wall-clock checks
        if ($watchTimeSeconds === 0) {
            return $next($request);
        }

        // 2. Prevent massive delta progress updates (max batch size is 60s, permit up to 70s)
        if ($watchTimeSeconds > 70) {
            return response()->json([
                'message' => 'Unprocessable Entity. Invalid progress delta.',
            ], 422);
        }

        // 3. Query existing progress log for this user and lesson
        $activityLog = ActivityLog::where('user_id', $user->id)
            ->where('lesson_id', $request->input('lesson_id'))
            ->first();

        if ($activityLog && $activityLog->last_accessed_at) {
            // Calculate seconds elapsed since the last progress heartbeat ping
            $secondsElapsed = now()->timestamp - $activityLog->last_accessed_at->timestamp;

            // Allow a 5-second network/latency variance buffer
            if ($watchTimeSeconds > ($secondsElapsed + 5)) {
                return response()->json([
                    'message' => 'Unprocessable Entity. Progress exceeds elapsed wall-clock time.',
                    'details' => [
                        'watch_time_seconds' => $watchTimeSeconds,
                        'seconds_elapsed_since_last_ping' => $secondsElapsed,
                    ]
                ], 422);
            }
        }

        return $next($request);
    }
}
