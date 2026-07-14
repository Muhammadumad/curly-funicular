<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Lesson;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ExtractAudio implements ShouldQueue
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
    public function handle(): void
    {
        $lesson = Lesson::find($this->lessonId);

        if (!$lesson || !$lesson->video_url) {
            Log::warning('ExtractAudio aborted: Lesson or video URL missing', ['lesson_id' => $this->lessonId]);
            return;
        }

        Log::info('Extracting audio from lesson video', [
            'lesson_id' => $lesson->id,
            'video_url' => $lesson->video_url
        ]);

        // Simulate reducing video file size to a lightweight audio format
        $audioContent = "Simulated binary audio payload for lesson: {$lesson->title}";
        Storage::disk('local')->put("audio/{$lesson->id}.mp3", $audioContent);

        Log::info('Audio extracted successfully', ['lesson_id' => $lesson->id]);
    }
}
