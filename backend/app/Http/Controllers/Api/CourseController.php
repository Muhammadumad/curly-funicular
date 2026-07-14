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
            'modules' => function ($query) {
                $query->orderBy('order_sequence', 'asc');
            },
            'modules.lessons' => function ($query) {
                $query->orderBy('order_sequence', 'asc');
            }
        ];

        if (auth('sanctum')->check()) {
            $userId = auth('sanctum')->id();
            $relations['modules.lessons.activityLogs'] = function ($query) use ($userId) {
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

        // 1. Get module IDs for this course
        $moduleIds = $course->modules()->pluck('id');

        // 2. Total count of lessons mapped to the course's modules
        $totalLessons = Lesson::whereIn('module_id', $moduleIds)->count();

        // 3. Count of completed lessons for the authenticated user
        $completedLessons = ActivityLog::where('user_id', $user->id)
            ->whereIn('lesson_id', Lesson::whereIn('module_id', $moduleIds)->pluck('id'))
            ->where('status', 'completed')
            ->count();

        // 4. Prevent divide-by-zero, calculate percentage
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

    /**
     * Get temporary signed stream URL and JWT token for a classroom lesson.
     */
    public function getClassroomLesson(int $lessonId, Request $request, \App\Services\Video\VideoStreamingService $streamingService): JsonResponse
    {
        $user = $request->user();

        // 1. Authorization check: user must be active (enrolled and paid)
        if (!$user->is_active) {
            return response()->json([
                'message' => 'Access denied. Active enrollment required to watch classroom content.',
            ], 403);
        }

        // 2. Fetch the lesson
        $lesson = \App\Models\Lesson::find($lessonId);

        if (!$lesson) {
            return response()->json([
                'message' => 'Lesson not found.',
            ], 404);
        }

        // 3. Generate signed stream details
        $signedDetails = $streamingService->generateSignedStreamUrl($lesson, $user->id);

        return response()->json($signedDetails, 200);
    }

    /**
     * Stream endpoint that validates JWT before redirecting to actual stream provider.
     */
    public function streamVideo(int $lessonId, Request $request, \App\Services\Video\VideoStreamingService $streamingService): \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $token = $request->query('token');

        if (!$token) {
            return response()->json(['message' => 'Forbidden. Streaming token required.'], 403);
        }

        // Validate JWT signature and expiration
        $payload = \App\Services\Video\JwtTokenGenerator::verify($token, config('app.key'));

        if (!$payload || (int) $payload['lesson_id'] !== $lessonId) {
            return response()->json(['message' => 'Forbidden. Invalid or expired streaming token.'], 403);
        }

        $lesson = \App\Models\Lesson::find($lessonId);
        if (!$lesson) {
            return response()->json(['message' => 'Lesson not found.'], 404);
        }

        // Resolve actual HLS target URL
        $targetUrl = $streamingService->getTargetHlsUrl($lesson);

        // Redirect to provider with permanent redirect to stream (using 302/307 to avoid caching of dynamic signed URL)
        return redirect()->away($targetUrl, 307);
    }

    /**
     * Ask the interactive AI tutor a question about the active lesson.
     */
    public function askCopilot(int $lessonId, Request $request, \App\Services\AI\CopilotService $copilotService): JsonResponse
    {
        $user = $request->user();

        // 1. Authorization check: user must be active
        if (!$user->is_active) {
            return response()->json([
                'message' => 'Access denied. Active enrollment required to use the AI Copilot.',
            ], 403);
        }

        // 2. Validate payload
        $request->validate([
            'question' => 'required|string|max:1000',
        ]);

        // 3. Generate answer and citations via CopilotService
        $result = $copilotService->ask($lessonId, $request->input('question'));

        return response()->json($result, 200);
    }
}
