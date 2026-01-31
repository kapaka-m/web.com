<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'services' => Service::count(),
            'projects' => Project::count(),
            'posts' => Post::count(),
            'messages' => ContactMessage::count(),
            'unread_messages' => ContactMessage::unread()->count(),
        ];

        $recentMessages = ContactMessage::query()
            ->latest()
            ->take(5)
            ->get()
            ->map(fn(ContactMessage $message) => [
                'id' => $message->id,
                'name' => $message->name,
                'email' => $message->email,
                'subject' => $message->subject,
                'is_read' => $message->is_read,
                'created_at' => $message->created_at->toDateTimeString(),
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentMessages' => $recentMessages,
        ]);
    }
}
