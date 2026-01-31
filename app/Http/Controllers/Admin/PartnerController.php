<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Support\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PartnerController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Partner::class, 'partner');
    }

    public function index(Request $request)
    {
        $showTrashed = $request->boolean('trashed');

        $partners = Partner::query()
            ->withTrashed()
            ->when($showTrashed, fn($query) => $query->onlyTrashed())
            ->orderBy('sort_order')
            ->paginate(10)
            ->through(fn(Partner $partner) => [
                'id' => $partner->id,
                'name' => $partner->name,
                'logo' => $partner->logo,
                'url' => $partner->url,
                'is_active' => $partner->is_active,
                'sort_order' => $partner->sort_order,
                'deleted_at' => optional($partner->deleted_at)->toDateTimeString(),
            ]);

        return Inertia::render('Admin/Partners/Index', [
            'partners' => $partners,
            'filters' => [
                'trashed' => $showTrashed,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Partners/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatePartner($request);

        $partner = Partner::create([
            'name' => $validated['name'],
            'logo' => $validated['logo'] ?? null,
            'url' => $validated['url'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => (bool) ($validated['is_active'] ?? false),
        ]);

        ActivityLogger::log($request, 'partner.create', $partner, [
            'name' => $validated['name'],
        ]);

        return redirect()
            ->route('admin.partners.index')
            ->with('success', 'Partner created successfully.');
    }

    public function edit(Partner $partner)
    {
        return Inertia::render('Admin/Partners/Edit', [
            'partner' => [
                'id' => $partner->id,
                'name' => $partner->name,
                'logo' => $partner->logo,
                'url' => $partner->url,
                'sort_order' => $partner->sort_order,
                'is_active' => $partner->is_active,
            ],
        ]);
    }

    public function update(Request $request, Partner $partner): RedirectResponse
    {
        $before = $partner->toArray();
        $validated = $this->validatePartner($request);

        $partner->update([
            'name' => $validated['name'],
            'logo' => $validated['logo'] ?? null,
            'url' => $validated['url'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => (bool) ($validated['is_active'] ?? false),
        ]);

        ActivityLogger::logWithDiff($request, 'partner.update', $partner, $before, $partner->fresh()->toArray(), [
            'name' => $validated['name'],
        ]);

        return redirect()
            ->route('admin.partners.index')
            ->with('success', 'Partner updated successfully.');
    }

    public function destroy(Request $request, Partner $partner): RedirectResponse
    {
        ActivityLogger::log($request, 'partner.delete', $partner, [
            'name' => $partner->name,
        ]);

        $partner->delete();

        return redirect()
            ->route('admin.partners.index')
            ->with('success', 'Partner deleted successfully.');
    }

    public function restore(Request $request, int $partner): RedirectResponse
    {
        $partnerModel = Partner::withTrashed()->findOrFail($partner);
        $this->authorize('restore', $partnerModel);

        $partnerModel->restore();

        ActivityLogger::log($request, 'partner.restore', $partnerModel, [
            'name' => $partnerModel->name,
        ]);

        return redirect()
            ->route('admin.partners.index')
            ->with('success', 'Partner restored successfully.');
    }

    private function validatePartner(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:190'],
            'logo' => ['nullable', 'string', 'max:255'],
            'url' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }
}
