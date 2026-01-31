// MOHAMED HASSANIN (KAPAKA)
import LanguageTabs from '@/Components/LanguageTabs';
import { translateText } from '@/Support/translate';
import { useState } from 'react';

export default function CategoryForm({
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

    const translateFields = async (source, target) => {
        if (translationBusy) {
            return;
        }

        const sourceValue = data[`name_${source}`];
        const targetValue = data[`name_${target}`];

        if (!sourceValue || String(sourceValue).trim() === '') {
            return;
        }

        if (targetValue && String(targetValue).trim() !== '') {
            return;
        }

        setTranslationBusy(true);
        setTranslateStatus(locale === 'ar' ? 'جاري الترجمة...' : 'Translating...');

        try {
            const translated = await translateText({
                text: sourceValue,
                source,
                target,
            });

            if (translated) {
                setData(`name_${target}`, translated);
            }

            setTranslateStatus(
                translated
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
            setTimeout(() => setTranslateStatus(null), 2000);
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
                                    <div className="d-grid gap-2">
                                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                                            <span className="text-muted small">
                                                {locale === 'ar'
                                                    ? 'اسم التصنيف بالعربية'
                                                    : 'Arabic name'}
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
                                        <input
                                            className={`form-control ${
                                                errors.name_ar ? 'is-invalid' : ''
                                            }`}
                                            value={data.name_ar}
                                            onChange={(event) =>
                                                setData('name_ar', event.target.value)
                                            }
                                        />
                                        {errors.name_ar && (
                                            <div className="invalid-feedback">
                                                {errors.name_ar}
                                            </div>
                                        )}
                                    </div>
                                ),
                            },
                            {
                                key: 'en',
                                label: locale === 'ar' ? 'English' : 'English',
                                content: (
                                    <div className="d-grid gap-2">
                                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                                            <span className="text-muted small">
                                                {locale === 'ar'
                                                    ? 'اسم التصنيف بالإنجليزية'
                                                    : 'English name'}
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
                                        <input
                                            className={`form-control ${
                                                errors.name_en ? 'is-invalid' : ''
                                            }`}
                                            value={data.name_en}
                                            onChange={(event) =>
                                                setData('name_en', event.target.value)
                                            }
                                        />
                                        {errors.name_en && (
                                            <div className="invalid-feedback">
                                                {errors.name_en}
                                            </div>
                                        )}
                                    </div>
                                ),
                            },
                        ]}
                    />
                </div>
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
                <div className="col-md-6 d-flex align-items-center">
                    <div className="form-check mt-4">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(event) =>
                                setData('is_active', event.target.checked)
                            }
                            id="category-active"
                        />
                        <label className="form-check-label" htmlFor="category-active">
                            {locale === 'ar' ? 'نشط' : 'Active'}
                        </label>
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
