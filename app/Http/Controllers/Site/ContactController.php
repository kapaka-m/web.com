<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Mail\ContactMessageMail;
use App\Models\ContactMessage;
use App\Models\User;
use App\Notifications\ContactMessageReceived;
use App\Support\AlertDispatcher;
use App\Support\CaptchaService;
use App\Support\SiteData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function create()
    {
        $locale = app()->getLocale();
        $captcha = CaptchaService::config();
        $captchaEnabled = $captcha['enabled'] && $captcha['site_key'];

        return Inertia::render('Contact', [
            'site' => SiteData::forLocale($locale),
            'captcha' => $captchaEnabled
                ? [
                    'provider' => $captcha['provider'],
                    'site_key' => $captcha['site_key'],
                ]
                : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $captcha = CaptchaService::config();
        $captchaEnabled = $captcha['enabled']
            && $captcha['secret']
            && $captcha['site_key'];

        $rules = [
            'name' => ['required', 'string', 'max:160'],
            'email' => ['required', 'email', 'max:190'],
            'phone' => ['nullable', 'string', 'max:40'],
            'subject' => ['nullable', 'string', 'max:190'],
            'message' => ['required', 'string', 'max:2000'],
            'website' => ['nullable', 'string', 'max:190'],
        ];

        if ($captchaEnabled) {
            $rules['captcha_token'] = ['required', 'string'];
        }

        $validated = $request->validate($rules);

        if (!empty($validated['website'])) {
            return back()->with('error', $this->messageForLocale('error'));
        }

        if ($captchaEnabled && !CaptchaService::verify($validated['captcha_token'], $request->ip())) {
            return back()->with('error', $this->messageForLocale('error'));
        }

        $contactMessage = ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'subject' => $validated['subject'] ?? null,
            'message' => $validated['message'],
            'locale' => app()->getLocale(),
            'ip_address' => $request->ip(),
            'user_agent' => (string) $request->userAgent(),
        ]);

        User::query()
            ->where('role', User::ROLE_ADMIN)
            ->get()
            ->each(fn(User $user) => $user->notify(new ContactMessageReceived($contactMessage)));

        Mail::to(config('site.contact_to'))
            ->queue(new ContactMessageMail($contactMessage));

        AlertDispatcher::notify(
            'New contact message',
            $contactMessage->subject ?: 'New inquiry',
            [
                'name' => $contactMessage->name,
                'email' => $contactMessage->email,
            ],
        );

        return back()->with('success', $this->messageForLocale('success'));
    }

    private function messageForLocale(string $key): string
    {
        $isArabic = app()->getLocale() === 'ar';

        return match ($key) {
            'success' => $isArabic
            ? 'تم إرسال الرسالة بنجاح.'
            : 'Message sent successfully.',
            default => $isArabic
            ? 'تعذر إرسال الرسالة.'
            : 'Unable to send your message.',
        };
    }
}
