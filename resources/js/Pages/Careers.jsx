// MOHAMED HASSANIN (KAPAKA)
import Seo from '@/Components/Seo';
import PublicLayout from '@/Layouts/PublicLayout';
import { usePage } from '@inertiajs/react';

const createMarkup = (value) => ({ __html: value || '' });

export default function Careers({ site }) {
    const { locale } = usePage().props;
    const isArabic = locale === 'ar';
    const t = (ar, en) => (isArabic ? ar : en);

    const careers = site?.careers || {};
    const title = careers.title || t('??? ?????', 'Careers');
    const summary =
        careers.summary ||
        t('???? ??? ???????? ???? ??????.', 'Join the work we build.');
    const body =
        careers.body ||
        t(
            '???? ?????? ?? ????? ?????? ???????? ????????. ???? ??? ????? ??????? ?? ????? ???? ??????.',
            'We are always looking for people who are passionate about technology and design. Send your resume or reach out directly.',
        );

    const cta = careers.cta || t('????? ???', 'Contact me');

    return (
        <PublicLayout site={site}>
            <Seo
                title={title}
                description={summary}
                url={route('careers', { locale })}
                pageKey="careers"
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
                        <div className="mt-4">
                            <a className="btn btn-primary" href={route('contact', { locale })}>
                                {cta}
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
