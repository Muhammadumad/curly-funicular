<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Order;
use App\Services\Payments\PaymentGatewayInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function __construct(
        protected PaymentGatewayInterface $paymentGateway
    ) {}

    /**
     * Create a Paddle checkout session for the authenticated user.
     */
    public function createSession(Request $request): JsonResponse
    {
        $user = $request->user();

        // Retrieve the flagship masterclass
        $course = Course::where('slug', '28-day-ai-challenge')->first();

        if (!$course) {
            return response()->json([
                'message' => 'Course not found.',
            ], 404);
        }

        // If the user already has a paid order, return an error or redirect to success
        $alreadyPaid = Order::where('user_id', $user->id)
            ->where('status', 'paid')
            ->exists();

        if ($alreadyPaid) {
            return response()->json([
                'message' => 'You have already purchased this course.',
                'already_purchased' => true,
            ], 422);
        }

        try {
            $session = $this->paymentGateway->createCheckoutSession($user, [
                'id' => (string) $course->id,
                'price' => (float) $course->price,
                'title' => $course->title,
            ]);

            // Save or update pending order locally using updated Stripe schema columns
            Order::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'stripe_session_id' => $session->transactionId,
                ],
                [
                    'stripe_payment_intent_id' => null,
                    'amount_total' => $course->price,
                    'currency' => 'USD',
                    'status' => 'pending',
                ]
            );

            return response()->json([
                'checkout_url' => $session->url,
                'token' => $session->token,
                'transaction_id' => $session->transactionId,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Could not initiate checkout session.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Complete a mock transaction for local testing when Paddle API key is not configured.
     */
    public function mockComplete(Request $request): JsonResponse
    {
        // Only allow in local environment or if paddle api key is not configured
        if (!app()->environment('local') && !empty(config('services.paddle.api_key'))) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $user = $request->user();
        $transactionId = $request->input('transaction_id');

        if (!$transactionId) {
            return response()->json(['message' => 'Transaction ID required.'], 422);
        }

        // Find the pending order using new Stripe schema column
        $order = Order::where('user_id', $user->id)
            ->where('stripe_session_id', $transactionId)
            ->where('status', 'pending')
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Pending order not found.'], 404);
        }

        // Update order status to paid and activate student enrollment
        \Illuminate\Support\Facades\DB::transaction(function () use ($order, $user) {
            $order->update(['status' => 'paid']);
            $user->update([
                'is_active' => true,
                'enrolled_at' => now(),
            ]);
        });

        return response()->json([
            'message' => 'Mock transaction completed successfully.',
            'status' => 'paid'
        ]);
    }
}
