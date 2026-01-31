<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'summary',
        'description',
        'client',
        'year',
        'stack',
        'cover_image',
        'seo',
        'is_featured',
        'is_active',
    ];

    protected $casts = [
        'title' => 'array',
        'summary' => 'array',
        'description' => 'array',
        'stack' => 'array',
        'seo' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function images(): HasMany
    {
        return $this->hasMany(ProjectImage::class)->orderBy('sort_order');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}
