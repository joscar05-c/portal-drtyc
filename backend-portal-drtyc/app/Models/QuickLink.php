<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class QuickLink extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $fillable = [
        'title',
        'description',
        'url',
        'icon',
        'icon_path',
        'badge_text',
        'badge_color',
        'footer_info',
        'button_text',
        'button_icon',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['title', 'description', 'url', 'icon', 'icon_path', 'badge_text', 'badge_color', 'footer_info', 'button_text', 'button_icon', 'sort_order', 'is_active'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }
}
