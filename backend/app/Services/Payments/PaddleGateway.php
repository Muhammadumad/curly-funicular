<?php

declare(strict_types=1);

namespace App\Services\Payments;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * PaddleBilling Implementation of PaymentGatewayInterface.
 *
 * NOTE: Paddle Billing was chosen over Stripe as the primary gateway for Aether.
 * Stripe does not support Pakistan-registered sellers directly, requiring a foreign
 * entity workaround. Paddle acts as a Merchant-of-Record, accepting sellers globally,
 * paying out via wire transfer or Payoneer (matching the existing payout setup),
 * and completely offloading the burden of global VAT/sales-tax compliance.
 */
class PaddleGateway implements PaymentGatewayInterface
{
    protected string $apiKey;
    protected string $webhookSecret;
    protected string $env;
    protected ?string $priceId;

    public function __construct()
    {
        $this->apiKey = config('services.paddle.api_key') ?? '';
        $this->webhookSecret = config('services.paddle.webhook_secret') ?? '';
        $this->env = config('services.paddle.env', 'sandbox');
        $this->priceId = env('PADDLE_PRICE_ID');
    }

    /**
     * Create a checkout session for the authenticated user and course.
     */
    public function createCheckoutSession(User $user, array $product): CheckoutSession
    {
        $baseUrl = $this->env === 'sandbox'
            ? 'https://sandbox-api.paddle.com'
            : 'https://api.paddle.com';

        // Use configured price ID from ENV, or fall back to a dummy one for sandbox testing
        $priceId = $this->priceId ?: 'pri_01h7zf7a7b8c9d0e1f2g3h4i5j';

        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

        // Construct payload for Paddle API
        $payload = [
            'items' => [
                [
                    'price_id' => $priceId,
                    'quantity' => 1,
                ]
            ],
            'custom_data' => [
                'user_id' => (string) $user->id,
            ],
            'checkout' => [
                'return_url' => $frontendUrl . '/checkout/success',
            ]
        ];

        // If API key is empty (e.g. local testing without real keys), return mock session
        if (empty($this->apiKey)) {
            Log::warning('Paddle API Key not configured. Returning mock checkout session.');
            $mockTxId = 'trn_' . bin2hex(random_bytes(8));
            $mockCheckoutUrl = $frontendUrl . "/checkout?mock_transaction_id={$mockTxId}";

            return new CheckoutSession($mockCheckoutUrl, 'token_mock_' . $mockTxId, $mockTxId);
        }

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->apiKey}",
            'Content-Type' => 'application/json',
        ])->post("{$baseUrl}/transactions", $payload);

        if ($response->failed()) {
            Log::error('Paddle API Error: ' . $response->body());
            throw new \RuntimeException('Failed to initiate transaction with Paddle: ' . $response->json('error.detail', 'Unknown error'));
        }

        $transactionId = $response->json('data.id');
        
        $checkoutUrl = $this->env === 'sandbox'
            ? "https://sandbox-checkout.paddle.com/checkout/buy?transaction_id={$transactionId}"
            : "https://checkout.paddle.com/checkout/buy?transaction_id={$transactionId}";

        return new CheckoutSession(
            $checkoutUrl,
            $response->json('data.checkout.token') ?? 'token_' . $transactionId,
            $transactionId
        );
    }

    /**
     * Verify the webhook signature from the incoming request.
     */
    public function verifyWebhookSignature(Request $request): bool
    {
        $signatureHeader = $request->header('Paddle-Signature');

        if (empty($signatureHeader) || empty($this->webhookSecret)) {
            return false;
        }

        // Paddle-Signature format: t=1672531199;h=sha256:abcd...
        if (!preg_match('/t=(\d+);h=sha256:([a-f0-9]+)/', $signatureHeader, $matches)) {
            return false;
        }

        $timestamp = $matches[1];
        $signatureHash = $matches[2];
        $rawBody = $request->getContent();

        // Concatenate timestamp and raw body with a dot
        $payload = $timestamp . '.' . $rawBody;

        $computedHash = hash_hmac('sha256', $payload, $this->webhookSecret);

        return hash_equals($signatureHash, $computedHash);
    }
}
