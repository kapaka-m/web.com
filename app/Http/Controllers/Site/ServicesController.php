<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Support\SiteData;
use App\Support\Translation;
use Inertia\Inertia;

class ServicesController extends Controller
{
    public function index()
    {
        $locale = app()->getLocale();

        $services = Service::active()
            ->orderBy('sort_order')
            ->get()
            ->map(fn(Service $service) => [
                'id' => $service->id,
                'title' => Translation::get($service->title, $locale),
                'summary' => Translation::get($service->summary, $locale),
                'slug' => $service->slug,
                'features' => Translation::map($service->features ?? [], $locale),
                'icon' => $service->icon,
            ]);

        return Inertia::render('Services', [
            'site' => SiteData::forLocale($locale),
            'services' => $services,
        ]);
    }

    public function show(string $locale, Service $service)
    {
        if (!$service->is_active) {
            abort(404);
        }

        $seo = $service->seo ?? [];

        $serviceData = [
            'id' => $service->id,
            'title' => Translation::get($service->title, $locale),
            'summary' => Translation::get($service->summary, $locale),
            'description' => Translation::get($service->description, $locale),
            'slug' => $service->slug,
            'features' => Translation::map($service->features ?? [], $locale),
            'icon' => $service->icon,
            'seo' => [
                'meta_title' => Translation::get($seo['meta_title'] ?? null, $locale),
                'meta_description' => Translation::get($seo['meta_description'] ?? null, $locale),
                'og_image' => $seo['og_image'] ?? null,
                'robots' => $seo['robots'] ?? null,
            ],
        ];

        return Inertia::render('Services/Show', [
            'site' => SiteData::forLocale($locale),
            'service' => $serviceData,
        ]);
    }
}
