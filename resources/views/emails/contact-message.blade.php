{{-- MOHAMED HASSANIN (KAPAKA) --}}
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Contact Message</title>
    </head>
    <body>
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> {{ $contactMessage->name }}</p>
        <p><strong>Email:</strong> {{ $contactMessage->email }}</p>
        @if ($contactMessage->phone)
            <p><strong>Phone:</strong> {{ $contactMessage->phone }}</p>
        @endif
        <p><strong>Subject:</strong> {{ $contactMessage->subject ?? 'N/A' }}</p>
        <p><strong>Message:</strong></p>
        <p>{{ $contactMessage->message }}</p>
        <hr>
        <p><strong>Locale:</strong> {{ $contactMessage->locale }}</p>
        <p><strong>IP:</strong> {{ $contactMessage->ip_address }}</p>
        <p><strong>User Agent:</strong> {{ $contactMessage->user_agent }}</p>
    </body>
</html>
