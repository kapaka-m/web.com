// MOHAMED HASSANIN (KAPAKA)
import RichTextEditor from '@/Components/RichTextEditor';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function SettingsEdit({ settings }) {
    const { locale } = usePage().props;
    const isArabic = locale === 'ar';
    const t = (ar, en) => (isArabic ? ar : en);
    const { data, setData, put, processing, errors } = useForm(settings);

    const submit = (event) => {
        event.preventDefault();
        put(route('admin.settings.update'));
    };

    const updateHighlight = (index, field, value) => {
        const highlights = [...data.about_highlights];
        highlights[index] = { ...highlights[index], [field]: value };
        setData('about_highlights', highlights);
    };

    const updateSocial = (index, field, value) => {
        const links = [...data.social_links];
        links[index] = { ...links[index], [field]: value };
        setData('social_links', links);
    };

    const updateStat = (index, field, value) => {
        const stats = [...data.stats];
        stats[index] = { ...stats[index], [field]: value };
        setData('stats', stats);
    };

    const updateSeoPage = (index, field, value) => {
        const pages = [...(data.seo_pages || [])];
        pages[index] = { ...pages[index], [field]: value };
        setData('seo_pages', pages);
    };

    const seoPageLabels = {
        home: 'Home',
        about: 'About',
        services: 'Services',
        projects: 'Projects',
        consulting: 'Consulting',
        careers: 'Careers',
        blog: 'Blog',
        contact: 'Contact',
        privacy: 'Privacy Policy',
        terms: 'Terms of Use',
    };

    const robotsOptions = [
        { value: '', label: 'Default (index,follow)' },
        { value: 'index,follow', label: 'index,follow' },
        { value: 'noindex,nofollow', label: 'noindex,nofollow' },
        { value: 'noindex,follow', label: 'noindex,follow' },
        { value: 'index,nofollow', label: 'index,nofollow' },
    ];

    const fieldError = (key) => errors[key];
    const seoPages = data.seo_pages || [];

    return (
        <AdminLayout title={t('إعدادات الموقع', 'Site Settings')}>
            <Head title={t('الإعدادات', 'Settings')} />
            <form onSubmit={submit}>
                <div className="content-card mb-4">
                    <h5 className="mb-3">{t('عام', 'General')}</h5>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('اسم الموقع (عربي)', 'Site Name (AR)')}
                            </label>
                            <input
                                className={`form-control ${fieldError('site_name_ar') ? 'is-invalid' : ''}`}
                                value={data.site_name_ar}
                                onChange={(event) =>
                                    setData('site_name_ar', event.target.value)
                                }
                            />
                            {fieldError('site_name_ar') && (
                                <div className="invalid-feedback">
                                    {fieldError('site_name_ar')}
                                </div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('اسم الموقع (إنجليزي)', 'Site Name (EN)')}
                            </label>
                            <input
                                className={`form-control ${fieldError('site_name_en') ? 'is-invalid' : ''}`}
                                value={data.site_name_en}
                                onChange={(event) =>
                                    setData('site_name_en', event.target.value)
                                }
                            />
                            {fieldError('site_name_en') && (
                                <div className="invalid-feedback">
                                    {fieldError('site_name_en')}
                                </div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('الشعار (عربي)', 'Tagline (AR)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.tagline_ar || ''}
                                onChange={(event) =>
                                    setData('tagline_ar', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('الشعار (إنجليزي)', 'Tagline (EN)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.tagline_en || ''}
                                onChange={(event) =>
                                    setData('tagline_en', event.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="content-card mb-4">
                    <h5 className="mb-3">{t('قسم الواجهة الرئيسية', 'Hero Section')}</h5>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('الشارة (عربي)', 'Badge (AR)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.hero_badge_ar || ''}
                                onChange={(event) =>
                                    setData('hero_badge_ar', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('الشارة (إنجليزي)', 'Badge (EN)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.hero_badge_en || ''}
                                onChange={(event) =>
                                    setData('hero_badge_en', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('العنوان الرئيسي (عربي)', 'Headline (AR)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.hero_headline_ar || ''}
                                onChange={(event) =>
                                    setData('hero_headline_ar', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('العنوان الرئيسي (إنجليزي)', 'Headline (EN)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.hero_headline_en || ''}
                                onChange={(event) =>
                                    setData('hero_headline_en', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('الوصف المختصر (عربي)', 'Subheadline (AR)')}
                            </label>
                            <textarea
                                rows="2"
                                className="form-control"
                                value={data.hero_subheadline_ar || ''}
                                onChange={(event) =>
                                    setData('hero_subheadline_ar', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('الوصف المختصر (إنجليزي)', 'Subheadline (EN)')}
                            </label>
                            <textarea
                                rows="2"
                                className="form-control"
                                value={data.hero_subheadline_en || ''}
                                onChange={(event) =>
                                    setData('hero_subheadline_en', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('زر الدعوة الأساسي (عربي)', 'Primary CTA (AR)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.hero_primary_cta_ar || ''}
                                onChange={(event) =>
                                    setData('hero_primary_cta_ar', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('زر الدعوة الأساسي (إنجليزي)', 'Primary CTA (EN)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.hero_primary_cta_en || ''}
                                onChange={(event) =>
                                    setData('hero_primary_cta_en', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('زر الدعوة الثانوي (عربي)', 'Secondary CTA (AR)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.hero_secondary_cta_ar || ''}
                                onChange={(event) =>
                                    setData('hero_secondary_cta_ar', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('زر الدعوة الثانوي (إنجليزي)', 'Secondary CTA (EN)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.hero_secondary_cta_en || ''}
                                onChange={(event) =>
                                    setData('hero_secondary_cta_en', event.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="content-card mb-4">
                    <h5 className="mb-3">{t('قسم من أنا', 'About Section')}</h5>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('العنوان (عربي)', 'Title (AR)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.about_title_ar || ''}
                                onChange={(event) =>
                                    setData('about_title_ar', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('العنوان (إنجليزي)', 'Title (EN)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.about_title_en || ''}
                                onChange={(event) =>
                                    setData('about_title_en', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('الملخص (عربي)', 'Summary (AR)')}
                            </label>
                            <textarea
                                rows="3"
                                className="form-control"
                                value={data.about_summary_ar || ''}
                                onChange={(event) =>
                                    setData('about_summary_ar', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('الملخص (إنجليزي)', 'Summary (EN)')}
                            </label>
                            <textarea
                                rows="3"
                                className="form-control"
                                value={data.about_summary_en || ''}
                                onChange={(event) =>
                                    setData('about_summary_en', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('النص (عربي)', 'Body (AR)')}
                            </label>
                            <textarea
                                rows="4"
                                className="form-control"
                                value={data.about_body_ar || ''}
                                onChange={(event) =>
                                    setData('about_body_ar', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('النص (إنجليزي)', 'Body (EN)')}
                            </label>
                            <textarea
                                rows="4"
                                className="form-control"
                                value={data.about_body_en || ''}
                                onChange={(event) =>
                                    setData('about_body_en', event.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <h6 className="mb-3">{t('نقاط التميز', 'Highlights')}</h6>
                        <div className="row g-3">
                            {data.about_highlights.map((highlight, index) => (
                                <div className="col-md-6" key={index}>
                                    <div className="border rounded-4 p-3 h-100">
                                        <div className="mb-2">
                                            <label className="form-label small">
                                                {t('العنوان (عربي)', 'Title (AR)')}
                                            </label>
                                            <input
                                                className={`form-control ${
                                                    fieldError(`about_highlights.${index}.title_ar`)
                                                        ? 'is-invalid'
                                                        : ''
                                                }`}
                                                value={highlight.title_ar || ''}
                                                onChange={(event) =>
                                                    updateHighlight(
                                                        index,
                                                        'title_ar',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label small">
                                                {t(
                                                    'العنوان (إنجليزي)',
                                                    'Title (EN)',
                                                )}
                                            </label>
                                            <input
                                                className="form-control"
                                                value={highlight.title_en || ''}
                                                onChange={(event) =>
                                                    updateHighlight(
                                                        index,
                                                        'title_en',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label small">
                                                {t(
                                                    'الوصف (عربي)',
                                                    'Description (AR)',
                                                )}
                                            </label>
                                            <textarea
                                                rows="2"
                                                className="form-control"
                                                value={highlight.description_ar || ''}
                                                onChange={(event) =>
                                                    updateHighlight(
                                                        index,
                                                        'description_ar',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label small">
                                                {t(
                                                    'الوصف (إنجليزي)',
                                                    'Description (EN)',
                                                )}
                                            </label>
                                            <textarea
                                                rows="2"
                                                className="form-control"
                                                value={highlight.description_en || ''}
                                                onChange={(event) =>
                                                    updateHighlight(
                                                        index,
                                                        'description_en',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="content-card mb-4">
                    <h5 className="mb-3">{t('التواصل', 'Contact')}</h5>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('البريد الإلكتروني', 'Email')}
                            </label>
                            <input
                                className={`form-control ${fieldError('contact_email') ? 'is-invalid' : ''}`}
                                value={data.contact_email || ''}
                                onChange={(event) =>
                                    setData('contact_email', event.target.value)
                                }
                            />
                            {fieldError('contact_email') && (
                                <div className="invalid-feedback">
                                    {fieldError('contact_email')}
                                </div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('الهاتف', 'Phone')}
                            </label>
                            <input
                                className="form-control"
                                value={data.contact_phone || ''}
                                onChange={(event) =>
                                    setData('contact_phone', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('الموقع (عربي)', 'Location (AR)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.contact_location_ar || ''}
                                onChange={(event) =>
                                    setData('contact_location_ar', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('الموقع (إنجليزي)', 'Location (EN)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.contact_location_en || ''}
                                onChange={(event) =>
                                    setData('contact_location_en', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('التوافر (عربي)', 'Availability (AR)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.contact_availability_ar || ''}
                                onChange={(event) =>
                                    setData(
                                        'contact_availability_ar',
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('التوافر (إنجليزي)', 'Availability (EN)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.contact_availability_en || ''}
                                onChange={(event) =>
                                    setData(
                                        'contact_availability_en',
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="content-card mb-4">
                    <h5 className="mb-3">{t('روابط التواصل', 'Social Links')}</h5>
                    <div className="row g-3">
                        {data.social_links.map((link, index) => (
                            <div className="col-md-4" key={index}>
                                <div className="border rounded-4 p-3 h-100">
                                    <div className="mb-2">
                                        <label className="form-label small">
                                            {t('الاسم', 'Label')}
                                        </label>
                                        <input
                                            className="form-control"
                                            value={link.label || ''}
                                            onChange={(event) =>
                                                updateSocial(
                                                    index,
                                                    'label',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small">
                                            {t('الرابط', 'URL')}
                                        </label>
                                        <input
                                            className="form-control"
                                            value={link.url || ''}
                                            onChange={(event) =>
                                                updateSocial(
                                                    index,
                                                    'url',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label small">
                                            {t('الأيقونة', 'Icon')}
                                        </label>
                                        <input
                                            className="form-control"
                                            value={link.icon || ''}
                                            onChange={(event) =>
                                                updateSocial(
                                                    index,
                                                    'icon',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="bi-linkedin"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="content-card mb-4">
                    <h5 className="mb-3">{t('الإحصائيات', 'Stats')}</h5>
                    <div className="row g-3">
                        {data.stats.map((stat, index) => (
                            <div className="col-md-4" key={index}>
                                <div className="border rounded-4 p-3 h-100">
                                    <div className="mb-2">
                                        <label className="form-label small">
                                            {t('القيمة', 'Value')}
                                        </label>
                                        <input
                                            className="form-control"
                                            value={stat.value || ''}
                                            onChange={(event) =>
                                                updateStat(
                                                    index,
                                                    'value',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small">
                                            {t('التسمية (عربي)', 'Label (AR)')}
                                        </label>
                                        <input
                                            className="form-control"
                                            value={stat.label_ar || ''}
                                            onChange={(event) =>
                                                updateStat(
                                                    index,
                                                    'label_ar',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label small">
                                            {t('التسمية (إنجليزي)', 'Label (EN)')}
                                        </label>
                                        <input
                                            className="form-control"
                                            value={stat.label_en || ''}
                                            onChange={(event) =>
                                                updateStat(
                                                    index,
                                                    'label_en',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="content-card mb-4">
                    <h5 className="mb-3">{t('تحسين محركات البحث', 'SEO')}</h5>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('عنوان الميتا (عربي)', 'Meta Title (AR)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.seo_meta_title_ar || ''}
                                onChange={(event) =>
                                    setData('seo_meta_title_ar', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('عنوان الميتا (إنجليزي)', 'Meta Title (EN)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.seo_meta_title_en || ''}
                                onChange={(event) =>
                                    setData('seo_meta_title_en', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t(
                                    'وصف الميتا (عربي)',
                                    'Meta Description (AR)',
                                )}
                            </label>
                            <textarea
                                rows="2"
                                className="form-control"
                                value={data.seo_meta_description_ar || ''}
                                onChange={(event) =>
                                    setData(
                                        'seo_meta_description_ar',
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t(
                                    'وصف الميتا (إنجليزي)',
                                    'Meta Description (EN)',
                                )}
                            </label>
                            <textarea
                                rows="2"
                                className="form-control"
                                value={data.seo_meta_description_en || ''}
                                onChange={(event) =>
                                    setData(
                                        'seo_meta_description_en',
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </div>
                    <div className="row g-3 mt-2">
                        <div className="col-md-6">
                            <label className="form-label">Default OG Image URL</label>
                            <input
                                className="form-control"
                                value={data.seo_default_og_image || ''}
                                onChange={(event) =>
                                    setData(
                                        'seo_default_og_image',
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Twitter Handle</label>
                            <input
                                className="form-control"
                                value={data.seo_twitter_handle || ''}
                                onChange={(event) =>
                                    setData(
                                        'seo_twitter_handle',
                                        event.target.value,
                                    )
                                }
                                placeholder="@handle"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <h6 className="mb-3">Schema: Person</h6>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Name (AR)</label>
                                <input
                                    className="form-control"
                                    value={data.seo_person_name_ar || ''}
                                    onChange={(event) =>
                                        setData(
                                            'seo_person_name_ar',
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Name (EN)</label>
                                <input
                                    className="form-control"
                                    value={data.seo_person_name_en || ''}
                                    onChange={(event) =>
                                        setData(
                                            'seo_person_name_en',
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Job Title (AR)</label>
                                <input
                                    className="form-control"
                                    value={data.seo_person_job_title_ar || ''}
                                    onChange={(event) =>
                                        setData(
                                            'seo_person_job_title_ar',
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Job Title (EN)</label>
                                <input
                                    className="form-control"
                                    value={data.seo_person_job_title_en || ''}
                                    onChange={(event) =>
                                        setData(
                                            'seo_person_job_title_en',
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Person Image URL</label>
                                <input
                                    className="form-control"
                                    value={data.seo_person_image || ''}
                                    onChange={(event) =>
                                        setData(
                                            'seo_person_image',
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h6 className="mb-3">Schema: Organization</h6>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Name (AR)</label>
                                <input
                                    className="form-control"
                                    value={data.seo_org_name_ar || ''}
                                    onChange={(event) =>
                                        setData(
                                            'seo_org_name_ar',
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Name (EN)</label>
                                <input
                                    className="form-control"
                                    value={data.seo_org_name_en || ''}
                                    onChange={(event) =>
                                        setData(
                                            'seo_org_name_en',
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Logo URL</label>
                                <input
                                    className="form-control"
                                    value={data.seo_org_logo || ''}
                                    onChange={(event) =>
                                        setData('seo_org_logo', event.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h6 className="mb-3">SEO per Page</h6>
                        <div className="row g-3">
                            {seoPages.map((page, index) => (
                                <div className="col-12" key={page.key || index}>
                                    <div className="border rounded-4 p-3 h-100">
                                        <div className="fw-semibold mb-3">
                                            {seoPageLabels[page.key] || page.key}
                                        </div>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label">
                                                    Meta Title (AR)
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={page.meta_title_ar || ''}
                                                    onChange={(event) =>
                                                        updateSeoPage(
                                                            index,
                                                            'meta_title_ar',
                                                            event.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">
                                                    Meta Title (EN)
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={page.meta_title_en || ''}
                                                    onChange={(event) =>
                                                        updateSeoPage(
                                                            index,
                                                            'meta_title_en',
                                                            event.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">
                                                    Meta Description (AR)
                                                </label>
                                                <textarea
                                                    rows="2"
                                                    className="form-control"
                                                    value={page.meta_description_ar || ''}
                                                    onChange={(event) =>
                                                        updateSeoPage(
                                                            index,
                                                            'meta_description_ar',
                                                            event.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">
                                                    Meta Description (EN)
                                                </label>
                                                <textarea
                                                    rows="2"
                                                    className="form-control"
                                                    value={page.meta_description_en || ''}
                                                    onChange={(event) =>
                                                        updateSeoPage(
                                                            index,
                                                            'meta_description_en',
                                                            event.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">
                                                    OG Image URL
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={page.og_image || ''}
                                                    onChange={(event) =>
                                                        updateSeoPage(
                                                            index,
                                                            'og_image',
                                                            event.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">
                                                    Meta Robots
                                                </label>
                                                <select
                                                    className="form-select"
                                                    value={page.robots || ''}
                                                    onChange={(event) =>
                                                        updateSeoPage(
                                                            index,
                                                            'robots',
                                                            event.target.value,
                                                        )
                                                    }
                                                >
                                                    {robotsOptions.map((option) => (
                                                        <option
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="content-card mb-4">
                    <h5 className="mb-3">{t('المحتوى القانوني', 'Legal')}</h5>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('سياسة الخصوصية (عربي)', 'Privacy Policy (AR)')}
                            </label>
                            <RichTextEditor
                                value={data.privacy_policy_ar || ''}
                                onChange={(value) =>
                                    setData('privacy_policy_ar', value)
                                }
                                placeholder={t(
                                    'نص قانوني يوضح سياسة الخصوصية',
                                    'Add privacy policy content',
                                )}
                            />
                            {fieldError('privacy_policy_ar') && (
                                <div className="text-danger small mt-2">
                                    {fieldError('privacy_policy_ar')}
                                </div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('سياسة الخصوصية (إنجليزي)', 'Privacy Policy (EN)')}
                            </label>
                            <RichTextEditor
                                value={data.privacy_policy_en || ''}
                                onChange={(value) =>
                                    setData('privacy_policy_en', value)
                                }
                                placeholder="Add privacy policy content"
                            />
                            {fieldError('privacy_policy_en') && (
                                <div className="text-danger small mt-2">
                                    {fieldError('privacy_policy_en')}
                                </div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('شروط الاستخدام (عربي)', 'Terms of Use (AR)')}
                            </label>
                            <RichTextEditor
                                value={data.terms_of_use_ar || ''}
                                onChange={(value) =>
                                    setData('terms_of_use_ar', value)
                                }
                                placeholder={t(
                                    'نص قانوني يوضح شروط الاستخدام',
                                    'Add terms of use content',
                                )}
                            />
                            {fieldError('terms_of_use_ar') && (
                                <div className="text-danger small mt-2">
                                    {fieldError('terms_of_use_ar')}
                                </div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('شروط الاستخدام (إنجليزي)', 'Terms of Use (EN)')}
                            </label>
                            <RichTextEditor
                                value={data.terms_of_use_en || ''}
                                onChange={(value) =>
                                    setData('terms_of_use_en', value)
                                }
                                placeholder="Add terms of use content"
                            />
                            {fieldError('terms_of_use_en') && (
                                <div className="text-danger small mt-2">
                                    {fieldError('terms_of_use_en')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="content-card mb-4">
                    <h5 className="mb-3">{t('إعدادات البريد SMTP', 'SMTP Settings')}</h5>
                    <div className="row g-3">
                        <div className="col-md-3">
                            <div className="form-check form-switch mt-4">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="smtp-enabled"
                                    checked={Boolean(data.smtp_enabled)}
                                    onChange={(event) =>
                                        setData('smtp_enabled', event.target.checked)
                                    }
                                />
                                <label className="form-check-label" htmlFor="smtp-enabled">
                                    {t('تفعيل SMTP', 'Enable SMTP')}
                                </label>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">
                                {t('المُرسل', 'Mailer')}
                            </label>
                            <input
                                className="form-control"
                                value={data.smtp_mailer || ''}
                                onChange={(event) =>
                                    setData('smtp_mailer', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">{t('المضيف', 'Host')}</label>
                            <input
                                className="form-control"
                                value={data.smtp_host || ''}
                                onChange={(event) =>
                                    setData('smtp_host', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">{t('المنفذ', 'Port')}</label>
                            <input
                                className="form-control"
                                value={data.smtp_port || ''}
                                onChange={(event) =>
                                    setData('smtp_port', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">
                                {t('اسم المستخدم', 'Username')}
                            </label>
                            <input
                                className="form-control"
                                value={data.smtp_username || ''}
                                onChange={(event) =>
                                    setData('smtp_username', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">
                                {t('كلمة المرور', 'Password')}
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                value={data.smtp_password || ''}
                                onChange={(event) =>
                                    setData('smtp_password', event.target.value)
                                }
                                placeholder={t(
                                    'اتركها فارغة للاحتفاظ بالحالية',
                                    'Leave blank to keep current',
                                )}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">
                                {t('التشفير', 'Encryption')}
                            </label>
                            <input
                                className="form-control"
                                value={data.smtp_encryption || ''}
                                onChange={(event) =>
                                    setData('smtp_encryption', event.target.value)
                                }
                                placeholder="tls"
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('بريد المرسل', 'From Address')}
                            </label>
                            <input
                                className="form-control"
                                value={data.smtp_from_address || ''}
                                onChange={(event) =>
                                    setData('smtp_from_address', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('اسم المرسل', 'From Name')}
                            </label>
                            <input
                                className="form-control"
                                value={data.smtp_from_name || ''}
                                onChange={(event) =>
                                    setData('smtp_from_name', event.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="content-card mb-4">
                    <h5 className="mb-3">{t('الحماية و Captcha', 'Security & Captcha')}</h5>
                    <div className="row g-3">
                        <div className="col-md-3">
                            <div className="form-check form-switch mt-4">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="captcha-enabled"
                                    checked={Boolean(data.captcha_enabled)}
                                    onChange={(event) =>
                                        setData('captcha_enabled', event.target.checked)
                                    }
                                />
                                <label className="form-check-label" htmlFor="captcha-enabled">
                                    {t('تفعيل Captcha', 'Enable Captcha')}
                                </label>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">
                                {t('المزود', 'Provider')}
                            </label>
                            <select
                                className="form-select"
                                value={data.captcha_provider || 'hcaptcha'}
                                onChange={(event) =>
                                    setData('captcha_provider', event.target.value)
                                }
                            >
                                <option value="hcaptcha">hCaptcha</option>
                                <option value="turnstile">Turnstile</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">{t('Site Key', 'Site Key')}</label>
                            <input
                                className="form-control"
                                value={data.captcha_site_key || ''}
                                onChange={(event) =>
                                    setData('captcha_site_key', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">{t('Secret', 'Secret')}</label>
                            <input
                                type="password"
                                className="form-control"
                                value={data.captcha_secret || ''}
                                onChange={(event) =>
                                    setData('captcha_secret', event.target.value)
                                }
                                placeholder={t(
                                    'اتركه فارغًا للاحتفاظ بالحالي',
                                    'Leave blank to keep current',
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="content-card mb-4">
                    <h5 className="mb-3">{t('تنبيهات Slack/Telegram', 'Alerts')}</h5>
                    <div className="row g-3">
                        <div className="col-md-3">
                            <div className="form-check form-switch mt-4">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="alerts-enabled"
                                    checked={Boolean(data.alerts_enabled)}
                                    onChange={(event) =>
                                        setData('alerts_enabled', event.target.checked)
                                    }
                                />
                                <label className="form-check-label" htmlFor="alerts-enabled">
                                    {t('تفعيل التنبيهات', 'Enable Alerts')}
                                </label>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <label className="form-label">
                                {t('رابط Slack Webhook', 'Slack Webhook URL')}
                            </label>
                            <input
                                className="form-control"
                                value={data.alerts_slack_webhook || ''}
                                onChange={(event) =>
                                    setData('alerts_slack_webhook', event.target.value)
                                }
                                placeholder="https://hooks.slack.com/services/..."
                            />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">
                                {t('Chat ID', 'Chat ID')}
                            </label>
                            <input
                                className="form-control"
                                value={data.alerts_telegram_chat_id || ''}
                                onChange={(event) =>
                                    setData('alerts_telegram_chat_id', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">
                                {t('Telegram Token', 'Telegram Token')}
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                value={data.alerts_telegram_bot_token || ''}
                                onChange={(event) =>
                                    setData('alerts_telegram_bot_token', event.target.value)
                                }
                                placeholder={t(
                                    'اتركه فارغًا للاحتفاظ بالحالي',
                                    'Leave blank to keep current',
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="content-card mb-4">
                    <h5 className="mb-3">{t('النشرة البريدية والتسويق', 'Newsletter & Marketing')}</h5>
                    <div className="row g-3">
                        <div className="col-md-3">
                            <div className="form-check form-switch mt-4">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="newsletter-enabled"
                                    checked={Boolean(data.newsletter_enabled)}
                                    onChange={(event) =>
                                        setData('newsletter_enabled', event.target.checked)
                                    }
                                />
                                <label className="form-check-label" htmlFor="newsletter-enabled">
                                    {t('تفعيل النشرة', 'Enable Newsletter')}
                                </label>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-check form-switch mt-4">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="newsletter-double"
                                    checked={Boolean(data.newsletter_double_opt_in)}
                                    onChange={(event) =>
                                        setData(
                                            'newsletter_double_opt_in',
                                            event.target.checked,
                                        )
                                    }
                                />
                                <label className="form-check-label" htmlFor="newsletter-double">
                                    {t('تأكيد مزدوج', 'Double Opt-In')}
                                </label>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-check form-switch mt-4">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="mailchimp-enabled"
                                    checked={Boolean(data.mailchimp_enabled)}
                                    onChange={(event) =>
                                        setData('mailchimp_enabled', event.target.checked)
                                    }
                                />
                                <label className="form-check-label" htmlFor="mailchimp-enabled">
                                    Mailchimp
                                </label>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-check form-switch mt-4">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="sendinblue-enabled"
                                    checked={Boolean(data.sendinblue_enabled)}
                                    onChange={(event) =>
                                        setData('sendinblue_enabled', event.target.checked)
                                    }
                                />
                                <label className="form-check-label" htmlFor="sendinblue-enabled">
                                    Sendinblue
                                </label>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Mailchimp API Key</label>
                            <input
                                type="password"
                                className="form-control"
                                value={data.mailchimp_api_key || ''}
                                onChange={(event) =>
                                    setData('mailchimp_api_key', event.target.value)
                                }
                                placeholder={t(
                                    'اتركه فارغًا للاحتفاظ بالحالي',
                                    'Leave blank to keep current',
                                )}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Mailchimp List ID</label>
                            <input
                                className="form-control"
                                value={data.mailchimp_list_id || ''}
                                onChange={(event) =>
                                    setData('mailchimp_list_id', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Mailchimp Datacenter</label>
                            <input
                                className="form-control"
                                value={data.mailchimp_datacenter || ''}
                                onChange={(event) =>
                                    setData('mailchimp_datacenter', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Sendinblue API Key</label>
                            <input
                                type="password"
                                className="form-control"
                                value={data.sendinblue_api_key || ''}
                                onChange={(event) =>
                                    setData('sendinblue_api_key', event.target.value)
                                }
                                placeholder={t(
                                    'اتركه فارغًا للاحتفاظ بالحالي',
                                    'Leave blank to keep current',
                                )}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Sendinblue List ID</label>
                            <input
                                className="form-control"
                                value={data.sendinblue_list_id || ''}
                                onChange={(event) =>
                                    setData('sendinblue_list_id', event.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="content-card mb-4">
                    <h5 className="mb-3">{t('الحجوزات والدردشة', 'Embeds & Chat')}</h5>
                    <div className="row g-3">
                        <div className="col-md-3">
                            <div className="form-check form-switch mt-4">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="calendly-enabled"
                                    checked={Boolean(data.calendly_enabled)}
                                    onChange={(event) =>
                                        setData('calendly_enabled', event.target.checked)
                                    }
                                />
                                <label className="form-check-label" htmlFor="calendly-enabled">
                                    {t('تفعيل Calendly', 'Enable Calendly')}
                                </label>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <label className="form-label">
                                {t('رابط Calendly', 'Calendly URL')}
                            </label>
                            <input
                                className="form-control"
                                value={data.calendly_url || ''}
                                onChange={(event) =>
                                    setData('calendly_url', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">{t('مزوّد الدردشة', 'Chat Provider')}</label>
                            <select
                                className="form-select"
                                value={data.chat_provider || 'none'}
                                onChange={(event) =>
                                    setData('chat_provider', event.target.value)
                                }
                            >
                                <option value="none">{t('بدون', 'None')}</option>
                                <option value="crisp">Crisp</option>
                                <option value="intercom">Intercom</option>
                                <option value="custom">{t('كود مخصص', 'Custom')}</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Crisp Website ID</label>
                            <input
                                className="form-control"
                                value={data.crisp_website_id || ''}
                                onChange={(event) =>
                                    setData('crisp_website_id', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Intercom App ID</label>
                            <input
                                className="form-control"
                                value={data.intercom_app_id || ''}
                                onChange={(event) =>
                                    setData('intercom_app_id', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label className="form-label">
                                {t('كود الدردشة المخصص', 'Custom Chat Script')}
                            </label>
                            <textarea
                                rows="3"
                                className="form-control"
                                value={data.chat_custom_script || ''}
                                onChange={(event) =>
                                    setData('chat_custom_script', event.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="content-card mb-4">
                    <h5 className="mb-3">{t('صفحة الخدمات الاستشارية', 'Consulting Page')}</h5>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('عنوان (عربي)', 'Title (AR)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.consulting_title_ar || ''}
                                onChange={(event) =>
                                    setData('consulting_title_ar', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('عنوان (إنجليزي)', 'Title (EN)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.consulting_title_en || ''}
                                onChange={(event) =>
                                    setData('consulting_title_en', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('ملخص (عربي)', 'Summary (AR)')}
                            </label>
                            <textarea
                                rows="2"
                                className="form-control"
                                value={data.consulting_summary_ar || ''}
                                onChange={(event) =>
                                    setData('consulting_summary_ar', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('ملخص (إنجليزي)', 'Summary (EN)')}
                            </label>
                            <textarea
                                rows="2"
                                className="form-control"
                                value={data.consulting_summary_en || ''}
                                onChange={(event) =>
                                    setData('consulting_summary_en', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('المحتوى (عربي)', 'Body (AR)')}
                            </label>
                            <RichTextEditor
                                value={data.consulting_body_ar || ''}
                                onChange={(value) =>
                                    setData('consulting_body_ar', value)
                                }
                                placeholder={t('اكتب التفاصيل هنا', 'Add details')}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('المحتوى (إنجليزي)', 'Body (EN)')}
                            </label>
                            <RichTextEditor
                                value={data.consulting_body_en || ''}
                                onChange={(value) =>
                                    setData('consulting_body_en', value)
                                }
                                placeholder="Add details"
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('زر الدعوة (عربي)', 'CTA (AR)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.consulting_cta_ar || ''}
                                onChange={(event) =>
                                    setData('consulting_cta_ar', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('زر الدعوة (إنجليزي)', 'CTA (EN)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.consulting_cta_en || ''}
                                onChange={(event) =>
                                    setData('consulting_cta_en', event.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="content-card mb-4">
                    <h5 className="mb-3">{t('صفحة فرص العمل', 'Careers Page')}</h5>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('عنوان (عربي)', 'Title (AR)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.careers_title_ar || ''}
                                onChange={(event) =>
                                    setData('careers_title_ar', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('عنوان (إنجليزي)', 'Title (EN)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.careers_title_en || ''}
                                onChange={(event) =>
                                    setData('careers_title_en', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('ملخص (عربي)', 'Summary (AR)')}
                            </label>
                            <textarea
                                rows="2"
                                className="form-control"
                                value={data.careers_summary_ar || ''}
                                onChange={(event) =>
                                    setData('careers_summary_ar', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('ملخص (إنجليزي)', 'Summary (EN)')}
                            </label>
                            <textarea
                                rows="2"
                                className="form-control"
                                value={data.careers_summary_en || ''}
                                onChange={(event) =>
                                    setData('careers_summary_en', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('المحتوى (عربي)', 'Body (AR)')}
                            </label>
                            <RichTextEditor
                                value={data.careers_body_ar || ''}
                                onChange={(value) =>
                                    setData('careers_body_ar', value)
                                }
                                placeholder={t('اكتب التفاصيل هنا', 'Add details')}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('المحتوى (إنجليزي)', 'Body (EN)')}
                            </label>
                            <RichTextEditor
                                value={data.careers_body_en || ''}
                                onChange={(value) =>
                                    setData('careers_body_en', value)
                                }
                                placeholder="Add details"
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('زر الدعوة (عربي)', 'CTA (AR)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.careers_cta_ar || ''}
                                onChange={(event) =>
                                    setData('careers_cta_ar', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('زر الدعوة (إنجليزي)', 'CTA (EN)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.careers_cta_en || ''}
                                onChange={(event) =>
                                    setData('careers_cta_en', event.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="content-card mb-4">
                    <h5 className="mb-3">{t('ملاحظة الفوتر', 'Footer Note')}</h5>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('ملاحظة الفوتر (عربي)', 'Footer Note (AR)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.footer_note_ar || ''}
                                onChange={(event) =>
                                    setData('footer_note_ar', event.target.value)
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                {t('ملاحظة الفوتر (إنجليزي)', 'Footer Note (EN)')}
                            </label>
                            <input
                                className="form-control"
                                value={data.footer_note_en || ''}
                                onChange={(event) =>
                                    setData('footer_note_en', event.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end">
                    <button className="btn btn-primary" disabled={processing} type="submit">
                        {t('حفظ التغييرات', 'Save Changes')}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
