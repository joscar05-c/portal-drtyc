<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Area extends Model
{
    protected $fillable = ['name', 'description', 'parent_id', 'is_main_entry_point'];

    protected function casts(): array
    {
        return [
            'is_main_entry_point' => 'boolean',
        ];
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Area::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Area::class, 'parent_id');
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function documentMovementsFrom(): HasMany
    {
        return $this->hasMany(DocumentMovement::class, 'from_area_id');
    }

    public function documentMovementsTo(): HasMany
    {
        return $this->hasMany(DocumentMovement::class, 'to_area_id');
    }

    public function getFullNameAttribute(): string
    {
        return $this->parent
            ? $this->parent->name . ' > ' . $this->name
            : $this->name;
    }
}
