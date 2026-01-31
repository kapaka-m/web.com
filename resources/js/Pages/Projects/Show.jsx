// MOHAMED HASSANIN (KAPAKA)
import Breadcrumbs from '@/Components/Breadcrumbs';
import ResponsiveImage from '@/Components/ResponsiveImage';
import Seo from '@/Components/Seo';
import PublicLayout from '@/Layouts/PublicLayout';
import { resolveImageUrl } from '@/Support/resolveImageUrl';
import { buildOrganizationSchema, buildPersonSchema, buildSeoGraph } from '@/Support/seoSchema';
import { usePage } from '@inertiajs/react';

export default function ProjectsShow({ site, project }) {
    const { locale, appUrl } = usePage().props;
    const coverImage = resolveImageUrl(project.cover_image);
    const url = route('projects.show', { locale, project: project.slug });
    const organization = buildOrganizationSchema(site, appUrl);
    const person = buildPersonSchema(site, appUrl, organization);
    const creator = organization || person;
    const seoTitle = project?.seo?.meta_title || project.title;
    const seoDescription = project?.seo?.meta_description || project.summary;
    const seoImage = project?.seo?.og_image || project.cover_image;
    const year = project.year ? String(project.year).trim() : '';
    const creativeSchema = {
        '@type': 'CreativeWork',
        name: project.title,
        description: project.summary || undefined,
        url,
        ...(creator ? { creator } : {}),
        ...(coverImage ? { image: [coverImage] } : {}),
        ...(year ? { dateCreated: `${year}-01-01` } : {}),
    };
    const schema = buildSeoGraph([creativeSchema, organization, person]);

    const breadcrumbs = [
        { label: locale === 'ar' ? 'الرئيسية' : 'Home', href: route('home', { locale }) },
        { label: locale === 'ar' ? 'المشاريع' : 'Projects', href: route('projects.index', { locale }) },
        { label: project.title },
    ];

    return (
        <PublicLayout site={site}>
            <Seo
                title={seoTitle}
                description={seoDescription}
                image={seoImage}
                url={url}
                robots={project?.seo?.robots || null}
                schema={schema}
            />
            <section className="page-header">
                <div className="container">
                    <Breadcrumbs items={breadcrumbs} />
                    <h1 className="section-title">{project.title}</h1>
                    <p className="section-subtitle">{project.summary}</p>
                </div>
            </section>
            <section className="section">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-8">
                            {coverImage && (
                                <div className="detail-cover mb-4">
                                    <ResponsiveImage
                                        src={project.cover_image}
                                        srcSet={project.cover_image_srcset}
                                        alt={project.title}
                                        sizes="100vw"
                                    />
                                </div>
                            )}
                            <div className="content-card">
                                <h5 className="mb-3">
                                    {locale === 'ar'
                                        ? 'تفاصيل المشروع'
                                        : 'Project Details'}
                                </h5>
                                <p className="text-muted mb-0">
                                    {project.description}
                                </p>
                            </div>
                            {project.gallery?.length > 0 && (
                                <div className="content-card mt-4">
                                    <h6 className="mb-3">
                                        {locale === 'ar'
                                            ? 'معرض الصور'
                                            : 'Project Gallery'}
                                    </h6>
                                    <div className="row g-3">
                                        {project.gallery.map((image) => (
                                            <div
                                                className="col-md-6"
                                                key={image.id}
                                            >
                                                <div className="gallery-card">
                                                    <ResponsiveImage
                                                        src={image.image_path}
                                                        srcSet={image.image_srcset}
                                                        alt={image.caption || project.title}
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                    />
                                                    {image.caption && (
                                                        <p className="text-muted small mb-0 mt-2">
                                                            {image.caption}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="col-lg-4">
                            <div className="content-card">
                                <h6 className="mb-3">
                                    {locale === 'ar'
                                        ? 'معلومات سريعة'
                                        : 'Quick Info'}
                                </h6>
                                <div className="mb-3">
                                    <div className="text-muted small">
                                        {locale === 'ar' ? 'العميل' : 'Client'}
                                    </div>
                                    <div className="fw-semibold">
                                        {project.client}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="text-muted small">
                                        {locale === 'ar' ? 'السنة' : 'Year'}
                                    </div>
                                    <div className="fw-semibold">
                                        {project.year}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-muted small mb-2">
                                        {locale === 'ar'
                                            ? 'التقنيات'
                                            : 'Stack'}
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        {project.stack.map((item) => (
                                            <span
                                                className="badge-soft"
                                                key={item}
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
