// MOHAMED HASSANIN (KAPAKA)
import Breadcrumbs from '@/Components/Breadcrumbs';
import ResponsiveImage from '@/Components/ResponsiveImage';
import Seo from '@/Components/Seo';
import PublicLayout from '@/Layouts/PublicLayout';
import { Link, usePage } from '@inertiajs/react';

export default function About({ site, services, testimonials = [], partners = [] }) {
    const { locale } = usePage().props;
    const title = locale === 'ar' ? 'من أنا' : 'About';

    const breadcrumbs = [
        { label: locale === 'ar' ? 'الرئيسية' : 'Home', href: route('home', { locale }) },
        { label: title },
    ];

    return (
        <PublicLayout site={site}>
            <Seo
                title={title}
                description={site?.about?.summary}
                url={route('about', { locale })}
                pageKey="about"
            />
            <section className="page-header">
                <div className="container">
                    <Breadcrumbs items={breadcrumbs} />
                    <h1 className="section-title">{title}</h1>
                    <p className="section-subtitle">{site?.about?.summary}</p>
                </div>
            </section>
            <section className="section">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-7">
                            <div className="content-card">
                                <h5 className="mb-3">
                                    {locale === 'ar' ? 'رحلتي المهنية' : 'My Journey'}
                                </h5>
                                <p className="text-muted mb-4">
                                    {site?.about?.body}
                                </p>
                                <div className="row g-3">
                                    {(site?.stats || []).map((stat) => (
                                        <div className="col-md-4" key={stat.label}>
                                            <div className="p-3 border rounded-4 text-center bg-white">
                                                <div className="h4 mb-1 fw-bold">
                                                    {stat.value}
                                                </div>
                                                <div className="text-muted small">
                                                    {stat.label}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="content-card h-100">
                                <h5 className="mb-3">
                                    {locale === 'ar' ? 'أبرز النقاط' : 'Highlights'}
                                </h5>
                                <div className="d-grid gap-3">
                                    {(site?.about?.highlights || []).map((item) => (
                                        <div
                                            className="border rounded-4 p-3"
                                            key={item.title}
                                        >
                                            <h6 className="mb-2">{item.title}</h6>
                                            <p className="text-muted mb-0 small">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {testimonials.length > 0 && (
                        <div className="mt-5">
                            <div className="mb-4">
                                <h3 className="section-title">
                                    {locale === 'ar'
                                        ? 'شهادات العملاء'
                                        : 'Client Testimonials'}
                                </h3>
                                <p className="section-subtitle">
                                    {locale === 'ar'
                                        ? 'آراء من عملاء وشركاء تعاونوا معي.'
                                        : 'Feedback from clients and partners.'}
                                </p>
                            </div>
                            <div className="row g-4">
                                {testimonials.map((item) => {
                                    return (
                                        <div
                                            className="col-md-6 col-lg-4"
                                            key={item.id}
                                        >
                                            <div className="testimonial-card h-100">
                                                <p className="mb-4">
                                                    &ldquo;{item.quote}&rdquo;
                                                </p>
                                                <div className="d-flex align-items-center gap-3">
                                                    {item.avatar ? (
                                                        <ResponsiveImage
                                                            src={item.avatar}
                                                            srcSet={item.avatar_srcset}
                                                            alt={item.name}
                                                            className="testimonial-avatar"
                                                            sizes="52px"
                                                        />
                                                    ) : (
                                                        <div className="testimonial-avatar placeholder">
                                                            <i className="bi bi-person"></i>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="fw-semibold">
                                                            {item.name}
                                                        </div>
                                                        <div className="text-muted small">
                                                            {[item.role, item.company]
                                                                .filter(Boolean)
                                                                .join(' • ')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {partners.length > 0 && (
                        <div className="mt-5">
                            <div className="mb-4">
                                <h3 className="section-title">
                                    {locale === 'ar' ? 'الشركاء' : 'Partners'}
                                </h3>
                                <p className="section-subtitle">
                                    {locale === 'ar'
                                        ? 'علامات تجارية وثقت في خبراتي.'
                                        : 'Brands that trusted my expertise.'}
                                </p>
                            </div>
                            <div className="row g-3">
                                {partners.map((partner) => (
                                    <div
                                        className="col-6 col-md-4 col-lg-3"
                                        key={partner.id}
                                    >
                                        <a
                                            href={partner.url || '#'}
                                            className="partner-card"
                                            target={partner.url ? '_blank' : undefined}
                                            rel={partner.url ? 'noreferrer' : undefined}
                                        >
                                            {partner.logo ? (
                                                <ResponsiveImage
                                                    src={partner.logo}
                                                    srcSet={partner.logo_srcset}
                                                    alt={partner.name}
                                                    sizes="120px"
                                                />
                                            ) : (
                                                <span>{partner.name}</span>
                                            )}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-5">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                            <h3 className="mb-0">
                                {locale === 'ar'
                                    ? 'الخدمات الأساسية'
                                    : 'Core Services'}
                            </h3>
                            <Link
                                className="btn btn-outline-primary"
                                href={route('services.index', { locale })}
                            >
                                {locale === 'ar' ? 'عرض الخدمات' : 'View Services'}
                            </Link>
                        </div>
                        <div className="row g-4">
                            {services.map((service) => (
                                <div className="col-md-6 col-lg-3" key={service.id}>
                                    <div className="card h-100 shadow-soft p-3">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <span className="icon-badge">
                                                <i className={`bi ${service.icon}`}></i>
                                            </span>
                                            <h6 className="mb-0">{service.title}</h6>
                                        </div>
                                        <p className="text-muted small mb-0">
                                            {service.summary}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
