<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebhookEndpoint extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'url',
        'events',
        'secret',
        'is_active',
        'last_fired_at',
    ];

    protected $casts = [
        'events' => 'array',
        'is_active' => 'boolean',
        'last_fired_at' => 'datetime',
    ];
}
