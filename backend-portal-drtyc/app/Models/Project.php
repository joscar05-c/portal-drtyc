<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class Project extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $fillable = [
        'title',
        'location',
        'budget',
        'progress_percentage',
        'status',
        'image_path',
    ];

    protected function casts(): array
    {
        return [
            'budget' => 'decimal:2',
            'progress_percentage' => 'integer',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['title', 'location', 'budget', 'progress_percentage', 'status', 'image_path'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }
}
