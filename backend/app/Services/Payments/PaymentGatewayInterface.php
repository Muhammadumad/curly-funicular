<?php

declare(strict_types=1);

namespace App\Services\Payments;

use App\Models\User;
use Illuminate\Http\Request;

interface PaymentGatewayInterface
{
    /**
     * Create a checkout session for the authenticated user and course.
     *
     * @param User $user
     * @param array{id: string, price: float, title: string} $product
     * @return CheckoutSession
     */
    public function createCheckoutSession(User $user, array $product): CheckoutSession;

    /**
     * Verify the webhook signature from the incoming request.
     *
     * @param Request $request
     * @return bool
     */
    public function verifyWebhookSignature(Request $request): bool;
}
