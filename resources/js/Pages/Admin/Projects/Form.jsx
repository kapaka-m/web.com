// MOHAMED HASSANIN (KAPAKA)
import { useEffect, useState } from 'react';
import LanguageTabs from '@/Components/LanguageTabs';
import { resolveImageUrl } from '@/Support/resolveImageUrl';
import { translateText } from '@/Support/translate';

export default function ProjectForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    submitLabel,
    locale,
}) {
    const robotsOptions = [
        { value: '', label: 'Default (index,follow)' },
        { value: 'index,follow', label: 'index,follow' },
        { value: 'noindex,nofollow', label: 'noindex,nofollow' },
        { value: 'noindex,follow', label: 'noindex,follow' },
        { value: 'index,nofollow', label: 'index,nofollow' },
    ];

    const [translateStatus, setTranslateStatus] = useState(null);
    const [translationBusy, setTranslationBusy] = useState(false);
    const hasImage = Boolean(data.cover_image);
    const [previewUrl, setPreviewUrl] = useState(null);
    const previewImage =
        previewUrl ||
        (data.remove_cover_image ? null : resolveImageUrl(data.cover_image));

    useEffect(() => {
        if (!data.cover_image_file) {
            setPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(data.cover_image_file);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [data.cover_image_file]);

    const translateFields = async (source, target) => {
        if (translationBusy) {
            return;
        }

        const pairs = [
            { from: `title_${source}`, to: `title_${target}` },
            { from: `summary_${source}`, to: `summary_${target}` },
            { from: `description_${source}`, to: `description_${target}` },
        ];

        setTranslationBusy(true);
        setTranslateStatus(locale === 'ar' ? 'جاري الترجمة...' : 'Translating...');

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

                const translated = await translateText({
                    text: sourceValue,
                    source,
                    target,
                });

                if (translated) {
                    updates[pair.to] = translated;
                }
            }

            Object.entries(updates).forEach(([key, value]) => setData(key, value));

            setTranslateStatus(
                Object.keys(updates).length
                    ? locale === 'ar'
                        ? 'تمت الترجمة.'
                        : 'Translation ready.'
                    : locale === 'ar'
                    ? 'لا يوجد نص لترجمته.'
                    : 'Nothing to translate.',
            );
        } catch (error) {
            setTranslateStatus(locale === 'ar' ? 'فشلت الترجمة.' : 'Translation failed.');
        } finally {
            setTranslationBusy(false);
            setTimeout(() => setTranslateStatus(null), 2500);
        }
    };

    const galleryImages = data.gallery_images || [];

    const addGalleryImage = () => {
        setData('gallery_images', [
            ...galleryImages,
            {
                id: null,
                image_path: '',
                caption_ar: '',
                caption_en: '',
                sort_order: galleryImages.length + 1,
            },
        ]);
    };

    const updateGalleryImage = (index, field, value) => {
        const nextImages = [...galleryImages];
        nextImages[index] = { ...nextImages[index], [field]: value };
        setData('gallery_images', nextImages);
    };

    const removeGalleryImage = (index) => {
        const removed = galleryImages[index];
        const nextImages = galleryImages.filter((_, idx) => idx !== index);
        setData('gallery_images', nextImages);

        if (removed?.id) {
            setData('gallery_removed', [
                ...(data.gallery_removed || []),
                removed.id,
            ]);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="row g-3">
                <div className="col-12">
                    <LanguageTabs
                        initial={locale === 'ar' ? 'ar' : 'en'}
                        tabs={[
                            {
                                key: 'ar',
                                label: locale === 'ar' ? 'العربية' : 'Arabic',
                                content: (
                                    <div className="d-grid gap-3">
                                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                                            <span className="text-muted small">
                                                {locale === 'ar'
                                                    ? 'حقول المشروع بالعربية'
                                                    : 'Arabic fields'}
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
                                                    ? 'اقتراح الإنجليزية'
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
                                                    ? 'عنوان المشروع (عربي)'
                                                    : 'Project Title (AR)'}
                                            </label>
                                            <input
                                                className={`form-control ${
                                                    errors.title_ar
                                                        ? 'is-invalid'
                                                        : ''
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
                                                    ? 'ملخص (عربي)'
                                                    : 'Summary (AR)'}
                                            </label>
                                            <textarea
                                                rows="3"
                                                className={`form-control ${
                                                    errors.summary_ar
                                                        ? 'is-invalid'
                                                        : ''
                                                }`}
                                                value={data.summary_ar || ''}
                                                onChange={(event) =>
                                                    setData(
                                                        'summary_ar',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            {errors.summary_ar && (
                                                <div className="invalid-feedback">
                                                    {errors.summary_ar}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="form-label">
                                                {locale === 'ar'
                                                    ? 'وصف تفصيلي (عربي)'
                                                    : 'Description (AR)'}
                                            </label>
                                            <textarea
                                                rows="4"
                                                className={`form-control ${
                                                    errors.description_ar
                                                        ? 'is-invalid'
                                                        : ''
                                                }`}
                                                value={data.description_ar || ''}
                                                onChange={(event) =>
                                                    setData(
                                                        'description_ar',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            {errors.description_ar && (
                                                <div className="invalid-feedback">
                                                    {errors.description_ar}
                                                </div>
                                            )}
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
                                                    ? 'حقول المشروع بالإنجليزية'
                                                    : 'English fields'}
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
                                                    ? 'اقتراح العربية'
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
                                                    ? 'عنوان المشروع (إنجليزي)'
                                                    : 'Project Title (EN)'}
                                            </label>
                                            <input
                                                className={`form-control ${
                                                    errors.title_en
                                                        ? 'is-invalid'
                                                        : ''
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
                                                    ? 'ملخص (إنجليزي)'
                                                    : 'Summary (EN)'}
                                            </label>
                                            <textarea
                                                rows="3"
                                                className={`form-control ${
                                                    errors.summary_en
                                                        ? 'is-invalid'
                                                        : ''
                                                }`}
                                                value={data.summary_en || ''}
                                                onChange={(event) =>
                                                    setData(
                                                        'summary_en',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            {errors.summary_en && (
                                                <div className="invalid-feedback">
                                                    {errors.summary_en}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="form-label">
                                                {locale === 'ar'
                                                    ? 'وصف تفصيلي (إنجليزي)'
                                                    : 'Description (EN)'}
                                            </label>
                                            <textarea
                                                rows="4"
                                                className={`form-control ${
                                                    errors.description_en
                                                        ? 'is-invalid'
                                                        : ''
                                                }`}
                                                value={data.description_en || ''}
                                                onChange={(event) =>
                                                    setData(
                                                        'description_en',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            {errors.description_en && (
                                                <div className="invalid-feedback">
                                                    {errors.description_en}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ),
                            },
                        ]}
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label">
                        {locale === 'ar' ? 'Slug' : 'Slug'}
                    </label>
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
                        {locale === 'ar' ? 'العميل' : 'Client'}
                    </label>
                    <input
                        className={`form-control ${errors.client ? 'is-invalid' : ''}`}
                        value={data.client || ''}
                        onChange={(event) => setData('client', event.target.value)}
                    />
                    {errors.client && (
                        <div className="invalid-feedback">{errors.client}</div>
                    )}
                </div>
                <div className="col-md-4">
                    <label className="form-label">
                        {locale === 'ar' ? 'السنة' : 'Year'}
                    </label>
                    <input
                        className={`form-control ${errors.year ? 'is-invalid' : ''}`}
                        value={data.year || ''}
                        onChange={(event) => setData('year', event.target.value)}
                    />
                    {errors.year && (
                        <div className="invalid-feedback">{errors.year}</div>
                    )}
                </div>
                <div className="col-md-6">
                    <label className="form-label">
                        {locale === 'ar' ? 'التقنيات (فواصل)' : 'Stack (comma separated)'}
                    </label>
                    <input
                        className={`form-control ${errors.stack ? 'is-invalid' : ''}`}
                        value={data.stack || ''}
                        onChange={(event) => setData('stack', event.target.value)}
                        placeholder="Laravel, React, MySQL"
                    />
                    {errors.stack && (
                        <div className="invalid-feedback">{errors.stack}</div>
                    )}
                </div>
                <div className="col-md-6">
                    <label className="form-label">
                        {locale === 'ar' ? 'رابط صورة الغلاف' : 'Cover Image URL'}
                    </label>
                    <input
                        className={`form-control ${errors.cover_image ? 'is-invalid' : ''}`}
                        value={data.cover_image || ''}
                        onChange={(event) => setData('cover_image', event.target.value)}
                    />
                    {errors.cover_image && (
                        <div className="invalid-feedback">{errors.cover_image}</div>
                    )}
                </div>
                <div className="col-md-6">
                    <label className="form-label">
                        {locale === 'ar'
                            ? 'رفع صورة الغلاف'
                            : 'Upload Cover Image'}
                    </label>
                    <input
                        type="file"
                        className={`form-control ${errors.cover_image_file ? 'is-invalid' : ''}`}
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
                                {locale === 'ar'
                                    ? 'معاينة صورة الغلاف'
                                    : 'Cover Preview'}
                            </div>
                            <img
                                src={previewImage}
                                alt={locale === 'ar' ? 'صورة الغلاف' : 'Cover'}
                                className="img-fluid rounded-4"
                            />
                        </div>
                    </div>
                )}
                <div className="col-md-3 d-flex align-items-center">
                    <div className="form-check mt-4">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={data.is_featured}
                            onChange={(event) => setData('is_featured', event.target.checked)}
                            id="project-featured"
                        />
                        <label className="form-check-label" htmlFor="project-featured">
                            {locale === 'ar' ? 'مميز' : 'Featured'}
                        </label>
                    </div>
                </div>
                <div className="col-md-3 d-flex align-items-center">
                    <div className="form-check mt-4">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(event) => setData('is_active', event.target.checked)}
                            id="project-active"
                        />
                        <label className="form-check-label" htmlFor="project-active">
                            {locale === 'ar' ? 'نشط' : 'Active'}
                        </label>
                    </div>
                </div>
                {hasImage && (
                    <div className="col-md-6 d-flex align-items-center">
                        <div className="form-check mt-4">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={data.remove_cover_image}
                                onChange={(event) =>
                                    setData('remove_cover_image', event.target.checked)
                                }
                                id="project-remove-image"
                            />
                            <label
                                className="form-check-label"
                                htmlFor="project-remove-image"
                            >
                                {locale === 'ar'
                                    ? 'إزالة صورة الغلاف الحالية'
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
                                <label className="form-label">Meta Title (AR)</label>
                                <input
                                    className={`form-control ${
                                        errors.seo_meta_title_ar ? 'is-invalid' : ''
                                    }`}
                                    value={data.seo_meta_title_ar || ''}
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
                                <label className="form-label">Meta Title (EN)</label>
                                <input
                                    className={`form-control ${
                                        errors.seo_meta_title_en ? 'is-invalid' : ''
                                    }`}
                                    value={data.seo_meta_title_en || ''}
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
                                    Meta Description (AR)
                                </label>
                                <textarea
                                    rows="2"
                                    className={`form-control ${
                                        errors.seo_meta_description_ar
                                            ? 'is-invalid'
                                            : ''
                                    }`}
                                    value={data.seo_meta_description_ar || ''}
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
                                    value={data.seo_meta_description_en || ''}
                                    onChange={(event) =>
                                        setData(
                                            'seo_meta_description_en',
                                            event.target.value,
                                        )
                                    }
                                />
                                {errors.seo_meta_description_en && (
                                    <div className="invalid-feedback">
                                        {errors.seo_meta_description_en}
                                    </div>
                                )}
                            </div>
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
                <div className="col-12">
                    <div className="border rounded-4 p-4 bg-white">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                            <h6 className="mb-0">
                                {locale === 'ar' ? 'معرض الصور' : 'Gallery Images'}
                            </h6>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={addGalleryImage}
                            >
                                {locale === 'ar' ? 'إضافة صورة' : 'Add Image'}
                            </button>
                        </div>
                        {galleryImages.length === 0 ? (
                            <p className="text-muted small mb-0">
                                {locale === 'ar'
                                    ? 'أضف صوراً لعرض المشروع.'
                                    : 'Add images to showcase the project.'}
                            </p>
                        ) : (
                            <div className="row g-3">
                                {galleryImages.map((image, index) => {
                                    const preview = resolveImageUrl(image.image_path);
                                    return (
                                        <div
                                            className="col-lg-6"
                                            key={image.id || index}
                                        >
                                            <div className="border rounded-4 p-3 h-100">
                                                <div className="mb-3">
                                                    <label className="form-label">
                                                        {locale === 'ar'
                                                            ? 'رابط الصورة'
                                                            : 'Image URL'}
                                                    </label>
                                                    <input
                                                        className={`form-control ${
                                                            errors[
                                                                `gallery_images.${index}.image_path`
                                                            ]
                                                                ? 'is-invalid'
                                                                : ''
                                                        }`}
                                                        value={image.image_path || ''}
                                                        onChange={(event) =>
                                                            updateGalleryImage(
                                                                index,
                                                                'image_path',
                                                                event.target.value,
                                                            )
                                                        }
                                                    />
                                                    {errors[
                                                        `gallery_images.${index}.image_path`
                                                    ] && (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors[
                                                                    `gallery_images.${index}.image_path`
                                                                ]
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">
                                                        {locale === 'ar'
                                                            ? 'تعليق (عربي)'
                                                            : 'Caption (AR)'}
                                                    </label>
                                                    <input
                                                        className={`form-control ${
                                                            errors[
                                                                `gallery_images.${index}.caption_ar`
                                                            ]
                                                                ? 'is-invalid'
                                                                : ''
                                                        }`}
                                                        value={image.caption_ar || ''}
                                                        onChange={(event) =>
                                                            updateGalleryImage(
                                                                index,
                                                                'caption_ar',
                                                                event.target.value,
                                                            )
                                                        }
                                                    />
                                                    {errors[
                                                        `gallery_images.${index}.caption_ar`
                                                    ] && (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors[
                                                                    `gallery_images.${index}.caption_ar`
                                                                ]
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">
                                                        {locale === 'ar'
                                                            ? 'تعليق (إنجليزي)'
                                                            : 'Caption (EN)'}
                                                    </label>
                                                    <input
                                                        className={`form-control ${
                                                            errors[
                                                                `gallery_images.${index}.caption_en`
                                                            ]
                                                                ? 'is-invalid'
                                                                : ''
                                                        }`}
                                                        value={image.caption_en || ''}
                                                        onChange={(event) =>
                                                            updateGalleryImage(
                                                                index,
                                                                'caption_en',
                                                                event.target.value,
                                                            )
                                                        }
                                                    />
                                                    {errors[
                                                        `gallery_images.${index}.caption_en`
                                                    ] && (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors[
                                                                    `gallery_images.${index}.caption_en`
                                                                ]
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="d-flex align-items-center gap-3 mb-3">
                                                    <div className="flex-grow-1">
                                                        <label className="form-label">
                                                            {locale === 'ar'
                                                                ? 'الترتيب'
                                                                : 'Sort Order'}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className={`form-control ${
                                                                errors[
                                                                    `gallery_images.${index}.sort_order`
                                                                ]
                                                                    ? 'is-invalid'
                                                                    : ''
                                                            }`}
                                                            value={image.sort_order ?? 0}
                                                            onChange={(event) =>
                                                                updateGalleryImage(
                                                                    index,
                                                                    'sort_order',
                                                                    event.target.value,
                                                                )
                                                            }
                                                        />
                                                        {errors[
                                                            `gallery_images.${index}.sort_order`
                                                        ] && (
                                                            <div className="invalid-feedback">
                                                                {
                                                                    errors[
                                                                        `gallery_images.${index}.sort_order`
                                                                    ]
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger align-self-end"
                                                        onClick={() =>
                                                            removeGalleryImage(index)
                                                        }
                                                    >
                                                        {locale === 'ar'
                                                            ? 'إزالة'
                                                            : 'Remove'}
                                                    </button>
                                                </div>
                                                {preview && (
                                                    <div className="border rounded-3 overflow-hidden">
                                                        <img
                                                            src={preview}
                                                            alt={
                                                                image.caption_ar ||
                                                                image.caption_en ||
                                                                'Gallery'
                                                            }
                                                            className="img-fluid"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <button className="btn btn-primary" disabled={processing} type="submit">
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
