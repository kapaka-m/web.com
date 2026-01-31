<?php
// MOHAMED HASSANIN (KAPAKA)

return [
    'contact_to' => env('CONTACT_TO_EMAIL', 'info@Mohamed-hassanin.dev'),
    'captcha' => [
        'provider' => env('CAPTCHA_PROVIDER', 'hcaptcha'),
        'enabled' => env('CAPTCHA_ENABLED', false),
    ],
    'hcaptcha' => [
        'site_key' => env('HCAPTCHA_SITE_KEY'),
        'secret' => env('HCAPTCHA_SECRET'),
        'enabled' => env('HCAPTCHA_ENABLED', false),
    ],
    'turnstile' => [
        'site_key' => env('TURNSTILE_SITE_KEY'),
        'secret' => env('TURNSTILE_SECRET'),
        'enabled' => env('TURNSTILE_ENABLED', false),
    ],
];
