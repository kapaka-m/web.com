<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SetLocale
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $availableLocales = config('app.supported_locales', ['ar', 'en']);
        $routeLocale = $request->route('locale');

        if ($routeLocale && in_array($routeLocale, $availableLocales, true)) {
            $locale = $routeLocale;
            $request->session()->put('locale', $locale);
        } else {
            $locale = $request->session()->get('locale', config('app.locale'));

            if (!in_array($locale, $availableLocales, true)) {
                $locale = config('app.fallback_locale', 'en');
            }
        }

        app()->setLocale($locale);

        return $next($request);
    }
}
