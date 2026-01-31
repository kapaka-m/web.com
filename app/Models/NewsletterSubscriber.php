<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsletterSubscriber extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_UNSUBSCRIBED = 'unsubscribed';

    protected $fillable = [
        'email',
        'name',
        'status',
        'token',
        'locale',
        'source',
        'subscribed_at',
        'confirmed_at',
        'unsubscribed_at',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'subscribed_at' => 'datetime',
        'confirmed_at' => 'datetime',
        'unsubscribed_at' => 'datetime',
    ];

    public function scopeConfirmed($query)
    {
        return $query->where('status', self::STATUS_CONFIRMED);
    }
}
