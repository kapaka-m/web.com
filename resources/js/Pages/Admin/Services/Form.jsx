// MOHAMED HASSANIN (KAPAKA)
import LanguageTabs from '@/Components/LanguageTabs';
import { translateText } from '@/Support/translate';
import { useState } from 'react';

export default function ServiceForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    submitLabel,
    locale,
}) {
    const [translateStatus, setTranslateStatus] = useState(null);
    const [translationBusy, setTranslationBusy] = useState(false);

    const robotsOptions = [
        { value: '', label: 'Default (index,follow)' },
        { value: 'index,follow', label: 'index,follow' },
        { value: 'noindex,nofollow', label: 'noindex,nofollow' },
        { value: 'noindex,follow', label: 'noindex,follow' },
        { value: 'index,nofollow', label: 'index,nofollow' },
    ];

    const translateFields = async (source, target) => {
        if (translationBusy) {
            return;
        }

        const pairs = [
            { from: `title_${source}`, to: `title_${target}` },
            { from: `summary_${source}`, to: `summary_${target}` },
            { from: `description_${source}`, to: `description_${target}` },
            { from: `features_${source}`, to: `features_${target}` },
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

    return (
        <form onSubmit={onSubmit}>
            <div className="row g-3">
                <div className="col-md-6">
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
                <div className="col-md-3">
                    <label className="form-label">
                        {locale === 'ar' ? 'أيقونة Bootstrap' : 'Bootstrap Icon'}
                    </label>
                    <input
                        className={`form-control ${errors.icon ? 'is-invalid' : ''}`}
                        value={data.icon || ''}
                        onChange={(event) => setData('icon', event.target.value)}
                        placeholder="bi-rocket-takeoff"
                    />
                    {errors.icon && (
                        <div className="invalid-feedback">{errors.icon}</div>
                    )}
                </div>
                <div className="col-md-3">
                    <label className="form-label">
                        {locale === 'ar' ? 'ترتيب العرض' : 'Sort Order'}
                    </label>
                    <input
                        type="number"
                        className={`form-control ${
                            errors.sort_order ? 'is-invalid' : ''
                        }`}
                        value={data.sort_order}
                        onChange={(event) => setData('sort_order', event.target.value)}
                    />
                    {errors.sort_order && (
                        <div className="invalid-feedback">{errors.sort_order}</div>
                    )}
                </div>
                <div className="col-md-3 d-flex align-items-center">
                    <div className="form-check mt-4">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(event) =>
                                setData('is_active', event.target.checked)
                            }
                            id="service-active"
                        />
                        <label className="form-check-label" htmlFor="service-active">
                            {locale === 'ar' ? 'نشط' : 'Active'}
                        </label>
                    </div>
                </div>
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
                                                    ? 'حقول الخدمة بالعربية'
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
                                                    ? 'عنوان الخدمة (عربي)'
                                                    : 'Service Title (AR)'}
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
                                                    ? 'ملخص (عربي)'
                                                    : 'Summary (AR)'}
                                            </label>
                                            <textarea
                                                rows="3"
                                                className={`form-control ${
                                                    errors.summary_ar ? 'is-invalid' : ''
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
                                                    ? 'وصف الخدمة (عربي)'
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
                                        <div>
                                            <label className="form-label">
                                                {locale === 'ar'
                                                    ? 'نقاط الخدمة (عربي - سطر لكل نقطة)'
                                                    : 'Service Highlights (AR - one per line)'}
                                            </label>
                                            <textarea
                                                rows="4"
                                                className={`form-control ${
                                                    errors.features_ar ? 'is-invalid' : ''
                                                }`}
                                                value={data.features_ar || ''}
                                                onChange={(event) =>
                                                    setData(
                                                        'features_ar',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            {errors.features_ar && (
                                                <div className="invalid-feedback">
                                                    {errors.features_ar}
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
                                                    ? 'حقول الخدمة بالإنجليزية'
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
                                                    ? 'عنوان الخدمة (إنجليزي)'
                                                    : 'Service Title (EN)'}
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
                                                    ? 'ملخص (إنجليزي)'
                                                    : 'Summary (EN)'}
                                            </label>
                                            <textarea
                                                rows="3"
                                                className={`form-control ${
                                                    errors.summary_en ? 'is-invalid' : ''
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
                                                    ? 'وصف الخدمة (إنجليزي)'
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
                                        <div>
                                            <label className="form-label">
                                                {locale === 'ar'
                                                    ? 'نقاط الخدمة (إنجليزي - سطر لكل نقطة)'
                                                    : 'Service Highlights (EN - one per line)'}
                                            </label>
                                            <textarea
                                                rows="4"
                                                className={`form-control ${
                                                    errors.features_en ? 'is-invalid' : ''
                                                }`}
                                                value={data.features_en || ''}
                                                onChange={(event) =>
                                                    setData(
                                                        'features_en',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            {errors.features_en && (
                                                <div className="invalid-feedback">
                                                    {errors.features_en}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ),
                            },
                        ]}
                    />
                </div>
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
            </div>
            <div className="mt-4">
                <button className="btn btn-primary" disabled={processing} type="submit">
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
