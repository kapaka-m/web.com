// MOHAMED HASSANIN (KAPAKA)
import { resolveImageUrl } from '@/Support/resolveImageUrl';
import { useMemo, useState } from 'react';

export default function ResponsiveImage({
    src,
    alt = '',
    className = '',
    srcSet = null,
    sizes = '100vw',
    loading = 'lazy',
    decoding = 'async',
    onLoad,
    ...props
}) {
    const [loaded, setLoaded] = useState(false);
    const resolvedSrc = useMemo(() => resolveImageUrl(src), [src]);
    const resolvedSrcSet = typeof srcSet === 'string' ? srcSet : null;

    if (!resolvedSrc) {
        return null;
    }

    const handleLoad = (event) => {
        setLoaded(true);
        if (onLoad) {
            onLoad(event);
        }
    };

    return (
        <img
            src={resolvedSrc}
            srcSet={resolvedSrcSet || undefined}
            sizes={resolvedSrcSet ? sizes : undefined}
            loading={loading}
            decoding={decoding}
            onLoad={handleLoad}
            className={`${className} img-blur${loaded ? ' is-loaded' : ''}`}
            {...props}
        />
    );
}
