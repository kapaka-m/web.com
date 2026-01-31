<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;
use App\Models\Testimonial;
use App\Models\Partner;
use App\Support\ImageVariants;
use App\Support\SiteData;
use App\Support\Translation;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $locale = app()->getLocale();

        return Inertia::render('Home', [
            'site' => SiteData::forLocale($locale),
            'services' => $this->buildServices($locale),
            'projects' => $this->buildProjects($locale),
            'posts' => $this->buildPosts($locale),
            'testimonials' => $this->buildTestimonials($locale),
            'partners' => $this->buildPartners(),
        ]);
    }

    private function buildServices(string $locale): array
    {
        return Service::active()
            ->orderBy('sort_order')
            ->take(6)
            ->get()
            ->map(fn(Service $service) => [
                'id' => $service->id,
                'title' => Translation::get($service->title, $locale),
                'summary' => Translation::get($service->summary, $locale),
                'features' => Translation::map($service->features ?? [], $locale),
                'icon' => $service->icon,
            ])
            ->values()
            ->all();
    }

    private function buildProjects(string $locale): array
    {
        return Project::active()
            ->orderByDesc('is_featured')
            ->orderByDesc('id')
            ->take(3)
            ->get()
            ->map(fn(Project $project) => [
                'id' => $project->id,
                'title' => Translation::get($project->title, $locale),
                'summary' => Translation::get($project->summary, $locale),
                'slug' => $project->slug,
                'client' => $project->client,
                'year' => $project->year,
                'stack' => $project->stack ?? [],
                'cover_image' => $project->cover_image,
                'cover_image_srcset' => ImageVariants::srcSet($project->cover_image),
            ])
            ->values()
            ->all();
    }

    private function buildPosts(string $locale): array
    {
        return Post::published()
            ->take(3)
            ->get()
            ->map(fn(Post $post) => [
                'id' => $post->id,
                'title' => Translation::get($post->title, $locale),
                'excerpt' => Translation::get($post->excerpt, $locale),
                'slug' => $post->slug,
                'cover_image' => $post->cover_image,
                'cover_image_srcset' => ImageVariants::srcSet($post->cover_image),
                'published_at' => optional($post->published_at)->toDateString(),
            ])
            ->values()
            ->all();
    }

    private function buildTestimonials(string $locale): array
    {
        return Testimonial::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->take(6)
            ->get()
            ->map(fn(Testimonial $testimonial) => [
                'id' => $testimonial->id,
                'name' => $testimonial->name,
                'role' => Translation::get($testimonial->role, $locale),
                'company' => $testimonial->company,
                'quote' => Translation::get($testimonial->quote, $locale),
                'avatar' => $testimonial->avatar,
                'avatar_srcset' => ImageVariants::srcSet($testimonial->avatar),
            ])
            ->values()
            ->all();
    }

    private function buildPartners(): array
    {
        return Partner::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->take(8)
            ->get()
            ->map(fn(Partner $partner) => [
                'id' => $partner->id,
                'name' => $partner->name,
                'logo' => $partner->logo,
                'logo_srcset' => ImageVariants::srcSet($partner->logo),
                'url' => $partner->url,
            ])
            ->values()
            ->all();
    }
}
