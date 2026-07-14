<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id',
    'stripe_session_id',
    'stripe_payment_intent_id',
    'amount_total',
    'currency',
    'status',
    'invoice_pdf_path',
])]
class Order extends Model
{
    use HasFactory;

    /**
     * Get the user that owns this order.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
