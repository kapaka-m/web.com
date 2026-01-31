// MOHAMED HASSANIN (KAPAKA)
import Breadcrumbs from '@/Components/Breadcrumbs';
import Seo from '@/Components/Seo';
import PublicLayout from '@/Layouts/PublicLayout';
import { buildOrganizationSchema, buildPersonSchema, buildSeoGraph } from '@/Support/seoSchema';
import { Link, usePage } from '@inertiajs/react';

export default function ServiceShow({ site, service }) {
    const { locale, appUrl } = usePage().props;
    const url = route('services.show', { locale, service: service.slug });
    const organization = buildOrganizationSchema(site, appUrl);
    const person = buildPersonSchema(site, appUrl, organization);
    const provider = organization || person;
    const seoTitle = service?.seo?.meta_title || service.title;
    const seoDescription = service?.seo?.meta_description || service.summary;
    const serviceSchema = {
        '@type': 'Service',
        name: service.title,
        description: service.summary || undefined,
        url,
        serviceType: service.title,
        ...(provider ? { provider } : {}),
        ...(site?.contact?.location
            ? { areaServed: site.contact.location }
            : {}),
    };
    const schema = buildSeoGraph([serviceSchema, organization, person]);

    const breadcrumbs = [
        { label: locale === 'ar' ? 'الرئيسية' : 'Home', href: route('home', { locale }) },
        { label: locale === 'ar' ? 'الخدمات' : 'Services', href: route('services.index', { locale }) },
        { label: service.title },
    ];

    return (
        <PublicLayout site={site}>
            <Seo
                title={seoTitle}
                description={seoDescription}
                url={url}
                image={service?.seo?.og_image || null}
                robots={service?.seo?.robots || null}
                schema={schema}
            />
            <section className="page-header">
                <div className="container">
                    <Breadcrumbs items={breadcrumbs} />
                    <h1 className="section-title">{service.title}</h1>
                    <p className="section-subtitle">{service.summary}</p>
                </div>
            </section>
            <section className="section">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="content-card">
                                <h5 className="mb-3">
                                    {locale === 'ar'
                                        ? 'وصف الخدمة'
                                        : 'Service Overview'}
                                </h5>
                                <p className="text-muted mb-0">
                                    {service.description || service.summary}
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="content-card">
                                <h6 className="mb-3">
                                    {locale === 'ar'
                                        ? 'ما الذي ستحصل عليه؟'
                                        : 'Key Deliverables'}
                                </h6>
                                <ul className="list-unstyled mb-3">
                                    {service.features.map((feature) => (
                                        <li
                                            className="d-flex align-items-start gap-2 mb-2"
                                            key={feature}
                                        >
                                            <i className="bi bi-check2-circle text-success mt-1"></i>
                                            <span className="small">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    className="btn btn-primary w-100"
                                    href={route('contact', { locale })}
                                >
                                    {locale === 'ar'
                                        ? 'اطلب الخدمة الآن'
                                        : 'Start a Project'}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
