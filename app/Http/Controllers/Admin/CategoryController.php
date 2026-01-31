<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Support\ActivityLogger;
use App\Support\Translation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Category::class, 'category');
    }

    public function index(Request $request)
    {
        $locale = app()->getLocale();
        $showTrashed = $request->boolean('trashed');

        $categories = Category::query()
            ->when($showTrashed, fn($query) => $query->onlyTrashed())
            ->orderBy('id')
            ->paginate(10)
            ->through(fn(Category $category) => [
                'id' => $category->id,
                'name' => Translation::get($category->name, $locale),
                'slug' => $category->slug,
                'is_active' => $category->is_active,
                'deleted_at' => optional($category->deleted_at)->toDateTimeString(),
            ]);

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'filters' => [
                'trashed' => $showTrashed,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Categories/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateCategory($request);
        $slugSource = $validated['slug'] ?: $validated['name_en'];

        $category = Category::create([
            'name' => [
                'ar' => $validated['name_ar'],
                'en' => $validated['name_en'],
            ],
            'slug' => $this->generateUniqueSlug($slugSource),
            'is_active' => (bool) ($validated['is_active'] ?? false),
        ]);

        ActivityLogger::log($request, 'category.create', $category, [
            'name_ar' => $validated['name_ar'],
            'name_en' => $validated['name_en'],
        ]);

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function edit(Category $category)
    {
        return Inertia::render('Admin/Categories/Edit', [
            'category' => [
                'id' => $category->id,
                'name_ar' => Translation::get($category->name, 'ar'),
                'name_en' => Translation::get($category->name, 'en'),
                'slug' => $category->slug,
                'is_active' => $category->is_active,
            ],
        ]);
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $before = $category->toArray();
        $validated = $this->validateCategory($request, $category);
        $slugSource = $validated['slug'] ?: $validated['name_en'];

        $category->update([
            'name' => [
                'ar' => $validated['name_ar'],
                'en' => $validated['name_en'],
            ],
            'slug' => $this->generateUniqueSlug($slugSource, $category),
            'is_active' => (bool) ($validated['is_active'] ?? false),
        ]);

        ActivityLogger::logWithDiff($request, 'category.update', $category, $before, $category->fresh()->toArray(), [
            'name_ar' => $validated['name_ar'],
            'name_en' => $validated['name_en'],
        ]);

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(Request $request, Category $category): RedirectResponse
    {
        ActivityLogger::log($request, 'category.delete', $category, [
            'name_ar' => Translation::get($category->name, 'ar'),
            'name_en' => Translation::get($category->name, 'en'),
        ]);

        $category->delete();

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Category deleted successfully.');
    }

    public function restore(Request $request, int $category): RedirectResponse
    {
        $categoryModel = Category::withTrashed()->findOrFail($category);
        $this->authorize('restore', $categoryModel);

        $categoryModel->restore();

        ActivityLogger::log($request, 'category.restore', $categoryModel, [
            'name_ar' => Translation::get($categoryModel->name, 'ar'),
            'name_en' => Translation::get($categoryModel->name, 'en'),
        ]);

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Category restored successfully.');
    }

    private function validateCategory(Request $request, ?Category $category = null): array
    {
        return $request->validate([
            'name_ar' => ['required', 'string', 'max:190'],
            'name_en' => ['required', 'string', 'max:190'],
            'slug' => [
                'nullable',
                'string',
                'max:190',
                Rule::unique('categories', 'slug')->ignore($category?->id),
            ],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }

    private function generateUniqueSlug(string $source, ?Category $category = null): string
    {
        $slug = Str::slug($source);
        $base = $slug ?: Str::random(6);
        $slug = $base;
        $counter = 1;

        while (
            Category::query()
                ->where('slug', $slug)
                ->when($category, fn($query) => $query->where('id', '!=', $category->id))
                ->exists()
        ) {
            $slug = $base . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}
