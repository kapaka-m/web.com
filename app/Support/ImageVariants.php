<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Support;

use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;

class ImageVariants
{
    public static function srcSet(?string $path): ?string
    {
        $normalized = self::normalizePath($path);
        if (!$normalized) {
            return null;
        }

        $disk = config('images.disk', 'public');
        /** @var FilesystemAdapter $diskAdapter */
        $diskAdapter = Storage::disk($disk);
        $widths = self::variantWidths();
        if (empty($widths)) {
            return null;
        }

        $entries = [];
        foreach ($widths as $width) {
            $variant = self::variantPath($normalized, $width);
            if ($diskAdapter->exists($variant)) {
                $entries[] = $diskAdapter->url($variant) . ' ' . $width . 'w';
            }
        }

        return $entries ? implode(', ', $entries) : null;
    }

    public static function deleteAll(?string $path): void
    {
        $normalized = self::normalizePath($path);
        if (!$normalized) {
            return;
        }

        $disk = config('images.disk', 'public');
        $paths = [$normalized];
        foreach (self::variantWidths() as $width) {
            $paths[] = self::variantPath($normalized, $width);
        }

        Storage::disk($disk)->delete($paths);
    }

    public static function variantPath(string $path, int $width): string
    {
        $dotPosition = strrpos($path, '.');
        if ($dotPosition === false) {
            return $path . '-w' . $width;
        }

        $name = substr($path, 0, $dotPosition);
        $extension = substr($path, $dotPosition);

        return $name . '-w' . $width . $extension;
    }

    public static function variantWidths(): array
    {
        $widths = config('images.responsive_widths', []);
        if (!is_array($widths)) {
            return [];
        }

        $widths = array_map('intval', $widths);
        $widths = array_filter($widths, static fn($width) => $width > 0);
        $widths = array_values(array_unique($widths));
        sort($widths);

        return $widths;
    }

    private static function normalizePath(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        $value = trim((string) $path);
        if ($value === '') {
            return null;
        }

        $lower = strtolower($value);
        if (
            str_starts_with($lower, 'http://') ||
            str_starts_with($lower, 'https://') ||
            str_starts_with($lower, '//') ||
            str_starts_with($lower, 'data:') ||
            str_starts_with($lower, 'blob:')
        ) {
            return null;
        }

        $value = ltrim($value, '/');

        if (str_starts_with($value, 'storage/')) {
            $value = substr($value, strlen('storage/'));
        }

        return $value === '' ? null : $value;
    }
}
