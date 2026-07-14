<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Lesson;
use App\Services\Video\TranscriptionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class RequestTranscription implements ShouldQueue
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
    public function handle(TranscriptionService $transcriptionService): void
    {
        $lesson = Lesson::find($this->lessonId);

        if (!$lesson) {
            Log::warning('RequestTranscription aborted: Lesson missing', ['lesson_id' => $this->lessonId]);
            return;
        }

        $audioPath = "audio/{$lesson->id}.mp3";
        if (!Storage::disk('local')->exists($audioPath)) {
            Log::error('RequestTranscription failed: Audio file not found', ['audio_path' => $audioPath]);
            throw new \RuntimeException("Audio file not found: {$audioPath}");
        }

        Log::info('Requesting transcription for audio file', ['lesson_id' => $lesson->id]);

        // Generate transcription using speech-to-text API (or service fallback)
        $transcript = $transcriptionService->transcribe($lesson->video_url, $lesson->title);
        Storage::disk('local')->put("transcripts/{$lesson->id}.txt", $transcript);

        Log::info('Transcription completed and saved', ['lesson_id' => $lesson->id]);
    }
}
