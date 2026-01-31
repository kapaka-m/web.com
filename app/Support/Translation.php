<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Support;

class Translation
{
    public static function get($value, string $locale, ?string $fallback = null)
    {
        $fallback = $fallback ?? config('app.fallback_locale', 'en');
        if (is_string($value) || $value === null) {
            return $value;
        }

        if (!is_array($value)) {
            return $value;
        }

        if (array_key_exists($locale, $value)) {
            return $value[$locale];
        }

        if (array_key_exists($fallback, $value)) {
            return $value[$fallback];
        }

        return count($value) ? reset($value) : null;
    }

    public static function map(array $items, string $locale, ?string $fallback = null): array
    {
        return array_map(static fn($item) => self::get($item, $locale, $fallback), $items);
    }
}
