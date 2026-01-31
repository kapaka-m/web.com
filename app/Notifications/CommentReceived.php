<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CommentReceived extends Notification
{
    use Queueable;

    public function __construct(private readonly Comment $comment)
    {
    }

    public function via(): array
    {
        return ['database'];
    }

    public function toDatabase(): array
    {
        return [
            'type' => 'comment',
            'title' => 'New comment awaiting review',
            'body' => $this->comment->name,
            'link' => route('admin.comments.index'),
        ];
    }
}
