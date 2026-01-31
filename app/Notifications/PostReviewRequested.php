<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Notifications;

use App\Models\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PostReviewRequested extends Notification
{
    use Queueable;

    public function __construct(private readonly Post $post)
    {
    }

    public function via(): array
    {
        return ['database'];
    }

    public function toDatabase(): array
    {
        return [
            'type' => 'review',
            'title' => 'Post pending review',
            'body' => $this->post->slug,
            'link' => route('admin.posts.edit', ['post' => $this->post->id]),
        ];
    }
}
