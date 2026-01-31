// MOHAMED HASSANIN (KAPAKA)
const getImageSettings = () => {
    if (typeof window === 'undefined') {
        return {};
    }

    return window.__IMAGE_SETTINGS__ || {};
};

const normalizeCdnUrl = (value) => {
    const normalized = String(value || '').trim();
    return normalized === '' ? null : normalized.replace(/\/+$/, '');
};

const normalizeLocalPath = (value) => {
    let normalized = String(value || '').trim();
    normalized = normalized.replace(/^\/+/, '');

    if (normalized.startsWith('storage/')) {
        return normalized;
    }

    if (normalized.startsWith('uploads/')) {
        return `storage/${normalized}`;
    }

    return `storage/${normalized}`;
};

const resolveCdnUrl = (path) => {
    const cdnUrl = normalizeCdnUrl(getImageSettings().cdnUrl);
    if (!cdnUrl) {
        return null;
    }

    const normalizedPath = normalizeLocalPath(path);
    if (cdnUrl.endsWith('/storage')) {
        const trimmedPath = normalizedPath.startsWith('storage/')
            ? normalizedPath.slice('storage/'.length)
            : normalizedPath;
        return `${cdnUrl}/${trimmedPath}`;
    }

    return `${cdnUrl}/${normalizedPath}`;
};

export function resolveImageUrl(path) {
    if (!path) {
        return null;
    }

    const normalized = String(path).trim();

    if (
        normalized.startsWith('http://') ||
        normalized.startsWith('https://') ||
        normalized.startsWith('//') ||
        normalized.startsWith('data:') ||
        normalized.startsWith('blob:')
    ) {
        return normalized;
    }

    const cdnUrl = resolveCdnUrl(normalized);
    if (cdnUrl) {
        return cdnUrl;
    }

    if (normalized.startsWith('/')) {
        return normalized;
    }

    if (normalized.startsWith('storage/')) {
        return `/${normalized}`;
    }

    if (normalized.startsWith('uploads/')) {
        return `/storage/${normalized}`;
    }

    return `/storage/${normalized}`;
}

export function resolveAbsoluteUrl(path, appUrl) {
    const resolved = resolveImageUrl(path);

    if (!resolved) {
        return null;
    }

    if (resolved.startsWith('http://') || resolved.startsWith('https://')) {
        return resolved;
    }

    if (!appUrl) {
        return resolved;
    }

    const base = appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl;

    if (resolved.startsWith('/')) {
        return `${base}${resolved}`;
    }

    return `${base}/${resolved}`;
}
