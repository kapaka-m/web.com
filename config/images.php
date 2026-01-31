<?php
// MOHAMED HASSANIN (KAPAKA)

return [
    'disk' => env('IMAGE_DISK', 'public'),
    'directory' => env('IMAGE_DIRECTORY', 'uploads'),
    'responsive_widths' => array_values(array_filter(array_map(
        'intval',
        explode(',', env('IMAGE_RESPONSIVE_WIDTHS', '320,640,960,1280,1600'))
    ))),
    'max_width' => (int) env('IMAGE_MAX_WIDTH', 1920),
    'max_pixels' => (int) env('IMAGE_MAX_PIXELS', 24000000),
    'quality' => (int) env('IMAGE_QUALITY', 82),
    'png_compression' => (int) env('IMAGE_PNG_COMPRESSION', 8),
    'allowed_mimes' => [
        'image/jpeg',
        'image/png',
        'image/webp',
    ],
    'watermark' => [
        'enabled' => (bool) env('IMAGE_WATERMARK_ENABLED', false),
        'path' => env('IMAGE_WATERMARK_PATH', 'watermark.png'),
        'position' => env('IMAGE_WATERMARK_POSITION', 'bottom-right'),
        'opacity' => (int) env('IMAGE_WATERMARK_OPACITY', 30),
        'scale' => (float) env('IMAGE_WATERMARK_SCALE', 0.2),
        'padding' => (int) env('IMAGE_WATERMARK_PADDING', 24),
    ],
    'av_scan' => [
        'enabled' => (bool) env('IMAGE_AV_SCAN_ENABLED', false),
        'binary' => env('IMAGE_AV_SCAN_BINARY', 'clamscan'),
        'timeout' => (int) env('IMAGE_AV_SCAN_TIMEOUT', 10),
    ],
    'cdn_url' => env('IMAGE_CDN_URL'),
    'cache_max_age' => (int) env('IMAGE_CACHE_MAX_AGE', 31536000),
];
