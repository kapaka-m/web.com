<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Console\Commands;

use App\Models\Post;
use App\Support\AlertDispatcher;
use App\Support\Translation;
use App\Support\WebhookDispatcher;
use Illuminate\Console\Command;

class PublishScheduledPosts extends Command
{
    protected $signature = 'posts:publish-scheduled';

    protected $description = 'Publish approved posts that reached their scheduled time.';

    public function handle(): int
    {
        $posts = Post::query()
            ->where('review_status', Post::REVIEW_APPROVED)
            ->where('is_published', false)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->get();

        $count = 0;
        $posts->each(function (Post $post) use (&$count): void {
            $post->update(['is_published' => true]);
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
            $count++;
        });

        if ($count > 0) {
            $this->info("Published {$count} scheduled posts.");
        }

        return self::SUCCESS;
    }
}
