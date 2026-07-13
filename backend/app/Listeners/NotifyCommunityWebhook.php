<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\UserEnrolledInMasterclass;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NotifyCommunityWebhook implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * The number of times the queued listener should be tried.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var int
     */
    public $backoff = 15;

    /**
     * Handle the event.
     */
    public function handle(UserEnrolledInMasterclass $event): void
    {
        $session = $event->session;
        $email = $session->customer_details->email ?? $session->customer_email;
        $name = $session->customer_details->name ?? 'A new student';
        $amount = number_format($session->amount_total / 100, 2);
        $currency = strtoupper($session->currency ?? 'USD');

        $webhookUrl = config('services.discord.webhook_url');

        if (!$webhookUrl || str_contains($webhookUrl, 'placeholder')) {
            Log::info('NotifyCommunityWebhook: Discord Webhook URL is placeholder or empty. Skipping notification.');
            return;
        }

        $payload = [
            'content' => "🚀 **New Enrollment!** **{$name}** ({$email}) has enrolled in *Build & Deploy Applied AI Systems*! Payment of **{$amount} {$currency}** processed successfully. Welcome them to the community! 🎉"
        ];

        $response = Http::post($webhookUrl, $payload);

        if ($response->failed()) {
            Log::warning('NotifyCommunityWebhook failed: ' . $response->body(), [
                'status' => $response->status(),
                'payload' => $payload
            ]);
            
            // Release the job to retry
            $this->release($this->backoff);
        } else {
            Log::info('NotifyCommunityWebhook: Successfully pinged Discord.');
        }
    }
}
