// MOHAMED HASSANIN (KAPAKA)
import Breadcrumbs from '@/Components/Breadcrumbs';
import Pagination from '@/Components/Pagination';
import ResponsiveImage from '@/Components/ResponsiveImage';
import Seo from '@/Components/Seo';
import PublicLayout from '@/Layouts/PublicLayout';
import { resolveImageUrl } from '@/Support/resolveImageUrl';
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function BlogIndex({ site, posts, categories = [], tags = [], filters = {} }) {
    const { locale } = usePage().props;
    const title = locale === 'ar' ? 'المدونة' : 'Blog';
    const [search, setSearch] = useState(filters.q || '');
    const [category, setCategory] = useState(filters.category || '');
    const [tag, setTag] = useState(filters.tag || '');

    useEffect(() => {
        setSearch(filters.q || '');
        setCategory(filters.category || '');
        setTag(filters.tag || '');
    }, [filters.q, filters.category, filters.tag]);

    const applyFilters = (event) => {
        event.preventDefault();
        router.get(
            route('blog.index', { locale }),
            {
                q: search || undefined,
                category: category || undefined,
                tag: tag || undefined,
            },
            { preserveState: true, replace: true, preserveScroll: true },
        );
    };

    const clearFilters = () => {
        setSearch('');
        setCategory('');
        setTag('');
        router.get(route('blog.index', { locale }), {}, { replace: true });
    };

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
                        ? 'مقالات قصيرة عن التطوير والأمن وتجربة المنتج.'
                        : 'Short reads on development, security, and product delivery.'
                }
                pageKey="blog"
            />
            <section className="page-header">
                <div className="container">
                    <Breadcrumbs items={breadcrumbs} />
                    <h1 className="section-title">{title}</h1>
                    <p className="section-subtitle">
                        {locale === 'ar'
                            ? 'مقالات قصيرة عن التطوير والأمن وتجربة المنتج.'
                            : 'Short reads on development, security, and product delivery.'}
                    </p>
                </div>
            </section>
            <section className="section">
                <div className="container">
                    <form onSubmit={applyFilters} className="content-card mb-4">
                        <div className="row g-3 align-items-end">
                            <div className="col-lg-4">
                                <label className="form-label">
                                    {locale === 'ar' ? 'بحث' : 'Search'}
                                </label>
                                <input
                                    className="form-control"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder={
                                        locale === 'ar'
                                            ? 'ابحث في المقالات'
                                            : 'Search posts'
                                    }
                                />
                            </div>
                            <div className="col-lg-3">
                                <label className="form-label">
                                    {locale === 'ar' ? 'التصنيف' : 'Category'}
                                </label>
                                <select
                                    className="form-select"
                                    value={category}
                                    onChange={(event) => setCategory(event.target.value)}
                                >
                                    <option value="">
                                        {locale === 'ar' ? 'الكل' : 'All'}
                                    </option>
                                    {categories.map((item) => (
                                        <option key={item.slug} value={item.slug}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-lg-3">
                                <label className="form-label">
                                    {locale === 'ar' ? 'الوسوم' : 'Tags'}
                                </label>
                                <select
                                    className="form-select"
                                    value={tag}
                                    onChange={(event) => setTag(event.target.value)}
                                >
                                    <option value="">
                                        {locale === 'ar' ? 'الكل' : 'All'}
                                    </option>
                                    {tags.map((item) => (
                                        <option key={item.slug} value={item.slug}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-lg-2 d-flex gap-2">
                                <button className="btn btn-primary flex-grow-1" type="submit">
                                    {locale === 'ar' ? 'تصفية' : 'Filter'}
                                </button>
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={clearFilters}
                                >
                                    {locale === 'ar' ? 'مسح' : 'Clear'}
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="row g-4">
                        {posts.data.map((post) => (
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
                                    <div className="d-flex flex-wrap gap-2 mb-2">
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
                                        {post.reading_time && (
                                            <span className="badge-soft">
                                                {post.reading_time}
                                            </span>
                                        )}
                                    </div>
                                    <h5 className="mb-2">{post.title}</h5>
                                    <p className="text-muted">{post.excerpt}</p>
                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                        {post.tags.map((tagItem) => (
                                            <Link
                                                key={tagItem.slug}
                                                className="tag-pill"
                                                href={route('blog.index', {
                                                    locale,
                                                    tag: tagItem.slug,
                                                })}
                                            >
                                                #{tagItem.name}
                                            </Link>
                                        ))}
                                    </div>
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
                        {posts.data.length === 0 && (
                            <div className="col-12">
                                <div className="content-card text-center">
                                    {locale === 'ar'
                                        ? 'لا توجد مقالات مطابقة.'
                                        : 'No posts found.'}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-5">
                        <Pagination links={posts.links} />
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
