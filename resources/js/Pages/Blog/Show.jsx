// MOHAMED HASSANIN (KAPAKA)
import Breadcrumbs from '@/Components/Breadcrumbs';
import ReadingProgress from '@/Components/ReadingProgress';
import ResponsiveImage from '@/Components/ResponsiveImage';
import Seo from '@/Components/Seo';
import TableOfContents from '@/Components/TableOfContents';
import PublicLayout from '@/Layouts/PublicLayout';
import { resolveImageUrl } from '@/Support/resolveImageUrl';
import { buildOrganizationSchema, buildPersonSchema, buildSeoGraph } from '@/Support/seoSchema';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

const slugifyHeading = (value) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/(^-|-$)/g, '');

const buildToc = (html) => {
    if (!html) {
        return { html: '', items: [] };
    }

    if (typeof window === 'undefined' || !window.DOMParser) {
        return { html, items: [] };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const headings = Array.from(doc.querySelectorAll('h2, h3'));
    const usedIds = new Set();
    const items = [];

    headings.forEach((heading, index) => {
        const text = (heading.textContent || '').trim();
        if (!text) {
            return;
        }

        let id = heading.getAttribute('id') || slugifyHeading(text);
        if (!id) {
            id = `section-${index + 1}`;
        }

        let uniqueId = id;
        let counter = 2;
        while (usedIds.has(uniqueId)) {
            uniqueId = `${id}-${counter}`;
            counter += 1;
        }

        usedIds.add(uniqueId);
        heading.setAttribute('id', uniqueId);

        items.push({
            id: uniqueId,
            text,
            level: heading.tagName === 'H3' ? 3 : 2,
        });
    });

    return { html: doc.body.innerHTML, items };
};

export default function BlogShow({ site, post, comments = [], related = [], preview = false }) {
    const { locale, appUrl } = usePage().props;
    const coverImage = resolveImageUrl(post.cover_image);
    const url = route('blog.show', { locale, post: post.slug });
    const organization = buildOrganizationSchema(site, appUrl);
    const person = buildPersonSchema(site, appUrl, organization);
    const publisher = organization || person;
    const author = person || organization;
    const seoTitle = post?.seo?.meta_title || post.title;
    const seoDescription = post?.seo?.meta_description || post.excerpt;
    const seoImage = post?.seo?.og_image || post.cover_image;
    const schema = buildSeoGraph([
        {
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.published_at,
            url,
            ...(coverImage ? { image: [coverImage] } : {}),
            ...(publisher ? { publisher } : {}),
            ...(author ? { author } : {}),
            ...(post.category?.name ? { articleSection: post.category.name } : {}),
            ...(post.tags?.length
                ? { keywords: post.tags.map((tag) => tag.name).join(', ') }
                : {}),
        },
        organization,
        person,
    ]);

    const { contentHtml, items } = useMemo(
        () => buildToc(post.content || ''),
        [post.content],
    );

    const { data, setData, post: submit, processing, errors, reset } = useForm({
        name: '',
        email: '',
        message: '',
        website: '',
    });

    const submitComment = (event) => {
        event.preventDefault();
        submit(route('blog.comments.store', { locale, post: post.slug }), {
            preserveScroll: true,
            onSuccess: () => reset('message', 'website'),
        });
    };

    const breadcrumbs = [
        { label: locale === 'ar' ? 'الرئيسية' : 'Home', href: route('home', { locale }) },
        { label: locale === 'ar' ? 'المدونة' : 'Blog', href: route('blog.index', { locale }) },
        { label: post.title },
    ];

    return (
        <PublicLayout site={site}>
            <ReadingProgress targetId="article-content" />
            <Seo
                title={seoTitle}
                description={seoDescription}
                image={seoImage}
                url={url}
                type="article"
                robots={preview ? 'noindex,nofollow' : post?.seo?.robots || null}
                schema={schema}
            />
            <section className="page-header">
                <div className="container">
                    <Breadcrumbs items={breadcrumbs} />
                    <h1 className="section-title">{post.title}</h1>
                    <p className="section-subtitle">{post.excerpt}</p>
                    <div className="d-flex flex-wrap gap-2 text-muted small">
                        {post.category && (
                            <Link
                                className="badge-soft"
                                href={route('blog.index', {
                                    locale,
                                    category: post.category.slug,
                                })}
                            >
                                {post.category.name}
                            </Link>
                        )}
                        {post.published_at && (
                            <span className="badge-soft">{post.published_at}</span>
                        )}
                        {post.reading_time && (
                            <span className="badge-soft">{post.reading_time}</span>
                        )}
                    </div>
                </div>
            </section>
            <section className="section">
                <div className="container">
                    {preview && (
                        <div className="alert alert-warning">
                            {locale === 'ar'
                                ? 'أنت في وضع المعاينة، وقد تختلف البيانات بعد النشر.'
                                : 'You are viewing a preview. Content may change before publishing.'}
                        </div>
                    )}
                    <div className="row g-4">
                        <div className="col-lg-8">
                            {coverImage && (
                                <div className="detail-cover mb-4">
                                    <ResponsiveImage
                                        src={post.cover_image}
                                        srcSet={post.cover_image_srcset}
                                        alt={post.title}
                                        sizes="100vw"
                                    />
                                </div>
                            )}
                            <div className="content-card" id="article-content">
                                <div
                                    className="rich-content"
                                    dangerouslySetInnerHTML={{
                                        __html: contentHtml || '',
                                    }}
                                />
                                {post.tags?.length > 0 && (
                                    <div className="mt-4 d-flex flex-wrap gap-2">
                                        {(post.tags || []).map((tag) => (
                                            <Link
                                                key={tag.slug}
                                                className="tag-pill"
                                                href={route('blog.index', {
                                                    locale,
                                                    tag: tag.slug,
                                                })}
                                            >
                                                #{tag.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="content-card mt-4">
                                <h5 className="mb-3">
                                    {locale === 'ar'
                                        ? 'اترك تعليقاً'
                                        : 'Leave a Comment'}
                                </h5>
                                <p className="text-muted small">
                                    {locale === 'ar'
                                        ? 'التعليقات تخضع للمراجعة قبل النشر.'
                                        : 'Comments are moderated before publishing.'}
                                </p>
                                <form onSubmit={submitComment} className="mt-3">
                                    <input
                                        type="text"
                                        className="d-none"
                                        name="website"
                                        value={data.website}
                                        onChange={(event) =>
                                            setData('website', event.target.value)
                                        }
                                    />
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                {locale === 'ar' ? 'الاسم' : 'Name'}
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
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                {locale === 'ar'
                                                    ? 'البريد الإلكتروني'
                                                    : 'Email'}
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
                                        <div className="col-12">
                                            <label className="form-label">
                                                {locale === 'ar' ? 'التعليق' : 'Comment'}
                                            </label>
                                            <textarea
                                                rows="4"
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
                                    <button
                                        className="btn btn-primary mt-3"
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? locale === 'ar'
                                                ? 'جارٍ الإرسال...'
                                                : 'Sending...'
                                            : locale === 'ar'
                                            ? 'إرسال التعليق'
                                            : 'Submit Comment'}
                                    </button>
                                </form>
                            </div>

                            <div className="content-card mt-4">
                                <h5 className="mb-3">
                                    {locale === 'ar' ? 'التعليقات' : 'Comments'}
                                </h5>
                                {comments.length === 0 ? (
                                    <p className="text-muted mb-0">
                                        {locale === 'ar'
                                            ? 'لا توجد تعليقات بعد.'
                                            : 'No comments yet.'}
                                    </p>
                                ) : (
                                    <div className="d-grid gap-3">
                                        {comments.map((comment) => (
                                            <div
                                                className="comment-card"
                                                key={comment.id}
                                            >
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="fw-semibold">
                                                        {comment.name}
                                                    </div>
                                                    <div className="text-muted small">
                                                        {comment.created_at}
                                                    </div>
                                                </div>
                                                <p className="text-muted mb-0">
                                                    {comment.message}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <TableOfContents
                                items={items}
                                title={
                                    locale === 'ar'
                                        ? 'جدول المحتوى'
                                        : 'Table of Contents'
                                }
                            />
                            {related.length > 0 && (
                                <div className="content-card mt-4">
                                    <h6 className="mb-3">
                                        {locale === 'ar'
                                            ? 'مقالات ذات صلة'
                                            : 'Related Posts'}
                                    </h6>
                                    <div className="d-grid gap-3">
                                        {related.map((item) => (
                                            <Link
                                                key={item.id}
                                                className="related-post"
                                                href={route('blog.show', {
                                                    locale,
                                                    post: item.slug,
                                                })}
                                            >
                                                <div className="related-thumb">
                                                    {resolveImageUrl(item.cover_image) ? (
                                                        <ResponsiveImage
                                                            src={item.cover_image}
                                                            srcSet={item.cover_image_srcset}
                                                            alt={item.title}
                                                            sizes="64px"
                                                        />
                                                    ) : (
                                                        <div className="related-thumb-placeholder" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="fw-semibold">
                                                        {item.title}
                                                    </div>
                                                    <div className="text-muted small">
                                                        {item.published_at}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
