<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentMovement extends Model
{
    protected $fillable = [
        'document_entry_id',
        'from_area_id',
        'from_user_id',
        'to_area_id',
        'to_user_id',
        'action_requested',
        'observations',
        'is_received',
        'received_at',
    ];

    protected function casts(): array
    {
        return [
            'is_received' => 'boolean',
            'received_at' => 'datetime',
        ];
    }

    public function documentEntry(): BelongsTo
    {
        return $this->belongsTo(DocumentEntry::class);
    }

    public function fromArea(): BelongsTo
    {
        return $this->belongsTo(Area::class, 'from_area_id');
    }

    public function toArea(): BelongsTo
    {
        return $this->belongsTo(Area::class, 'to_area_id');
    }

    public function fromUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    public function toUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'to_user_id');
    }
}
