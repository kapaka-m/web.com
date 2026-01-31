<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploader
{
    public static function store(UploadedFile $file, string $folder, string $field = 'file'): string
    {
        $extension = ImageSecurity::assertSafe($file, $field);

        $disk = config('images.disk', 'public');
        $baseDirectory = trim((string) config('images.directory', 'uploads'), '/');
        $folder = trim($folder, '/');
        $directory = $folder === '' ? $baseDirectory : $baseDirectory . '/' . $folder;

        Storage::disk($disk)->makeDirectory($directory);

        $filename = Str::uuid()->toString() . '.' . $extension;
        $path = $directory . '/' . $filename;

        if (!self::canProcess($extension)) {
            Storage::disk($disk)->put($path, file_get_contents($file->getPathname()));
            return $path;
        }

        self::processAndStore($file->getPathname(), $path, $extension, $disk);

        return $path;
    }

    public static function delete(?string $path): void
    {
        ImageVariants::deleteAll($path);
    }

    private static function processAndStore(string $sourcePath, string $path, string $extension, string $disk): void
    {
        $quality = (int) config('images.quality', 82);
        $pngCompression = (int) config('images.png_compression', 8);
        $maxWidth = (int) config('images.max_width', 1920);
        $variantWidths = ImageVariants::variantWidths();

        $source = self::createImageResource($sourcePath, $extension);
        if (!$source) {
            Storage::disk($disk)->put($path, file_get_contents($sourcePath));
            return;
        }

        $width = imagesx($source);
        $height = imagesy($source);
        $targetWidth = $maxWidth > 0 ? min($width, $maxWidth) : $width;
        $targetHeight = $width > 0
            ? (int) round($height * ($targetWidth / $width))
            : $height;

        $main = self::resizeImage($source, $width, $height, $targetWidth, $targetHeight, $extension);
        self::applyWatermark($main);
        self::saveImage($main, $path, $extension, $quality, $pngCompression, $disk);

        foreach ($variantWidths as $variantWidth) {
            if ($variantWidth >= $targetWidth) {
                continue;
            }

            $variantHeight = $width > 0
                ? (int) round($height * ($variantWidth / $width))
                : $height;
            $variant = self::resizeImage($source, $width, $height, $variantWidth, $variantHeight, $extension);
            self::applyWatermark($variant);
            self::saveImage(
                $variant,
                ImageVariants::variantPath($path, $variantWidth),
                $extension,
                $quality,
                $pngCompression,
                $disk
            );
            imagedestroy($variant);
        }

        imagedestroy($main);
        imagedestroy($source);
    }

    private static function createImageResource(string $path, string $extension)
    {
        return match ($extension) {
            'jpg' => imagecreatefromjpeg($path),
            'png' => imagecreatefrompng($path),
            'webp' => imagecreatefromwebp($path),
            default => null,
        };
    }

    private static function resizeImage(
        $source,
        int $sourceWidth,
        int $sourceHeight,
        int $targetWidth,
        int $targetHeight,
        string $extension
    ) {
        $target = imagecreatetruecolor($targetWidth, $targetHeight);

        if (in_array($extension, ['png', 'webp'], true)) {
            imagealphablending($target, false);
            imagesavealpha($target, true);
            $transparent = imagecolorallocatealpha($target, 0, 0, 0, 127);
            imagefilledrectangle($target, 0, 0, $targetWidth, $targetHeight, $transparent);
        }

        imagecopyresampled(
            $target,
            $source,
            0,
            0,
            0,
            0,
            $targetWidth,
            $targetHeight,
            $sourceWidth,
            $sourceHeight
        );

        return $target;
    }

    private static function saveImage(
        $image,
        string $path,
        string $extension,
        int $quality,
        int $pngCompression,
        string $disk
    ): void {
        $fullPath = Storage::disk($disk)->path($path);
        $directory = dirname($fullPath);
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        if ($extension === 'png') {
            imagepng($image, $fullPath, $pngCompression);
            return;
        }

        if ($extension === 'webp') {
            imagewebp($image, $fullPath, $quality);
            return;
        }

        imagejpeg($image, $fullPath, $quality);
    }

    private static function applyWatermark($image): void
    {
        $config = config('images.watermark', []);
        if (empty($config['enabled'])) {
            return;
        }

        $path = self::resolveWatermarkPath($config['path'] ?? null);
        if (!$path) {
            return;
        }

        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        if (!self::canProcess($extension)) {
            return;
        }

        $watermark = self::createImageResource($path, $extension);
        if (!$watermark) {
            return;
        }

        $imageWidth = imagesx($image);
        $imageHeight = imagesy($image);
        $watermarkWidth = imagesx($watermark);
        $watermarkHeight = imagesy($watermark);

        $scale = (float) ($config['scale'] ?? 0.2);
        $padding = (int) ($config['padding'] ?? 24);
        $targetWidth = max(1, (int) round($imageWidth * $scale));
        $targetHeight = $watermarkWidth > 0
            ? (int) round($watermarkHeight * ($targetWidth / $watermarkWidth))
            : $watermarkHeight;

        $resized = self::resizeImage(
            $watermark,
            $watermarkWidth,
            $watermarkHeight,
            $targetWidth,
            $targetHeight,
            $extension
        );

        [$x, $y] = self::resolveWatermarkPosition(
            $config['position'] ?? 'bottom-right',
            $imageWidth,
            $imageHeight,
            $targetWidth,
            $targetHeight,
            $padding
        );

        $opacity = (int) ($config['opacity'] ?? 100);
        $opacity = max(0, min(100, $opacity));

        if ($opacity < 100) {
            imagecopymerge(
                $image,
                $resized,
                $x,
                $y,
                0,
                0,
                $targetWidth,
                $targetHeight,
                $opacity
            );
        } else {
            imagecopy($image, $resized, $x, $y, 0, 0, $targetWidth, $targetHeight);
        }

        imagedestroy($resized);
        imagedestroy($watermark);
    }

    private static function resolveWatermarkPosition(
        string $position,
        int $imageWidth,
        int $imageHeight,
        int $watermarkWidth,
        int $watermarkHeight,
        int $padding
    ): array {
        return match ($position) {
            'top-left' => [$padding, $padding],
            'top-right' => [$imageWidth - $watermarkWidth - $padding, $padding],
            'bottom-left' => [$padding, $imageHeight - $watermarkHeight - $padding],
            'center' => [
                (int) round(($imageWidth - $watermarkWidth) / 2),
                (int) round(($imageHeight - $watermarkHeight) / 2),
            ],
            default => [
                $imageWidth - $watermarkWidth - $padding,
                $imageHeight - $watermarkHeight - $padding,
            ],
        };
    }

    private static function resolveWatermarkPath(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        if (is_file($path)) {
            return $path;
        }

        $storagePath = storage_path('app/' . $path);
        if (is_file($storagePath)) {
            return $storagePath;
        }

        $publicPath = public_path($path);
        if (is_file($publicPath)) {
            return $publicPath;
        }

        return null;
    }

    private static function canProcess(string $extension): bool
    {
        return match ($extension) {
            'jpg' => function_exists('imagecreatefromjpeg') && function_exists('imagejpeg'),
            'png' => function_exists('imagecreatefrompng') && function_exists('imagepng'),
            'webp' => function_exists('imagecreatefromwebp') && function_exists('imagewebp'),
            default => false,
        };
    }
}
