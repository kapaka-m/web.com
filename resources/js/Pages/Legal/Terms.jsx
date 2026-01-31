// MOHAMED HASSANIN (KAPAKA)
import Breadcrumbs from '@/Components/Breadcrumbs';
import Seo from '@/Components/Seo';
import PublicLayout from '@/Layouts/PublicLayout';
import { usePage } from '@inertiajs/react';

export default function Terms({ site }) {
    const { locale } = usePage().props;
    const title = locale === 'ar' ? 'شروط الاستخدام' : 'Terms of Use';
    const content = site?.legal?.terms_of_use || '';

    const breadcrumbs = [
        { label: locale === 'ar' ? 'الرئيسية' : 'Home', href: route('home', { locale }) },
        { label: title },
    ];

    return (
        <PublicLayout site={site}>
            <Seo
                title={title}
                description={site?.tagline}
                url={route('terms', { locale })}
                pageKey="terms"
            />
            <section className="page-header">
                <div className="container">
                    <Breadcrumbs items={breadcrumbs} />
                    <h1 className="section-title">{title}</h1>
                </div>
            </section>
            <section className="section">
                <div className="container">
                    {content ? (
                        <div className="content-card">
                            <div
                                className="rich-content"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        </div>
                    ) : (
                        <div className="content-card text-center">
                            {locale === 'ar'
                                ? 'سيتم تحديث شروط الاستخدام قريباً.'
                                : 'Terms of use content will be available soon.'}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
