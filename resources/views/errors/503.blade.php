{{-- MOHAMED HASSANIN (KAPAKA) --}}
@php
    $locale = app()->getLocale();
    $locale = in_array($locale, ['ar', 'en']) ? $locale : config('app.locale');
    $dir = $locale === 'ar' ? 'rtl' : 'ltr';
@endphp
<!DOCTYPE html>
<html lang="{ str_replace('_', '-', $locale) }" dir="{ $dir }">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>503 - { $locale === 'ar' ? 'الموقع تحت الصيانة' : 'We will be back soon' }</title>
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=cairo:300,400,600,700|tajawal:400,500,700|manrope:400,500,600,700|space-grotesk:400,500,600,700&display=swap" rel="stylesheet" />
        @if ($dir === 'rtl')
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.rtl.min.css" rel="stylesheet" />
        @else
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" />
        @endif
        @vite('resources/css/app.css')
    </head>
    <body class="antialiased">
        <div class="min-vh-100 d-flex align-items-center py-5">
            <div class="container">
                <div class="content-card text-center">
                    <div class="display-3 fw-bold mb-3">503</div>
                    <h1 class="h3 mb-3">
                        { $locale === 'ar' ? 'الموقع تحت الصيانة' : 'We will be back soon' }
                    </h1>
                    <p class="text-muted mb-4">
                        { $locale === 'ar' ? 'نقوم ببعض التحسينات الآن. سنعود قريباً.' : 'We are performing maintenance. We will be back shortly.' }
                    </p>
                    <a class="btn btn-primary" href="{ route('home', ['locale' => $locale]) }">
                        { $locale === 'ar' ? 'العودة للرئيسية' : 'Back to Home' }
                    </a>
                </div>
            </div>
        </div>
    </body>
</html>
