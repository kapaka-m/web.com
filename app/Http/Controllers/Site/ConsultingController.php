<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Support\SiteData;
use Inertia\Inertia;

class ConsultingController extends Controller
{
    public function index()
    {
        $locale = app()->getLocale();

        return Inertia::render('Consulting', [
            'site' => SiteData::forLocale($locale),
        ]);
    }
}
