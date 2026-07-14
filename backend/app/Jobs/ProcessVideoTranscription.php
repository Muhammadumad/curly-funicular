<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Lesson;
use App\Services\Video\TranscriptionService;
use App\Services\Video\TranscriptIngestionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessVideoTranscription implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        protected int $lessonId
    ) {}

    /**
     * Execute the job.
     */
    public function handle(
        TranscriptionService $transcriptionService,
        TranscriptIngestionService $ingestionService
    ): void {
        $lesson = Lesson::find($this->lessonId);
        
        if (!$lesson || !$lesson->video_url) {
            return;
        }

        // 1. Generate transcription text blocks
        $transcript = $transcriptionService->transcribe($lesson->video_url, $lesson->title);

        // 2. Chunk, embed, and ingest into vector database
        $ingestionService->ingest($lesson->id, $transcript);
    }
}
