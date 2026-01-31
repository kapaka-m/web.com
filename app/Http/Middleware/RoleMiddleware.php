<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();

        if (!$user || (!empty($roles) && !in_array($user->role, $roles, true))) {
            abort(403);
        }

        return $next($request);
    }
}
