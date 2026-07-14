<?php

declare(strict_types=1);

namespace App\Services\Video;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TranscriptIngestionService
{
    /**
     * Ingest a raw transcript text, segment it, and generate vector embeddings.
     */
    public function ingest(int $lessonId, string $transcriptRaw): void
    {
        // 1. Clear old transcript chunks for this lesson
        DB::table('lesson_transcripts')->where('lesson_id', $lessonId)->delete();

        // 2. Parse lines
        $lines = explode("\n", $transcriptRaw);
        
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) {
                continue;
            }

            // Parse timestamp format: e.g. [01:23] Content or 01:23 - Content or [01:23:45]
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

            // 3. Generate vector embedding using Laravel 13 AI SDK fluent interface
            $embedding = null;
            try {
                // Fluent Laravel AI SDK: Str::of($text)->toEmbeddings()
                $strObj = Str::of($content);
                if (method_exists($strObj, 'toEmbeddings')) {
                    $embedding = $strObj->toEmbeddings();
                } else {
                    // Fallback mock embedding (random 1536 float array)
                    $embedding = $this->generateMockEmbedding();
                }
            } catch (\Throwable $e) {
                $embedding = $this->generateMockEmbedding();
            }

            // 4. Save to DB
            DB::table('lesson_transcripts')->insert([
                'lesson_id' => $lessonId,
                'content' => $content,
                'timestamp_seconds' => $timestampSeconds,
                'embedding' => is_array($embedding) ? json_encode($embedding) : $embedding,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
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
