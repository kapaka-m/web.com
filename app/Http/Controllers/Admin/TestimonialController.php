<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use App\Support\ActivityLogger;
use App\Support\Translation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestimonialController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Testimonial::class, 'testimonial');
    }

    public function index(Request $request)
    {
        $locale = app()->getLocale();
        $showTrashed = $request->boolean('trashed');

        $testimonials = Testimonial::query()
            ->withTrashed()
            ->when($showTrashed, fn($query) => $query->onlyTrashed())
            ->orderBy('sort_order')
            ->paginate(10)
            ->through(fn(Testimonial $testimonial) => [
                'id' => $testimonial->id,
                'name' => $testimonial->name,
                'role' => Translation::get($testimonial->role, $locale),
                'company' => $testimonial->company,
                'is_active' => $testimonial->is_active,
                'sort_order' => $testimonial->sort_order,
                'deleted_at' => optional($testimonial->deleted_at)->toDateTimeString(),
            ]);

        return Inertia::render('Admin/Testimonials/Index', [
            'testimonials' => $testimonials,
            'filters' => [
                'trashed' => $showTrashed,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Testimonials/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateTestimonial($request);

        $testimonial = Testimonial::create([
            'name' => $validated['name'],
            'role' => [
                'ar' => $validated['role_ar'] ?? null,
                'en' => $validated['role_en'] ?? null,
            ],
            'quote' => [
                'ar' => $validated['quote_ar'],
                'en' => $validated['quote_en'],
            ],
            'company' => $validated['company'] ?? null,
            'avatar' => $validated['avatar'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => (bool) ($validated['is_active'] ?? false),
        ]);

        ActivityLogger::log($request, 'testimonial.create', $testimonial, [
            'name' => $validated['name'],
        ]);

        return redirect()
            ->route('admin.testimonials.index')
            ->with('success', 'Testimonial created successfully.');
    }

    public function edit(Testimonial $testimonial)
    {
        return Inertia::render('Admin/Testimonials/Edit', [
            'testimonial' => [
                'id' => $testimonial->id,
                'name' => $testimonial->name,
                'role_ar' => Translation::get($testimonial->role, 'ar'),
                'role_en' => Translation::get($testimonial->role, 'en'),
                'quote_ar' => Translation::get($testimonial->quote, 'ar'),
                'quote_en' => Translation::get($testimonial->quote, 'en'),
                'company' => $testimonial->company,
                'avatar' => $testimonial->avatar,
                'sort_order' => $testimonial->sort_order,
                'is_active' => $testimonial->is_active,
            ],
        ]);
    }

    public function update(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $before = $testimonial->toArray();
        $validated = $this->validateTestimonial($request);

        $testimonial->update([
            'name' => $validated['name'],
            'role' => [
                'ar' => $validated['role_ar'] ?? null,
                'en' => $validated['role_en'] ?? null,
            ],
            'quote' => [
                'ar' => $validated['quote_ar'],
                'en' => $validated['quote_en'],
            ],
            'company' => $validated['company'] ?? null,
            'avatar' => $validated['avatar'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => (bool) ($validated['is_active'] ?? false),
        ]);

        ActivityLogger::logWithDiff($request, 'testimonial.update', $testimonial, $before, $testimonial->fresh()->toArray(), [
            'name' => $validated['name'],
        ]);

        return redirect()
            ->route('admin.testimonials.index')
            ->with('success', 'Testimonial updated successfully.');
    }

    public function destroy(Request $request, Testimonial $testimonial): RedirectResponse
    {
        ActivityLogger::log($request, 'testimonial.delete', $testimonial, [
            'name' => $testimonial->name,
        ]);

        $testimonial->delete();

        return redirect()
            ->route('admin.testimonials.index')
            ->with('success', 'Testimonial deleted successfully.');
    }

    public function restore(Request $request, int $testimonial): RedirectResponse
    {
        $testimonialModel = Testimonial::withTrashed()->findOrFail($testimonial);
        $this->authorize('restore', $testimonialModel);

        $testimonialModel->restore();

        ActivityLogger::log($request, 'testimonial.restore', $testimonialModel, [
            'name' => $testimonialModel->name,
        ]);

        return redirect()
            ->route('admin.testimonials.index')
            ->with('success', 'Testimonial restored successfully.');
    }

    private function validateTestimonial(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:190'],
            'role_ar' => ['nullable', 'string', 'max:190'],
            'role_en' => ['nullable', 'string', 'max:190'],
            'quote_ar' => ['required', 'string', 'max:600'],
            'quote_en' => ['required', 'string', 'max:600'],
            'company' => ['nullable', 'string', 'max:190'],
            'avatar' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }
}
