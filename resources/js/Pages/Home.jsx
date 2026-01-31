// MOHAMED HASSANIN (KAPAKA)
import ResponsiveImage from '@/Components/ResponsiveImage';
import Seo from '@/Components/Seo';
import PublicLayout from '@/Layouts/PublicLayout';
import { resolveImageUrl } from '@/Support/resolveImageUrl';
import { buildOrganizationSchema, buildPersonSchema, buildSeoGraph } from '@/Support/seoSchema';
import { Link, usePage } from '@inertiajs/react';

export default function Home({ site, services, projects, posts, testimonials = [], partners = [] }) {
    const { locale, appUrl } = usePage().props;

    const labels = {
        servicesTitle: locale === 'ar' ? 'خدمات أساسية' : 'Signature Services',
        servicesSubtitle:
            locale === 'ar'
                ? 'حلول متكاملة من التحليل حتى الإطلاق مع تسليم واضح ومقاس.'
                : 'End-to-end solutions from discovery to launch.',
        projectsTitle: locale === 'ar' ? 'مشاريع مختارة' : 'Selected Projects',
        projectsSubtitle:
            locale === 'ar'
                ? 'نماذج من أعمال حققت نتائج واضحة وقابلة للقياس.'
                : 'A glimpse of projects that delivered measurable impact.',
        aboutTitle: locale === 'ar' ? 'خبرة شاملة' : 'End-to-end Expertise',
        aboutSubtitle:
            locale === 'ar'
                ? 'من الاستراتيجية حتى الإطلاق، كل خطوة محسوبة بعناية.'
                : 'From strategy to shipping, every step is intentional.',
        testimonialsTitle: locale === 'ar' ? 'شهادات العملاء' : 'Client Testimonials',
        testimonialsSubtitle:
            locale === 'ar'
                ? 'آراء من عملاء وشركاء تعاونوا معي في مشاريع واقعية.'
                : 'Words from clients and partners about our collaborations.',
        partnersTitle: locale === 'ar' ? 'شركاء وثقوا بنا' : 'Trusted By',
        partnersSubtitle:
            locale === 'ar'
                ? 'علامات تجارية وفرق اعتمدت على حلولنا الرقمية.'
                : 'Brands and teams that trusted our digital delivery.',
        blogTitle: locale === 'ar' ? 'أحدث المقالات' : 'Latest Insights',
        blogSubtitle:
            locale === 'ar'
                ? 'محتوى مركّز حول التطوير والأمن وبناء المنتجات الرقمية.'
                : 'Thoughts on engineering, security, and digital products.',
    };

    const title =
        site?.seo?.meta_title || (locale === 'ar' ? 'الصفحة الرئيسية' : 'Home');
    const description = site?.seo?.meta_description || site?.tagline;
    const organization = buildOrganizationSchema(site, appUrl);
    const person = buildPersonSchema(site, appUrl, organization);
    const schema = buildSeoGraph([organization, person]);

    return (
        <PublicLayout site={site}>
            <Seo
                title={title}
                description={description}
                url={route('home', { locale })}
                pageKey="home"
                schema={schema}
            />

            <section className="hero">
                <div className="container">
                    <div className="row align-items-center g-4">
                        <div className="col-lg-6 hero-content">
                            {site?.hero?.badge && (
                                <span className="badge-soft d-inline-flex align-items-center gap-2 mb-3">
                                    <span className="bi bi-stars"></span>
                                    {site.hero.badge}
                                </span>
                            )}
                            <h1 className="display-5 fw-bold mb-3">
                                {site?.hero?.headline}
                            </h1>
                            <p className="lead text-muted mb-4">
                                {site?.hero?.subheadline}
                            </p>
                            <div className="d-flex flex-wrap gap-3 mb-4">
                                <Link
                                    className="btn btn-primary btn-lg"
                                    href={route('projects.index', { locale })}
                                >
                                    {site?.hero?.primary_cta}
                                </Link>
                                <Link
                                    className="btn btn-outline-dark btn-lg"
                                    href={route('contact', { locale })}
                                >
                                    {site?.hero?.secondary_cta}
                                </Link>
                            </div>
                            <div className="d-flex flex-wrap gap-4">
                                {(site?.stats || []).map((stat) => (
                                    <div key={stat.label}>
                                        <div className="h4 mb-0 fw-bold">
                                            {stat.value}
                                        </div>
                                        <div className="text-muted small">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="hero-card">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <span className="icon-badge">
                                        <i className="bi bi-rocket-takeoff"></i>
                                    </span>
                                    <div>
                                        <h5 className="mb-1">
                                            {site?.about?.title}
                                        </h5>
                                        <p className="text-muted mb-0">
                                            {site?.about?.summary}
                                        </p>
                                    </div>
                                </div>
                                <div className="row g-3">
                                    {(site?.about?.highlights || []).map((item) => (
                                        <div className="col-md-6" key={item.title}>
                                            <div className="p-3 border rounded-4 bg-white shadow-soft h-100">
                                                <h6 className="mb-2">
                                                    {item.title}
                                                </h6>
                                                <p className="text-muted mb-0 small">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="mb-5">
                        <h2 className="section-title">{labels.servicesTitle}</h2>
                        <p className="section-subtitle">{labels.servicesSubtitle}</p>
                    </div>
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
                                    <ul className="list-unstyled mb-0">
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
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section bg-white">
                <div className="container">
                    <div className="mb-5 d-flex flex-wrap align-items-center justify-content-between gap-3">
                        <div>
                            <h2 className="section-title">{labels.projectsTitle}</h2>
                            <p className="section-subtitle">{labels.projectsSubtitle}</p>
                        </div>
                        <Link
                            className="btn btn-outline-primary"
                            href={route('projects.index', { locale })}
                        >
                            {locale === 'ar' ? 'عرض الكل' : 'View All'}
                        </Link>
                    </div>
                    <div className="row g-4">
                        {projects.map((project) => (
                            <div className="col-lg-4" key={project.id}>
                                <div className="card project-card h-100 p-3">
                                    <div
                                        className={`project-thumb mb-3 ${
                                            resolveImageUrl(project.cover_image)
                                                ? 'has-image'
                                                : ''
                                        }`}
                                    >
                                        {resolveImageUrl(project.cover_image) && (
                                            <ResponsiveImage
                                                src={project.cover_image}
                                                srcSet={project.cover_image_srcset}
                                                alt={project.title}
                                                className="project-thumb-image"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        )}
                                        <div className="project-thumb-content">
                                            <span className="badge-soft">
                                                {project.year}
                                            </span>
                                            <span className="badge-soft">
                                                {project.client}
                                            </span>
                                        </div>
                                    </div>
                                    <h5 className="mb-2">{project.title}</h5>
                                    <p className="text-muted">{project.summary}</p>
                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                        {project.stack.map((item) => (
                                            <span key={item} className="badge-soft">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                    <Link
                                        className="stretched-link text-primary"
                                        href={route('projects.show', {
                                            locale,
                                            project: project.slug,
                                        })}
                                    >
                                        {locale === 'ar'
                                            ? 'تفاصيل المشروع'
                                            : 'Project Details'}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {testimonials.length > 0 && (
                <section className="section">
                    <div className="container">
                        <div className="mb-5">
                            <h2 className="section-title">
                                {labels.testimonialsTitle}
                            </h2>
                            <p className="section-subtitle">
                                {labels.testimonialsSubtitle}
                            </p>
                        </div>
                        <div className="row g-4">
                            {testimonials.map((item) => {
                                const avatar = resolveImageUrl(item.avatar);
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
                                                {avatar ? (
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
                </section>
            )}

            {partners.length > 0 && (
                <section className="section bg-white">
                    <div className="container">
                        <div className="mb-4">
                            <h2 className="section-title">{labels.partnersTitle}</h2>
                            <p className="section-subtitle">
                                {labels.partnersSubtitle}
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
                </section>
            )}

            <section className="section">
                <div className="container">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-6">
                            <h2 className="section-title">{labels.aboutTitle}</h2>
                            <p className="section-subtitle">{labels.aboutSubtitle}</p>
                            <p className="text-muted">{site?.about?.body}</p>
                            <Link
                                className="btn btn-outline-dark mt-3"
                                href={route('about', { locale })}
                            >
                                {locale === 'ar' ? 'اعرف المزيد' : 'Learn More'}
                            </Link>
                        </div>
                        <div className="col-lg-6">
                            <div className="row g-3">
                                {(site?.about?.highlights || []).map((item) => (
                                    <div className="col-md-6" key={item.title}>
                                        <div className="p-4 border rounded-4 bg-white shadow-soft h-100">
                                            <h6>{item.title}</h6>
                                            <p className="text-muted small mb-0">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section bg-white">
                <div className="container">
                    <div className="mb-5 d-flex flex-wrap align-items-center justify-content-between gap-3">
                        <div>
                            <h2 className="section-title">{labels.blogTitle}</h2>
                            <p className="section-subtitle">{labels.blogSubtitle}</p>
                        </div>
                        <Link
                            className="btn btn-outline-primary"
                            href={route('blog.index', { locale })}
                        >
                            {locale === 'ar' ? 'كل المقالات' : 'All Posts'}
                        </Link>
                    </div>
                    <div className="row g-4">
                        {posts.map((post) => (
                            <div className="col-md-6 col-lg-4" key={post.id}>
                                <div className="card blog-card h-100 p-3">
                                    <div
                                        className={`blog-thumb mb-3 ${
                                            resolveImageUrl(post.cover_image)
                                                ? 'has-image'
                                                : ''
                                        }`}
                                    >
                                        {resolveImageUrl(post.cover_image) && (
                                            <ResponsiveImage
                                                src={post.cover_image}
                                                srcSet={post.cover_image_srcset}
                                                alt={post.title}
                                                className="blog-thumb-image"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        )}
                                        <div className="blog-thumb-content">
                                            <span className="badge-soft">
                                                {post.published_at}
                                            </span>
                                        </div>
                                    </div>
                                    <h5 className="mb-2">{post.title}</h5>
                                    <p className="text-muted">{post.excerpt}</p>
                                    <Link
                                        className="stretched-link text-primary"
                                        href={route('blog.show', {
                                            locale,
                                            post: post.slug,
                                        })}
                                    >
                                        {locale === 'ar' ? 'اقرأ المقال' : 'Read More'}
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
