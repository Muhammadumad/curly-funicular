<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class StudentManagementController extends Controller
{
    /**
     * Return a paginated list of students with their last activity timestamp.
     */
    public function index(): JsonResponse
    {
        $students = User::where('role', 'student')
            ->withMax('activityLogs', 'last_accessed_at')
            ->latest()
            ->paginate(15);

        return response()->json([
            'data' => $students,
        ], 200);
    }

    /**
     * Suspend a student account.
     */
    public function suspend(int $id): JsonResponse
    {
        $user = User::where('role', 'student')->findOrFail($id);
        $user->update(['is_suspended' => true]);

        return response()->json([
            'data' => ['message' => 'Student suspended successfully.'],
        ], 200);
    }

    /**
     * Unsuspend a student account.
     */
    public function unsuspend(int $id): JsonResponse
    {
        $user = User::where('role', 'student')->findOrFail($id);
        $user->update(['is_suspended' => false]);

        return response()->json([
            'data' => ['message' => 'Student unsuspended successfully.'],
        ], 200);
    }
}
