<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Support\ImageVariants;
use App\Support\SiteData;
use App\Support\Translation;
use Inertia\Inertia;

class ProjectsController extends Controller
{
    public function index()
    {
        $locale = app()->getLocale();

        $projects = Project::active()
            ->orderByDesc('is_featured')
            ->orderByDesc('id')
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
                'is_featured' => $project->is_featured,
            ]);

        return Inertia::render('Projects/Index', [
            'site' => SiteData::forLocale($locale),
            'projects' => $projects,
        ]);
    }

    public function show(string $locale, Project $project)
    {
        if (!$project->is_active) {
            abort(404);
        }

        $project->load('images');
        $seo = $project->seo ?? [];

        $projectData = [
            'id' => $project->id,
            'title' => Translation::get($project->title, $locale),
            'summary' => Translation::get($project->summary, $locale),
            'description' => Translation::get($project->description, $locale),
            'slug' => $project->slug,
            'client' => $project->client,
            'year' => $project->year,
            'stack' => $project->stack ?? [],
            'cover_image' => $project->cover_image,
            'cover_image_srcset' => ImageVariants::srcSet($project->cover_image),
            'gallery' => $project->images
                ->sortBy('sort_order')
                ->values()
                ->map(fn($image) => [
                    'id' => $image->id,
                    'image_path' => $image->image_path,
                    'image_srcset' => ImageVariants::srcSet($image->image_path),
                    'caption' => Translation::get($image->caption, $locale),
                ]),
            'seo' => [
                'meta_title' => Translation::get($seo['meta_title'] ?? null, $locale),
                'meta_description' => Translation::get($seo['meta_description'] ?? null, $locale),
                'og_image' => $seo['og_image'] ?? null,
                'robots' => $seo['robots'] ?? null,
            ],
        ];

        return Inertia::render('Projects/Show', [
            'site' => SiteData::forLocale($locale),
            'project' => $projectData,
        ]);
    }
}
