<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Order;
use App\Models\User;
use App\Jobs\ProcessPaddleWebhook;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class OrderAndWebhookTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Course $course;

    protected function setUp(): void
    {
        parent::setUp();

        // Create standard test user
        $this->user = User::factory()->create([
            'email' => 'student@example.com',
            'role' => 'student',
        ]);

        // Create course
        $this->course = Course::create([
            'title' => 'AI Growth Academy — 28-Day AI Challenge',
            'slug' => '28-day-ai-challenge',
            'description' => 'Master AI in 28 days',
            'price' => 99.00,
            'is_published' => true,
        ]);

        // Configure test webhook secret
        Config::set('services.paddle.webhook_secret', 'test_secret');
        Config::set('services.paddle.api_key', ''); // Triggers mock fallback in gateway
    }

    /**
     * Test checkout session creation.
     */
    public function test_checkout_session_creation(): void
    {
        $response = $this->actingAs($this->user)->postJson('/api/checkout/session');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'checkout_url',
            'token',
            'transaction_id',
        ]);

        // Assert pending order was created
        $this->assertDatabaseHas('orders', [
            'user_id' => $this->user->id,
            'amount_total' => 99.00,
            'status' => 'pending',
        ]);
    }

    /**
     * Test webhook signature validation and queuing.
     */
    public function test_webhook_dispatches_queued_job(): void
    {
        Queue::fake();

        $timestamp = time();
        $payload = [
            'event_type' => 'transaction.completed',
            'data' => [
                'id' => 'trn_test123456',
                'custom_data' => [
                    'user_id' => (string) $this->user->id,
                ],
                'details' => [
                    'totals' => [
                        'grand_total' => '99.00',
                        'currency_code' => 'USD',
                    ]
                ]
            ]
        ];

        $rawBody = json_encode($payload);
        $signaturePayload = $timestamp . '.' . $rawBody;
        $hash = hash_hmac('sha256', $signaturePayload, 'test_secret');
        $header = "t={$timestamp};h=sha256:{$hash}";

        $response = $this->postJson('/api/webhooks/paddle', $payload, [
            'Paddle-Signature' => $header,
        ]);

        $response->assertStatus(200);
        Queue::assertPushed(ProcessPaddleWebhook::class);
    }

    /**
     * Test webhook reject invalid signature.
     */
    public function test_webhook_rejects_invalid_signature(): void
    {
        $payload = ['event_type' => 'transaction.completed'];
        
        $response = $this->postJson('/api/webhooks/paddle', $payload, [
            'Paddle-Signature' => 't=123456;h=sha256:invalidhash',
        ]);

        $response->assertStatus(401);
    }

    public function test_webhook_job_execution_and_idempotency(): void
    {
        // 1. Create a pending order first
        $order = Order::create([
            'user_id' => $this->user->id,
            'stripe_session_id' => 'trn_test123456',
            'amount_total' => 99.00,
            'currency' => 'USD',
            'status' => 'pending',
        ]);

        $payload = [
            'event_type' => 'transaction.completed',
            'data' => [
                'id' => 'trn_test123456',
                'custom_data' => [
                    'user_id' => (string) $this->user->id,
                ],
                'details' => [
                    'totals' => [
                        'grand_total' => '99.00',
                        'currency_code' => 'USD',
                    ]
                ]
            ]
        ];

        // Run the job the first time
        $job = new ProcessPaddleWebhook($payload);
        $job->handle();

        // Check it was marked as paid
        $this->assertDatabaseHas('orders', [
            'stripe_session_id' => 'trn_test123456',
            'status' => 'paid',
        ]);

        // Run the job a second time (simulate double delivery)
        $job2 = new ProcessPaddleWebhook($payload);
        $job2->handle();

        // Assert we still have exactly 1 order (deduplicated/idempotent)
        $this->assertEquals(1, Order::where('stripe_session_id', 'trn_test123456')->count());
        $this->assertEquals('paid', Order::where('stripe_session_id', 'trn_test123456')->first()->status);
    }
}
