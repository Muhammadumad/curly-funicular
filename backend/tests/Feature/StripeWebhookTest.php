<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Order;
use App\Models\User;
use App\Events\UserEnrolledInMasterclass;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class StripeWebhookTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Course $course;
    protected string $webhookSecret = 'test_stripe_secret';

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'email' => 'student@example.com',
            'role' => 'student',
        ]);

        $this->course = Course::create([
            'title' => 'AI Growth Academy',
            'slug' => 'ai-growth-academy',
            'description' => 'Master AI',
            'price' => 99.00,
            'is_published' => true,
        ]);

        Config::set('services.stripe.webhook_secret', $this->webhookSecret);
    }

    /**
     * Test valid Stripe signature processes webhook and dispatches event.
     */
    public function test_valid_stripe_webhook_dispatches_enrollment_event(): void
    {
        Event::fake();

        // 1. Pre-create a pending order matching stripe session id
        Order::create([
            'user_id' => $this->user->id,
            'stripe_session_id' => 'cs_test_12345',
            'amount_total' => 99.00,
            'currency' => 'usd',
            'status' => 'pending',
        ]);

        $payload = [
            'type' => 'checkout.session.completed',
            'data' => [
                'object' => [
                    'id' => 'cs_test_12345',
                    'object' => 'checkout.session',
                    'customer_details' => [
                        'email' => 'student@example.com',
                    ],
                    'amount_total' => 9900,
                    'currency' => 'usd',
                ]
            ]
        ];

        $rawBody = json_encode($payload);
        $timestamp = time();
        $signaturePayload = $timestamp . '.' . $rawBody;
        $hash = hash_hmac('sha256', $signaturePayload, $this->webhookSecret);
        $sigHeader = "t={$timestamp},v1={$hash}";

        $response = $this->postJson('/api/webhooks/stripe', $payload, [
            'Stripe-Signature' => $sigHeader,
        ]);

        $response->assertStatus(200);
        $response->assertSee('Webhook Handled');

        Event::assertDispatched(UserEnrolledInMasterclass::class, function ($event) {
            return $event->session->id === 'cs_test_12345';
        });
    }

    /**
     * Test webhook rejects invalid Stripe signature.
     */
    public function test_invalid_stripe_signature_is_rejected(): void
    {
        Event::fake();

        $payload = [
            'type' => 'checkout.session.completed',
            'data' => [
                'object' => [
                    'id' => 'cs_test_12345',
                ]
            ]
        ];

        $response = $this->postJson('/api/webhooks/stripe', $payload, [
            'Stripe-Signature' => 't=' . time() . ',v1=invalidhash',
        ]);

        $response->assertStatus(400);
        $response->assertSee('Invalid Signature');
        Event::assertNotDispatched(UserEnrolledInMasterclass::class);
    }

    /**
     * Test idempotency check prevents duplicate events for already processed session.
     */
    public function test_stripe_webhook_idempotency_prevents_duplicate_processing(): void
    {
        Event::fake();

        // Pre-create a paid order matching stripe session id
        Order::create([
            'user_id' => $this->user->id,
            'stripe_session_id' => 'cs_test_12345',
            'amount_total' => 99.00,
            'currency' => 'usd',
            'status' => 'paid',
        ]);

        $payload = [
            'type' => 'checkout.session.completed',
            'data' => [
                'object' => [
                    'id' => 'cs_test_12345',
                    'object' => 'checkout.session',
                ]
            ]
        ];

        $rawBody = json_encode($payload);
        $timestamp = time();
        $signaturePayload = $timestamp . '.' . $rawBody;
        $hash = hash_hmac('sha256', $signaturePayload, $this->webhookSecret);
        $sigHeader = "t={$timestamp},v1={$hash}";

        $response = $this->postJson('/api/webhooks/stripe', $payload, [
            'Stripe-Signature' => $sigHeader,
        ]);

        $response->assertStatus(200);
        Event::assertNotDispatched(UserEnrolledInMasterclass::class);
    }
}
