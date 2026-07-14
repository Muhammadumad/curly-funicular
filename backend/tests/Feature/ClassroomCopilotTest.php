<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\User;
use App\Services\Video\TranscriptIngestionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ClassroomCopilotTest extends TestCase
{
    use RefreshDatabase;

    protected User $student;
    protected User $inactiveStudent;
    protected Course $course;
    protected Lesson $lesson;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Create student
        $this->student = User::factory()->create([
            'email' => 'student@example.com',
            'role' => 'student',
            'is_active' => true,
        ]);

        // 2. Create inactive student
        $this->inactiveStudent = User::factory()->create([
            'email' => 'inactive@example.com',
            'role' => 'student',
            'is_active' => false,
        ]);

        // 3. Create course
        $this->course = Course::create([
            'title' => 'AI Growth Academy — 28-Day AI Challenge',
            'slug' => '28-day-ai-challenge',
            'description' => 'Master AI in 28 days',
            'price' => 99.00,
            'is_published' => true,
        ]);

        // 4. Create lesson
        $this->lesson = Lesson::create([
            'course_id' => $this->course->id,
            'title' => 'Day 1: Intro',
            'video_url' => 'https://example.com/video1.mp4',
            'duration_in_seconds' => 300,
            'order_sequence' => 1,
        ]);

        // 5. Ingest transcript using the real TranscriptIngestionService
        $ingestionService = new TranscriptIngestionService();
        $ingestionService->ingest($this->lesson->id, 
            "[00:10] Today we discuss modern web application security.\n" .
            "[01:15] Why do we use Sanctum here instead of Passport for SPA token auth?\n" .
            "[02:30] Passport is a heavy OAuth2 package, while Sanctum provides cookie-based session guards.\n" .
            "[03:45] Let us write some API routes using Sanctum auth middleware."
        );
    }

    /**
     * Unauthenticated user cannot ask copilot.
     */
    public function test_unauthenticated_user_cannot_ask_copilot(): void
    {
        $response = $this->postJson("/api/classroom/{$this->lesson->id}/copilot", [
            'question' => 'Why did you use Sanctum instead of Passport?',
        ]);
        $response->assertStatus(401);
    }

    /**
     * Inactive user cannot ask copilot.
     */
    public function test_inactive_user_cannot_ask_copilot(): void
    {
        $response = $this->actingAs($this->inactiveStudent)->postJson("/api/classroom/{$this->lesson->id}/copilot", [
            'question' => 'Why did you use Sanctum instead of Passport?',
        ]);
        $response->assertStatus(403);
        $response->assertJsonPath('message', 'Access denied. Active enrollment required to use the AI Copilot.');
    }

    /**
     * Active user can ask copilot and gets a tailored response with citations.
     */
    public function test_active_user_can_ask_copilot_and_gets_citations(): void
    {
        $response = $this->actingAs($this->student)->postJson("/api/classroom/{$this->lesson->id}/copilot", [
            'question' => 'Why did you use Sanctum instead of Passport?',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'answer',
            'citations' => [
                '*' => [
                    'timestamp_seconds',
                    'timestamp_formatted',
                    'text',
                ],
            ],
        ]);

        // Verify that the fallback or AI logic cited the correct timestamp from database
        $response->assertJsonFragment([
            'timestamp_seconds' => 75, // 01:15
            'timestamp_formatted' => '01:15',
        ]);
    }
}
