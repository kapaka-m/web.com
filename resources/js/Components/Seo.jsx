// MOHAMED HASSANIN (KAPAKA)
import { Head, usePage } from '@inertiajs/react';
import { resolveAbsoluteUrl } from '@/Support/resolveImageUrl';

const normalizeString = (value) => {
    const normalized = String(value || '').trim();
    return normalized === '' ? null : normalized;
};

const normalizeTwitterHandle = (handle) => {
    const normalized = normalizeString(handle);
    if (!normalized) {
        return null;
    }
    return normalized.startsWith('@') ? normalized : `@${normalized}`;
};

const resolveCanonicalUrl = (value, appUrl) => {
    if (!value) {
        return '';
    }

    const base =
        appUrl || (typeof window !== 'undefined' ? window.location.origin : '');

    try {
        const url = base ? new URL(value, base) : new URL(value);
        url.hash = '';

        const params = new URLSearchParams(url.search);
        for (const key of Array.from(params.keys())) {
            if (key.toLowerCase().startsWith('utm_')) {
                params.delete(key);
            }
        }

        url.search = params.toString();
        return url.toString();
    } catch {
        return value;
    }
};

const resolvePageUrl = (value, pageUrl, appUrl) => {
    if (value) {
        return value;
    }

    if (pageUrl) {
        const base =
            appUrl || (typeof window !== 'undefined' ? window.location.origin : '');
        if (base) {
            try {
                return new URL(pageUrl, base).toString();
            } catch {
                return pageUrl;
            }
        }
        return pageUrl;
    }

    if (typeof window !== 'undefined') {
        return window.location.href;
    }

    return '';
};

export default function Seo({
    title,
    description,
    image,
    url,
    type = 'website',
    noIndex = false,
    robots = null,
    schema = null,
    pageKey = null,
}) {
    const page = usePage();
    const { locale, appUrl, site } = page.props;
    const pageSeo = pageKey ? site?.seo?.pages?.[pageKey] : null;
    const ogLocale = locale === 'ar' ? 'ar_AR' : 'en_US';

    const resolvedTitle =
        pageSeo?.meta_title ||
        title ||
        site?.seo?.meta_title ||
        site?.site_name ||
        '';
    const resolvedDescription =
        pageSeo?.meta_description ||
        description ||
        site?.seo?.meta_description ||
        site?.tagline ||
        '';

    const resolvedUrl = resolvePageUrl(url, page.url, appUrl);
    const canonicalUrl = resolveCanonicalUrl(resolvedUrl, appUrl);
    const resolvedImage = resolveAbsoluteUrl(
        image || pageSeo?.og_image || site?.seo?.default_og_image,
        appUrl,
    );
    const robotsContent =
        normalizeString(robots) ||
        normalizeString(pageSeo?.robots) ||
        (noIndex ? 'noindex,nofollow' : null);
    const twitterHandle = normalizeTwitterHandle(site?.seo?.twitter_handle);
    const siteName = normalizeString(site?.site_name);

    const resolvedSchema = Array.isArray(schema)
        ? { '@context': 'https://schema.org', '@graph': schema }
        : schema;

    return (
        <Head title={resolvedTitle}>
            {resolvedDescription && (
                <meta name="description" content={resolvedDescription} />
            )}
            {robotsContent && (
                <meta name="robots" content={robotsContent} />
            )}
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
            <meta property="og:title" content={resolvedTitle} />
            {resolvedDescription && (
                <meta property="og:description" content={resolvedDescription} />
            )}
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
            {siteName && <meta property="og:site_name" content={siteName} />}
            <meta property="og:type" content={type} />
            <meta property="og:locale" content={ogLocale} />
            {resolvedImage && (
                <meta property="og:image" content={resolvedImage} />
            )}
            <meta
                name="twitter:card"
                content={resolvedImage ? 'summary_large_image' : 'summary'}
            />
            {twitterHandle && (
                <meta name="twitter:site" content={twitterHandle} />
            )}
            <meta name="twitter:title" content={resolvedTitle} />
            {resolvedDescription && (
                <meta name="twitter:description" content={resolvedDescription} />
            )}
            {resolvedImage && (
                <meta name="twitter:image" content={resolvedImage} />
            )}
            {resolvedSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(resolvedSchema),
                    }}
                />
            )}
        </Head>
    );
}
