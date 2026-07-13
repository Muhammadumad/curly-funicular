<?php

declare(strict_types=1);

namespace App\Services\Payments;

class CheckoutSession
{
    public function __construct(
        public string $url,
        public string $token,
        public string $transactionId
    ) {}
}
