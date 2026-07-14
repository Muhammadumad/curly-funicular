<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VerifyProgressPingTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Course $course;
    protected Lesson $lesson;

    protected function setUp(): void
    {
        parent::setUp();

        // Create standard test user
        $this->user = User::factory()->create([
            'email' => 'student@example.com',
            'role' => 'student',
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
     * Test first ping under the limit succeeds.
     */
    public function test_first_ping_under_limit_succeeds(): void
    {
        $response = $this->actingAs($this->user)->postJson('/api/progress/ping', [
            'lesson_id' => $this->lesson->id,
            'watch_time_seconds' => 30,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $this->user->id,
            'lesson_id' => $this->lesson->id,
            'watch_time_seconds' => 30,
        ]);
    }

    /**
     * Test first ping exceeding the limit (70s) fails.
     */
    public function test_first_ping_exceeding_limit_fails(): void
    {
        $response = $this->actingAs($this->user)->postJson('/api/progress/ping', [
            'lesson_id' => $this->lesson->id,
            'watch_time_seconds' => 100,
        ]);

        $response->assertStatus(422);
        $response->assertJsonPath('message', 'Unprocessable Entity. Invalid progress delta.');
    }

    /**
     * Test sub-sequential progress tracking adheres to elapsed wall-clock time validation.
     */
    public function test_progress_verification_against_wall_clock_time(): void
    {
        $this->travelTo(now());

        // 1. Send first ping (succeeds)
        $response = $this->actingAs($this->user)->postJson('/api/progress/ping', [
            'lesson_id' => $this->lesson->id,
            'watch_time_seconds' => 30,
        ]);
        $response->assertStatus(200);

        // 2. Send second ping immediately claiming 30 seconds (fails, since 0 seconds elapsed)
        $response = $this->actingAs($this->user)->postJson('/api/progress/ping', [
            'lesson_id' => $this->lesson->id,
            'watch_time_seconds' => 30,
        ]);
        $response->assertStatus(422);
        $response->assertJsonPath('message', 'Unprocessable Entity. Progress exceeds elapsed wall-clock time.');

        // 3. Travel 35 seconds into the future
        $this->travel(35)->seconds();

        // 4. Send second ping claiming 30 seconds (succeeds, since 35 seconds elapsed on wall-clock)
        $response = $this->actingAs($this->user)->postJson('/api/progress/ping', [
            'lesson_id' => $this->lesson->id,
            'watch_time_seconds' => 30,
        ]);
        $response->assertStatus(200);
        
        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $this->user->id,
            'lesson_id' => $this->lesson->id,
            'watch_time_seconds' => 60,
        ]);
    }

    /**
     * Test status toggling (0 watch time seconds) bypasses the validation.
     */
    public function test_status_toggle_bypasses_wall_clock_validation(): void
    {
        // Send status completed manually (0 watch_time_seconds)
        $response = $this->actingAs($this->user)->postJson('/api/progress/ping', [
            'lesson_id' => $this->lesson->id,
            'watch_time_seconds' => 0,
            'status' => 'completed',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $this->user->id,
            'lesson_id' => $this->lesson->id,
            'status' => 'completed',
        ]);
    }
}
