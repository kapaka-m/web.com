{{-- MOHAMED HASSANIN (KAPAKA) --}}
@php
    $locale = app()->getLocale();
    $dir = $locale === 'ar' ? 'rtl' : 'ltr';
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', $locale) }}" dir="{{ $dir }}" data-locale="{{ $locale }}" data-dir="{{ $dir }}">
    <head>
        <meta charset="utf-8">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        @php
            $imageSettings = [
                'cdnUrl' => config('images.cdn_url'),
                'variantWidths' => config('images.responsive_widths', []),
            ];
        @endphp
        <script>
            window.__IMAGE_SETTINGS__ = @json($imageSettings);
        </script>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=cairo:300,400,600,700|tajawal:400,500,700|manrope:400,500,600,700|space-grotesk:400,500,600,700&display=swap" rel="stylesheet" />

        <!-- Bootstrap -->
        @if ($dir === 'rtl')
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.rtl.min.css" rel="stylesheet" />
        @else
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" />
        @endif
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.min.css" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="antialiased">
        @inertia
        <script defer src="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/highlight.min.js"></script>
        <script>
            const highlightBlocks = () => {
                if (window.hljs) {
                    window.hljs.highlightAll();
                }
            };
            document.addEventListener('DOMContentLoaded', highlightBlocks);
            document.addEventListener('inertia:finish', highlightBlocks);
        </script>
    </body>
</html>
