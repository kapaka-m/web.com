<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsletterSubscriberController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', NewsletterSubscriber::class);

        $query = NewsletterSubscriber::query()->latest('created_at');

        $status = $request->query('status');
        if ($status) {
            $query->where('status', $status);
        }

        $search = trim((string) $request->query('q', ''));
        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder->where('email', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        $subscribers = $query
            ->paginate(20)
            ->withQueryString()
            ->through(fn(NewsletterSubscriber $subscriber) => [
                'id' => $subscriber->id,
                'email' => $subscriber->email,
                'name' => $subscriber->name,
                'status' => $subscriber->status,
                'locale' => $subscriber->locale,
                'subscribed_at' => optional($subscriber->subscribed_at)->toDateTimeString(),
                'confirmed_at' => optional($subscriber->confirmed_at)->toDateTimeString(),
                'unsubscribed_at' => optional($subscriber->unsubscribed_at)->toDateTimeString(),
            ]);

        return Inertia::render('Admin/Newsletter/Index', [
            'subscribers' => $subscribers,
            'filters' => [
                'status' => $status,
                'q' => $search,
            ],
        ]);
    }

    public function update(Request $request, NewsletterSubscriber $subscriber): RedirectResponse
    {
        $this->authorize('update', $subscriber);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,confirmed,unsubscribed'],
        ]);

        $subscriber->update([
            'status' => $validated['status'],
            'confirmed_at' => $validated['status'] === NewsletterSubscriber::STATUS_CONFIRMED
                ? now()
                : $subscriber->confirmed_at,
            'unsubscribed_at' => $validated['status'] === NewsletterSubscriber::STATUS_UNSUBSCRIBED
                ? now()
                : $subscriber->unsubscribed_at,
        ]);

        return back()->with('success', 'Subscriber updated.');
    }

    public function destroy(Request $request, NewsletterSubscriber $subscriber): RedirectResponse
    {
        $this->authorize('delete', $subscriber);

        $subscriber->delete();

        return back()->with('success', 'Subscriber deleted.');
    }
}
