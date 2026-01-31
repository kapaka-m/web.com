<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Support;

use App\Models\SiteSetting;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;

class CaptchaService
{
    public static function config(): array
    {
        $provider = config('site.captcha.provider', 'hcaptcha');
        $enabled = config('site.captcha.enabled', false);
        $siteKey = null;
        $secret = null;

        if (Schema::hasTable('site_settings')) {
            $settings = SiteSetting::query()->first();
            $integration = $settings?->integrations['captcha'] ?? [];
            if (!empty($integration)) {
                $provider = $integration['provider'] ?? $provider;
                $enabled = $integration['enabled'] ?? $enabled;
                $siteKey = $integration['site_key'] ?? null;
                $secret = $integration['secret'] ?? null;
            }
        }

        if ($provider === 'turnstile') {
            $siteKey = $siteKey ?: config('site.turnstile.site_key');
            $secret = $secret ?: config('site.turnstile.secret');
        } else {
            $provider = 'hcaptcha';
            $siteKey = $siteKey ?: config('site.hcaptcha.site_key');
            $secret = $secret ?: config('site.hcaptcha.secret');
        }

        return [
            'provider' => $provider,
            'enabled' => (bool) $enabled,
            'site_key' => $siteKey,
            'secret' => Secrets::resolve($secret),
        ];
    }

    public static function verify(string $token, ?string $ip = null): bool
    {
        $config = self::config();
        if (!$config['enabled']) {
            return true;
        }

        if (!$config['secret']) {
            return false;
        }

        $endpoint = $config['provider'] === 'turnstile'
            ? 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
            : 'https://hcaptcha.com/siteverify';

        $payload = [
            'secret' => $config['secret'],
            'response' => $token,
        ];

        if ($ip) {
            $payload['remoteip'] = $ip;
        }

        /** @var Response $response */
        $response = Http::asForm()->timeout(6)->post($endpoint, $payload);

        if (!$response->ok()) {
            return false;
        }

        return (bool) Arr::get($response->json(), 'success');
    }
}
