<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Support\SiteData;
use Inertia\Inertia;

class CareersController extends Controller
{
    public function index()
    {
        $locale = app()->getLocale();

        return Inertia::render('Careers', [
            'site' => SiteData::forLocale($locale),
        ]);
    }
}
