<?php
// MOHAMED HASSANIN (KAPAKA)

return [
    'enabled' => (bool) env('TRANSLATION_ENABLED', false),
    'provider' => env('TRANSLATION_PROVIDER', 'libre'),
    'endpoint' => env('TRANSLATION_ENDPOINT', 'https://libretranslate.com/translate'),
    'api_key' => env('TRANSLATION_API_KEY'),
    'timeout' => (int) env('TRANSLATION_TIMEOUT', 8),
];
