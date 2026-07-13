<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Lesson;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminCurriculumController extends Controller
{
    /**
     * Store a newly created module.
     */
    public function storeModule(Request $request): JsonResponse
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'duration' => 'nullable|string|max:50',
            'order_sequence' => 'nullable|integer',
        ]);

        $module = Module::create([
            'course_id' => $request->course_id,
            'title' => $request->title,
            'duration' => $request->duration ?? '0h 00m',
            'order_sequence' => $request->order_sequence ?? 0,
        ]);

        return response()->json(['data' => $module], 201);
    }

    /**
     * Update an existing module.
     */
    public function updateModule(Request $request, int $id): JsonResponse
    {
        $module = Module::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'duration' => 'nullable|string|max:50',
            'order_sequence' => 'nullable|integer',
        ]);

        $module->update($request->only(['title', 'duration', 'order_sequence']));

        return response()->json(['data' => $module], 200);
    }

    /**
     * Remove an existing module.
     */
    public function destroyModule(int $id): JsonResponse
    {
        $module = Module::findOrFail($id);
        $module->delete();

        return response()->json(['data' => ['message' => 'Module deleted successfully.']], 200);
    }

    /**
     * Store a newly created lesson.
     */
    public function storeLesson(Request $request): JsonResponse
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'module_id' => 'required|exists:modules,id',
            'title' => 'required|string|max:255',
            'video_url' => 'required|url',
            'duration_in_seconds' => 'nullable|integer',
            'order_sequence' => 'nullable|integer',
        ]);

        $lesson = Lesson::create([
            'course_id' => $request->course_id,
            'module_id' => $request->module_id,
            'title' => $request->title,
            'video_url' => $request->video_url,
            'duration_in_seconds' => $request->duration_in_seconds ?? 0,
            'order_sequence' => $request->order_sequence ?? 0,
        ]);

        return response()->json(['data' => $lesson], 201);
    }

    /**
     * Update an existing lesson.
     */
    public function updateLesson(Request $request, int $id): JsonResponse
    {
        $lesson = Lesson::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'video_url' => 'sometimes|required|url',
            'duration_in_seconds' => 'nullable|integer',
            'order_sequence' => 'nullable|integer',
        ]);

        $lesson->update($request->only(['title', 'video_url', 'duration_in_seconds', 'order_sequence']));

        return response()->json(['data' => $lesson], 200);
    }

    /**
     * Remove an existing lesson.
     */
    public function destroyLesson(int $id): JsonResponse
    {
        $lesson = Lesson::findOrFail($id);
        $lesson->delete();

        return response()->json(['data' => ['message' => 'Lesson deleted successfully.']], 200);
    }
}
