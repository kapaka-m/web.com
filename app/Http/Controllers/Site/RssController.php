<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Support\SiteData;
use App\Support\Translation;
use Illuminate\Http\Response;

class RssController extends Controller
{
    public function index(string $locale): Response
    {
        app()->setLocale($locale);

        $site = SiteData::forLocale($locale);
        $posts = Post::published()
            ->take(20)
            ->get()
            ->map(fn(Post $post) => [
                'title' => Translation::get($post->title, $locale),
                'excerpt' => Translation::get($post->excerpt, $locale),
                'content' => Translation::get($post->content, $locale),
                'slug' => $post->slug,
                'published_at' => optional($post->published_at)->toRfc2822String(),
            ]);

        return response()
            ->view('rss', [
                'site' => $site,
                'posts' => $posts,
                'locale' => $locale,
            ])
            ->header('Content-Type', 'application/rss+xml; charset=UTF-8');
    }
}
