<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Listeners;

use App\Models\LoginAttempt;
use Illuminate\Auth\Events\Failed;

class LogFailedLogin
{
    public function handle(Failed $event): void
    {
        $email = $event->credentials['email'] ?? null;
        $userId = $event->user?->getAuthIdentifier();

        LoginAttempt::create([
            'user_id' => $userId,
            'email' => $email,
            'guard' => $event->guard,
            'succeeded' => false,
            'ip_address' => request()->ip(),
            'user_agent' => (string) request()->userAgent(),
            'created_at' => now(),
        ]);
    }
}
