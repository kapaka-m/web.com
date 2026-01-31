// MOHAMED HASSANIN (KAPAKA)
import Seo from '@/Components/Seo';
import PublicLayout from '@/Layouts/PublicLayout';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function Contact({ site, captcha }) {
    const { locale } = usePage().props;
    const isArabic = locale === 'ar';
    const t = (ar, en) => (isArabic ? ar : en);
    const title = t('?????', 'Contact');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        website: '',
        captcha_token: '',
    });

    const [step, setStep] = useState(1);
    const steps = [
        { key: 'details', label: t('???????', 'Your Details') },
        { key: 'message', label: t('?????? ???????', 'Message') },
        { key: 'review', label: t('?????? ??????', 'Review') },
    ];

    const canContinue = useMemo(() => {
        if (step === 1) {
            return data.name.trim() && data.email.trim();
        }
        if (step === 2) {
            return data.message.trim().length > 0;
        }
        return true;
    }, [data.email, data.message, data.name, step]);

    const submit = (event) => {
        event.preventDefault();
        post(route('contact.store', { locale }), {
            onSuccess: () => {
                reset();
                setStep(1);
            },
        });
    };

    const captchaRef = useRef(null);
    const widgetRef = useRef(null);
    const [captchaReady, setCaptchaReady] = useState(false);

    useEffect(() => {
        if (!captcha) {
            return;
        }

        const provider = captcha.provider || 'hcaptcha';
        const scriptId = provider === 'turnstile' ? 'turnstile-script' : 'hcaptcha-script';
        const existing = document.getElementById(scriptId);

        if (existing) {
            if (provider === 'turnstile' && window.turnstile) {
                setCaptchaReady(true);
            }
            if (provider === 'hcaptcha' && window.hcaptcha) {
                setCaptchaReady(true);
            }
            return;
        }

        const script = document.createElement('script');
        script.id = scriptId;
        script.async = true;
        script.defer = true;
        script.onload = () => setCaptchaReady(true);
        script.src =
            provider === 'turnstile'
                ? 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
                : 'https://js.hcaptcha.com/1/api.js?render=explicit';

        document.body.appendChild(script);
    }, [captcha]);

    useEffect(() => {
        if (!captcha || !captchaReady || step !== 3 || !captchaRef.current) {
            return;
        }

        if (widgetRef.current !== null) {
            return;
        }

        const provider = captcha.provider || 'hcaptcha';
        if (provider === 'turnstile' && window.turnstile) {
            widgetRef.current = window.turnstile.render(captchaRef.current, {
                sitekey: captcha.site_key,
                callback: (token) => setData('captcha_token', token),
                'expired-callback': () => setData('captcha_token', ''),
                'error-callback': () => setData('captcha_token', ''),
            });
        }

        if (provider === 'hcaptcha' && window.hcaptcha) {
            widgetRef.current = window.hcaptcha.render(captchaRef.current, {
                sitekey: captcha.site_key,
                callback: (token) => setData('captcha_token', token),
                'expired-callback': () => setData('captcha_token', ''),
                'error-callback': () => setData('captcha_token', ''),
            });
        }
    }, [captcha, captchaReady, setData, step]);

    return (
        <PublicLayout site={site}>
            <Seo
                title={title}
                description={site?.tagline}
                url={route('contact', { locale })}
                pageKey="contact"
            />
            <section className="page-header">
                <div className="container">
                    <h1 className="section-title">{title}</h1>
                    <p className="section-subtitle">
                        {t(
                            '?????? ?? ?????? ?????? ???? ??????.',
                            'Tell me about your project and I will get back to you.',
                        )}
                    </p>
                </div>
            </section>
            <section className="section">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-6">
                            <div className="content-card">
                                <h5 className="mb-3">{t('???? ?????', 'Send a message')}</h5>
                                <div className="stepper mb-4">
                                    {steps.map((item, index) => (
                                        <div
                                            key={item.key}
                                            className={`stepper__item ${
                                                step === index + 1 ? 'is-active' : ''
                                            } ${step > index + 1 ? 'is-done' : ''}`}
                                        >
                                            <span className="stepper__dot">
                                                {index + 1}
                                            </span>
                                            <span className="stepper__label">
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={submit}>
                                    <input
                                        type="text"
                                        className="d-none"
                                        name="website"
                                        value={data.website}
                                        onChange={(event) =>
                                            setData('website', event.target.value)
                                        }
                                    />

                                    {step === 1 && (
                                        <div className="d-grid gap-3">
                                            <div>
                                                <label className="form-label">
                                                    {t('????? ??????', 'Full name')}
                                                </label>
                                                <input
                                                    className={`form-control ${
                                                        errors.name ? 'is-invalid' : ''
                                                    }`}
                                                    value={data.name}
                                                    onChange={(event) =>
                                                        setData('name', event.target.value)
                                                    }
                                                    required
                                                />
                                                {errors.name && (
                                                    <div className="invalid-feedback">
                                                        {errors.name}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="form-label">
                                                    {t('?????? ??????????', 'Email')}
                                                </label>
                                                <input
                                                    type="email"
                                                    className={`form-control ${
                                                        errors.email ? 'is-invalid' : ''
                                                    }`}
                                                    value={data.email}
                                                    onChange={(event) =>
                                                        setData('email', event.target.value)
                                                    }
                                                    required
                                                />
                                                {errors.email && (
                                                    <div className="invalid-feedback">
                                                        {errors.email}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="form-label">
                                                    {t('??? ??????', 'Phone')}
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={data.phone}
                                                    onChange={(event) =>
                                                        setData('phone', event.target.value)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div className="d-grid gap-3">
                                            <div>
                                                <label className="form-label">
                                                    {t('???????', 'Subject')}
                                                </label>
                                                <input
                                                    className="form-control"
                                                    value={data.subject}
                                                    onChange={(event) =>
                                                        setData('subject', event.target.value)
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <label className="form-label">
                                                    {t('???????', 'Message')}
                                                </label>
                                                <textarea
                                                    rows="5"
                                                    className={`form-control ${
                                                        errors.message ? 'is-invalid' : ''
                                                    }`}
                                                    value={data.message}
                                                    onChange={(event) =>
                                                        setData('message', event.target.value)
                                                    }
                                                    required
                                                />
                                                {errors.message && (
                                                    <div className="invalid-feedback">
                                                        {errors.message}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div className="d-grid gap-3">
                                            <div className="border rounded-4 p-3 bg-white">
                                                <div className="small text-muted mb-2">
                                                    {t('???? ???????', 'Message summary')}
                                                </div>
                                                <div className="fw-semibold">
                                                    {data.name || '-'}
                                                </div>
                                                <div className="text-muted small">
                                                    {data.email || '-'}
                                                </div>
                                                {data.phone && (
                                                    <div className="text-muted small">
                                                        {data.phone}
                                                    </div>
                                                )}
                                                {data.subject && (
                                                    <div className="mt-2 fw-semibold">
                                                        {data.subject}
                                                    </div>
                                                )}
                                                <p className="mb-0 text-muted small">
                                                    {data.message}
                                                </p>
                                            </div>
                                            {captcha && (
                                                <div>
                                                    <div ref={captchaRef}></div>
                                                    {errors.captcha_token && (
                                                        <div className="text-danger small mt-2">
                                                            {errors.captcha_token}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-4 d-flex flex-wrap gap-2">
                                        {step > 1 && (
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => setStep(step - 1)}
                                            >
                                                {t('????', 'Back')}
                                            </button>
                                        )}
                                        {step < 3 && (
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                disabled={!canContinue}
                                                onClick={() => setStep(step + 1)}
                                            >
                                                {t('??????', 'Next')}
                                            </button>
                                        )}
                                        {step === 3 && (
                                            <button
                                                className="btn btn-primary"
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? t('???? ???????...', 'Sending...')
                                                    : t('?????', 'Send')}
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="content-card h-100">
                                <h5 className="mb-3">{t('?????? ???????', 'Contact Details')}</h5>
                                <div className="d-flex flex-column gap-3 text-muted">
                                    <div className="d-flex align-items-center gap-3">
                                        <span className="icon-badge">
                                            <i className="bi bi-envelope"></i>
                                        </span>
                                        <div>
                                            <div className="small text-uppercase">
                                                {t('??????', 'Email')}
                                            </div>
                                            <div className="fw-semibold">
                                                {site?.contact?.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <span className="icon-badge">
                                            <i className="bi bi-telephone"></i>
                                        </span>
                                        <div>
                                            <div className="small text-uppercase">
                                                {t('??????', 'Phone')}
                                            </div>
                                            <div className="fw-semibold">
                                                {site?.contact?.phone}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <span className="icon-badge">
                                            <i className="bi bi-geo-alt"></i>
                                        </span>
                                        <div>
                                            <div className="small text-uppercase">
                                                {t('??????', 'Location')}
                                            </div>
                                            <div className="fw-semibold">
                                                {site?.contact?.location}
                                            </div>
                                        </div>
                                    </div>
                                    {site?.contact?.availability && (
                                        <div className="p-3 border rounded-4 bg-white">
                                            <div className="fw-semibold">
                                                {site.contact.availability}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
