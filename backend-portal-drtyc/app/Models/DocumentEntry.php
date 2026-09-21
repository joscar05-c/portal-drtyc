<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class DocumentEntry extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $fillable = [
        'tracking_number',
        'sender_type',
        'document_number',
        'sender_name',
        'email',
        'phone',
        'document_type',
        'subject',
        'folios',
        'main_file_path',
        'annexes_file_path',
        'status',
        'official_response',
    ];

    protected function casts(): array
    {
        return [
            'annexes_file_path' => 'array',
            'folios' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (DocumentEntry $entry) {
            if (empty($entry->tracking_number)) {
                $entry->tracking_number = 'MPV-' . date('Y') . '-' . str_pad(
                    DocumentEntry::max('id') + 1,
                    6,
                    '0',
                    STR_PAD_LEFT
                );
            }
        });
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status', 'official_response'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    public function movements(): HasMany
    {
        return $this->hasMany(DocumentMovement::class);
    }
}
