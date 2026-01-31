<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use App\Notifications\CommentReceived;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, string $locale, Post $post): RedirectResponse
    {
        if (!$post->is_published) {
            abort(404);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'email' => ['required', 'email', 'max:190'],
            'message' => ['required', 'string', 'max:2000'],
            'website' => ['nullable', 'string', 'max:190'],
        ]);

        if (!empty($validated['website'])) {
            return back()->with('error', $this->messageForLocale('error'));
        }

        $comment = Comment::create([
            'post_id' => $post->id,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'message' => $validated['message'],
            'locale' => app()->getLocale(),
            'ip_address' => $request->ip(),
            'user_agent' => (string) $request->userAgent(),
        ]);

        User::query()
            ->where('role', User::ROLE_ADMIN)
            ->get()
            ->each(fn(User $user) => $user->notify(new CommentReceived($comment)));

        return back()->with('success', $this->messageForLocale('success'));
    }

    private function messageForLocale(string $key): string
    {
        $isArabic = app()->getLocale() === 'ar';

        return match ($key) {
            'success' => $isArabic
            ? 'تم استلام تعليقك وسيتم مراجعته قبل النشر.'
            : 'Your comment was received and will be reviewed.',
            default => $isArabic
            ? 'تعذر إرسال تعليقك.'
            : 'Unable to submit your comment.',
        };
    }
}
