// MOHAMED HASSANIN (KAPAKA)
import Pagination from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function PostsIndex({ posts, filters }) {
    const { locale } = usePage().props;
    const title = locale === 'ar' ? 'إدارة المدونات' : 'Manage Posts';
    const showTrashed = Boolean(filters?.trashed);

    const handleFilterChange = (event) => {
        const value = event.target.value;
        router.get(
            route('admin.posts.index'),
            value === 'trashed' ? { trashed: 1 } : {},
            { preserveState: true, replace: true },
        );
    };

    const reviewLabels = {
        draft: locale === 'ar' ? 'مسودة' : 'Draft',
        pending: locale === 'ar' ? 'قيد المراجعة' : 'Pending Review',
        approved: locale === 'ar' ? 'معتمد' : 'Approved',
    };

    const renderPublishBadge = (post) => {
        if (post.deleted_at) {
            return (
                <span className="badge bg-secondary">
                    {locale === 'ar' ? 'محذوف' : 'Deleted'}
                </span>
            );
        }

        if (post.review_status !== 'approved') {
            return (
                <span className="badge bg-secondary">
                    {locale === 'ar' ? 'غير منشور' : 'Not Published'}
                </span>
            );
        }

        if (post.published_at) {
            const isFuture =
                new Date(post.published_at).getTime() > new Date().getTime();
            if (isFuture) {
                return (
                    <span className="badge bg-info text-dark">
                        {locale === 'ar' ? 'مجدول' : 'Scheduled'}
                    </span>
                );
            }
        }

        return post.is_published ? (
            <span className="badge bg-success">
                {locale === 'ar' ? 'منشور' : 'Published'}
            </span>
        ) : (
            <span className="badge bg-secondary">
                {locale === 'ar' ? 'مسودة' : 'Draft'}
            </span>
        );
    };

    return (
        <AdminLayout title={title}>
            <Head title={title} />
            <div className="content-card">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                    <h5 className="mb-0">{title}</h5>
                    <div className="d-flex flex-wrap gap-2">
                        <select
                            className="form-select form-select-sm"
                            value={showTrashed ? 'trashed' : 'active'}
                            onChange={handleFilterChange}
                        >
                            <option value="active">
                                {locale === 'ar' ? 'النشطة' : 'Active'}
                            </option>
                            <option value="trashed">
                                {locale === 'ar' ? 'المحذوفة' : 'Trashed'}
                            </option>
                        </select>
                        <Link className="btn btn-primary" href={route('admin.posts.create')}>
                            {locale === 'ar' ? 'إضافة مقال' : 'Add Post'}
                        </Link>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>{locale === 'ar' ? 'العنوان' : 'Title'}</th>
                                <th>{locale === 'ar' ? 'المراجعة' : 'Review'}</th>
                                <th>{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                                <th>{locale === 'ar' ? 'تاريخ النشر' : 'Publish Date'}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.data.map((post) => (
                                <tr key={post.id}>
                                    <td>{post.title}</td>
                                    <td>
                                        <span className="badge bg-light text-dark">
                                            {reviewLabels[post.review_status] ||
                                                post.review_status}
                                        </span>
                                    </td>
                                    <td>{renderPublishBadge(post)}</td>
                                    <td className="text-muted">{post.published_at || '-'}</td>
                                    <td className="text-end">
                                        {!post.deleted_at && (
                                            <Link
                                                className="btn btn-sm btn-outline-primary me-2"
                                                href={route('admin.posts.edit', {
                                                    post: post.id,
                                                })}
                                            >
                                                {locale === 'ar' ? 'تعديل' : 'Edit'}
                                            </Link>
                                        )}
                                        {post.deleted_at ? (
                                            <Link
                                                className="btn btn-sm btn-outline-success"
                                                as="button"
                                                method="put"
                                                href={route('admin.posts.restore', {
                                                    post: post.id,
                                                })}
                                            >
                                                {locale === 'ar' ? 'استعادة' : 'Restore'}
                                            </Link>
                                        ) : (
                                            <Link
                                                className="btn btn-sm btn-outline-danger"
                                                as="button"
                                                method="delete"
                                                href={route('admin.posts.destroy', {
                                                    post: post.id,
                                                })}
                                            >
                                                {locale === 'ar' ? 'حذف' : 'Delete'}
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {posts.data.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">
                                        {locale === 'ar'
                                            ? 'لا توجد مقالات بعد.'
                                            : 'No posts yet.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={posts.links} />
            </div>
        </AdminLayout>
    );
}
