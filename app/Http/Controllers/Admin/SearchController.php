<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\ContactMessage;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;
use App\Models\Tag;
use App\Support\Translation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $locale = app()->getLocale();
        $query = trim((string) $request->query('q', ''));

        $results = $query === '' ? [] : $this->buildResults($query, $locale);

        return Inertia::render('Admin/Search', [
            'query' => $query,
            'results' => $results,
        ]);
    }

    private function buildResults(string $query, string $locale): array
    {
        $like = '%' . $query . '%';

        return [
            $this->searchPosts($like, $locale),
            $this->searchProjects($like, $locale),
            $this->searchServices($like, $locale),
            $this->searchCategories($like, $locale),
            $this->searchTags($like, $locale),
            $this->searchContacts($like),
        ];
    }

    private function searchPosts(string $like, string $locale): array
    {
        $items = Post::withTrashed()
            ->where(function ($query) use ($like, $locale) {
                $query->where("title->{$locale}", 'like', $like)
                    ->orWhere('slug', 'like', $like);
            })
            ->latest('updated_at')
            ->take(5)
            ->get()
            ->map(fn(Post $post) => [
                'id' => $post->id,
                'title' => Translation::get($post->title, $locale),
                'subtitle' => $post->slug,
                'url' => route('admin.posts.edit', ['post' => $post->id]),
                'deleted_at' => optional($post->deleted_at)->toDateTimeString(),
            ])
            ->values()
            ->all();

        return [
            'type' => 'posts',
            'label' => 'Posts',
            'items' => $items,
        ];
    }

    private function searchProjects(string $like, string $locale): array
    {
        $items = Project::withTrashed()
            ->where(function ($query) use ($like, $locale) {
                $query->where("title->{$locale}", 'like', $like)
                    ->orWhere('slug', 'like', $like);
            })
            ->latest('updated_at')
            ->take(5)
            ->get()
            ->map(fn(Project $project) => [
                'id' => $project->id,
                'title' => Translation::get($project->title, $locale),
                'subtitle' => $project->slug,
                'url' => route('admin.projects.edit', ['project' => $project->id]),
                'deleted_at' => optional($project->deleted_at)->toDateTimeString(),
            ])
            ->values()
            ->all();

        return [
            'type' => 'projects',
            'label' => 'Projects',
            'items' => $items,
        ];
    }

    private function searchServices(string $like, string $locale): array
    {
        $items = Service::withTrashed()
            ->where(function ($query) use ($like, $locale) {
                $query->where("title->{$locale}", 'like', $like)
                    ->orWhere('slug', 'like', $like);
            })
            ->latest('updated_at')
            ->take(5)
            ->get()
            ->map(fn(Service $service) => [
                'id' => $service->id,
                'title' => Translation::get($service->title, $locale),
                'subtitle' => $service->slug,
                'url' => route('admin.services.edit', ['service' => $service->id]),
                'deleted_at' => optional($service->deleted_at)->toDateTimeString(),
            ])
            ->values()
            ->all();

        return [
            'type' => 'services',
            'label' => 'Services',
            'items' => $items,
        ];
    }

    private function searchCategories(string $like, string $locale): array
    {
        $items = Category::withTrashed()
            ->where(function ($query) use ($like, $locale) {
                $query->where("name->{$locale}", 'like', $like)
                    ->orWhere('slug', 'like', $like);
            })
            ->latest('updated_at')
            ->take(5)
            ->get()
            ->map(fn(Category $category) => [
                'id' => $category->id,
                'title' => Translation::get($category->name, $locale),
                'subtitle' => $category->slug,
                'url' => route('admin.categories.edit', ['category' => $category->id]),
                'deleted_at' => optional($category->deleted_at)->toDateTimeString(),
            ])
            ->values()
            ->all();

        return [
            'type' => 'categories',
            'label' => 'Categories',
            'items' => $items,
        ];
    }

    private function searchTags(string $like, string $locale): array
    {
        $items = Tag::withTrashed()
            ->where(function ($query) use ($like, $locale) {
                $query->where("name->{$locale}", 'like', $like)
                    ->orWhere('slug', 'like', $like);
            })
            ->latest('updated_at')
            ->take(5)
            ->get()
            ->map(fn(Tag $tag) => [
                'id' => $tag->id,
                'title' => Translation::get($tag->name, $locale),
                'subtitle' => $tag->slug,
                'url' => route('admin.tags.edit', ['tag' => $tag->id]),
                'deleted_at' => optional($tag->deleted_at)->toDateTimeString(),
            ])
            ->values()
            ->all();

        return [
            'type' => 'tags',
            'label' => 'Tags',
            'items' => $items,
        ];
    }

    private function searchContacts(string $like): array
    {
        $items = ContactMessage::query()
            ->where(function ($query) use ($like) {
                $query->where('name', 'like', $like)
                    ->orWhere('email', 'like', $like)
                    ->orWhere('subject', 'like', $like);
            })
            ->latest('created_at')
            ->take(5)
            ->get()
            ->map(fn(ContactMessage $message) => [
                'id' => $message->id,
                'title' => $message->name,
                'subtitle' => $message->subject,
                'url' => route('admin.contacts.show', ['contact' => $message->id]),
                'deleted_at' => null,
            ])
            ->values()
            ->all();

        return [
            'type' => 'contacts',
            'label' => 'Contact Messages',
            'items' => $items,
        ];
    }
}
