<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WebhookEndpoint;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WebhookEndpointController extends Controller
{
    private array $events = [
        'post.published',
        'project.published',
        'service.published',
    ];

    public function index()
    {
        $this->authorize('viewAny', WebhookEndpoint::class);

        $endpoints = WebhookEndpoint::query()
            ->latest('created_at')
            ->paginate(20)
            ->through(fn(WebhookEndpoint $endpoint) => [
                'id' => $endpoint->id,
                'name' => $endpoint->name,
                'url' => $endpoint->url,
                'events' => $endpoint->events ?? [],
                'is_active' => $endpoint->is_active,
                'last_fired_at' => optional($endpoint->last_fired_at)->toDateTimeString(),
            ]);

        return Inertia::render('Admin/Webhooks/Index', [
            'endpoints' => $endpoints,
            'availableEvents' => $this->events,
        ]);
    }

    public function create()
    {
        $this->authorize('create', WebhookEndpoint::class);

        return Inertia::render('Admin/Webhooks/Create', [
            'availableEvents' => $this->events,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', WebhookEndpoint::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'url' => ['required', 'url', 'max:255'],
            'events' => ['nullable', 'array'],
            'events.*' => ['string'],
            'secret' => ['nullable', 'string', 'max:190'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        WebhookEndpoint::create([
            'name' => $validated['name'],
            'url' => $validated['url'],
            'events' => $validated['events'] ?? [],
            'secret' => $validated['secret'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.webhooks.index')
            ->with('success', 'Webhook saved.');
    }

    public function edit(WebhookEndpoint $webhook)
    {
        $this->authorize('update', $webhook);

        return Inertia::render('Admin/Webhooks/Edit', [
            'endpoint' => [
                'id' => $webhook->id,
                'name' => $webhook->name,
                'url' => $webhook->url,
                'events' => $webhook->events ?? [],
                'secret' => '',
                'is_active' => $webhook->is_active,
            ],
            'availableEvents' => $this->events,
        ]);
    }

    public function update(Request $request, WebhookEndpoint $webhook): RedirectResponse
    {
        $this->authorize('update', $webhook);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'url' => ['required', 'url', 'max:255'],
            'events' => ['nullable', 'array'],
            'events.*' => ['string'],
            'secret' => ['nullable', 'string', 'max:190'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $updates = [
            'name' => $validated['name'],
            'url' => $validated['url'],
            'events' => $validated['events'] ?? [],
            'is_active' => $validated['is_active'] ?? true,
        ];

        if (!empty($validated['secret'])) {
            $updates['secret'] = $validated['secret'];
        }

        $webhook->update($updates);

        return redirect()->route('admin.webhooks.index')
            ->with('success', 'Webhook updated.');
    }

    public function destroy(Request $request, WebhookEndpoint $webhook): RedirectResponse
    {
        $this->authorize('delete', $webhook);

        $webhook->delete();

        return back()->with('success', 'Webhook deleted.');
    }
}
