<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectImage;
use App\Support\ActivityLogger;
use App\Support\AlertDispatcher;
use App\Support\ImageUploader;
use App\Support\Translation;
use App\Support\WebhookDispatcher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Project::class, 'project');
    }

    public function index(Request $request)
    {
        $locale = app()->getLocale();
        $showTrashed = $request->boolean('trashed');

        $projects = Project::query()
            ->withTrashed()
            ->when($showTrashed, fn($query) => $query->onlyTrashed())
            ->orderByDesc('is_featured')
            ->orderByDesc('id')
            ->paginate(10)
            ->through(fn(Project $project) => [
                'id' => $project->id,
                'title' => Translation::get($project->title, $locale),
                'slug' => $project->slug,
                'is_featured' => $project->is_featured,
                'is_active' => $project->is_active,
                'deleted_at' => optional($project->deleted_at)->toDateTimeString(),
            ]);

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'filters' => [
                'trashed' => $showTrashed,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Projects/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateProject($request);
        $slugSource = $validated['slug'] ?: $validated['title_en'];

        $coverImage = $validated['cover_image'] ?? null;
        if ($request->hasFile('cover_image_file')) {
            $coverImage = ImageUploader::store(
                $request->file('cover_image_file'),
                'projects',
                'cover_image_file'
            );
        }

        $project = Project::create([
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
            'client' => $validated['client'] ?? null,
            'year' => $validated['year'] ?? null,
            'stack' => $this->splitComma($validated['stack'] ?? ''),
            'cover_image' => $coverImage,
            'seo' => $this->buildSeo($validated),
            'is_featured' => (bool) ($validated['is_featured'] ?? false),
            'is_active' => (bool) ($validated['is_active'] ?? false),
        ]);

        $this->syncGallery($project, $validated['gallery_images'] ?? []);

        ActivityLogger::log($request, 'project.create', $project, [
            'title_ar' => $validated['title_ar'],
            'title_en' => $validated['title_en'],
        ]);

        if ($project->is_active) {
            $this->dispatchProjectPublished($project->fresh());
        }

        return redirect()
            ->route('admin.projects.index')
            ->with('success', 'Project created successfully.');
    }

    public function edit(Project $project)
    {
        $project->load('images');
        $seo = $project->seo ?? [];

        return Inertia::render('Admin/Projects/Edit', [
            'project' => [
                'id' => $project->id,
                'title_ar' => Translation::get($project->title, 'ar'),
                'title_en' => Translation::get($project->title, 'en'),
                'slug' => $project->slug,
                'summary_ar' => Translation::get($project->summary, 'ar'),
                'summary_en' => Translation::get($project->summary, 'en'),
                'description_ar' => Translation::get($project->description, 'ar'),
                'description_en' => Translation::get($project->description, 'en'),
                'client' => $project->client,
                'year' => $project->year,
                'stack' => implode(', ', $project->stack ?? []),
                'cover_image' => $project->cover_image,
                'gallery_images' => $project->images
                    ->sortBy('sort_order')
                    ->values()
                    ->map(fn(ProjectImage $image) => [
                        'id' => $image->id,
                        'image_path' => $image->image_path,
                        'caption_ar' => Translation::get($image->caption, 'ar'),
                        'caption_en' => Translation::get($image->caption, 'en'),
                        'sort_order' => $image->sort_order,
                    ]),
                'is_featured' => $project->is_featured,
                'is_active' => $project->is_active,
                'seo_meta_title_ar' => Translation::get($seo['meta_title'] ?? null, 'ar'),
                'seo_meta_title_en' => Translation::get($seo['meta_title'] ?? null, 'en'),
                'seo_meta_description_ar' => Translation::get($seo['meta_description'] ?? null, 'ar'),
                'seo_meta_description_en' => Translation::get($seo['meta_description'] ?? null, 'en'),
                'seo_og_image' => $seo['og_image'] ?? null,
                'seo_robots' => $seo['robots'] ?? null,
            ],
        ]);
    }

    public function update(Request $request, Project $project): RedirectResponse
    {
        $before = $project->toArray();
        $validated = $this->validateProject($request, $project);
        $slugSource = $validated['slug'] ?: $validated['title_en'];

        $coverImage = $project->cover_image;
        if (!empty($validated['remove_cover_image'])) {
            $this->deleteStoredCoverImage($coverImage);
            $coverImage = null;
        } elseif ($request->hasFile('cover_image_file')) {
            $this->deleteStoredCoverImage($coverImage);
            $coverImage = ImageUploader::store(
                $request->file('cover_image_file'),
                'projects',
                'cover_image_file'
            );
        } elseif (!empty($validated['cover_image'])) {
            $coverImage = $validated['cover_image'];
        }

        $project->update([
            'title' => [
                'ar' => $validated['title_ar'],
                'en' => $validated['title_en'],
            ],
            'slug' => $this->generateUniqueSlug($slugSource, $project),
            'summary' => [
                'ar' => $validated['summary_ar'] ?? null,
                'en' => $validated['summary_en'] ?? null,
            ],
            'description' => [
                'ar' => $validated['description_ar'] ?? null,
                'en' => $validated['description_en'] ?? null,
            ],
            'client' => $validated['client'] ?? null,
            'year' => $validated['year'] ?? null,
            'stack' => $this->splitComma($validated['stack'] ?? ''),
            'cover_image' => $coverImage,
            'seo' => $this->buildSeo($validated),
            'is_featured' => (bool) ($validated['is_featured'] ?? false),
            'is_active' => (bool) ($validated['is_active'] ?? false),
        ]);

        $this->syncGallery(
            $project,
            $validated['gallery_images'] ?? [],
            $validated['gallery_removed'] ?? []
        );

        ActivityLogger::logWithDiff($request, 'project.update', $project, $before, $project->fresh()->toArray(), [
            'title_ar' => $validated['title_ar'],
            'title_en' => $validated['title_en'],
        ]);

        if (!($before['is_active'] ?? false) && $project->is_active) {
            $this->dispatchProjectPublished($project->fresh());
        }

        return redirect()
            ->route('admin.projects.index')
            ->with('success', 'Project updated successfully.');
    }

    public function destroy(Request $request, Project $project): RedirectResponse
    {
        ActivityLogger::log($request, 'project.delete', $project, [
            'title_ar' => Translation::get($project->title, 'ar'),
            'title_en' => Translation::get($project->title, 'en'),
        ]);

        $project->delete();

        return redirect()
            ->route('admin.projects.index')
            ->with('success', 'Project deleted successfully.');
    }

    public function restore(Request $request, int $project): RedirectResponse
    {
        $projectModel = Project::withTrashed()->findOrFail($project);
        $this->authorize('restore', $projectModel);

        $projectModel->restore();

        ActivityLogger::log($request, 'project.restore', $projectModel, [
            'title_ar' => Translation::get($projectModel->title, 'ar'),
            'title_en' => Translation::get($projectModel->title, 'en'),
        ]);

        return redirect()
            ->route('admin.projects.index')
            ->with('success', 'Project restored successfully.');
    }

    private function dispatchProjectPublished(Project $project): void
    {
        $payload = [
            'id' => $project->id,
            'slug' => $project->slug,
            'title' => Translation::get($project->title, app()->getLocale()),
            'url' => route('projects.show', [
                'locale' => app()->getLocale(),
                'project' => $project->slug,
            ]),
        ];

        WebhookDispatcher::dispatch('project.published', $payload);
        AlertDispatcher::notify('Project published', $payload['title'] ?? '', $payload);
    }

    private function validateProject(Request $request, ?Project $project = null): array
    {
        return $request->validate([
            'title_ar' => ['required', 'string', 'max:190'],
            'title_en' => ['required', 'string', 'max:190'],
            'slug' => [
                'nullable',
                'string',
                'max:190',
                Rule::unique('projects', 'slug')->ignore($project?->id),
            ],
            'summary_ar' => ['nullable', 'string', 'max:600'],
            'summary_en' => ['nullable', 'string', 'max:600'],
            'description_ar' => ['nullable', 'string'],
            'description_en' => ['nullable', 'string'],
            'client' => ['nullable', 'string', 'max:190'],
            'year' => ['nullable', 'string', 'max:20'],
            'stack' => ['nullable', 'string', 'max:255'],
            'cover_image' => ['nullable', 'string', 'max:255'],
            'cover_image_file' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'remove_cover_image' => ['nullable', 'boolean'],
            'gallery_images' => ['nullable', 'array'],
            'gallery_images.*.id' => ['nullable', 'integer', 'exists:project_images,id'],
            'gallery_images.*.image_path' => ['required', 'string', 'max:255'],
            'gallery_images.*.caption_ar' => ['nullable', 'string', 'max:255'],
            'gallery_images.*.caption_en' => ['nullable', 'string', 'max:255'],
            'gallery_images.*.sort_order' => ['nullable', 'integer', 'min:0'],
            'gallery_removed' => ['nullable', 'array'],
            'gallery_removed.*' => ['integer', 'exists:project_images,id'],
            'is_featured' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
            'seo_meta_title_ar' => ['nullable', 'string', 'max:255'],
            'seo_meta_title_en' => ['nullable', 'string', 'max:255'],
            'seo_meta_description_ar' => ['nullable', 'string', 'max:500'],
            'seo_meta_description_en' => ['nullable', 'string', 'max:500'],
            'seo_og_image' => ['nullable', 'string', 'max:255'],
            'seo_robots' => ['nullable', 'string', 'max:60'],
        ]);
    }

    private function generateUniqueSlug(string $source, ?Project $project = null): string
    {
        $slug = Str::slug($source);
        $base = $slug ?: Str::random(6);
        $slug = $base;
        $counter = 1;

        while (
            Project::query()
                ->where('slug', $slug)
                ->when($project, fn($query) => $query->where('id', '!=', $project->id))
                ->exists()
        ) {
            $slug = $base . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    private function splitComma(string $value): array
    {
        $items = array_map('trim', explode(',', $value));

        return array_values(array_filter($items));
    }

    private function deleteStoredCoverImage(?string $path): void
    {
        ImageUploader::delete($path);
    }

    private function syncGallery(Project $project, array $galleryImages, array $galleryRemoved = []): void
    {
        if (!empty($galleryRemoved)) {
            $project->images()
                ->whereIn('id', $galleryRemoved)
                ->get()
                ->each(function (ProjectImage $image) {
                    $this->deleteStoredGalleryImage($image->image_path);
                    $image->delete();
                });
        }

        foreach ($galleryImages as $item) {
            $imagePath = trim((string) ($item['image_path'] ?? ''));
            if ($imagePath === '') {
                continue;
            }

            $captionAr = trim((string) ($item['caption_ar'] ?? ''));
            $captionEn = trim((string) ($item['caption_en'] ?? ''));
            $caption = null;
            if ($captionAr !== '' || $captionEn !== '') {
                $caption = [
                    'ar' => $captionAr ?: $captionEn,
                    'en' => $captionEn ?: $captionAr,
                ];
            }

            $sortOrder = (int) ($item['sort_order'] ?? 0);

            if (!empty($item['id'])) {
                $image = $project->images()->whereKey($item['id'])->first();
                if (!$image instanceof ProjectImage) {
                    continue;
                }

                $image->update([
                    'image_path' => $imagePath,
                    'caption' => $caption,
                    'sort_order' => $sortOrder,
                ]);

                continue;
            }

            $project->images()->create([
                'image_path' => $imagePath,
                'caption' => $caption,
                'sort_order' => $sortOrder,
            ]);
        }
    }

    private function deleteStoredGalleryImage(?string $path): void
    {
        ImageUploader::delete($path);
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
