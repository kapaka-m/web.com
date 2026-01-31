<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $locales = config('app.supported_locales', ['ar', 'en']);
        $sitemaps = array_map(
            fn(string $locale) => [
                'loc' => route('sitemap.locale', ['locale' => $locale]),
                'lastmod' => now()->toDateString(),
            ],
            $locales
        );

        return response()
            ->view('sitemap-index', ['sitemaps' => $sitemaps])
            ->header('Content-Type', 'application/xml');
    }

    public function locale(string $locale): Response
    {
        app()->setLocale($locale);

        $urls = $this->buildLocaleUrls($locale);

        return response()
            ->view('sitemap', ['urls' => $urls])
            ->header('Content-Type', 'application/xml');
    }

    private function buildLocaleUrls(string $locale): array
    {
        $urls = [
            [
                'loc' => route('home', ['locale' => $locale]),
                'changefreq' => 'weekly',
                'priority' => '1.0',
            ],
            [
                'loc' => route('services.index', ['locale' => $locale]),
                'changefreq' => 'monthly',
                'priority' => '0.7',
            ],
            [
                'loc' => route('projects.index', ['locale' => $locale]),
                'changefreq' => 'monthly',
                'priority' => '0.8',
            ],
            [
                'loc' => route('consulting', ['locale' => $locale]),
                'changefreq' => 'monthly',
                'priority' => '0.6',
            ],
            [
                'loc' => route('careers', ['locale' => $locale]),
                'changefreq' => 'monthly',
                'priority' => '0.5',
            ],
            [
                'loc' => route('about', ['locale' => $locale]),
                'changefreq' => 'monthly',
                'priority' => '0.6',
            ],
            [
                'loc' => route('blog.index', ['locale' => $locale]),
                'changefreq' => 'weekly',
                'priority' => '0.7',
            ],
            [
                'loc' => route('contact', ['locale' => $locale]),
                'changefreq' => 'monthly',
                'priority' => '0.5',
            ],
            [
                'loc' => route('privacy', ['locale' => $locale]),
                'changefreq' => 'yearly',
                'priority' => '0.3',
            ],
            [
                'loc' => route('terms', ['locale' => $locale]),
                'changefreq' => 'yearly',
                'priority' => '0.3',
            ],
        ];

        $services = Service::active()->get(['slug', 'updated_at']);
        foreach ($services as $service) {
            $urls[] = [
                'loc' => route('services.show', [
                    'locale' => $locale,
                    'service' => $service->slug,
                ]),
                'lastmod' => optional($service->updated_at)->toDateString(),
                'changefreq' => 'yearly',
                'priority' => '0.6',
            ];
        }

        $projects = Project::active()->get(['slug', 'updated_at']);
        foreach ($projects as $project) {
            $urls[] = [
                'loc' => route('projects.show', [
                    'locale' => $locale,
                    'project' => $project->slug,
                ]),
                'lastmod' => optional($project->updated_at)->toDateString(),
                'changefreq' => 'monthly',
                'priority' => '0.7',
            ];
        }

        $posts = Post::published()->get(['slug', 'published_at', 'updated_at']);
        foreach ($posts as $post) {
            $urls[] = [
                'loc' => route('blog.show', [
                    'locale' => $locale,
                    'post' => $post->slug,
                ]),
                'lastmod' => optional($post->updated_at)->toDateString()
                    ?? optional($post->published_at)->toDateString(),
                'changefreq' => 'monthly',
                'priority' => '0.6',
            ];
        }

        return $urls;
    }
}
