<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Tag;
use App\Support\ImageVariants;
use App\Support\ReadingTime;
use App\Support\SiteData;
use App\Support\Translation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $locale = app()->getLocale();

        $search = trim((string) $request->query('q', ''));
        $categorySlug = $request->query('category');
        $tagSlug = $request->query('tag');

        $query = Post::published()
            ->with(['category', 'tags']);

        if ($search !== '') {
            $query->where(function ($query) use ($search, $locale) {
                $query->where("title->{$locale}", 'like', "%{$search}%")
                    ->orWhere("excerpt->{$locale}", 'like', "%{$search}%")
                    ->orWhere("content->{$locale}", 'like', "%{$search}%");
            });
        }

        if ($categorySlug) {
            $query->whereHas('category', fn($query) => $query->where('slug', $categorySlug));
        }

        if ($tagSlug) {
            $query->whereHas('tags', fn($query) => $query->where('slug', $tagSlug));
        }

        $posts = $query
            ->paginate(6)
            ->withQueryString()
            ->through(function (Post $post) use ($locale) {
                $reading = ReadingTime::forText(
                    Translation::get($post->content, $locale),
                    $locale
                );

                return [
                    'id' => $post->id,
                    'title' => Translation::get($post->title, $locale),
                    'excerpt' => Translation::get($post->excerpt, $locale),
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
                ];
            });

        $categories = Category::query()
            ->where('is_active', true)
            ->orderBy('id')
            ->get()
            ->map(fn(Category $category) => [
                'name' => Translation::get($category->name, $locale),
                'slug' => $category->slug,
            ]);

        $tags = Tag::query()
            ->orderBy('id')
            ->get()
            ->map(fn(Tag $tag) => [
                'name' => Translation::get($tag->name, $locale),
                'slug' => $tag->slug,
            ]);

        return Inertia::render('Blog/Index', [
            'site' => SiteData::forLocale($locale),
            'posts' => $posts,
            'categories' => $categories,
            'tags' => $tags,
            'filters' => [
                'q' => $search,
                'category' => $categorySlug,
                'tag' => $tagSlug,
            ],
        ]);
    }

    public function show(string $locale, Post $post)
    {
        if (!$post->is_published) {
            abort(404);
        }

        return Inertia::render('Blog/Show', [
            'site' => SiteData::forLocale($locale),
            'post' => $this->buildPostData($post, $locale),
            'comments' => $this->buildComments($post),
            'related' => $this->buildRelatedPosts($post, $locale),
        ]);
    }

    private function buildPostData(Post $post, string $locale): array
    {
        $post->loadMissing(['category', 'tags']);

        $content = Translation::get($post->content, $locale);
        $reading = ReadingTime::forText($content, $locale);
        $category = $post->category;
        $seo = $post->seo ?? [];

        return [
            'id' => $post->id,
            'title' => Translation::get($post->title, $locale),
            'excerpt' => Translation::get($post->excerpt, $locale),
            'content' => $content,
            'slug' => $post->slug,
            'cover_image' => $post->cover_image,
            'cover_image_srcset' => ImageVariants::srcSet($post->cover_image),
            'published_at' => optional($post->published_at)->toDateString(),
            'category' => $category
                ? [
                    'name' => Translation::get($category->name, $locale),
                    'slug' => $category->slug,
                ]
                : null,
            'tags' => $post->tags->map(fn(Tag $tag) => [
                'name' => Translation::get($tag->name, $locale),
                'slug' => $tag->slug,
            ])->values(),
            'reading_time' => $reading['label'],
            'seo' => [
                'meta_title' => Translation::get($seo['meta_title'] ?? null, $locale),
                'meta_description' => Translation::get($seo['meta_description'] ?? null, $locale),
                'og_image' => $seo['og_image'] ?? null,
                'robots' => $seo['robots'] ?? null,
            ],
        ];
    }

    private function buildComments(Post $post): array
    {
        return Comment::query()
            ->where('post_id', $post->id)
            ->where('is_approved', true)
            ->orderBy('created_at')
            ->get()
            ->map(fn(Comment $comment) => [
                'id' => $comment->id,
                'name' => $comment->name,
                'message' => $comment->message,
                'created_at' => optional($comment->created_at)->toDateString(),
            ])
            ->values()
            ->all();
    }

    private function buildRelatedPosts(Post $post, string $locale): array
    {
        $related = Post::published()
            ->where('id', '!=', $post->id)
            ->when(
                $post->category_id,
                fn($query) => $query->where('category_id', $post->category_id)
            )
            ->take(3)
            ->get();

        if ($related->count() < 3) {
            $more = Post::published()
                ->where('id', '!=', $post->id)
                ->whereNotIn('id', $related->pluck('id'))
                ->take(3 - $related->count())
                ->get();
            $related = $related->concat($more);
        }

        return $related
            ->map(fn(Post $relatedPost) => [
                'id' => $relatedPost->id,
                'title' => Translation::get($relatedPost->title, $locale),
                'slug' => $relatedPost->slug,
                'excerpt' => Translation::get($relatedPost->excerpt, $locale),
                'cover_image' => $relatedPost->cover_image,
                'cover_image_srcset' => ImageVariants::srcSet($relatedPost->cover_image),
                'published_at' => optional($relatedPost->published_at)->toDateString(),
            ])
            ->values()
            ->all();
    }
}
