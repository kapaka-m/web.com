// MOHAMED HASSANIN (KAPAKA)
import LanguageTabs from '@/Components/LanguageTabs';
import RichTextEditor from '@/Components/RichTextEditor';
import { resolveImageUrl } from '@/Support/resolveImageUrl';
import { translateText } from '@/Support/translate';
import { usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function PostForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    submitLabel,
    locale,
    categories = [],
    tagsOptions = [],
    previewUrl = null,
    autosaveUrl = null,
    autosaveExistingUrl = null,
    onDraftSaved = null,
    reviewStatusOptions = [],
}) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.role === 'admin';
    const [translateStatus, setTranslateStatus] = useState(null);
    const [translationBusy, setTranslationBusy] = useState(false);

    const robotsOptions = [
        { value: '', label: 'Default (index,follow)' },
        { value: 'index,follow', label: 'index,follow' },
        { value: 'noindex,nofollow', label: 'noindex,nofollow' },
        { value: 'noindex,follow', label: 'noindex,follow' },
        { value: 'index,nofollow', label: 'index,nofollow' },
    ];

    const allowedReviewOptions = useMemo(() => {
        if (!reviewStatusOptions?.length) {
            return [];
        }
        if (isAdmin) {
            return reviewStatusOptions;
        }
        return reviewStatusOptions.filter((option) => option !== 'approved');
    }, [isAdmin, reviewStatusOptions]);

    const hasImage = Boolean(data.cover_image);
    const [localPreviewUrl, setLocalPreviewUrl] = useState(null);
    const previewImage =
        localPreviewUrl ||
        (data.remove_cover_image ? null : resolveImageUrl(data.cover_image));

    useEffect(() => {
        if (!data.cover_image_file) {
            setLocalPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(data.cover_image_file);
        setLocalPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [data.cover_image_file]);

    const autosaveTarget = autosaveExistingUrl || autosaveUrl;
    const autosaveTimer = useRef(null);
    const autosaveInit = useRef(false);
    const [autosaveStatus, setAutosaveStatus] = useState(null);

    useEffect(() => {
        if (!autosaveTarget) {
            return undefined;
        }

        if (!autosaveInit.current) {
            autosaveInit.current = true;
            return undefined;
        }

        if (autosaveTimer.current) {
            clearTimeout(autosaveTimer.current);
        }

        autosaveTimer.current = setTimeout(async () => {
            const hasDraftContent = [
                data.title_ar,
                data.title_en,
                data.excerpt_ar,
                data.excerpt_en,
                data.content_ar,
                data.content_en,
                data.content_markdown_ar,
                data.content_markdown_en,
            ].some((value) => String(value || '').trim() !== '');

            if (!hasDraftContent) {
                return;
            }

            const token = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content');

            const payload = {
                title_ar: data.title_ar,
                title_en: data.title_en,
                slug: data.slug,
                excerpt_ar: data.excerpt_ar,
                excerpt_en: data.excerpt_en,
                content_ar: data.content_ar,
                content_en: data.content_en,
                content_markdown_ar: data.content_markdown_ar,
                content_markdown_en: data.content_markdown_en,
                use_markdown: data.use_markdown,
                category_id: data.category_id || null,
                tags: data.tags || '',
            };

            setAutosaveStatus(
                locale === 'ar' ? '???? ????? ????????...' : 'Autosaving...',
            );

            const response = await fetch(autosaveTarget, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'X-CSRF-TOKEN': token } : {}),
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result = await response.json();
                if (result?.post_id && onDraftSaved) {
                    onDraftSaved(result.post_id);
                }
                setAutosaveStatus(
                    locale === 'ar'
                        ? '?? ??? ??????? ???????'
                        : 'Draft saved',
                );
            } else {
                setAutosaveStatus(
                    locale === 'ar' ? '??? ????? ????????' : 'Autosave failed',
                );
            }
        }, 1200);

        return () => {
            if (autosaveTimer.current) {
                clearTimeout(autosaveTimer.current);
            }
        };
    }, [
        autosaveTarget,
        data.title_ar,
        data.title_en,
        data.slug,
        data.excerpt_ar,
        data.excerpt_en,
        data.content_ar,
        data.content_en,
        data.content_markdown_ar,
        data.content_markdown_en,
        data.use_markdown,
        data.category_id,
        data.tags,
        locale,
        onDraftSaved,
    ]);

    const stripHtml = (value) =>
        String(value || '').replace(/<[^>]*>/g, ' ').trim();

    const translateFields = async (source, target) => {
        if (translationBusy) {
            return;
        }

        const contentSourceKey = data.use_markdown
            ? `content_markdown_${source}`
            : `content_${source}`;
        const contentTargetKey = data.use_markdown
            ? `content_markdown_${target}`
            : `content_${target}`;

        const pairs = [
            { from: `title_${source}`, to: `title_${target}` },
            { from: `excerpt_${source}`, to: `excerpt_${target}` },
            {
                from: contentSourceKey,
                to: contentTargetKey,
                strip: !data.use_markdown,
            },
            { from: `seo_meta_title_${source}`, to: `seo_meta_title_${target}` },
            {
                from: `seo_meta_description_${source}`,
                to: `seo_meta_description_${target}`,
            },
        ];

        setTranslationBusy(true);
        setTranslateStatus(
            locale === 'ar' ? '???? ???????...' : 'Translating...',
        );

        try {
            const updates = {};
            for (const pair of pairs) {
                const sourceValue = data[pair.from];
                const targetValue = data[pair.to];

                if (!sourceValue || String(sourceValue).trim() === '') {
                    continue;
                }

                if (targetValue && String(targetValue).trim() !== '') {
                    continue;
                }

                const text = pair.strip ? stripHtml(sourceValue) : sourceValue;
                const translated = await translateText({
                    text,
                    source,
                    target,
                });

                if (translated) {
                    updates[pair.to] = translated;
                }
            }

            Object.entries(updates).forEach(([key, value]) =>
                setData(key, value),
            );

            setTranslateStatus(
                Object.keys(updates).length
                    ? locale === 'ar'
                        ? '??? ???????.'
                        : 'Translation ready.'
                    : locale === 'ar'
                    ? '?? ???? ?? ???????.'
                    : 'Nothing to translate.',
            );
        } catch (error) {
            setTranslateStatus(
                locale === 'ar' ? '???? ???????.' : 'Translation failed.',
            );
        } finally {
            setTranslationBusy(false);
            setTimeout(() => setTranslateStatus(null), 2500);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="row g-3">
                <div className="col-md-4">
                    <label className="form-label">Slug</label>
                    <input
                        className={`form-control ${errors.slug ? 'is-invalid' : ''}`}
                        value={data.slug || ''}
                        onChange={(event) => setData('slug', event.target.value)}
                    />
                    {errors.slug && (
                        <div className="invalid-feedback">{errors.slug}</div>
                    )}
                </div>
                <div className="col-md-4">
                    <label className="form-label">
                        {locale === 'ar' ? '????? ?????' : 'Publish Date'}
                    </label>
                    <input
                        type="date"
                        className={`form-control ${
                            errors.published_at ? 'is-invalid' : ''
                        }`}
                        value={data.published_at || ''}
                        onChange={(event) =>
                            setData('published_at', event.target.value)
                        }
                    />
                    {errors.published_at && (
                        <div className="invalid-feedback">
                            {errors.published_at}
                        </div>
                    )}
                </div>
                <div className="col-md-4 d-flex align-items-center">
                    <div className="form-check mt-4">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={data.is_published}
                            onChange={(event) =>
                                setData('is_published', event.target.checked)
                            }
                            id="post-published"
                        />
                        <label className="form-check-label" htmlFor="post-published">
                            {locale === 'ar' ? '?????' : 'Published'}
                        </label>
                    </div>
                </div>
                {allowedReviewOptions.length > 0 && (
                    <div className="col-md-4">
                        <label className="form-label">
                            {locale === 'ar' ? '???? ????????' : 'Review Status'}
                        </label>
                        <select
                            className={`form-select ${
                                errors.review_status ? 'is-invalid' : ''
                            }`}
                            value={data.review_status || ''}
                            onChange={(event) =>
                                setData('review_status', event.target.value)
                            }
                        >
                            {allowedReviewOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        {errors.review_status && (
                            <div className="invalid-feedback">
                                {errors.review_status}
                            </div>
                        )}
                    </div>
                )}
                <div className="col-md-4">
                    <label className="form-label">
                        {locale === 'ar' ? '???????' : 'Category'}
                    </label>
                    <select
                        className={`form-select ${
                            errors.category_id ? 'is-invalid' : ''
                        }`}
                        value={data.category_id || ''}
                        onChange={(event) =>
                            setData('category_id', event.target.value)
                        }
                    >
                        <option value="">
                            {locale === 'ar' ? '???? ?????' : 'No category'}
                        </option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.category_id && (
                        <div className="invalid-feedback">
                            {errors.category_id}
                        </div>
                    )}
                </div>
                <div className="col-md-8">
                    <label className="form-label">
                        {locale === 'ar' ? '??????' : 'Tags'}
                    </label>
                    <input
                        className={`form-control ${errors.tags ? 'is-invalid' : ''}`}
                        value={data.tags || ''}
                        onChange={(event) => setData('tags', event.target.value)}
                        list="post-tags-options"
                        placeholder={
                            locale === 'ar'
                                ? '?????, ??????'
                                : 'security, devops'
                        }
                    />
                    <datalist id="post-tags-options">
                        {tagsOptions.map((tag) => (
                            <option key={tag.id} value={tag.name} />
                        ))}
                    </datalist>
                    <div className="form-text">
                        {locale === 'ar'
                            ? '???? ?????? ??????.'
                            : 'Use commas to separate tags.'}
                    </div>
                    {errors.tags && (
                        <div className="invalid-feedback">{errors.tags}</div>
                    )}
                </div>
                <div className="col-md-6 d-flex align-items-center">
                    <div className="form-check form-switch mt-4">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={Boolean(data.use_markdown)}
                            onChange={(event) =>
                                setData('use_markdown', event.target.checked)
                            }
                            id="post-use-markdown"
                        />
                        <label className="form-check-label" htmlFor="post-use-markdown">
                            {locale === 'ar'
                                ? '??????? ???? Markdown'
                                : 'Use Markdown editor'}
                        </label>
                    </div>
                </div>
                <div className="col-12">
                    <LanguageTabs
                        initial={locale === 'ar' ? 'ar' : 'en'}
                        tabs={[
                            {
                                key: 'ar',
                                label: locale === 'ar' ? '???????' : 'Arabic',
                                content: (
                                    <div className="d-grid gap-3">
                                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                                            <span className="text-muted small">
                                                {locale === 'ar'
                                                    ? '???? ??????? ????????'
                                                    : 'Arabic content'}
                                            </span>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() =>
                                                    translateFields('ar', 'en')
                                                }
                                                disabled={translationBusy}
                                            >
                                                {locale === 'ar'
                                                    ? '?????? ??????????'
                                                    : 'Suggest English'}
                                            </button>
                                        </div>
                                        {translateStatus && (
                                            <div className="text-muted small">
                                                {translateStatus}
                                            </div>
                                        )}
                                        <div>
                                            <label className="form-label">
                                                {locale === 'ar'
                                                    ? '????? ?????? (????)'
                                                    : 'Post Title (AR)'}
                                            </label>
                                            <input
                                                className={`form-control ${
                                                    errors.title_ar ? 'is-invalid' : ''
                                                }`}
                                                value={data.title_ar}
                                                onChange={(event) =>
                                                    setData(
                                                        'title_ar',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            {errors.title_ar && (
                                                <div className="invalid-feedback">
                                                    {errors.title_ar}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="form-label">
                                                {locale === 'ar'
                                                    ? '???? (????)'
                                                    : 'Excerpt (AR)'}
                                            </label>
                                            <textarea
                                                rows="3"
                                                className={`form-control ${
                                                    errors.excerpt_ar ? 'is-invalid' : ''
                                                }`}
                                                value={data.excerpt_ar || ''}
                                                onChange={(event) =>
                                                    setData(
                                                        'excerpt_ar',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            {errors.excerpt_ar && (
                                                <div className="invalid-feedback">
                                                    {errors.excerpt_ar}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="form-label">
                                                {locale === 'ar'
                                                    ? '??????? (????)'
                                                    : 'Content (AR)'}
                                            </label>
                                            {data.use_markdown ? (
                                                <textarea
                                                    rows="8"
                                                    className={`form-control ${
                                                        errors.content_markdown_ar
                                                            ? 'is-invalid'
                                                            : ''
                                                    }`}
                                                    value={data.content_markdown_ar || ''}
                                                    onChange={(event) =>
                                                        setData(
                                                            'content_markdown_ar',
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder={
                                                        locale === 'ar'
                                                            ? '???? ??????? ?? Markdown...'
                                                            : 'Write content in Markdown...'
                                                    }
                                                />
                                            ) : (
                                                <RichTextEditor
                                                    value={data.content_ar || ''}
                                                    onChange={(value) =>
                                                        setData('content_ar', value)
                                                    }
                                                    placeholder={
                                                        locale === 'ar'
                                                            ? '???? ????? ?????? ????????...'
                                                            : 'Write the post content in Arabic...'
                                                    }
                                                />
                                            )}
                                            {errors.content_ar && !data.use_markdown && (
                                                <div className="text-danger small mt-1">
                                                    {errors.content_ar}
                                                </div>
                                            )}
                                            {errors.content_markdown_ar &&
                                                data.use_markdown && (
                                                    <div className="invalid-feedback d-block">
                                                        {errors.content_markdown_ar}
                                                    </div>
                                                )}
                                        </div>
                                        <div className="border rounded-4 p-3">
                                            <h6 className="mb-3">SEO</h6>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">
                                                        Meta Title (AR)
                                                    </label>
                                                    <input
                                                        className={`form-control ${
                                                            errors.seo_meta_title_ar
                                                                ? 'is-invalid'
                                                                : ''
                                                        }`}
                                                        value={
                                                            data.seo_meta_title_ar || ''
                                                        }
                                                        onChange={(event) =>
                                                            setData(
                                                                'seo_meta_title_ar',
                                                                event.target.value,
                                                            )
                                                        }
                                                    />
                                                    {errors.seo_meta_title_ar && (
                                                        <div className="invalid-feedback">
                                                            {errors.seo_meta_title_ar}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">
                                                        Meta Description (AR)
                                                    </label>
                                                    <textarea
                                                        rows="2"
                                                        className={`form-control ${
                                                            errors.seo_meta_description_ar
                                                                ? 'is-invalid'
                                                                : ''
                                                        }`}
                                                        value={
                                                            data.seo_meta_description_ar ||
                                                            ''
                                                        }
                                                        onChange={(event) =>
                                                            setData(
                                                                'seo_meta_description_ar',
                                                                event.target.value,
                                                            )
                                                        }
                                                    />
                                                    {errors.seo_meta_description_ar && (
                                                        <div className="invalid-feedback">
                                                            {errors.seo_meta_description_ar}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                key: 'en',
                                label: locale === 'ar' ? 'English' : 'English',
                                content: (
                                    <div className="d-grid gap-3">
                                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                                            <span className="text-muted small">
                                                {locale === 'ar'
                                                    ? '???? ??????? ???????????'
                                                    : 'English content'}
                                            </span>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() =>
                                                    translateFields('en', 'ar')
                                                }
                                                disabled={translationBusy}
                                            >
                                                {locale === 'ar'
                                                    ? '?????? ???????'
                                                    : 'Suggest Arabic'}
                                            </button>
                                        </div>
                                        {translateStatus && (
                                            <div className="text-muted small">
                                                {translateStatus}
                                            </div>
                                        )}
                                        <div>
                                            <label className="form-label">
                                                {locale === 'ar'
                                                    ? '????? ?????? (???????)'
                                                    : 'Post Title (EN)'}
                                            </label>
                                            <input
                                                className={`form-control ${
                                                    errors.title_en ? 'is-invalid' : ''
                                                }`}
                                                value={data.title_en}
                                                onChange={(event) =>
                                                    setData(
                                                        'title_en',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            {errors.title_en && (
                                                <div className="invalid-feedback">
                                                    {errors.title_en}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="form-label">
                                                {locale === 'ar'
                                                    ? '???? (???????)'
                                                    : 'Excerpt (EN)'}
                                            </label>
                                            <textarea
                                                rows="3"
                                                className={`form-control ${
                                                    errors.excerpt_en ? 'is-invalid' : ''
                                                }`}
                                                value={data.excerpt_en || ''}
                                                onChange={(event) =>
                                                    setData(
                                                        'excerpt_en',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            {errors.excerpt_en && (
                                                <div className="invalid-feedback">
                                                    {errors.excerpt_en}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="form-label">
                                                {locale === 'ar'
                                                    ? '??????? (???????)'
                                                    : 'Content (EN)'}
                                            </label>
                                            {data.use_markdown ? (
                                                <textarea
                                                    rows="8"
                                                    className={`form-control ${
                                                        errors.content_markdown_en
                                                            ? 'is-invalid'
                                                            : ''
                                                    }`}
                                                    value={data.content_markdown_en || ''}
                                                    onChange={(event) =>
                                                        setData(
                                                            'content_markdown_en',
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder={
                                                        locale === 'ar'
                                                            ? '???? ??????? ?? Markdown...'
                                                            : 'Write content in Markdown...'
                                                    }
                                                />
                                            ) : (
                                                <RichTextEditor
                                                    value={data.content_en || ''}
                                                    onChange={(value) =>
                                                        setData('content_en', value)
                                                    }
                                                    placeholder={
                                                        locale === 'ar'
                                                            ? '???? ????? ?????? ???????????...'
                                                            : 'Write the post content in English...'
                                                    }
                                                />
                                            )}
                                            {errors.content_en && !data.use_markdown && (
                                                <div className="text-danger small mt-1">
                                                    {errors.content_en}
                                                </div>
                                            )}
                                            {errors.content_markdown_en &&
                                                data.use_markdown && (
                                                    <div className="invalid-feedback d-block">
                                                        {errors.content_markdown_en}
                                                    </div>
                                                )}
                                        </div>
                                        <div className="border rounded-4 p-3">
                                            <h6 className="mb-3">SEO</h6>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">
                                                        Meta Title (EN)
                                                    </label>
                                                    <input
                                                        className={`form-control ${
                                                            errors.seo_meta_title_en
                                                                ? 'is-invalid'
                                                                : ''
                                                        }`}
                                                        value={
                                                            data.seo_meta_title_en || ''
                                                        }
                                                        onChange={(event) =>
                                                            setData(
                                                                'seo_meta_title_en',
                                                                event.target.value,
                                                            )
                                                        }
                                                    />
                                                    {errors.seo_meta_title_en && (
                                                        <div className="invalid-feedback">
                                                            {errors.seo_meta_title_en}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">
                                                        Meta Description (EN)
                                                    </label>
                                                    <textarea
                                                        rows="2"
                                                        className={`form-control ${
                                                            errors.seo_meta_description_en
                                                                ? 'is-invalid'
                                                                : ''
                                                        }`}
                                                        value={
                                                            data.seo_meta_description_en ||
                                                            ''
                                                        }
                                                        onChange={(event) =>
                                                            setData(
                                                                'seo_meta_description_en',
                                                                event.target.value,
                                                            )
                                                        }
                                                    />
                                                    {errors.seo_meta_description_en && (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.seo_meta_description_en
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ),
                            },
                        ]}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label">
                        {locale === 'ar' ? '???? ???? ??????' : 'Cover Image URL'}
                    </label>
                    <input
                        className={`form-control ${
                            errors.cover_image ? 'is-invalid' : ''
                        }`}
                        value={data.cover_image || ''}
                        onChange={(event) =>
                            setData('cover_image', event.target.value)
                        }
                    />
                    {errors.cover_image && (
                        <div className="invalid-feedback">{errors.cover_image}</div>
                    )}
                </div>
                <div className="col-md-6">
                    <label className="form-label">
                        {locale === 'ar' ? '??? ???? ??????' : 'Upload Cover Image'}
                    </label>
                    <input
                        type="file"
                        className={`form-control ${
                            errors.cover_image_file ? 'is-invalid' : ''
                        }`}
                        onChange={(event) =>
                            setData('cover_image_file', event.target.files[0])
                        }
                    />
                    {errors.cover_image_file && (
                        <div className="invalid-feedback">
                            {errors.cover_image_file}
                        </div>
                    )}
                </div>
                {previewImage && (
                    <div className="col-12">
                        <div className="border rounded-4 p-3 bg-white">
                            <div className="small text-muted mb-2">
                                {locale === 'ar' ? '?????? ???? ??????' : 'Cover Preview'}
                            </div>
                            <img
                                src={previewImage}
                                alt={locale === 'ar' ? '???? ??????' : 'Cover'}
                                className="img-fluid rounded-4"
                            />
                        </div>
                    </div>
                )}
                {hasImage && (
                    <div className="col-md-6 d-flex align-items-center">
                        <div className="form-check mt-4">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={data.remove_cover_image}
                                onChange={(event) =>
                                    setData(
                                        'remove_cover_image',
                                        event.target.checked,
                                    )
                                }
                                id="post-remove-image"
                            />
                            <label
                                className="form-check-label"
                                htmlFor="post-remove-image"
                            >
                                {locale === 'ar'
                                    ? '????? ???? ?????? ???????'
                                    : 'Remove current cover image'}
                            </label>
                        </div>
                    </div>
                )}
                <div className="col-12">
                    <div className="border rounded-4 p-3">
                        <h6 className="mb-3">SEO</h6>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">OG Image URL</label>
                                <input
                                    className={`form-control ${
                                        errors.seo_og_image ? 'is-invalid' : ''
                                    }`}
                                    value={data.seo_og_image || ''}
                                    onChange={(event) =>
                                        setData('seo_og_image', event.target.value)
                                    }
                                />
                                {errors.seo_og_image && (
                                    <div className="invalid-feedback">
                                        {errors.seo_og_image}
                                    </div>
                                )}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Meta Robots</label>
                                <select
                                    className={`form-select ${
                                        errors.seo_robots ? 'is-invalid' : ''
                                    }`}
                                    value={data.seo_robots || ''}
                                    onChange={(event) =>
                                        setData('seo_robots', event.target.value)
                                    }
                                >
                                    {robotsOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.seo_robots && (
                                    <div className="invalid-feedback">
                                        {errors.seo_robots}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4 d-flex flex-wrap align-items-center gap-2">
                <button className="btn btn-primary" disabled={processing} type="submit">
                    {submitLabel}
                </button>
                {previewUrl && (
                    <a
                        className="btn btn-outline-secondary"
                        href={previewUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {locale === 'ar' ? '??????' : 'Preview'}
                    </a>
                )}
                {autosaveStatus && (
                    <span className="text-muted small ms-auto">
                        {autosaveStatus}
                    </span>
                )}
            </div>
        </form>
    );
}

