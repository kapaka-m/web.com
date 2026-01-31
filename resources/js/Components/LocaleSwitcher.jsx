// MOHAMED HASSANIN (KAPAKA)
import { Link, router, usePage } from '@inertiajs/react';

const buildLocaleUrl = (url, locale, supported) => {
    const [path, query = ''] = (url || '').split('?');
    const segments = (path || '')
        .split('/')
        .filter((segment) => segment.length > 0);

    if (segments.length && supported.includes(segments[0])) {
        segments[0] = locale;
    } else {
        segments.unshift(locale);
    }

    return `/${segments.join('/')}${query ? `?${query}` : ''}`;
};

const localeLabel = (code) => {
    if (code === 'ar') {
        return 'العربية';
    }
    if (code === 'en') {
        return 'English';
    }
    return code.toUpperCase();
};

export default function LocaleSwitcher({ className = '' }) {
    const page = usePage();
    const locale = page.props.locale;
    const url = page.url || '';
    const supportedLocales = page.props.supportedLocales || ['ar', 'en'];
    const currentLocale = supportedLocales.includes(locale)
        ? locale
        : supportedLocales[0] || 'en';

    if (supportedLocales.length <= 2) {
        const targetLocale =
            currentLocale === supportedLocales[0]
                ? supportedLocales[1] || supportedLocales[0]
                : supportedLocales[0];
        const href = buildLocaleUrl(url, targetLocale, supportedLocales);

        return (
            <Link
                href={href}
                className={`btn btn-sm btn-outline-secondary ${className}`}
            >
                {localeLabel(targetLocale)}
            </Link>
        );
    }

    return (
        <select
            className={`form-select form-select-sm ${className}`}
            value={currentLocale}
            onChange={(event) => {
                const target = event.target.value;
                if (target === currentLocale) {
                    return;
                }
                const href = buildLocaleUrl(url, target, supportedLocales);
                router.visit(href);
            }}
        >
            {supportedLocales.map((code) => (
                <option key={code} value={code}>
                    {localeLabel(code)}
                </option>
            ))}
        </select>
    );
}
