<?php
// MOHAMED HASSANIN (KAPAKA)

return [
    'alerts' => [
        'enabled' => env('ALERTS_ENABLED', false),
        'slack_webhook' => env('ALERTS_SLACK_WEBHOOK'),
        'telegram_bot_token' => env('ALERTS_TELEGRAM_BOT_TOKEN'),
        'telegram_chat_id' => env('ALERTS_TELEGRAM_CHAT_ID'),
    ],
    'newsletter' => [
        'enabled' => env('NEWSLETTER_ENABLED', true),
        'double_opt_in' => env('NEWSLETTER_DOUBLE_OPT_IN', true),
    ],
    'mailchimp' => [
        'enabled' => env('MAILCHIMP_ENABLED', false),
        'api_key' => env('MAILCHIMP_API_KEY'),
        'list_id' => env('MAILCHIMP_LIST_ID'),
        'datacenter' => env('MAILCHIMP_DATACENTER'),
    ],
    'sendinblue' => [
        'enabled' => env('SENDINBLUE_ENABLED', false),
        'api_key' => env('SENDINBLUE_API_KEY'),
        'list_id' => env('SENDINBLUE_LIST_ID'),
    ],
    'calendly' => [
        'enabled' => env('CALENDLY_ENABLED', false),
        'url' => env('CALENDLY_URL'),
    ],
    'chat' => [
        'provider' => env('CHAT_PROVIDER', 'none'),
        'crisp_website_id' => env('CRISP_WEBSITE_ID'),
        'intercom_app_id' => env('INTERCOM_APP_ID'),
        'custom_script' => env('CHAT_CUSTOM_SCRIPT'),
    ],
    'webhooks' => [
        'enabled' => env('WEBHOOKS_ENABLED', true),
        'timeout' => env('WEBHOOKS_TIMEOUT', 8),
        'max_payload' => env('WEBHOOKS_MAX_PAYLOAD', 8000),
    ],
    'monitoring' => [
        'sentry_dsn' => env('SENTRY_LARAVEL_DSN'),
        'bugsnag_api_key' => env('BUGSNAG_API_KEY'),
        'telescope' => env('TELESCOPE_ENABLED', true),
    ],
];
