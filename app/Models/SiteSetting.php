<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'site_name',
        'tagline',
        'hero',
        'about',
        'contact',
        'social_links',
        'stats',
        'seo',
        'smtp',
        'integrations',
        'consulting',
        'careers',
        'privacy_policy',
        'terms_of_use',
        'footer_note',
    ];

    protected $casts = [
        'site_name' => 'array',
        'tagline' => 'array',
        'hero' => 'array',
        'about' => 'array',
        'contact' => 'array',
        'social_links' => 'array',
        'stats' => 'array',
        'seo' => 'array',
        'smtp' => 'array',
        'integrations' => 'array',
        'consulting' => 'array',
        'careers' => 'array',
        'privacy_policy' => 'array',
        'terms_of_use' => 'array',
        'footer_note' => 'array',
    ];
}
