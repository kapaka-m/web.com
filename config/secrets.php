<?php
// MOHAMED HASSANIN (KAPAKA)

return [
    'driver' => env('SECRETS_DRIVER', 'env'),
    'cache_ttl' => (int) env('SECRETS_CACHE_TTL', 300),
    'vault' => [
        'address' => env('SECRETS_VAULT_ADDRESS'),
        'token' => env('SECRETS_VAULT_TOKEN'),
        'mount' => env('SECRETS_VAULT_MOUNT', 'secret'),
        'version' => env('SECRETS_VAULT_VERSION', 'v2'),
    ],
    'aws' => [
        'region' => env('SECRETS_AWS_REGION', env('AWS_DEFAULT_REGION')),
    ],
];
