<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $database = 'unknown';
        $status = 'ok';
        $http = 200;

        try {
            DB::connection()->getPdo();
            $database = 'ok';
        } catch (\Throwable $e) {
            $database = 'error';
            $status = 'error';
            $http = 503;
        }

        return response()->json([
            'status' => $status,
            'timestamp' => now()->toIso8601String(),
            'database' => $database,
            'app' => config('app.name'),
        ], $http);
    }
}
