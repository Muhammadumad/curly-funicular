<?php

declare(strict_types=1);

namespace App\Services\Video;

use App\Models\Lesson;
use Illuminate\Support\Facades\URL;

class VideoStreamingService
{
    /**
     * Generate the local signed HLS stream proxy URL.
     */
    public function generateSignedStreamUrl(Lesson $lesson, int $userId): array
    {
        // 1. Generate JWT containing user ID and lesson ID expiring in 4 hours (14400 seconds)
        $payload = [
            'user_id' => $userId,
            'lesson_id' => $lesson->id,
        ];
        
        $token = JwtTokenGenerator::generate($payload, config('app.key'), 14400);

        // 2. Generate local proxy URL
        // We use relative path or route helper
        $streamUrl = route('classroom.video.stream', [
            'lessonId' => $lesson->id,
            'token' => $token,
        ]);

        return [
            'stream_url' => $streamUrl,
            'token' => $token,
            'expires_in' => 14400,
        ];
    }

    /**
     * Get the actual target HLS stream URL (e.g. from CloudFront, Cloudflare, or local test stream).
     */
    public function getTargetHlsUrl(Lesson $lesson): string
    {
        $provider = env('CDN_PROVIDER');
        
        if ($provider === 'cloudfront') {
            $cloudfrontUrl = env('CLOUDFRONT_URL', 'https://d111111abcdef8.cloudfront.net');
            $streamPath = "lessons/{$lesson->id}/playlist.m3u8";
            $fullUrl = "{$cloudfrontUrl}/{$streamPath}";
            
            $keyPairId = env('CLOUDFRONT_KEY_PAIR_ID', 'K2JC7F7EXAMPLE');
            $expires = time() + 14400; // 4 hours
            
            $signature = hash_hmac('sha256', $streamPath . $expires, config('app.key'));
            return "{$fullUrl}?Expires={$expires}&Signature={$signature}&Key-Pair-Id={$keyPairId}";
        }
        
        if ($provider === 'cloudflare') {
            $streamId = $lesson->video_url ?: 'default-video-id';
            $token = hash_hmac('sha256', $streamId . time(), config('app.key'));
            return "https://iframe.videodelivery.net/{$token}/manifest/video.m3u8";
        }

        // Fallback for development testing
        return 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    }
}
