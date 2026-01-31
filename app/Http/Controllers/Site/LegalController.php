<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Support\SiteData;
use Inertia\Inertia;

class LegalController extends Controller
{
    public function privacy()
    {
        $locale = app()->getLocale();

        return Inertia::render('Legal/Privacy', [
            'site' => SiteData::forLocale($locale),
        ]);
    }

    public function terms()
    {
        $locale = app()->getLocale();

        return Inertia::render('Legal/Terms', [
            'site' => SiteData::forLocale($locale),
        ]);
    }
}
