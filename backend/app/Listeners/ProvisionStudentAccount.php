<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\UserEnrolledInMasterclass;
use App\Models\User;
use App\Models\Order;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ProvisionStudentAccount implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(UserEnrolledInMasterclass $event): void
    {
        $session = $event->session;
        $email = $session->customer_details->email ?? $session->customer_email;

        if (!$email) {
            Log::error('Stripe provision error: Email missing from session', ['session_id' => $session->id]);
            return;
        }

        DB::transaction(function () use ($session, $email) {
            // Find or create the user
            $user = User::where('email', $email)->first();

            if (!$user) {
                $user = User::create([
                    'name' => $session->customer_details->name ?? 'Student',
                    'email' => $email,
                    'password' => bcrypt(Str::random(16)),
                    'role' => 'student',
                    'is_suspended' => false,
                    'is_active' => true,
                    'enrolled_at' => now(),
                ]);
                Log::info('ProvisionStudentAccount: New student user created', ['user_id' => $user->id, 'email' => $email]);
            } else {
                $user->update([
                    'is_active' => true,
                    'enrolled_at' => now(),
                ]);
                Log::info('ProvisionStudentAccount: Existing user account activated', ['user_id' => $user->id, 'email' => $email]);
            }

            // Create the order record
            Order::create([
                'user_id' => $user->id,
                'stripe_session_id' => $session->id,
                'stripe_payment_intent_id' => $session->payment_intent,
                'amount_total' => $session->amount_total / 100, // Stripe amount is in cents
                'currency' => strtoupper($session->currency ?? 'USD'),
                'status' => $session->payment_status ?? 'paid',
                'invoice_pdf_path' => null,
            ]);

            Log::info('ProvisionStudentAccount: Order created successfully', [
                'user_id' => $user->id,
                'stripe_session_id' => $session->id
            ]);
        });
    }
}
