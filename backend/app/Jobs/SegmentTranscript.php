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

class SegmentTranscript implements ShouldQueue
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

        if (!$lesson) {
            Log::warning('SegmentTranscript aborted: Lesson missing', ['lesson_id' => $this->lessonId]);
            return;
        }

        $transcriptPath = "transcripts/{$lesson->id}.txt";
        if (!Storage::disk('local')->exists($transcriptPath)) {
            Log::error('SegmentTranscript failed: Transcript file not found', ['transcript_path' => $transcriptPath]);
            throw new \RuntimeException("Transcript file not found: {$transcriptPath}");
        }

        $transcriptRaw = Storage::disk('local')->get($transcriptPath);
        Log::info('Segmenting transcript text into timestamped chunks', ['lesson_id' => $lesson->id]);

        $lines = explode("\n", $transcriptRaw);
        $chunks = [];

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) {
                continue;
            }

            // Parse timestamp format: e.g. [01:23] Content
            if (preg_match('/(?:\[?(\d{1,2}):(\d{2})(?::(\d{2}))?\]?|-?\s*)\s*(.+)/', $line, $matches)) {
                $h = 0;
                $m = (int) $matches[1];
                $s = (int) $matches[2];
                if (isset($matches[3]) && $matches[3] !== '') {
                    $h = $m;
                    $m = $s;
                    $s = (int) $matches[3];
                }
                $timestampSeconds = ($h * 3600) + ($m * 60) + $s;
                $content = trim($matches[4]);
            } else {
                $timestampSeconds = 0;
                $content = $line;
            }

            $chunks[] = [
                'content' => $content,
                'timestamp_seconds' => $timestampSeconds,
            ];
        }

        Storage::disk('local')->put("chunks/{$lesson->id}.json", json_encode($chunks));
        Log::info('Transcript segmented successfully', ['lesson_id' => $lesson->id, 'chunks_count' => count($chunks)]);
    }
}
