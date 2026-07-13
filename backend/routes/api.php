<?php

declare(strict_types=1);

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('throttle:api')->group(function (): void {
    // Public Storefront & Auth Routes (No Auth)
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{slug}', [CourseController::class, 'show']);

    // Student / Authenticated Routes
    Route::middleware('auth:sanctum')->group(function (): void {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);

        // Progress tracking & Analytics
        Route::post('/progress/ping', [ActivityLogController::class, 'updateProgress']);
        Route::get('/courses/{slug}/progress', [CourseController::class, 'getProgress']);

        // Admin-only Routes (Nested under auth:sanctum and custom 'admin' middleware)
        Route::middleware('admin')->group(function (): void {
            Route::get('/admin/dashboard', function () {
                return response()->json([
                    'message' => 'Welcome to the Admin Dashboard.',
                ]);
            });
        });
    });
});
