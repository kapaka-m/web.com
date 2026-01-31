<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;
use App\Models\Tag;
use App\Support\Translation;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ContentToolsController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Tools/Content', [
            'types' => [
                ['value' => 'posts', 'label' => 'Posts'],
                ['value' => 'projects', 'label' => 'Projects'],
                ['value' => 'services', 'label' => 'Services'],
            ],
        ]);
    }

    public function export(Request $request)
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'type' => ['required', Rule::in(['posts', 'projects', 'services'])],
            'format' => ['required', Rule::in(['json', 'csv'])],
        ]);

        $records = $this->collectRecords($validated['type']);

        if ($validated['format'] === 'json') {
            $filename = $validated['type'] . '-export.json';
            $payload = json_encode($records, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

            return response()->streamDownload(function () use ($payload) {
                echo $payload;
            }, $filename, ['Content-Type' => 'application/json']);
        }

        $filename = $validated['type'] . '-export.csv';
        $header = array_keys($records[0] ?? []);

        return response()->streamDownload(function () use ($records, $header) {
            $output = fopen('php://output', 'w');
            if (!empty($header)) {
                fputcsv($output, $header);
            }
            foreach ($records as $row) {
                fputcsv($output, $row);
            }
            fclose($output);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    public function import(Request $request)
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'type' => ['required', Rule::in(['posts', 'projects', 'services'])],
            'format' => ['required', Rule::in(['json', 'csv'])],
            'file' => ['required', 'file', 'max:5120'],
        ]);

        $records = $this->parseImport($request->file('file'), $validated['format']);
        $imported = 0;

        foreach ($records as $record) {
            $record = array_change_key_case($record, CASE_LOWER);
            if ($validated['type'] === 'posts') {
                $imported += $this->importPost($record) ? 1 : 0;
                continue;
            }

            if ($validated['type'] === 'projects') {
                $imported += $this->importProject($record) ? 1 : 0;
                continue;
            }

            if ($validated['type'] === 'services') {
                $imported += $this->importService($record) ? 1 : 0;
            }
        }

        return back()->with('success', "Imported {$imported} records.");
    }

    private function collectRecords(string $type): array
    {
        if ($type === 'services') {
            return Service::withTrashed()->orderBy('id')->get()->map(function (Service $service) {
                return [
                    'id' => $service->id,
                    'slug' => $service->slug,
                    'title_ar' => Translation::get($service->title, 'ar'),
                    'title_en' => Translation::get($service->title, 'en'),
                    'summary_ar' => Translation::get($service->summary, 'ar'),
                    'summary_en' => Translation::get($service->summary, 'en'),
                    'description_ar' => Translation::get($service->description, 'ar'),
                    'description_en' => Translation::get($service->description, 'en'),
                    'features_ar' => implode("\n", Translation::map($service->features ?? [], 'ar')),
                    'features_en' => implode("\n", Translation::map($service->features ?? [], 'en')),
                    'icon' => $service->icon,
                    'sort_order' => $service->sort_order,
                    'is_active' => $service->is_active ? 1 : 0,
                    'deleted_at' => optional($service->deleted_at)->toDateTimeString(),
                ];
            })->toArray();
        }

        if ($type === 'projects') {
            return Project::withTrashed()->orderBy('id')->get()->map(function (Project $project) {
                return [
                    'id' => $project->id,
                    'slug' => $project->slug,
                    'title_ar' => Translation::get($project->title, 'ar'),
                    'title_en' => Translation::get($project->title, 'en'),
                    'summary_ar' => Translation::get($project->summary, 'ar'),
                    'summary_en' => Translation::get($project->summary, 'en'),
                    'description_ar' => Translation::get($project->description, 'ar'),
                    'description_en' => Translation::get($project->description, 'en'),
                    'client' => $project->client,
                    'year' => $project->year,
                    'stack' => implode(', ', $project->stack ?? []),
                    'cover_image' => $project->cover_image,
                    'is_featured' => $project->is_featured ? 1 : 0,
                    'is_active' => $project->is_active ? 1 : 0,
                    'deleted_at' => optional($project->deleted_at)->toDateTimeString(),
                ];
            })->toArray();
        }

        return Post::withTrashed()->orderBy('id')->get()->map(function (Post $post) {
            return [
                'id' => $post->id,
                'slug' => $post->slug,
                'title_ar' => Translation::get($post->title, 'ar'),
                'title_en' => Translation::get($post->title, 'en'),
                'excerpt_ar' => Translation::get($post->excerpt, 'ar'),
                'excerpt_en' => Translation::get($post->excerpt, 'en'),
                'content_ar' => Translation::get($post->content, 'ar'),
                'content_en' => Translation::get($post->content, 'en'),
                'content_markdown_ar' => Translation::get($post->content_markdown, 'ar'),
                'content_markdown_en' => Translation::get($post->content_markdown, 'en'),
                'cover_image' => $post->cover_image,
                'category_id' => $post->category_id,
                'tags' => $post->tags->map(fn(Tag $tag) => Translation::get($tag->name, 'en'))->implode(', '),
                'is_published' => $post->is_published ? 1 : 0,
                'published_at' => optional($post->published_at)->toDateTimeString(),
                'review_status' => $post->review_status,
                'deleted_at' => optional($post->deleted_at)->toDateTimeString(),
            ];
        })->toArray();
    }

    private function parseImport($file, string $format): array
    {
        $content = file_get_contents($file->getRealPath());
        if ($format === 'json') {
            $decoded = json_decode($content, true);
            return is_array($decoded) ? $decoded : [];
        }

        $lines = array_filter(array_map('trim', explode("\n", $content)));
        if (empty($lines)) {
            return [];
        }

        $header = str_getcsv(array_shift($lines));
        $records = [];
        foreach ($lines as $line) {
            $row = str_getcsv($line);
            $records[] = array_combine($header, $row);
        }

        return $records;
    }

    private function importService(array $record): bool
    {
        $titleAr = trim((string) ($record['title_ar'] ?? ''));
        $titleEn = trim((string) ($record['title_en'] ?? ''));
        $slug = trim((string) ($record['slug'] ?? ''));

        if ($titleAr === '' && $titleEn === '') {
            return false;
        }

        $service = Service::withTrashed()->firstOrNew(['slug' => $slug !== '' ? $slug : Str::slug($titleEn ?: $titleAr)]);
        $service->fill([
            'title' => ['ar' => $titleAr ?: $titleEn, 'en' => $titleEn ?: $titleAr],
            'summary' => $this->buildTranslated($record, 'summary'),
            'description' => $this->buildTranslated($record, 'description'),
            'features' => $this->buildFeatures($record),
            'icon' => Arr::get($record, 'icon'),
            'sort_order' => (int) Arr::get($record, 'sort_order', 0),
            'is_active' => (bool) Arr::get($record, 'is_active', false),
        ]);
        $service->save();

        return true;
    }

    private function importProject(array $record): bool
    {
        $titleAr = trim((string) ($record['title_ar'] ?? ''));
        $titleEn = trim((string) ($record['title_en'] ?? ''));
        $slug = trim((string) ($record['slug'] ?? ''));

        if ($titleAr === '' && $titleEn === '') {
            return false;
        }

        $project = Project::withTrashed()->firstOrNew(['slug' => $slug !== '' ? $slug : Str::slug($titleEn ?: $titleAr)]);
        $project->fill([
            'title' => ['ar' => $titleAr ?: $titleEn, 'en' => $titleEn ?: $titleAr],
            'summary' => $this->buildTranslated($record, 'summary'),
            'description' => $this->buildTranslated($record, 'description'),
            'client' => Arr::get($record, 'client'),
            'year' => Arr::get($record, 'year'),
            'stack' => $this->splitComma(Arr::get($record, 'stack', '')),
            'cover_image' => Arr::get($record, 'cover_image'),
            'is_featured' => (bool) Arr::get($record, 'is_featured', false),
            'is_active' => (bool) Arr::get($record, 'is_active', false),
        ]);
        $project->save();

        return true;
    }

    private function importPost(array $record): bool
    {
        $titleAr = trim((string) ($record['title_ar'] ?? ''));
        $titleEn = trim((string) ($record['title_en'] ?? ''));
        $slug = trim((string) ($record['slug'] ?? ''));

        if ($titleAr === '' && $titleEn === '') {
            return false;
        }

        $post = Post::withTrashed()->firstOrNew(['slug' => $slug !== '' ? $slug : Str::slug($titleEn ?: $titleAr)]);
        $post->fill([
            'title' => ['ar' => $titleAr ?: $titleEn, 'en' => $titleEn ?: $titleAr],
            'excerpt' => $this->buildTranslated($record, 'excerpt'),
            'content' => $this->buildTranslated($record, 'content'),
            'content_markdown' => $this->buildTranslated($record, 'content_markdown'),
            'cover_image' => Arr::get($record, 'cover_image'),
            'category_id' => Arr::get($record, 'category_id'),
            'is_published' => (bool) Arr::get($record, 'is_published', false),
            'published_at' => Arr::get($record, 'published_at'),
            'review_status' => Arr::get($record, 'review_status', Post::REVIEW_DRAFT),
        ]);
        $post->save();

        $this->syncTags($post, Arr::get($record, 'tags', ''));

        return true;
    }

    private function buildTranslated(array $record, string $base): ?array
    {
        $ar = trim((string) ($record[$base . '_ar'] ?? ''));
        $en = trim((string) ($record[$base . '_en'] ?? ''));

        if ($ar === '' && $en === '') {
            return null;
        }

        return [
            'ar' => $ar !== '' ? $ar : $en,
            'en' => $en !== '' ? $en : $ar,
        ];
    }

    private function buildFeatures(array $record): array
    {
        $featuresAr = array_filter(array_map('trim', explode("\n", (string) ($record['features_ar'] ?? ''))));
        $featuresEn = array_filter(array_map('trim', explode("\n", (string) ($record['features_en'] ?? ''))));
        $max = max(count($featuresAr), count($featuresEn));

        $features = [];
        for ($i = 0; $i < $max; $i++) {
            $ar = $featuresAr[$i] ?? null;
            $en = $featuresEn[$i] ?? null;
            if (!$ar && !$en) {
                continue;
            }
            $features[] = [
                'ar' => $ar ?? $en,
                'en' => $en ?? $ar,
            ];
        }

        return $features;
    }

    private function splitComma(string $value): array
    {
        $items = array_map('trim', explode(',', $value));

        return array_values(array_filter($items));
    }

    private function syncTags(Post $post, string $tagsInput): void
    {
        $tags = collect(explode(',', $tagsInput))
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

    private function authorizeAdmin(Request $request): void
    {
        if (!$request->user()?->isAdmin()) {
            abort(403);
        }
    }
}
