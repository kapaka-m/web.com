<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Support;

use App\Models\NewsletterSubscriber;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;

class NewsletterProviders
{
    public static function sync(NewsletterSubscriber $subscriber): void
    {
        $settings = self::settings();

        if (!empty($settings['mailchimp']['enabled'])) {
            self::syncMailchimp($subscriber, $settings['mailchimp']);
        }

        if (!empty($settings['sendinblue']['enabled'])) {
            self::syncSendinblue($subscriber, $settings['sendinblue']);
        }
    }

    private static function settings(): array
    {
        $base = config('integrations', []);

        if (!Schema::hasTable('site_settings')) {
            return $base;
        }

        $custom = SiteSetting::query()->first()?->integrations ?? [];

        return array_replace_recursive($base, $custom);
    }

    private static function syncMailchimp(NewsletterSubscriber $subscriber, array $config): void
    {
        $apiKey = Secrets::resolve($config['api_key'] ?? null);
        $listId = $config['list_id'] ?? null;
        $datacenter = $config['datacenter'] ?? null;

        if (!$apiKey || !$listId) {
            return;
        }

        if (!$datacenter && str_contains($apiKey, '-')) {
            $datacenter = substr($apiKey, strrpos($apiKey, '-') + 1);
        }

        if (!$datacenter) {
            return;
        }

        $endpoint = "https://{$datacenter}.api.mailchimp.com/3.0/lists/{$listId}/members";
        $payload = [
            'email_address' => $subscriber->email,
            'status' => 'subscribed',
            'merge_fields' => [
                'FNAME' => $subscriber->name,
            ],
        ];

        Http::withBasicAuth('apikey', $apiKey)
            ->timeout(8)
            ->post($endpoint, $payload);
    }

    private static function syncSendinblue(NewsletterSubscriber $subscriber, array $config): void
    {
        $apiKey = Secrets::resolve($config['api_key'] ?? null);
        $listId = $config['list_id'] ?? null;

        if (!$apiKey || !$listId) {
            return;
        }

        $payload = [
            'email' => $subscriber->email,
            'attributes' => [
                'FIRSTNAME' => $subscriber->name,
            ],
            'listIds' => [(int) $listId],
            'updateEnabled' => true,
        ];

        Http::withHeaders(['api-key' => $apiKey])
            ->timeout(8)
            ->post('https://api.sendinblue.com/v3/contacts', $payload);
    }
}
