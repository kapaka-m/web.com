// MOHAMED HASSANIN (KAPAKA)
import Seo from '@/Components/Seo';
import PublicLayout from '@/Layouts/PublicLayout';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

const createMarkup = (value) => ({ __html: value || '' });

export default function Consulting({ site }) {
    const { locale } = usePage().props;
    const isArabic = locale === 'ar';
    const t = (ar, en) => (isArabic ? ar : en);

    const consulting = site?.consulting || {};
    const title = consulting.title || t('??????????', 'Consulting');
    const summary =
        consulting.summary ||
        t('????? ?????? ??? ??? ????? ???????.', 'Turn ideas into delivery plans.');
    const body =
        consulting.body ||
        t(
            '????? ????? ???????? ?????? ?????????? ????? ??????? ????? ????? ???? ?????.',
            'I provide advisory sessions to define requirements, improve performance, and build a clear roadmap.',
        );

    const calendly = site?.integrations?.calendly;

    useEffect(() => {
        if (!calendly?.enabled || !calendly?.url) {
            return;
        }

        const cssId = 'calendly-css';
        if (!document.getElementById(cssId)) {
            const link = document.createElement('link');
            link.id = cssId;
            link.rel = 'stylesheet';
            link.href = 'https://assets.calendly.com/assets/external/widget.css';
            document.head.appendChild(link);
        }

        const scriptId = 'calendly-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://assets.calendly.com/assets/external/widget.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, [calendly]);

    return (
        <PublicLayout site={site}>
            <Seo
                title={title}
                description={summary}
                url={route('consulting', { locale })}
                pageKey="consulting"
            />
            <section className="page-header">
                <div className="container">
                    <h1 className="section-title">{title}</h1>
                    <p className="section-subtitle">{summary}</p>
                </div>
            </section>
            <section className="section">
                <div className="container">
                    <div className="content-card">
                        <div
                            className="text-muted"
                            dangerouslySetInnerHTML={createMarkup(body)}
                        ></div>
                    </div>
                    {calendly?.enabled && calendly?.url && (
                        <div className="content-card mt-4">
                            <h5 className="mb-3">
                                {t('???? ??????', 'Book a session')}
                            </h5>
                            <div
                                className="calendly-inline-widget"
                                data-url={calendly.url}
                                style={{ minWidth: '320px', height: '720px' }}
                            ></div>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
