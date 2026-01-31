// MOHAMED HASSANIN (KAPAKA)
import Breadcrumbs from '@/Components/Breadcrumbs';
import Seo from '@/Components/Seo';
import PublicLayout from '@/Layouts/PublicLayout';
import { Link, usePage } from '@inertiajs/react';

export default function Services({ site, services }) {
    const { locale } = usePage().props;
    const title = locale === 'ar' ? 'الخدمات' : 'Services';

    const breadcrumbs = [
        { label: locale === 'ar' ? 'الرئيسية' : 'Home', href: route('home', { locale }) },
        { label: title },
    ];

    return (
        <PublicLayout site={site}>
            <Seo
                title={title}
                description={
                    locale === 'ar'
                        ? 'خدمات احترافية عبر التطوير والتصميم والأمن.'
                        : 'Professional services across development, design, and security.'
                }
                url={route('services.index', { locale })}
                pageKey="services"
            />
            <section className="page-header">
                <div className="container">
                    <Breadcrumbs items={breadcrumbs} />
                    <h1 className="section-title">{title}</h1>
                    <p className="section-subtitle">
                        {locale === 'ar'
                            ? 'خدمات احترافية عبر التطوير والتصميم والأمن.'
                            : 'Professional services across development, design, and security.'}
                    </p>
                </div>
            </section>
            <section className="section">
                <div className="container">
                    <div className="row g-4">
                        {services.map((service) => (
                            <div className="col-md-6 col-lg-4" key={service.id}>
                                <div className="card h-100 shadow-soft p-4">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <span className="icon-badge">
                                            <i className={`bi ${service.icon}`}></i>
                                        </span>
                                        <h5 className="mb-0">{service.title}</h5>
                                    </div>
                                    <p className="text-muted">{service.summary}</p>
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
                                        className="stretched-link text-primary"
                                        href={route('services.show', {
                                            locale,
                                            service: service.slug,
                                        })}
                                    >
                                        {locale === 'ar'
                                            ? 'تفاصيل الخدمة'
                                            : 'Service Details'}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
