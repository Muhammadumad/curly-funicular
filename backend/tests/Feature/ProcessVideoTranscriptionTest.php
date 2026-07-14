<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Jobs\ExtractAudio;
use App\Jobs\RequestTranscription;
use App\Jobs\SegmentTranscript;
use App\Jobs\GenerateEmbeddings;
use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ProcessVideoTranscriptionTest extends TestCase
{
    use RefreshDatabase;

    protected Course $course;

    protected function setUp(): void
    {
        parent::setUp();

        $this->course = Course::create([
            'title' => 'AI Masterclass',
            'slug' => 'ai-masterclass',
            'description' => 'Master AI patterns',
            'price' => 199.00,
            'is_published' => true,
        ]);
    }

    /**
     * Creating a new lesson with a video dispatches the chained jobs.
     */
    public function test_creating_lesson_dispatches_chained_jobs(): void
    {
        Bus::fake();

        Lesson::create([
            'course_id' => $this->course->id,
            'title' => 'Introduction to AI Integration',
            'video_url' => 'https://example.com/day1.mp4',
            'duration_in_seconds' => 600,
            'order_sequence' => 1,
        ]);

        Bus::assertChained([
            ExtractAudio::class,
            RequestTranscription::class,
            SegmentTranscript::class,
            GenerateEmbeddings::class,
        ]);
    }

    /**
     * Updating a lesson video_url dispatches the chained jobs.
     */
    public function test_updating_video_url_dispatches_chained_jobs(): void
    {
        // 1. Create with an old video (without Bus::fake to initialize database structure)
        $lesson = Lesson::create([
            'course_id' => $this->course->id,
            'title' => 'Introduction to AI Integration',
            'video_url' => 'https://example.com/day1-old.mp4',
            'duration_in_seconds' => 600,
            'order_sequence' => 1,
        ]);

        Bus::fake();

        // 2. Update video URL
        $lesson->update([
            'video_url' => 'https://example.com/day1-new.mp4',
        ]);

        Bus::assertChained([
            ExtractAudio::class,
            RequestTranscription::class,
            SegmentTranscript::class,
            GenerateEmbeddings::class,
        ]);
    }

    /**
     * Updating title only does not dispatch the chained jobs.
     */
    public function test_updating_title_does_not_dispatch_jobs(): void
    {
        $lesson = Lesson::create([
            'course_id' => $this->course->id,
            'title' => 'Introduction to AI Integration',
            'video_url' => 'https://example.com/day1.mp4',
            'duration_in_seconds' => 600,
            'order_sequence' => 1,
        ]);

        Bus::fake();

        $lesson->update([
            'title' => 'New Title Name',
        ]);

        Bus::assertNotDispatched(ExtractAudio::class);
    }

    /**
     * Executing the chained sequence of jobs creates transcript records in the database.
     */
    public function test_executing_chained_jobs_creates_transcript_records(): void
    {
        // Create lesson (this triggers sync queue chain if sync queue is active, but let's run them explicitly to verify behavior)
        $lesson = Lesson::create([
            'course_id' => $this->course->id,
            'title' => 'Introduction to AI Integration',
            'video_url' => 'https://example.com/day1.mp4',
            'duration_in_seconds' => 600,
            'order_sequence' => 1,
        ]);

        // Run jobs sequentially to verify implementation correctness
        (new ExtractAudio($lesson->id))->handle();
        (new RequestTranscription($lesson->id))->handle(app(\App\Services\Video\TranscriptionService::class));
        (new SegmentTranscript($lesson->id))->handle();
        (new GenerateEmbeddings($lesson->id))->handle();

        // Assert database contains correct embeddings and timestamps
        $this->assertDatabaseHas('lesson_transcripts', [
            'lesson_id' => $lesson->id,
            'timestamp_seconds' => 75, // 01:15 from TranscriptionService fallback
        ]);
        
        $this->assertEquals(4, DB::table('lesson_transcripts')->where('lesson_id', $lesson->id)->count());
    }
}
