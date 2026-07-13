<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    /**
     * Return aggregate platform statistics for the admin dashboard.
     */
    public function stats(): JsonResponse
    {
        $totalStudents = User::where('role', 'student')->count();

        $activeStudents = User::where('role', 'student')
            ->whereHas('activityLogs', function ($query) {
                $query->where('last_accessed_at', '>=', now()->subDays(7));
            })
            ->count();

        // Placeholder revenue: students × first published course price
        $coursePrice = Course::where('is_published', true)->value('price') ?? 0;
        $totalRevenue = $totalStudents * (float) $coursePrice;

        $recentSignups = User::where('role', 'student')
            ->latest()
            ->take(10)
            ->get(['id', 'name', 'email', 'created_at']);

        return response()->json([
            'data' => [
                'total_students' => $totalStudents,
                'active_students' => $activeStudents,
                'total_revenue' => round($totalRevenue, 2),
                'recent_signups' => $recentSignups,
            ],
        ], 200);
    }
}
