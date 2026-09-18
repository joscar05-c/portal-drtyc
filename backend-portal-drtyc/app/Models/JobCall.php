<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class JobCall extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $fillable = [
        'title',
        'type',
        'status',
        'start_date',
        'end_date',
        'application_start_at',
        'application_end_at',
        'description',
        'documents',
        'schedule',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'application_start_at' => 'datetime',
            'application_end_at' => 'datetime',
            'documents' => 'array',
            'schedule' => 'array',
        ];
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    public function isAcceptingApplications(): bool
    {
        if (is_null($this->application_start_at) || is_null($this->application_end_at)) {
            return false;
        }

        $now = now();
        return $now->gte($this->application_start_at) && $now->lte($this->application_end_at);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['title', 'type', 'status', 'start_date', 'end_date', 'application_start_at', 'application_end_at', 'description', 'documents', 'schedule'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }
}
