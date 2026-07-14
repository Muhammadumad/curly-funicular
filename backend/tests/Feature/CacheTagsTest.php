<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class CacheTagsTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Course $course;
    protected Lesson $lesson;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::create([
            'name' => 'Student A',
            'email' => 'student.a@example.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'is_suspended' => false,
            'is_active' => true,
        ]);

        $this->course = Course::create([
            'title' => 'AI Course',
            'slug' => 'ai-course',
            'description' => 'Test course',
            'price' => 99.00,
            'is_published' => true,
        ]);

        $this->lesson = Lesson::create([
            'course_id' => $this->course->id,
            'title' => 'First Lesson',
            'video_url' => 'https://example.com/video.mp4',
            'duration_in_seconds' => 300,
            'order_sequence' => 1,
        ]);
    }

    /**
     * Test progress ping caches validity checks.
     */
    public function test_progress_ping_caches_validity(): void
    {
        $cacheKey = "user_session_valid_{$this->user->id}";
        $cacheStore = Cache::store();
        $supportsTags = method_exists($cacheStore, 'tags');
        $cache = $supportsTags ? Cache::tags(['user_'.$this->user->id]) : $cacheStore;

        $this->assertFalse($cache->has($cacheKey));

        $response = $this->actingAs($this->user)->postJson('/api/progress/ping', [
            'lesson_id' => $this->lesson->id,
            'watch_time_seconds' => 10,
        ]);

        $response->assertStatus(200);
        $this->assertTrue($cache->has($cacheKey));
    }

    /**
     * Test updating user model invalidates progress ping cache.
     */
    public function test_updating_user_invalidates_cache(): void
    {
        $cacheKey = "user_session_valid_{$this->user->id}";
        $cacheStore = Cache::store();
        $supportsTags = method_exists($cacheStore, 'tags');
        $cache = $supportsTags ? Cache::tags(['user_'.$this->user->id]) : $cacheStore;

        // 1. Populate cache
        $this->actingAs($this->user)->postJson('/api/progress/ping', [
            'lesson_id' => $this->lesson->id,
            'watch_time_seconds' => 10,
        ]);
        $this->assertTrue($cache->has($cacheKey));

        // 2. Trigger update event (e.g. suspend user)
        $this->user->update(['is_suspended' => true]);

        // 3. Assert cache was cleared
        $this->assertFalse($cache->has($cacheKey));
    }
}
