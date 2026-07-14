<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Order;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessPaddleWebhook implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @param array $payload
     */
    public function __construct(
        protected array $payload
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $eventType = $this->payload['event_type'] ?? null;
        $data = $this->payload['data'] ?? [];

        Log::info("Processing Paddle Webhook Job: {$eventType}", ['transaction_id' => $data['id'] ?? 'unknown']);

        if (!$eventType || empty($data)) {
            Log::warning('ProcessPaddleWebhook: Missing event_type or data.');
            return;
        }

        $transactionId = $data['id'] ?? null;

        if (!$transactionId) {
            Log::warning('ProcessPaddleWebhook: Missing transaction ID.');
            return;
        }

        // Idempotency / Deduplication check:
        // We look up the user first.
        $userId = isset($data['custom_data']['user_id']) ? (int) $data['custom_data']['user_id'] : null;
        $user = null;

        if ($userId) {
            $user = User::find($userId);
        }

        // Fallback to customer details email if user_id not found in custom_data
        if (!$user && isset($data['customer_details']['email'])) {
            $user = User::where('email', $data['customer_details']['email'])->first();
        }

        if (!$user) {
            Log::error("ProcessPaddleWebhook: User not found for transaction {$transactionId}.");
            return;
        }

        // Parse amount and currency safely
        // In Paddle Billing, totals are under details.totals
        $amount = 99.00;
        if (isset($data['details']['totals']['grand_total'])) {
            // Paddle Billing totals are strings or numeric
            $amount = (float) $data['details']['totals']['grand_total'];
        } elseif (isset($data['details']['totals']['total'])) {
            $amount = (float) $data['details']['totals']['total'];
        }

        // Adjust from cents if necessary (Paddle modern API uses normal decimal strings, e.g. "99.00", but we handle division just in case)
        if ($amount > 10000) {
            // Safety fallback if amount is in cents
            $amount = $amount / 100;
        }

        $currency = $data['details']['totals']['currency_code'] ?? 'USD';

        if ($eventType === 'transaction.completed') {
            // Update or create order to paid
            Order::updateOrCreate(
                [
                    'stripe_session_id' => $transactionId,
                ],
                [
                    'user_id' => $user->id,
                    'amount_total' => $amount,
                    'currency' => $currency,
                    'status' => 'paid',
                ]
            );

            Log::info("ProcessPaddleWebhook: Order marked as paid for transaction {$transactionId}. User {$user->id} now has access.");
        } elseif ($eventType === 'transaction.payment_failed') {
            // Update order to failed
            Order::updateOrCreate(
                [
                    'stripe_session_id' => $transactionId,
                ],
                [
                    'user_id' => $user->id,
                    'amount_total' => $amount,
                    'currency' => $currency,
                    'status' => 'failed',
                ]
            );

            Log::info("ProcessPaddleWebhook: Order marked as failed for transaction {$transactionId}.");
        } else {
            Log::info("ProcessPaddleWebhook: Event {$eventType} unhandled by design.");
        }
    }
}
