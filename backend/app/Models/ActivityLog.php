<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'lesson_id', 'status', 'watch_time_seconds', 'last_accessed_at'])]
class ActivityLog extends Model
{
    use HasFactory;

    protected $casts = [
        'last_accessed_at' => 'datetime',
    ];

    /**
     * Get the student who owns this activity tracking log.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the lesson being tracked.
     */
    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }
}