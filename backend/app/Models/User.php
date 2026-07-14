<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'role', 'is_suspended', 'is_active', 'enrolled_at'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_suspended' => 'boolean',
            'is_active' => 'boolean',
            'enrolled_at' => 'datetime',
        ];
    }

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'has_purchased',
    ];

    /**
     * Get all activity logs for this user.
     */
    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    /**
     * Get all orders for this user.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Attribute to check if user has purchased the masterclass or is an admin.
     */
    public function getHasPurchasedAttribute(): bool
    {
        if ($this->isAdmin()) {
            return true;
        }
        return $this->is_active || $this->orders()->where('status', 'paid')->exists();
    }

    /**
     * Check if the user has administrative instructor permissions.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin'; // Kept safely inside the class methods
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::updated(function (User $user) {
            $cacheStore = \Illuminate\Support\Facades\Cache::store();
            $supportsTags = method_exists($cacheStore, 'tags');
            if ($supportsTags) {
                \Illuminate\Support\Facades\Cache::tags(['user_'.$user->id])->flush();
            } else {
                \Illuminate\Support\Facades\Cache::forget("user_session_valid_{$user->id}");
            }
        });
    }
}