<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Mail\NewsletterConfirmationMail;
use App\Models\NewsletterSubscriber;
use App\Models\SiteSetting;
use App\Support\NewsletterProviders;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class NewsletterController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $settings = $this->settings();
        if (!($settings['newsletter']['enabled'] ?? true)) {
            return back();
        }

        $validated = $request->validate([
            'email' => ['required', 'email', 'max:190'],
            'name' => ['nullable', 'string', 'max:160'],
        ]);

        $subscriber = NewsletterSubscriber::query()
            ->where('email', $validated['email'])
            ->first();

        if (!$subscriber) {
            $subscriber = NewsletterSubscriber::create([
                'email' => $validated['email'],
                'name' => $validated['name'] ?? null,
                'status' => NewsletterSubscriber::STATUS_PENDING,
                'token' => Str::random(40),
                'locale' => app()->getLocale(),
                'source' => 'website',
                'subscribed_at' => now(),
                'ip_address' => $request->ip(),
                'user_agent' => (string) $request->userAgent(),
            ]);
        } elseif ($subscriber->status === NewsletterSubscriber::STATUS_UNSUBSCRIBED) {
            $subscriber->update([
                'status' => NewsletterSubscriber::STATUS_PENDING,
                'token' => Str::random(40),
                'name' => $validated['name'] ?? $subscriber->name,
                'locale' => app()->getLocale(),
                'subscribed_at' => now(),
            ]);
        }

        $doubleOptIn = (bool) ($settings['newsletter']['double_opt_in'] ?? true);

        if ($doubleOptIn) {
            if (!$subscriber->token) {
                $subscriber->update(['token' => Str::random(40)]);
            }

            Mail::to($subscriber->email)->queue(new NewsletterConfirmationMail($subscriber));

            return back()->with('success', $this->message('pending'));
        }

        $subscriber->update([
            'status' => NewsletterSubscriber::STATUS_CONFIRMED,
            'confirmed_at' => now(),
            'token' => null,
        ]);

        NewsletterProviders::sync($subscriber);

        return back()->with('success', $this->message('confirmed'));
    }

    public function confirm(string $locale, string $token): RedirectResponse
    {
        $subscriber = NewsletterSubscriber::query()
            ->where('token', $token)
            ->first();

        if (!$subscriber) {
            return redirect()->route('home', ['locale' => $locale])
                ->with('error', $this->message('invalid'));
        }

        $subscriber->update([
            'status' => NewsletterSubscriber::STATUS_CONFIRMED,
            'confirmed_at' => now(),
            'token' => null,
        ]);

        NewsletterProviders::sync($subscriber);

        return redirect()->route('home', ['locale' => $locale])
            ->with('success', $this->message('confirmed'));
    }

    public function unsubscribe(string $locale, string $token): RedirectResponse
    {
        $subscriber = NewsletterSubscriber::query()
            ->where('token', $token)
            ->first();

        if (!$subscriber) {
            return redirect()->route('home', ['locale' => $locale])
                ->with('error', $this->message('invalid'));
        }

        $subscriber->update([
            'status' => NewsletterSubscriber::STATUS_UNSUBSCRIBED,
            'unsubscribed_at' => now(),
        ]);

        return redirect()->route('home', ['locale' => $locale])
            ->with('success', $this->message('unsubscribed'));
    }

    private function settings(): array
    {
        $base = config('integrations', []);

        if (!Schema::hasTable('site_settings')) {
            return $base;
        }

        $custom = SiteSetting::query()->first()?->integrations ?? [];

        return array_replace_recursive($base, $custom);
    }

    private function message(string $type): string
    {
        $isArabic = app()->getLocale() === 'ar';

        return match ($type) {
            'pending' => $isArabic
            ? 'تم إرسال رابط التأكيد إلى بريدك الإلكتروني.'
            : 'Please check your inbox to confirm your subscription.',
            'confirmed' => $isArabic
            ? 'تم تأكيد اشتراكك بنجاح.'
            : 'Your subscription is confirmed.',
            'unsubscribed' => $isArabic
            ? 'تم إلغاء الاشتراك بنجاح.'
            : 'You have been unsubscribed.',
            default => $isArabic
            ? 'الرابط غير صالح.'
            : 'Invalid confirmation link.',
        };
    }
}
