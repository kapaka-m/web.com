<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Notifications;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ContactMessageReceived extends Notification
{
    use Queueable;

    public function __construct(private readonly ContactMessage $message)
    {
    }

    public function via(): array
    {
        return ['database'];
    }

    public function toDatabase(): array
    {
        return [
            'type' => 'contact',
            'title' => 'New contact message',
            'body' => $this->message->subject
                ? "{$this->message->name}: {$this->message->subject}"
                : $this->message->name,
            'link' => route('admin.contacts.show', ['contact' => $this->message->id]),
        ];
    }
}
