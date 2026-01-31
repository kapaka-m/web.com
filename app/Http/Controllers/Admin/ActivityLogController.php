<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index()
    {
        $logs = ActivityLog::query()
            ->with('user')
            ->latest()
            ->paginate(15)
            ->through(fn(ActivityLog $log) => [
                'id' => $log->id,
                'action' => $log->action,
                'user' => $log->user ? [
                    'id' => $log->user->id,
                    'name' => $log->user->name,
                    'email' => $log->user->email,
                ] : null,
                'subject_type' => $log->subject_type ? class_basename($log->subject_type) : null,
                'subject_id' => $log->subject_id,
                'properties' => $log->properties,
                'created_at' => $log->created_at->toDateTimeString(),
            ]);

        return Inertia::render('Admin/ActivityLogs/Index', [
            'logs' => $logs,
        ]);
    }
}
