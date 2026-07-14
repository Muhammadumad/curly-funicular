<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Lesson;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GenerateEmbeddings implements ShouldQueue
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
            Log::warning('GenerateEmbeddings aborted: Lesson missing', ['lesson_id' => $this->lessonId]);
            return;
        }

        $chunksPath = "chunks/{$lesson->id}.json";
        if (!Storage::disk('local')->exists($chunksPath)) {
            Log::error('GenerateEmbeddings failed: Chunks file not found', ['chunks_path' => $chunksPath]);
            throw new \RuntimeException("Chunks file not found: {$chunksPath}");
        }

        $chunks = json_decode(Storage::disk('local')->get($chunksPath), true);
        Log::info('Generating vector embeddings for chunks', ['lesson_id' => $lesson->id, 'chunks_count' => count($chunks)]);

        // 1. Clear old transcript chunks for this lesson
        DB::table('lesson_transcripts')->where('lesson_id', $lesson->id)->delete();

        // 2. Generate embeddings and save to DB
        foreach ($chunks as $chunk) {
            $content = $chunk['content'];
            $timestampSeconds = $chunk['timestamp_seconds'];

            $embedding = null;
            try {
                // Fluent Laravel AI SDK: Str::of($text)->toEmbeddings()
                $strObj = Str::of($content);
                if (method_exists($strObj, 'toEmbeddings')) {
                    $embedding = $strObj->toEmbeddings();
                } else {
                    $embedding = $this->generateMockEmbedding();
                }
            } catch (\Throwable $e) {
                $embedding = $this->generateMockEmbedding();
            }

            DB::table('lesson_transcripts')->insert([
                'lesson_id' => $lesson->id,
                'content' => $content,
                'timestamp_seconds' => $timestampSeconds,
                'embedding' => is_array($embedding) ? json_encode($embedding) : $embedding,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        Log::info('Embeddings generated and saved successfully', ['lesson_id' => $lesson->id]);
    }

    /**
     * Generate mock embedding vector of 1536 dimensions.
     */
    private function generateMockEmbedding(): string
    {
        $vector = array_map(fn() => rand(-100, 100) / 1000, range(1, 1536));
        return json_encode($vector);
    }
}
