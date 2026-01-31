<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Testimonial;
use App\Models\Partner;
use App\Support\ImageVariants;
use App\Support\SiteData;
use App\Support\Translation;
use Inertia\Inertia;

class AboutController extends Controller
{
    public function index()
    {
        $locale = app()->getLocale();

        $services = Service::active()
            ->orderBy('sort_order')
            ->take(4)
            ->get()
            ->map(fn(Service $service) => [
                'id' => $service->id,
                'title' => Translation::get($service->title, $locale),
                'summary' => Translation::get($service->summary, $locale),
                'icon' => $service->icon,
            ]);

        $testimonials = Testimonial::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->take(6)
            ->get()
            ->map(fn(Testimonial $testimonial) => [
                'id' => $testimonial->id,
                'name' => $testimonial->name,
                'role' => Translation::get($testimonial->role, $locale),
                'company' => $testimonial->company,
                'quote' => Translation::get($testimonial->quote, $locale),
                'avatar' => $testimonial->avatar,
                'avatar_srcset' => ImageVariants::srcSet($testimonial->avatar),
            ]);

        $partners = Partner::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->take(8)
            ->get()
            ->map(fn(Partner $partner) => [
                'id' => $partner->id,
                'name' => $partner->name,
                'logo' => $partner->logo,
                'logo_srcset' => ImageVariants::srcSet($partner->logo),
                'url' => $partner->url,
            ]);

        return Inertia::render('About', [
            'site' => SiteData::forLocale($locale),
            'services' => $services,
            'testimonials' => $testimonials,
            'partners' => $partners,
        ]);
    }
}
