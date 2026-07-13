<?php

declare(strict_types=1);

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Stripe\Checkout\Session;

class UserEnrolledInMasterclass
{
    use Dispatchable, SerializesModels;

    /**
     * The Stripe checkout session object.
     *
     * @var \Stripe\Checkout\Session
     */
    public $session;

    /**
     * Create a new event instance.
     */
    public function __construct(Session $session)
    {
        $this->session = $session;
    }
}
