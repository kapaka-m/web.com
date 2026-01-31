<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Support\ActivityLogger;
use App\Support\AlertDispatcher;
use App\Support\Translation;
use App\Support\WebhookDispatcher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Service::class, 'service');
    }

    public function index(Request $request)
    {
        $locale = app()->getLocale();
        $showTrashed = $request->boolean('trashed');

        $services = Service::query()
            ->withTrashed()
            ->when($showTrashed, fn($query) => $query->onlyTrashed())
            ->orderBy('sort_order')
            ->paginate(10)
            ->through(fn(Service $service) => [
                'id' => $service->id,
                'title' => Translation::get($service->title, $locale),
                'summary' => Translation::get($service->summary, $locale),
                'is_active' => $service->is_active,
                'sort_order' => $service->sort_order,
                'deleted_at' => optional($service->deleted_at)->toDateTimeString(),
            ]);

        return Inertia::render('Admin/Services/Index', [
            'services' => $services,
            'filters' => [
                'trashed' => $showTrashed,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Services/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateService($request);
        $slugSource = $validated['slug'] ?: $validated['title_en'];

        $service = Service::create([
            'title' => [
                'ar' => $validated['title_ar'],
                'en' => $validated['title_en'],
            ],
            'slug' => $this->generateUniqueSlug($slugSource),
            'summary' => [
                'ar' => $validated['summary_ar'] ?? null,
                'en' => $validated['summary_en'] ?? null,
            ],
            'description' => [
                'ar' => $validated['description_ar'] ?? null,
                'en' => $validated['description_en'] ?? null,
            ],
            'features' => $this->buildFeatures($validated),
            'icon' => $validated['icon'] ?? null,
            'seo' => $this->buildSeo($validated),
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => (bool) ($validated['is_active'] ?? false),
        ]);

        ActivityLogger::log($request, 'service.create', $service, [
            'title_ar' => $validated['title_ar'],
            'title_en' => $validated['title_en'],
        ]);

        if ($service->is_active) {
            $this->dispatchServicePublished($service->fresh());
        }

        return redirect()
            ->route('admin.services.index')
            ->with('success', 'Service created successfully.');
    }

    public function edit(Service $service)
    {
        $featuresAr = [];
        $featuresEn = [];
        $seo = $service->seo ?? [];

        foreach ($service->features ?? [] as $feature) {
            $featuresAr[] = Translation::get($feature, 'ar');
            $featuresEn[] = Translation::get($feature, 'en');
        }

        return Inertia::render('Admin/Services/Edit', [
            'service' => [
                'id' => $service->id,
                'title_ar' => Translation::get($service->title, 'ar'),
                'title_en' => Translation::get($service->title, 'en'),
                'slug' => $service->slug,
                'summary_ar' => Translation::get($service->summary, 'ar'),
                'summary_en' => Translation::get($service->summary, 'en'),
                'description_ar' => Translation::get($service->description, 'ar'),
                'description_en' => Translation::get($service->description, 'en'),
                'features_ar' => implode("\n", array_filter($featuresAr)),
                'features_en' => implode("\n", array_filter($featuresEn)),
                'icon' => $service->icon,
                'sort_order' => $service->sort_order,
                'is_active' => $service->is_active,
                'seo_meta_title_ar' => Translation::get($seo['meta_title'] ?? null, 'ar'),
                'seo_meta_title_en' => Translation::get($seo['meta_title'] ?? null, 'en'),
                'seo_meta_description_ar' => Translation::get($seo['meta_description'] ?? null, 'ar'),
                'seo_meta_description_en' => Translation::get($seo['meta_description'] ?? null, 'en'),
                'seo_og_image' => $seo['og_image'] ?? null,
                'seo_robots' => $seo['robots'] ?? null,
            ],
        ]);
    }

    public function update(Request $request, Service $service): RedirectResponse
    {
        $before = $service->toArray();
        $validated = $this->validateService($request);
        $slugSource = $validated['slug'] ?: $validated['title_en'];

        $service->update([
            'title' => [
                'ar' => $validated['title_ar'],
                'en' => $validated['title_en'],
            ],
            'slug' => $this->generateUniqueSlug($slugSource, $service),
            'summary' => [
                'ar' => $validated['summary_ar'] ?? null,
                'en' => $validated['summary_en'] ?? null,
            ],
            'description' => [
                'ar' => $validated['description_ar'] ?? null,
                'en' => $validated['description_en'] ?? null,
            ],
            'features' => $this->buildFeatures($validated),
            'icon' => $validated['icon'] ?? null,
            'seo' => $this->buildSeo($validated),
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => (bool) ($validated['is_active'] ?? false),
        ]);

        ActivityLogger::logWithDiff($request, 'service.update', $service, $before, $service->fresh()->toArray(), [
            'title_ar' => $validated['title_ar'],
            'title_en' => $validated['title_en'],
        ]);

        if (!($before['is_active'] ?? false) && $service->is_active) {
            $this->dispatchServicePublished($service->fresh());
        }

        return redirect()
            ->route('admin.services.index')
            ->with('success', 'Service updated successfully.');
    }

    public function destroy(Request $request, Service $service): RedirectResponse
    {
        ActivityLogger::log($request, 'service.delete', $service, [
            'title_ar' => Translation::get($service->title, 'ar'),
            'title_en' => Translation::get($service->title, 'en'),
        ]);

        $service->delete();

        return redirect()
            ->route('admin.services.index')
            ->with('success', 'Service deleted successfully.');
    }

    public function restore(Request $request, int $service): RedirectResponse
    {
        $serviceModel = Service::withTrashed()->findOrFail($service);
        $this->authorize('restore', $serviceModel);

        $serviceModel->restore();

        ActivityLogger::log($request, 'service.restore', $serviceModel, [
            'title_ar' => Translation::get($serviceModel->title, 'ar'),
            'title_en' => Translation::get($serviceModel->title, 'en'),
        ]);

        return redirect()
            ->route('admin.services.index')
            ->with('success', 'Service restored successfully.');
    }

    private function dispatchServicePublished(Service $service): void
    {
        $payload = [
            'id' => $service->id,
            'slug' => $service->slug,
            'title' => Translation::get($service->title, app()->getLocale()),
            'url' => route('services.show', [
                'locale' => app()->getLocale(),
                'service' => $service->slug,
            ]),
        ];

        WebhookDispatcher::dispatch('service.published', $payload);
        AlertDispatcher::notify('Service published', $payload['title'] ?? '', $payload);
    }

    private function validateService(Request $request): array
    {
        return $request->validate([
            'title_ar' => ['required', 'string', 'max:190'],
            'title_en' => ['required', 'string', 'max:190'],
            'slug' => [
                'nullable',
                'string',
                'max:190',
                Rule::unique('services', 'slug')->ignore($request->route('service')?->id),
            ],
            'summary_ar' => ['nullable', 'string', 'max:600'],
            'summary_en' => ['nullable', 'string', 'max:600'],
            'description_ar' => ['nullable', 'string'],
            'description_en' => ['nullable', 'string'],
            'features_ar' => ['nullable', 'string'],
            'features_en' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:120'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'seo_meta_title_ar' => ['nullable', 'string', 'max:255'],
            'seo_meta_title_en' => ['nullable', 'string', 'max:255'],
            'seo_meta_description_ar' => ['nullable', 'string', 'max:500'],
            'seo_meta_description_en' => ['nullable', 'string', 'max:500'],
            'seo_og_image' => ['nullable', 'string', 'max:255'],
            'seo_robots' => ['nullable', 'string', 'max:60'],
        ]);
    }

    private function generateUniqueSlug(string $source, ?Service $service = null): string
    {
        $slug = Str::slug($source);
        $base = $slug ?: Str::random(6);
        $slug = $base;
        $counter = 1;

        while (
            Service::query()
                ->where('slug', $slug)
                ->when($service, fn($query) => $query->where('id', '!=', $service->id))
                ->exists()
        ) {
            $slug = $base . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    private function buildFeatures(array $validated): array
    {
        $featuresAr = $this->splitLines($validated['features_ar'] ?? '');
        $featuresEn = $this->splitLines($validated['features_en'] ?? '');
        $max = max(count($featuresAr), count($featuresEn));

        $features = [];
        for ($index = 0; $index < $max; $index++) {
            $ar = $featuresAr[$index] ?? null;
            $en = $featuresEn[$index] ?? null;

            if (!$ar && !$en) {
                continue;
            }

            $features[] = [
                'ar' => $ar ?? $en,
                'en' => $en ?? $ar,
            ];
        }

        return $features;
    }

    private function splitLines(string $value): array
    {
        $lines = preg_split("/\r\n|\n|\r/", $value);

        return array_values(array_filter(array_map('trim', $lines ?? [])));
    }

    private function buildSeo(array $validated): array
    {
        return [
            'meta_title' => $this->buildTranslatedValue(
                $validated['seo_meta_title_ar'] ?? null,
                $validated['seo_meta_title_en'] ?? null,
            ),
            'meta_description' => $this->buildTranslatedValue(
                $validated['seo_meta_description_ar'] ?? null,
                $validated['seo_meta_description_en'] ?? null,
            ),
            'og_image' => $this->normalizeOptionalString($validated['seo_og_image'] ?? null),
            'robots' => $this->normalizeOptionalString($validated['seo_robots'] ?? null),
        ];
    }

    private function buildTranslatedValue(?string $ar, ?string $en): ?array
    {
        $ar = trim((string) $ar);
        $en = trim((string) $en);

        if ($ar === '' && $en === '') {
            return null;
        }

        return [
            'ar' => $ar !== '' ? $ar : $en,
            'en' => $en !== '' ? $en : $ar,
        ];
    }

    private function normalizeOptionalString(?string $value): ?string
    {
        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }
}
