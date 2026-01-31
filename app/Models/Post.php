<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    public const REVIEW_DRAFT = 'draft';
    public const REVIEW_PENDING = 'pending';
    public const REVIEW_APPROVED = 'approved';

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'content_markdown',
        'cover_image',
        'seo',
        'author_id',
        'category_id',
        'is_published',
        'published_at',
        'review_status',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'title' => 'array',
        'excerpt' => 'array',
        'content' => 'array',
        'content_markdown' => 'array',
        'seo' => 'array',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function scopePublished($query)
    {
        return $query
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('review_status', self::REVIEW_APPROVED)
            ->where('published_at', '<=', now())
            ->orderByDesc('published_at');
    }
}
