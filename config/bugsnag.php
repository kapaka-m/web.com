<?php
// MOHAMED HASSANIN (KAPAKA)

return [
    'api_key' => env('BUGSNAG_API_KEY'),
    'notify_release_stages' => [env('APP_ENV', 'production')],
    'release_stage' => env('APP_ENV', 'production'),
    'app_version' => env('APP_VERSION'),
];
