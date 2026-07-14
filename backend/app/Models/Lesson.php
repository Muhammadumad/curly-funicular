<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['course_id', 'module_id', 'title', 'video_url', 'duration_in_seconds', 'order_sequence'])]
class Lesson extends Model
{
    use HasFactory;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::created(function (Lesson $lesson) {
            if ($lesson->video_url) {
                \Illuminate\Support\Facades\Bus::chain([
                    new \App\Jobs\ExtractAudio($lesson->id),
                    new \App\Jobs\RequestTranscription($lesson->id),
                    new \App\Jobs\SegmentTranscript($lesson->id),
                    new \App\Jobs\GenerateEmbeddings($lesson->id),
                ])->dispatch();
            }
        });

        static::updated(function (Lesson $lesson) {
            if ($lesson->wasChanged('video_url') && $lesson->video_url) {
                \Illuminate\Support\Facades\Bus::chain([
                    new \App\Jobs\ExtractAudio($lesson->id),
                    new \App\Jobs\RequestTranscription($lesson->id),
                    new \App\Jobs\SegmentTranscript($lesson->id),
                    new \App\Jobs\GenerateEmbeddings($lesson->id),
                ])->dispatch();
            }
        });
    }

    /**
     * Get the parent course this lesson belongs to.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get the parent module this lesson belongs to.
     */
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    /**
     * Get all tracking activity logs for this specific lesson.
     */
    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }
}