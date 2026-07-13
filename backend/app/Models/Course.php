<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'slug', 'description', 'price', 'is_published'];

    /**
     * Get all lessons belonging to this AI course, sorted by sequence order.
     */
    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class)->orderBy('order_sequence', 'asc');
    }

    /**
     * Get all modules belonging to this course, sorted by sequence order.
     */
    public function modules(): HasMany
    {
        return $this->hasMany(Module::class)->orderBy('order_sequence', 'asc');
    }
}