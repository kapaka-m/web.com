<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'summary',
        'description',
        'features',
        'icon',
        'seo',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'title' => 'array',
        'summary' => 'array',
        'description' => 'array',
        'features' => 'array',
        'seo' => 'array',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }
}
