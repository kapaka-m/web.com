<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Support\SiteData;
use App\Support\Translation;
use Illuminate\Http\Response;

class NewsSitemapController extends Controller
{
    public function index(string $locale): Response
    {
        app()->setLocale($locale);

        $site = SiteData::forLocale($locale);
        $posts = Post::published()
            ->where('published_at', '>=', now()->subDays(2))
            ->orderByDesc('published_at')
            ->get()
            ->map(fn(Post $post) => [
                'title' => Translation::get($post->title, $locale),
                'slug' => $post->slug,
                'published_at' => optional($post->published_at)->toAtomString(),
            ]);

        return response()
            ->view('news-sitemap', [
                'site' => $site,
                'posts' => $posts,
                'locale' => $locale,
            ])
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }
}
