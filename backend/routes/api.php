<?php

declare(strict_types=1);

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\AdminCurriculumController;
use App\Http\Controllers\Api\StudentManagementController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\StripeWebhookController;
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
    Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
    Route::post('/webhooks/paddle', [\App\Http\Controllers\Api\PaddleWebhookController::class, 'handle']);
    Route::post('/webhooks/stripe', [StripeWebhookController::class, 'handle']);

    // Student / Authenticated Routes
    Route::middleware('auth:sanctum')->group(function (): void {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);

        // Progress tracking & Analytics
        Route::post('/progress/ping', [ActivityLogController::class, 'updateProgress']);
        Route::get('/courses/{slug}/progress', [CourseController::class, 'getProgress']);

        // Checkout session
        Route::post('/checkout/session', [\App\Http\Controllers\Api\CheckoutController::class, 'createSession']);
        Route::post('/checkout/mock-complete', [\App\Http\Controllers\Api\CheckoutController::class, 'mockComplete']);

        // Orders & Invoices
        Route::get('/orders', [\App\Http\Controllers\Api\OrderController::class, 'index']);
        Route::get('/orders/{order}', [\App\Http\Controllers\Api\OrderController::class, 'show']);
        Route::get('/orders/{order}/invoice', [\App\Http\Controllers\Api\OrderController::class, 'downloadInvoice']);

        // Admin-only Routes (Nested under auth:sanctum and custom 'admin' middleware)
        Route::middleware('admin')->prefix('admin')->group(function (): void {
            Route::get('/stats', [AdminDashboardController::class, 'stats']);
            Route::get('/students', [StudentManagementController::class, 'index']);
            Route::patch('/students/{id}/suspend', [StudentManagementController::class, 'suspend']);
            Route::patch('/students/{id}/unsuspend', [StudentManagementController::class, 'unsuspend']);

            // Curriculum Editor CRUD
            Route::post('/modules', [AdminCurriculumController::class, 'storeModule']);
            Route::put('/modules/{id}', [AdminCurriculumController::class, 'updateModule']);
            Route::delete('/modules/{id}', [AdminCurriculumController::class, 'destroyModule']);
            Route::post('/lessons', [AdminCurriculumController::class, 'storeLesson']);
            Route::put('/lessons/{id}', [AdminCurriculumController::class, 'updateLesson']);
            Route::delete('/lessons/{id}', [AdminCurriculumController::class, 'destroyLesson']);
        });
    });
});
