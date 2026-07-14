<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\User;
use App\Services\Video\JwtTokenGenerator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClassroomVideoTest extends TestCase
{
    use RefreshDatabase;

    protected User $activeUser;
    protected User $inactiveUser;
    protected Course $course;
    protected Lesson $lesson;

    protected function setUp(): void
    {
        parent::setUp();

        // Create active user
        $this->activeUser = User::factory()->create([
            'email' => 'active@example.com',
            'role' => 'student',
            'is_active' => true,
        ]);

        // Create inactive user
        $this->inactiveUser = User::factory()->create([
            'email' => 'inactive@example.com',
            'role' => 'student',
            'is_active' => false,
        ]);

        // Create course
        $this->course = Course::create([
            'title' => 'AI Growth Academy — 28-Day AI Challenge',
            'slug' => '28-day-ai-challenge',
            'description' => 'Master AI in 28 days',
            'price' => 99.00,
            'is_published' => true,
        ]);

        // Create lesson
        $this->lesson = Lesson::create([
            'course_id' => $this->course->id,
            'title' => 'First Steps in AI',
            'video_url' => 'https://example.com/video1.mp4',
            'duration_in_seconds' => 300,
            'order_sequence' => 1,
        ]);
    }

    /**
     * Unauthenticated user cannot access signed HLS endpoint.
     */
    public function test_unauthenticated_user_cannot_access_classroom_lesson(): void
    {
        $response = $this->getJson("/api/classroom/{$this->lesson->id}");
        $response->assertStatus(401);
    }

    /**
     * Inactive user cannot access signed HLS endpoint.
     */
    public function test_inactive_user_cannot_access_classroom_lesson(): void
    {
        $response = $this->actingAs($this->inactiveUser)->getJson("/api/classroom/{$this->lesson->id}");
        $response->assertStatus(403);
        $response->assertJsonPath('message', 'Access denied. Active enrollment required to watch classroom content.');
    }

    /**
     * Active user can access signed HLS details.
     */
    public function test_active_user_can_access_classroom_lesson_and_receives_token(): void
    {
        $response = $this->actingAs($this->activeUser)->getJson("/api/classroom/{$this->lesson->id}");
        
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'stream_url',
            'token',
            'expires_in',
        ]);
    }

    /**
     * Accessing stream endpoint without token returns 403.
     */
    public function test_streaming_without_token_returns_forbidden(): void
    {
        $response = $this->getJson("/api/classroom/{$this->lesson->id}/stream");
        $response->assertStatus(403);
    }

    /**
     * Accessing stream endpoint with invalid token returns 403.
     */
    public function test_streaming_with_invalid_token_returns_forbidden(): void
    {
        $response = $this->getJson("/api/classroom/{$this->lesson->id}/stream?token=invalid_token");
        $response->assertStatus(403);
    }

    /**
     * Accessing stream endpoint with valid token redirects to target stream.
     */
    public function test_streaming_with_valid_token_redirects_to_stream(): void
    {
        // 1. Generate valid token
        $payload = [
            'user_id' => $this->activeUser->id,
            'lesson_id' => $this->lesson->id,
        ];
        $token = JwtTokenGenerator::generate($payload, config('app.key'), 14400);

        // 2. Perform stream request (redirect assertion)
        $response = $this->get("/api/classroom/{$this->lesson->id}/stream?token={$token}");
        
        $response->assertStatus(307);
        $response->assertRedirect('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
    }
}
