<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Support\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ContactMessageController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(ContactMessage::class, 'contact');
    }

    public function index()
    {
        $messages = ContactMessage::query()
            ->latest()
            ->paginate(12)
            ->through(fn(ContactMessage $message) => [
                'id' => $message->id,
                'name' => $message->name,
                'email' => $message->email,
                'subject' => $message->subject,
                'is_read' => $message->is_read,
                'created_at' => $message->created_at->toDateTimeString(),
            ]);

        return Inertia::render('Admin/Contacts/Index', [
            'messages' => $messages,
        ]);
    }

    public function show(ContactMessage $contact)
    {
        if (!$contact->is_read) {
            $contact->update(['is_read' => true]);
        }

        return Inertia::render('Admin/Contacts/Show', [
            'message' => [
                'id' => $contact->id,
                'name' => $contact->name,
                'email' => $contact->email,
                'phone' => $contact->phone,
                'subject' => $contact->subject,
                'message' => $contact->message,
                'created_at' => $contact->created_at->toDateTimeString(),
                'locale' => $contact->locale,
            ],
        ]);
    }

    public function destroy(\Illuminate\Http\Request $request, ContactMessage $contact): RedirectResponse
    {
        ActivityLogger::log($request, 'contact.delete', $contact, [
            'email' => $contact->email,
            'subject' => $contact->subject,
        ]);

        $contact->delete();

        return redirect()
            ->route('admin.contacts.index')
            ->with('success', 'Message deleted successfully.');
    }
}
