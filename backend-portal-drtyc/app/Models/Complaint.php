<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class Complaint extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $fillable = [
        'tracking_code',
        'document_number',
        'full_name',
        'email',
        'phone',
        'type',
        'details',
        'reply',
        'status',
    ];

    protected static function booted(): void
    {
        static::creating(function (Complaint $complaint) {
            if (empty($complaint->tracking_code)) {
                $complaint->tracking_code = 'REC-' . date('Y') . '-' . str_pad(
                    Complaint::max('id') + 1,
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
            ->logOnly(['reply', 'status'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }
}
