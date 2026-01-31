<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $locale = app()->getLocale();
        $direction = $locale === 'ar' ? 'rtl' : 'ltr';
        $supportedLocales = config('app.supported_locales', ['ar', 'en']);
        $user = $request->user();
        $notifications = null;

        if ($user) {
            $notifications = [
                'unread_count' => $user->unreadNotifications()->count(),
                'items' => $user->notifications()
                    ->latest()
                    ->take(6)
                    ->get()
                    ->map(fn($notification) => [
                        'id' => $notification->id,
                        'type' => data_get($notification->data, 'type'),
                        'title' => data_get($notification->data, 'title'),
                        'body' => data_get($notification->data, 'body'),
                        'link' => data_get($notification->data, 'link'),
                        'read_at' => optional($notification->read_at)->toDateTimeString(),
                        'created_at' => optional($notification->created_at)->toDateTimeString(),
                    ]),
            ];
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'locale' => $locale,
            'direction' => $direction,
            'supportedLocales' => $supportedLocales,
            'appUrl' => config('app.url'),
            'notifications' => $notifications,
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }
}
