<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessPaddleWebhook;
use App\Services\Payments\PaymentGatewayInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaddleWebhookController extends Controller
{
    public function __construct(
        protected PaymentGatewayInterface $paymentGateway
    ) {}

    /**
     * Handle incoming Paddle webhook events.
     */
    public function handle(Request $request): JsonResponse
    {
        Log::info('Paddle Webhook received.', ['headers' => $request->headers->all()]);

        if (!$this->paymentGateway->verifyWebhookSignature($request)) {
            Log::warning('Paddle Webhook Signature verification failed.');
            return response()->json(['message' => 'Invalid webhook signature.'], 401);
        }

        $payload = $request->all();
        
        // Dispatch the webhook processing to a background queue
        ProcessPaddleWebhook::dispatch($payload);

        return response()->json(['message' => 'Webhook received and queued.'], 200);
    }
}
