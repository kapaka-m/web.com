<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Support;

use App\Models\WebhookEndpoint;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class WebhookDispatcher
{
    public static function dispatch(string $event, array $payload): void
    {
        if (!config('integrations.webhooks.enabled', true)) {
            return;
        }

        if (!Schema::hasTable('webhook_endpoints')) {
            return;
        }

        $endpoints = WebhookEndpoint::query()
            ->where('is_active', true)
            ->get();

        if ($endpoints->isEmpty()) {
            return;
        }

        $body = [
            'event' => $event,
            'data' => $payload,
            'sent_at' => now()->toIso8601String(),
        ];

        $json = json_encode($body);
        $maxPayload = (int) config('integrations.webhooks.max_payload', 8000);
        if ($maxPayload > 0 && $json && strlen($json) > $maxPayload) {
            $body['data'] = Arr::only($payload, ['id', 'slug', 'title', 'url', 'published_at']);
            $json = json_encode($body);
        }

        foreach ($endpoints as $endpoint) {
            if (!$endpoint instanceof WebhookEndpoint) {
                continue;
            }
            if (!self::matchesEvent($endpoint->events ?? [], $event)) {
                continue;
            }

            $headers = [
                'X-Webhook-Event' => $event,
            ];

            if ($endpoint->secret) {
                $signature = hash_hmac('sha256', $json, $endpoint->secret);
                $headers['X-Webhook-Signature'] = $signature;
            }

            try {
                /** @var Response $response */
                $response = Http::timeout(config('integrations.webhooks.timeout', 8))
                    ->withHeaders($headers)
                    ->post($endpoint->url, $body);

                $endpoint->update([
                    'last_fired_at' => now(),
                ]);

                if (!$response->ok()) {
                    Log::warning('Webhook delivery failed.', [
                        'url' => $endpoint->url,
                        'event' => $event,
                        'status' => $response->status(),
                    ]);
                }
            } catch (\Throwable $e) {
                Log::warning('Webhook delivery error.', [
                    'url' => $endpoint->url,
                    'event' => $event,
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }

    private static function matchesEvent(array $events, string $event): bool
    {
        if (empty($events)) {
            return true;
        }

        return in_array($event, $events, true);
    }
}
