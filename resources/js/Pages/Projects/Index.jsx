// MOHAMED HASSANIN (KAPAKA)
import ResponsiveImage from '@/Components/ResponsiveImage';
import Seo from '@/Components/Seo';
import PublicLayout from '@/Layouts/PublicLayout';
import { resolveImageUrl } from '@/Support/resolveImageUrl';
import { Link, usePage } from '@inertiajs/react';

export default function ProjectsIndex({ site, projects }) {
    const { locale } = usePage().props;
    const title = locale === 'ar' ? 'المشاريع' : 'Projects';

    return (
        <PublicLayout site={site}>
            <Seo
                title={title}
                description={
                    locale === 'ar'
                        ? 'مجموعة من المشاريع التي تم تنفيذها بتركيز على الجودة والأداء.'
                        : 'A portfolio of projects built with quality, performance, and impact in mind.'
                }
                url={route('projects.index', { locale })}
                pageKey="projects"
            />
            <section className="page-header">
                <div className="container">
                    <h1 className="section-title">{title}</h1>
                    <p className="section-subtitle">
                        {locale === 'ar'
                            ? 'مجموعة من المشاريع التي تم تنفيذها بتركيز على الجودة والأداء.'
                            : 'A portfolio of projects built with quality, performance, and impact in mind.'}
                    </p>
                </div>
            </section>
            <section className="section">
                <div className="container">
                    <div className="row g-4">
                        {projects.map((project) => (
                            <div className="col-md-6 col-lg-4" key={project.id}>
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
                                    <p className="text-muted">
                                        {project.summary}
                                    </p>
                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                        {project.stack.map((item) => (
                                            <span
                                                key={item}
                                                className="badge-soft"
                                            >
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
        </PublicLayout>
    );
}
