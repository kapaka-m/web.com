<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Support;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Schema;

class MailSettings
{
    public static function apply(): void
    {
        try {
            if (!Schema::hasTable('site_settings')) {
                return;
            }

            $settings = SiteSetting::query()->first();
            if (!$settings || empty($settings->smtp)) {
                return;
            }
        } catch (\Throwable $e) {
            return;
        }

        $smtp = $settings->smtp;
        if (array_key_exists('enabled', $smtp) && !$smtp['enabled']) {
            return;
        }

        $mailer = $smtp['mailer'] ?? 'smtp';
        $host = $smtp['host'] ?? null;
        $port = $smtp['port'] ?? null;
        $username = $smtp['username'] ?? null;
        $password = Secrets::resolve($smtp['password'] ?? null);
        $encryption = $smtp['encryption'] ?? null;
        $fromAddress = $smtp['from_address'] ?? null;
        $fromName = $smtp['from_name'] ?? null;

        $config = [];

        if ($mailer) {
            $config['mail.default'] = $mailer;
        }

        if ($host) {
            $config['mail.mailers.smtp.host'] = $host;
        }
        if ($port) {
            $config['mail.mailers.smtp.port'] = $port;
        }
        if ($username) {
            $config['mail.mailers.smtp.username'] = $username;
        }
        if ($password) {
            $config['mail.mailers.smtp.password'] = $password;
        }
        if ($encryption) {
            $config['mail.mailers.smtp.scheme'] = $encryption;
        }
        if ($fromAddress) {
            $config['mail.from.address'] = $fromAddress;
        }
        if ($fromName) {
            $config['mail.from.name'] = $fromName;
        }

        if (!empty($config)) {
            config($config);
        }
    }
}
