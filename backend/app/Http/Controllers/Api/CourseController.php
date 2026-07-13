<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Return all published courses along with their nested lessons.
     */
    public function index(): JsonResponse
    {
        $courses = Course::with(['lessons' => function ($query) {
            $query->orderBy('order_sequence', 'asc');
        }])
        ->where('is_published', true)
        ->get();

        return response()->json($courses, 200);
    }

    /**
     * Return a single course with its nested lessons matched by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $relations = [
            'lessons' => function ($query) {
                $query->orderBy('order_sequence', 'asc');
            }
        ];

        if (auth('sanctum')->check()) {
            $userId = auth('sanctum')->id();
            $relations['lessons.activityLogs'] = function ($query) use ($userId) {
                $query->where('user_id', $userId);
            };
        }

        $course = Course::with($relations)
            ->where('slug', $slug)
            ->where('is_published', true)
            ->first();

        if (! $course) {
            return response()->json([
                'message' => 'Course not found.',
            ], 404);
        }

        return response()->json($course, 200);
    }

    /**
     * Calculate and return course completion progress for the authenticated user.
     */
    public function getProgress(string $slug, Request $request): JsonResponse
    {
        $user = $request->user();

        $course = Course::where('slug', $slug)
            ->where('is_published', true)
            ->first();

        if (! $course) {
            return response()->json([
                'message' => 'Course not found.',
            ], 404);
        }

        // 1. Total count of lessons mapped to the course
        $totalLessons = $course->lessons()->count();

        // 2. Count of completed lessons for the authenticated user
        $completedLessons = ActivityLog::where('user_id', $user->id)
            ->whereIn('lesson_id', $course->lessons()->pluck('id'))
            ->where('status', 'completed')
            ->count();

        // 3. Prevent divide-by-zero, calculate percentage
        $completionPercentage = $totalLessons > 0
            ? round(($completedLessons / $totalLessons) * 100, 2)
            : 0;

        return response()->json([
            'course_id' => $course->id,
            'total_lessons' => $totalLessons,
            'completed_lessons' => $completedLessons,
            'completion_percentage' => $completionPercentage,
        ], 200);
    }
}
