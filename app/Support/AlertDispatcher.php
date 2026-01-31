<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Support;

use App\Models\SiteSetting;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;

class AlertDispatcher
{
    public static function notify(string $title, string $message, array $context = []): void
    {
        $settings = self::settings();
        if (!$settings) {
            return;
        }

        $text = $title !== '' ? "{$title}\n{$message}" : $message;

        if (!empty($context)) {
            $text .= "\n" . json_encode($context, JSON_UNESCAPED_UNICODE);
        }

        $slackWebhook = Secrets::resolve($settings['slack_webhook'] ?? null);
        if ($slackWebhook) {
            Http::timeout(6)->post($slackWebhook, [
                'text' => $text,
            ]);
        }

        $telegramToken = Secrets::resolve($settings['telegram_bot_token'] ?? null);
        $telegramChat = $settings['telegram_chat_id'] ?? null;
        if ($telegramToken && $telegramChat) {
            $telegramUrl = "https://api.telegram.org/bot{$telegramToken}/sendMessage";
            Http::timeout(6)->asForm()->post($telegramUrl, [
                'chat_id' => $telegramChat,
                'text' => $text,
            ]);
        }
    }

    private static function settings(): ?array
    {
        $base = config('integrations.alerts', []);

        if (!Schema::hasTable('site_settings')) {
            return $base ?: null;
        }

        $settings = SiteSetting::query()->first();
        $custom = $settings?->integrations['alerts'] ?? [];

        $merged = array_merge($base, $custom);

        if (
            !($merged['enabled'] ?? false)
            && empty($merged['slack_webhook'])
            && empty($merged['telegram_bot_token'])
        ) {
            return null;
        }

        return $merged;
    }
}
