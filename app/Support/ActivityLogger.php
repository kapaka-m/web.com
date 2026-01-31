<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Support;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ActivityLogger
{
    private const DEFAULT_IGNORED_KEYS = [
        'created_at',
        'updated_at',
        'deleted_at',
        'password',
        'remember_token',
    ];

    public static function log(
        Request $request,
        string $action,
        ?Model $subject = null,
        array $properties = []
    ): void {
        ActivityLog::create([
            'user_id' => $request->user()?->id,
            'action' => $action,
            'subject_type' => $subject ? $subject::class : null,
            'subject_id' => $subject?->getKey(),
            'properties' => $properties,
            'ip_address' => $request->ip(),
            'user_agent' => (string) $request->userAgent(),
        ]);
    }

    public static function logWithDiff(
        Request $request,
        string $action,
        ?Model $subject = null,
        array $before = [],
        array $after = [],
        array $properties = [],
        array $ignoredKeys = []
    ): void {
        $diff = self::buildDiff($before, $after, $ignoredKeys);

        self::log($request, $action, $subject, array_merge($properties, [
            'diff' => $diff,
        ]));
    }

    private static function buildDiff(array $before, array $after, array $ignoredKeys = []): array
    {
        $ignore = array_flip(array_merge(self::DEFAULT_IGNORED_KEYS, $ignoredKeys));
        $keys = array_unique(array_merge(array_keys($before), array_keys($after)));
        $diff = [];

        foreach ($keys as $key) {
            if (isset($ignore[$key])) {
                continue;
            }

            $beforeValue = $before[$key] ?? null;
            $afterValue = $after[$key] ?? null;

            if (is_array($beforeValue) && is_array($afterValue)) {
                $nested = self::buildDiff($beforeValue, $afterValue, $ignoredKeys);
                if (!empty($nested)) {
                    $diff[$key] = $nested;
                }
                continue;
            }

            $normalizedBefore = self::normalizeValue($beforeValue);
            $normalizedAfter = self::normalizeValue($afterValue);

            if ($normalizedBefore !== $normalizedAfter) {
                $diff[$key] = [
                    'from' => $normalizedBefore,
                    'to' => $normalizedAfter,
                ];
            }
        }

        return $diff;
    }

    private static function normalizeValue($value)
    {
        if ($value instanceof \DateTimeInterface) {
            return $value->format('Y-m-d H:i:s');
        }

        if (is_array($value)) {
            return array_map([self::class, 'normalizeValue'], $value);
        }

        return $value;
    }
}
