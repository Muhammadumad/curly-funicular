<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(
            \App\Services\Payments\PaymentGatewayInterface::class,
            \App\Services\Payments\PaddleGateway::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('api', function (\Illuminate\Http\Request $request) {
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('login', function (\Illuminate\Http\Request $request) {
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(5)->by($request->ip());
        });

        \Illuminate\Auth\Notifications\ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return env('FRONTEND_URL', 'http://localhost:5173') . '/reset-password?token=' . $token . '&email=' . urlencode($notifiable->getEmailForPasswordReset());
        });

        \Illuminate\Support\Facades\Event::listen(
            \App\Events\UserEnrolledInMasterclass::class,
            \App\Listeners\ProvisionStudentAccount::class
        );
        \Illuminate\Support\Facades\Event::listen(
            \App\Events\UserEnrolledInMasterclass::class,
            \App\Listeners\GenerateAndSendInvoice::class
        );
        \Illuminate\Support\Facades\Event::listen(
            \App\Events\UserEnrolledInMasterclass::class,
            \App\Listeners\DispatchWelcomeSequence::class
        );
        \Illuminate\Support\Facades\Event::listen(
            \App\Events\UserEnrolledInMasterclass::class,
            \App\Listeners\NotifyCommunityWebhook::class
        );
    }
}
