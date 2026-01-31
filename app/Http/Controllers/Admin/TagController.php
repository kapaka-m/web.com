<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use App\Support\ActivityLogger;
use App\Support\Translation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TagController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Tag::class, 'tag');
    }

    public function index(Request $request)
    {
        $locale = app()->getLocale();
        $showTrashed = $request->boolean('trashed');

        $tags = Tag::query()
            ->withTrashed()
            ->when($showTrashed, fn($query) => $query->onlyTrashed())
            ->orderBy('id')
            ->paginate(10)
            ->through(fn(Tag $tag) => [
                'id' => $tag->id,
                'name' => Translation::get($tag->name, $locale),
                'slug' => $tag->slug,
                'deleted_at' => optional($tag->deleted_at)->toDateTimeString(),
            ]);

        return Inertia::render('Admin/Tags/Index', [
            'tags' => $tags,
            'filters' => [
                'trashed' => $showTrashed,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Tags/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateTag($request);
        $slugSource = $validated['slug'] ?: $validated['name_en'];

        $tag = Tag::create([
            'name' => [
                'ar' => $validated['name_ar'],
                'en' => $validated['name_en'],
            ],
            'slug' => $this->generateUniqueSlug($slugSource),
        ]);

        ActivityLogger::log($request, 'tag.create', $tag, [
            'name_ar' => $validated['name_ar'],
            'name_en' => $validated['name_en'],
        ]);

        return redirect()
            ->route('admin.tags.index')
            ->with('success', 'Tag created successfully.');
    }

    public function edit(Tag $tag)
    {
        return Inertia::render('Admin/Tags/Edit', [
            'tag' => [
                'id' => $tag->id,
                'name_ar' => Translation::get($tag->name, 'ar'),
                'name_en' => Translation::get($tag->name, 'en'),
                'slug' => $tag->slug,
            ],
        ]);
    }

    public function update(Request $request, Tag $tag): RedirectResponse
    {
        $before = $tag->toArray();
        $validated = $this->validateTag($request, $tag);
        $slugSource = $validated['slug'] ?: $validated['name_en'];

        $tag->update([
            'name' => [
                'ar' => $validated['name_ar'],
                'en' => $validated['name_en'],
            ],
            'slug' => $this->generateUniqueSlug($slugSource, $tag),
        ]);

        ActivityLogger::logWithDiff($request, 'tag.update', $tag, $before, $tag->fresh()->toArray(), [
            'name_ar' => $validated['name_ar'],
            'name_en' => $validated['name_en'],
        ]);

        return redirect()
            ->route('admin.tags.index')
            ->with('success', 'Tag updated successfully.');
    }

    public function destroy(Request $request, Tag $tag): RedirectResponse
    {
        ActivityLogger::log($request, 'tag.delete', $tag, [
            'name_ar' => Translation::get($tag->name, 'ar'),
            'name_en' => Translation::get($tag->name, 'en'),
        ]);

        $tag->delete();

        return redirect()
            ->route('admin.tags.index')
            ->with('success', 'Tag deleted successfully.');
    }

    public function restore(Request $request, int $tag): RedirectResponse
    {
        $tagModel = Tag::withTrashed()->findOrFail($tag);
        $this->authorize('restore', $tagModel);

        $tagModel->restore();

        ActivityLogger::log($request, 'tag.restore', $tagModel, [
            'name_ar' => Translation::get($tagModel->name, 'ar'),
            'name_en' => Translation::get($tagModel->name, 'en'),
        ]);

        return redirect()
            ->route('admin.tags.index')
            ->with('success', 'Tag restored successfully.');
    }

    private function validateTag(Request $request, ?Tag $tag = null): array
    {
        return $request->validate([
            'name_ar' => ['required', 'string', 'max:190'],
            'name_en' => ['required', 'string', 'max:190'],
            'slug' => [
                'nullable',
                'string',
                'max:190',
                Rule::unique('tags', 'slug')->ignore($tag?->id),
            ],
        ]);
    }

    private function generateUniqueSlug(string $source, ?Tag $tag = null): string
    {
        $slug = Str::slug($source);
        $base = $slug ?: Str::random(6);
        $slug = $base;
        $counter = 1;

        while (
            Tag::query()
                ->where('slug', $slug)
                ->when($tag, fn($query) => $query->where('id', '!=', $tag->id))
                ->exists()
        ) {
            $slug = $base . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}
