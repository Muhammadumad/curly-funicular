<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Events\UserEnrolledInMasterclass;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    /**
     * Handle incoming Stripe webhook payload.
     */
    public function handle(Request $request): Response
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $webhookSecret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent(
                $payload,
                $sigHeader,
                $webhookSecret
            );
        } catch (\UnexpectedValueException $e) {
            Log::error('Stripe webhook error: Invalid payload', ['error' => $e->getMessage()]);
            return response('Invalid Payload', 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            Log::error('Stripe webhook error: Invalid signature', ['error' => $e->getMessage()]);
            return response('Invalid Signature', 400);
        }

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $sessionId = $session->id;

            // Idempotency check: prevent duplicate processing
            $alreadyProcessed = Order::where('stripe_session_id', $sessionId)->exists();

            if (!$alreadyProcessed) {
                // Dispatch asynchronous event
                event(new UserEnrolledInMasterclass($session));
            } else {
                Log::info('Stripe webhook: Session already processed', ['stripe_session_id' => $sessionId]);
            }
        }

        return response('Webhook Handled', 200);
    }
}
