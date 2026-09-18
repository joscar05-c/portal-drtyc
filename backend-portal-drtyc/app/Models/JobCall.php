<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class JobCall extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $fillable = [
        'title',
        'slug',
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

    protected static function booted(): void
    {
        static::creating(function (JobCall $jobCall) {
            if (empty($jobCall->slug)) {
                $jobCall->slug = static::generateUniqueSlug($jobCall->title);
            }
        });

        static::updating(function (JobCall $jobCall) {
            if ($jobCall->isDirty('title') && !$jobCall->isDirty('slug')) {
                $jobCall->slug = static::generateUniqueSlug($jobCall->title, $jobCall->id);
            }
        });
    }

    protected static function generateUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $counter = 1;

        while (static::where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists()
        ) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
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
            ->logOnly(['title', 'slug', 'type', 'status', 'start_date', 'end_date', 'application_start_at', 'application_end_at', 'description', 'documents', 'schedule'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }
}
