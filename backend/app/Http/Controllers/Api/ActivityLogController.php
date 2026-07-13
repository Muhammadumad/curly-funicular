<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TrackProgressRequest;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class ActivityLogController extends Controller
{
    /**
     * Handle the real-time background progress tracking heartbeat ping.
     */
    public function updateProgress(TrackProgressRequest $request): JsonResponse
    {
        $user = $request->user();

        // 1. Check if the activity log already exists
        $activityLog = ActivityLog::where('user_id', $user->id)
            ->where('lesson_id', $request->lesson_id)
            ->first();

        // 2. Perform records authorization using the ActivityLogPolicy
        if ($activityLog) {
            if (! Gate::allows('update', $activityLog)) {
                return response()->json([
                    'message' => 'Access denied. You do not own this activity log.',
                ], 403);
            }
        }

        // 3. Atomically update or create progress tracking record
        $watchTime = (int) $request->watch_time_seconds;
        if ($activityLog) {
            $watchTime += $activityLog->watch_time_seconds;
        }

        $status = $request->status ?? ($activityLog?->status ?? 'started');

        $log = ActivityLog::updateOrCreate(
            [
                'user_id' => $user->id,
                'lesson_id' => $request->lesson_id,
            ],
            [
                'watch_time_seconds' => $watchTime,
                'status' => $status,
                'last_accessed_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Progress tracked successfully.',
            'activity_log' => $log,
        ], 200);
    }
}
