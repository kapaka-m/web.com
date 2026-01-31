<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use App\Notifications\PostReviewRequested;
use App\Support\ActivityLogger;
use App\Support\AlertDispatcher;
use App\Support\HtmlSanitizer;
use App\Support\ImageUploader;
use App\Support\ImageVariants;
use App\Support\ReadingTime;
use App\Support\SiteData;
use App\Support\Translation;
use App\Support\WebhookDispatcher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PostController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Post::class, 'post');
    }

    public function index(Request $request)
    {
        $locale = app()->getLocale();
        $showTrashed = $request->boolean('trashed');

        $posts = Post::query()
            ->withTrashed()
            ->when($showTrashed, fn($query) => $query->onlyTrashed())
            ->orderByDesc('published_at')
            ->paginate(10)
            ->through(fn(Post $post) => [
                'id' => $post->id,
                'title' => Translation::get($post->title, $locale),
                'slug' => $post->slug,
                'is_published' => $post->is_published,
                'published_at' => optional($post->published_at)->toDateString(),
                'review_status' => $post->review_status,
                'deleted_at' => optional($post->deleted_at)->toDateTimeString(),
            ]);

        return Inertia::render('Admin/Posts/Index', [
            'posts' => $posts,
            'filters' => [
                'trashed' => $showTrashed,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Posts/Create', [
            'categories' => $this->categoriesForSelect(),
            'tags' => $this->tagsForSelect(),
            'reviewStatusOptions' => $this->reviewStatusOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatePost($request);
        $slugSource = $validated['slug'] ?: $validated['title_en'];

        $reviewStatus = $this->resolveReviewStatus($request, $validated);
        $publishedAt = $this->resolvePublishedAt($validated);
        $shouldPublish = $this->resolvePublishFlag($reviewStatus, $validated, $publishedAt);

        $markdown = $this->buildMarkdown($validated);
        [$contentAr, $contentEn] = $this->resolveContent(
            $validated,
            $markdown,
            (bool) ($validated['use_markdown'] ?? false),
        );

        $coverImage = $validated['cover_image'] ?? null;
        if ($request->hasFile('cover_image_file')) {
            $coverImage = ImageUploader::store(
                $request->file('cover_image_file'),
                'posts',
                'cover_image_file'
            );
        }

        $post = Post::create([
            'title' => [
                'ar' => $validated['title_ar'],
                'en' => $validated['title_en'],
            ],
            'slug' => $this->generateUniqueSlug($slugSource),
            'excerpt' => [
                'ar' => $validated['excerpt_ar'] ?? null,
                'en' => $validated['excerpt_en'] ?? null,
            ],
            'content' => [
                'ar' => $contentAr,
                'en' => $contentEn,
            ],
            'cover_image' => $coverImage,
            'author_id' => $request->user()?->id,
            'category_id' => $validated['category_id'] ?? null,
            'is_published' => $shouldPublish,
            'published_at' => $publishedAt,
            'review_status' => $reviewStatus,
            'reviewed_by' => $reviewStatus === Post::REVIEW_APPROVED ? $request->user()?->id : null,
            'reviewed_at' => $reviewStatus === Post::REVIEW_APPROVED ? now() : null,
            'seo' => $this->buildSeo($validated),
            'content_markdown' => $markdown,
        ]);

        $this->syncTags($post, $validated['tags'] ?? null);

        if ($reviewStatus === Post::REVIEW_PENDING) {
            $this->notifyReviewRequested($post);
        }

        ActivityLogger::log($request, 'post.create', $post, [
            'title_ar' => $validated['title_ar'],
            'title_en' => $validated['title_en'],
        ]);

        if ($shouldPublish) {
            $this->dispatchPostPublished($post->fresh());
        }

        return redirect()
            ->route('admin.posts.index')
            ->with('success', 'Post created successfully.');
    }

    public function edit(Post $post)
    {
        $seo = $post->seo ?? [];
        $markdown = $post->content_markdown ?? [];
        $useMarkdown = trim((string) Translation::get($markdown, 'ar')) !== ''
            || trim((string) Translation::get($markdown, 'en')) !== '';

        return Inertia::render('Admin/Posts/Edit', [
            'post' => [
                'id' => $post->id,
                'title_ar' => Translation::get($post->title, 'ar'),
                'title_en' => Translation::get($post->title, 'en'),
                'slug' => $post->slug,
                'excerpt_ar' => Translation::get($post->excerpt, 'ar'),
                'excerpt_en' => Translation::get($post->excerpt, 'en'),
                'content_ar' => Translation::get($post->content, 'ar'),
                'content_en' => Translation::get($post->content, 'en'),
                'content_markdown_ar' => Translation::get($markdown, 'ar'),
                'content_markdown_en' => Translation::get($markdown, 'en'),
                'use_markdown' => $useMarkdown,
                'cover_image' => $post->cover_image,
                'category_id' => $post->category_id,
                'tags' => $post->tags
                    ->map(fn(Tag $tag) => Translation::get($tag->name, app()->getLocale()))
                    ->implode(', '),
                'is_published' => $post->is_published,
                'published_at' => optional($post->published_at)->format('Y-m-d'),
                'review_status' => $post->review_status ?? Post::REVIEW_DRAFT,
                'seo_meta_title_ar' => Translation::get($seo['meta_title'] ?? null, 'ar'),
                'seo_meta_title_en' => Translation::get($seo['meta_title'] ?? null, 'en'),
                'seo_meta_description_ar' => Translation::get($seo['meta_description'] ?? null, 'ar'),
                'seo_meta_description_en' => Translation::get($seo['meta_description'] ?? null, 'en'),
                'seo_og_image' => $seo['og_image'] ?? null,
                'seo_robots' => $seo['robots'] ?? null,
            ],
            'categories' => $this->categoriesForSelect(),
            'tags' => $this->tagsForSelect(),
            'reviewStatusOptions' => $this->reviewStatusOptions(),
        ]);
    }

    public function update(Request $request, Post $post): RedirectResponse
    {
        $before = $post->toArray();
        $validated = $this->validatePost($request, $post);
        $slugSource = $validated['slug'] ?: $validated['title_en'];

        $reviewStatus = $this->resolveReviewStatus($request, $validated, $post);
        $publishedAt = $this->resolvePublishedAt($validated);
        $shouldPublish = $this->resolvePublishFlag($reviewStatus, $validated, $publishedAt);

        $markdown = $this->buildMarkdown($validated);
        [$contentAr, $contentEn] = $this->resolveContent(
            $validated,
            $markdown,
            (bool) ($validated['use_markdown'] ?? false),
        );

        $coverImage = $post->cover_image;
        if (!empty($validated['remove_cover_image'])) {
            $this->deleteStoredCoverImage($coverImage);
            $coverImage = null;
        } elseif ($request->hasFile('cover_image_file')) {
            $this->deleteStoredCoverImage($coverImage);
            $coverImage = ImageUploader::store(
                $request->file('cover_image_file'),
                'posts',
                'cover_image_file'
            );
        } elseif (!empty($validated['cover_image'])) {
            $coverImage = $validated['cover_image'];
        }

        $post->update([
            'title' => [
                'ar' => $validated['title_ar'],
                'en' => $validated['title_en'],
            ],
            'slug' => $this->generateUniqueSlug($slugSource, $post),
            'excerpt' => [
                'ar' => $validated['excerpt_ar'] ?? null,
                'en' => $validated['excerpt_en'] ?? null,
            ],
            'content' => [
                'ar' => $contentAr,
                'en' => $contentEn,
            ],
            'content_markdown' => $markdown,
            'cover_image' => $coverImage,
            'category_id' => $validated['category_id'] ?? null,
            'is_published' => $shouldPublish,
            'published_at' => $publishedAt,
            'review_status' => $reviewStatus,
            'reviewed_by' => $reviewStatus === Post::REVIEW_APPROVED ? $request->user()?->id : null,
            'reviewed_at' => $reviewStatus === Post::REVIEW_APPROVED ? now() : null,
            'seo' => $this->buildSeo($validated),
        ]);

        $this->syncTags($post, $validated['tags'] ?? null);

        if ($reviewStatus === Post::REVIEW_PENDING && (($before['review_status'] ?? null) !== Post::REVIEW_PENDING)) {
            $this->notifyReviewRequested($post);
        }

        ActivityLogger::logWithDiff($request, 'post.update', $post, $before, $post->fresh()->toArray(), [
            'title_ar' => $validated['title_ar'],
            'title_en' => $validated['title_en'],
        ]);

        if ($shouldPublish && empty($before['is_published'])) {
            $this->dispatchPostPublished($post->fresh());
        }

        return redirect()
            ->route('admin.posts.index')
            ->with('success', 'Post updated successfully.');
    }

    public function destroy(Request $request, Post $post): RedirectResponse
    {
        ActivityLogger::log($request, 'post.delete', $post, [
            'title_ar' => Translation::get($post->title, 'ar'),
            'title_en' => Translation::get($post->title, 'en'),
        ]);

        $post->delete();

        return redirect()
            ->route('admin.posts.index')
            ->with('success', 'Post deleted successfully.');
    }

    public function restore(Request $request, int $post): RedirectResponse
    {
        $postModel = Post::withTrashed()->findOrFail($post);
        $this->authorize('restore', $postModel);

        $postModel->restore();

        ActivityLogger::log($request, 'post.restore', $postModel, [
            'title_ar' => Translation::get($postModel->title, 'ar'),
            'title_en' => Translation::get($postModel->title, 'en'),
        ]);

        return redirect()
            ->route('admin.posts.index')
            ->with('success', 'Post restored successfully.');
    }

    public function preview(Post $post)
    {
        $locale = app()->getLocale();
        $content = Translation::get($post->content, $locale);
        $reading = ReadingTime::forText($content, $locale);
        $seo = $post->seo ?? [];

        $postData = [
            'id' => $post->id,
            'title' => Translation::get($post->title, $locale),
            'excerpt' => Translation::get($post->excerpt, $locale),
            'content' => $content,
            'slug' => $post->slug,
            'cover_image' => $post->cover_image,
            'cover_image_srcset' => ImageVariants::srcSet($post->cover_image),
            'published_at' => optional($post->published_at)->toDateString(),
            'category' => $post->category
                ? [
                    'name' => Translation::get($post->category->name, $locale),
                    'slug' => $post->category->slug,
                ]
                : null,
            'tags' => $post->tags->map(fn(Tag $tag) => [
                'name' => Translation::get($tag->name, $locale),
                'slug' => $tag->slug,
            ]),
            'reading_time' => $reading['label'],
            'seo' => [
                'meta_title' => Translation::get($seo['meta_title'] ?? null, $locale),
                'meta_description' => Translation::get($seo['meta_description'] ?? null, $locale),
                'og_image' => $seo['og_image'] ?? null,
                'robots' => $seo['robots'] ?? null,
            ],
        ];

        return Inertia::render('Blog/Show', [
            'site' => SiteData::forLocale($locale),
            'post' => $postData,
            'comments' => [],
            'related' => [],
            'preview' => true,
        ]);
    }

    public function autosave(Request $request)
    {
        return $this->persistAutosave($request);
    }

    public function autosaveExisting(Request $request, Post $post)
    {
        return $this->persistAutosave($request, $post);
    }

    private function validatePost(Request $request, ?Post $post = null): array
    {
        return $request->validate([
            'title_ar' => ['required', 'string', 'max:190'],
            'title_en' => ['required', 'string', 'max:190'],
            'slug' => [
                'nullable',
                'string',
                'max:190',
                Rule::unique('posts', 'slug')->ignore($post?->id),
            ],
            'excerpt_ar' => ['nullable', 'string', 'max:600'],
            'excerpt_en' => ['nullable', 'string', 'max:600'],
            'content_ar' => ['nullable', 'string'],
            'content_en' => ['nullable', 'string'],
            'content_markdown_ar' => ['nullable', 'string'],
            'content_markdown_en' => ['nullable', 'string'],
            'use_markdown' => ['nullable', 'boolean'],
            'cover_image' => ['nullable', 'string', 'max:255'],
            'cover_image_file' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'remove_cover_image' => ['nullable', 'boolean'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'tags' => ['nullable', 'string', 'max:255'],
            'is_published' => ['nullable', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'review_status' => [
                'nullable',
                Rule::in([
                    Post::REVIEW_DRAFT,
                    Post::REVIEW_PENDING,
                    Post::REVIEW_APPROVED,
                ]),
            ],
            'seo_meta_title_ar' => ['nullable', 'string', 'max:255'],
            'seo_meta_title_en' => ['nullable', 'string', 'max:255'],
            'seo_meta_description_ar' => ['nullable', 'string', 'max:500'],
            'seo_meta_description_en' => ['nullable', 'string', 'max:500'],
            'seo_og_image' => ['nullable', 'string', 'max:255'],
            'seo_robots' => ['nullable', 'string', 'max:60'],
        ]);
    }

    private function generateUniqueSlug(string $source, ?Post $post = null): string
    {
        $slug = Str::slug($source);
        $base = $slug ?: Str::random(6);
        $slug = $base;
        $counter = 1;

        while (
            Post::query()
                ->where('slug', $slug)
                ->when($post, fn($query) => $query->where('id', '!=', $post->id))
                ->exists()
        ) {
            $slug = $base . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    private function deleteStoredCoverImage(?string $path): void
    {
        ImageUploader::delete($path);
    }

    private function categoriesForSelect(): array
    {
        return Category::query()
            ->where('is_active', true)
            ->orderBy('id')
            ->get()
            ->map(fn(Category $category) => [
                'id' => $category->id,
                'name' => Translation::get($category->name, app()->getLocale()),
            ])
            ->toArray();
    }

    private function tagsForSelect(): array
    {
        return Tag::query()
            ->orderBy('id')
            ->get()
            ->map(fn(Tag $tag) => [
                'id' => $tag->id,
                'name' => Translation::get($tag->name, app()->getLocale()),
            ])
            ->toArray();
    }

    private function syncTags(Post $post, ?string $tagsInput): void
    {
        $tags = collect(explode(',', $tagsInput ?? ''))
            ->map('trim')
            ->filter()
            ->unique()
            ->values();

        if ($tags->isEmpty()) {
            $post->tags()->sync([]);
            return;
        }

        $tagIds = [];
        foreach ($tags as $label) {
            $slug = Str::slug($label);
            if ($slug === '') {
                $slug = Str::random(6);
            }

            $tag = Tag::firstOrCreate(
                ['slug' => $slug],
                [
                    'name' => [
                        'ar' => $label,
                        'en' => $label,
                    ],
                ]
            );

            $tagIds[] = $tag->id;
        }

        $post->tags()->sync($tagIds);
    }

    private function persistAutosave(Request $request, ?Post $post = null)
    {
        $validated = $request->validate([
            'title_ar' => ['nullable', 'string', 'max:190'],
            'title_en' => ['nullable', 'string', 'max:190'],
            'slug' => ['nullable', 'string', 'max:190'],
            'excerpt_ar' => ['nullable', 'string', 'max:600'],
            'excerpt_en' => ['nullable', 'string', 'max:600'],
            'content_ar' => ['nullable', 'string'],
            'content_en' => ['nullable', 'string'],
            'content_markdown_ar' => ['nullable', 'string'],
            'content_markdown_en' => ['nullable', 'string'],
            'use_markdown' => ['nullable', 'boolean'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'tags' => ['nullable', 'string', 'max:255'],
        ]);

        $markdown = $this->buildMarkdown($validated);
        [$contentAr, $contentEn] = $this->resolveContent(
            $validated,
            $markdown,
            (bool) ($validated['use_markdown'] ?? false),
        );
        $titleAr = $validated['title_ar'] ?? ($post ? Translation::get($post->title, 'ar') : '');
        $titleEn = $validated['title_en'] ?? ($post ? Translation::get($post->title, 'en') : '');
        $slugSource = $validated['slug'] ?? $titleEn ?: $titleAr;

        if (!$post) {
            $post = Post::create([
                'title' => [
                    'ar' => $titleAr,
                    'en' => $titleEn,
                ],
                'slug' => $this->generateUniqueSlug($slugSource ?: Str::random(6)),
                'excerpt' => [
                    'ar' => $validated['excerpt_ar'] ?? null,
                    'en' => $validated['excerpt_en'] ?? null,
                ],
                'content' => [
                    'ar' => $contentAr,
                    'en' => $contentEn,
                ],
                'content_markdown' => $markdown,
                'author_id' => $request->user()?->id,
                'category_id' => $validated['category_id'] ?? null,
                'is_published' => false,
                'published_at' => null,
            ]);
        } else {
            $post->update([
                'title' => [
                    'ar' => $titleAr,
                    'en' => $titleEn,
                ],
                'slug' => $this->generateUniqueSlug($slugSource ?: $post->slug, $post),
                'excerpt' => [
                    'ar' => $validated['excerpt_ar'] ?? Translation::get($post->excerpt, 'ar'),
                    'en' => $validated['excerpt_en'] ?? Translation::get($post->excerpt, 'en'),
                ],
                'content' => [
                    'ar' => $contentAr ?? Translation::get($post->content, 'ar'),
                    'en' => $contentEn ?? Translation::get($post->content, 'en'),
                ],
                'content_markdown' => $markdown ?? $post->content_markdown,
                'category_id' => $validated['category_id'] ?? $post->category_id,
            ]);
        }

        $this->syncTags($post, $validated['tags'] ?? null);

        return response()->json([
            'post_id' => $post->id,
            'saved_at' => now()->toDateTimeString(),
        ]);
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

    private function reviewStatusOptions(): array
    {
        return [
            Post::REVIEW_DRAFT,
            Post::REVIEW_PENDING,
            Post::REVIEW_APPROVED,
        ];
    }

    private function resolveReviewStatus(Request $request, array $validated, ?Post $post = null): string
    {
        $requested = $validated['review_status'] ?? ($post?->review_status ?? Post::REVIEW_DRAFT);
        $requested = in_array($requested, $this->reviewStatusOptions(), true)
            ? $requested
            : Post::REVIEW_DRAFT;

        $user = $request->user();
        if ($user && !$user->isAdmin() && $requested === Post::REVIEW_APPROVED) {
            return Post::REVIEW_PENDING;
        }

        return $requested;
    }

    private function resolvePublishedAt(array $validated): ?\Carbon\Carbon
    {
        $publishedAt = $validated['published_at'] ?? null;
        if ($publishedAt) {
            return \Carbon\Carbon::parse($publishedAt);
        }

        if (!empty($validated['is_published'])) {
            return now();
        }

        return null;
    }

    private function resolvePublishFlag(string $reviewStatus, array $validated, ?\Carbon\Carbon $publishedAt): bool
    {
        if ($reviewStatus !== Post::REVIEW_APPROVED) {
            return false;
        }

        if (!empty($publishedAt) && $publishedAt->isFuture()) {
            return false;
        }

        return (bool) ($validated['is_published'] ?? false);
    }

    private function buildMarkdown(array $validated): ?array
    {
        $markdownAr = trim((string) ($validated['content_markdown_ar'] ?? ''));
        $markdownEn = trim((string) ($validated['content_markdown_en'] ?? ''));

        if ($markdownAr === '' && $markdownEn === '') {
            return null;
        }

        return [
            'ar' => $markdownAr !== '' ? $markdownAr : $markdownEn,
            'en' => $markdownEn !== '' ? $markdownEn : $markdownAr,
        ];
    }

    private function resolveContent(array $validated, ?array $markdown, bool $useMarkdown): array
    {
        $contentAr = HtmlSanitizer::clean($validated['content_ar'] ?? null);
        $contentEn = HtmlSanitizer::clean($validated['content_en'] ?? null);

        if (!$useMarkdown || empty($markdown)) {
            return [$contentAr, $contentEn];
        }

        $markdownAr = $markdown['ar'] ?? null;
        $markdownEn = $markdown['en'] ?? null;

        if ($markdownAr) {
            $contentAr = HtmlSanitizer::clean($this->markdownToHtml($markdownAr));
        }

        if ($markdownEn) {
            $contentEn = HtmlSanitizer::clean($this->markdownToHtml($markdownEn));
        }

        return [$contentAr, $contentEn];
    }

    private function markdownToHtml(string $value): string
    {
        return Str::markdown($value);
    }

    private function dispatchPostPublished(Post $post): void
    {
        $payload = [
            'id' => $post->id,
            'slug' => $post->slug,
            'title' => Translation::get($post->title, app()->getLocale()),
            'url' => route('blog.show', [
                'locale' => app()->getLocale(),
                'post' => $post->slug,
            ]),
            'published_at' => optional($post->published_at)->toIso8601String(),
        ];

        WebhookDispatcher::dispatch('post.published', $payload);
        AlertDispatcher::notify('Post published', $payload['title'] ?? '', $payload);
    }

    private function notifyReviewRequested(Post $post): void
    {
        User::query()
            ->where('role', User::ROLE_ADMIN)
            ->get()
            ->each(fn(User $user) => $user->notify(new PostReviewRequested($post)));
    }
}
