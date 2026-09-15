<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class Document extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $fillable = [
        'user_id',
        'category_id',
        'document_type',
        'document_number',
        'year',
        'title',
        'description',
        'file_path',
        'issue_date',
    ];

    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'issue_date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['document_type', 'document_number', 'year', 'title', 'description', 'file_path', 'issue_date'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }
}
