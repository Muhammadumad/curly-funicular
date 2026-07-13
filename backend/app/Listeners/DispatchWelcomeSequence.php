<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\UserEnrolledInMasterclass;
use App\Models\User;
use App\Mail\WelcomeMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class DispatchWelcomeSequence implements ShouldQueue
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
            return;
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            // Release to queue to wait for user creation by ProvisionStudentAccount
            Log::info('DispatchWelcomeSequence: User not found yet. Releasing job back to queue.', [
                'email' => $email
            ]);
            $this->release(5);
            return;
        }

        try {
            Mail::to($user->email)->send(new WelcomeMail($user));
            Log::info('DispatchWelcomeSequence: Welcome email sent successfully.', ['user_id' => $user->id]);
        } catch (\Throwable $e) {
            Log::error('DispatchWelcomeSequence error: ' . $e->getMessage());
            throw $e;
        }
    }
}
