<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Support\ActivityLogger;
use App\Support\Translation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommentController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Comment::class, 'comment');
    }

    public function index(Request $request)
    {
        $locale = app()->getLocale();
        $showTrashed = $request->boolean('trashed');

        $comments = Comment::query()
            ->withTrashed()
            ->when($showTrashed, fn($query) => $query->onlyTrashed())
            ->orderByDesc('created_at')
            ->with('post')
            ->paginate(12)
            ->through(fn(Comment $comment) => [
                'id' => $comment->id,
                'name' => $comment->name,
                'email' => $comment->email,
                'message' => $comment->message,
                'is_approved' => $comment->is_approved,
                'created_at' => optional($comment->created_at)->toDateString(),
                'locale' => $comment->locale,
                'deleted_at' => optional($comment->deleted_at)->toDateTimeString(),
                'post' => [
                    'id' => $comment->post?->id,
                    'title' => $comment->post
                        ? Translation::get($comment->post->title, $locale)
                        : null,
                    'slug' => $comment->post?->slug,
                ],
            ]);

        return Inertia::render('Admin/Comments/Index', [
            'comments' => $comments,
            'filters' => [
                'trashed' => $showTrashed,
            ],
        ]);
    }

    public function approve(Request $request, Comment $comment): RedirectResponse
    {
        $this->authorize('update', $comment);
        $before = $comment->toArray();

        $comment->update([
            'is_approved' => true,
            'approved_at' => now(),
        ]);

        ActivityLogger::logWithDiff($request, 'comment.approve', $comment, $before, $comment->fresh()->toArray(), [
            'comment_id' => $comment->id,
        ]);

        return redirect()
            ->route('admin.comments.index')
            ->with('success', 'Comment approved.');
    }

    public function destroy(Request $request, Comment $comment): RedirectResponse
    {
        ActivityLogger::log($request, 'comment.delete', $comment, [
            'comment_id' => $comment->id,
        ]);

        $comment->delete();

        return redirect()
            ->route('admin.comments.index')
            ->with('success', 'Comment deleted successfully.');
    }

    public function restore(Request $request, int $comment): RedirectResponse
    {
        $commentModel = Comment::withTrashed()->findOrFail($comment);
        $this->authorize('restore', $commentModel);

        $commentModel->restore();

        ActivityLogger::log($request, 'comment.restore', $commentModel, [
            'comment_id' => $commentModel->id,
        ]);

        return redirect()
            ->route('admin.comments.index')
            ->with('success', 'Comment restored successfully.');
    }
}
