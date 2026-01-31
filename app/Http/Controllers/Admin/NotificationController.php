<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function markRead(Request $request, string $notification): RedirectResponse
    {
        $user = $request->user();

        $record = $user?->notifications()->whereKey($notification)->first();
        if ($record) {
            $record->markAsRead();
        }

        return back();
    }

    public function markAllRead(Request $request): RedirectResponse
    {
        $request->user()?->unreadNotifications()->update(['read_at' => now()]);

        return back();
    }
}
