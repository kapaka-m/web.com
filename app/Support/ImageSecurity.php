<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Validation\ValidationException;
use Symfony\Component\Process\Process;

class ImageSecurity
{
    public static function assertSafe(UploadedFile $file, string $field = 'file'): string
    {
        if (!$file->isValid()) {
            throw ValidationException::withMessages([
                $field => 'Upload failed. Please try again.',
            ]);
        }

        $path = $file->getPathname();
        $imageInfo = @getimagesize($path);
        if (!$imageInfo || empty($imageInfo['mime'])) {
            throw ValidationException::withMessages([
                $field => 'The uploaded file is not a valid image.',
            ]);
        }

        $mime = $imageInfo['mime'];
        $allowed = config('images.allowed_mimes', []);
        if (!in_array($mime, $allowed, true)) {
            throw ValidationException::withMessages([
                $field => 'Unsupported image type.',
            ]);
        }

        $maxPixels = (int) config('images.max_pixels', 0);
        if ($maxPixels > 0) {
            $width = (int) ($imageInfo[0] ?? 0);
            $height = (int) ($imageInfo[1] ?? 0);
            if ($width > 0 && $height > 0 && ($width * $height) > $maxPixels) {
                throw ValidationException::withMessages([
                    $field => 'Image dimensions are too large.',
                ]);
            }
        }

        self::scanFile($path, $field);

        return self::extensionForMime($mime);
    }

    private static function extensionForMime(string $mime): string
    {
        return match ($mime) {
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            default => 'jpg',
        };
    }

    private static function scanFile(string $path, string $field): void
    {
        $enabled = (bool) config('images.av_scan.enabled', false);
        if (!$enabled) {
            return;
        }

        $binary = (string) config('images.av_scan.binary', 'clamscan');
        $timeout = (int) config('images.av_scan.timeout', 10);

        $process = new Process([$binary, '--no-summary', $path]);
        $process->setTimeout($timeout);
        $process->run();

        if (!$process->isSuccessful()) {
            $exitCode = $process->getExitCode();
            $message = $exitCode === 1
                ? 'Upload blocked by security scan.'
                : 'Security scan failed. Please try again.';

            throw ValidationException::withMessages([
                $field => $message,
            ]);
        }
    }
}
