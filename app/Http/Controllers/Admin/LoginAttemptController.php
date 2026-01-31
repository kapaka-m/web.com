<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LoginAttempt;
use Inertia\Inertia;

class LoginAttemptController extends Controller
{
    public function index()
    {
        $attempts = LoginAttempt::query()
            ->latest('created_at')
            ->paginate(20)
            ->through(fn(LoginAttempt $attempt) => [
                'id' => $attempt->id,
                'email' => $attempt->email,
                'user_id' => $attempt->user_id,
                'guard' => $attempt->guard,
                'succeeded' => $attempt->succeeded,
                'ip_address' => $attempt->ip_address,
                'created_at' => optional($attempt->created_at)->toDateTimeString(),
            ]);

        return Inertia::render('Admin/LoginAttempts/Index', [
            'attempts' => $attempts,
        ]);
    }
}
