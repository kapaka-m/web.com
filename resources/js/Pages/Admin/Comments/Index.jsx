// MOHAMED HASSANIN (KAPAKA)
import Pagination from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function CommentsIndex({ comments, filters }) {
    const { locale } = usePage().props;
    const title = locale === 'ar' ? 'تعليقات المدونة' : 'Blog Comments';
    const showTrashed = Boolean(filters?.trashed);

    const handleFilterChange = (event) => {
        const value = event.target.value;
        router.get(
            route('admin.comments.index'),
            value === 'trashed' ? { trashed: 1 } : {},
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout title={title}>
            <Head title={title} />
            <div className="content-card">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                    <h5 className="mb-0">{title}</h5>
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
                </div>
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>{locale === 'ar' ? 'المرسل' : 'Sender'}</th>
                                <th>{locale === 'ar' ? 'التعليق' : 'Comment'}</th>
                                <th>{locale === 'ar' ? 'المقال' : 'Post'}</th>
                                <th>{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                                <th>{locale === 'ar' ? 'التاريخ' : 'Date'}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {comments.data.map((comment) => (
                                <tr key={comment.id}>
                                    <td>
                                        <div className="fw-semibold">{comment.name}</div>
                                        <div className="text-muted small">
                                            {comment.email}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-muted small">
                                            {comment.message}
                                        </div>
                                    </td>
                                    <td>
                                        {comment.post?.slug ? (
                                            <Link
                                                className="text-decoration-underline"
                                                href={route('blog.show', {
                                                    locale: comment.locale || locale,
                                                    post: comment.post.slug,
                                                })}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {comment.post.title}
                                            </Link>
                                        ) : (
                                            <span className="text-muted small">
                                                {locale === 'ar'
                                                    ? 'غير متاح'
                                                    : 'Unavailable'}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {comment.deleted_at ? (
                                            <span className="badge bg-secondary">
                                                {locale === 'ar'
                                                    ? 'محذوف'
                                                    : 'Deleted'}
                                            </span>
                                        ) : comment.is_approved ? (
                                            <span className="badge bg-success">
                                                {locale === 'ar'
                                                    ? 'معتمد'
                                                    : 'Approved'}
                                            </span>
                                        ) : (
                                            <span className="badge bg-secondary">
                                                {locale === 'ar'
                                                    ? 'بانتظار المراجعة'
                                                    : 'Pending'}
                                            </span>
                                        )}
                                    </td>
                                    <td>{comment.created_at}</td>
                                    <td className="text-end">
                                        {!comment.deleted_at && !comment.is_approved && (
                                            <Link
                                                className="btn btn-sm btn-outline-success me-2"
                                                as="button"
                                                method="put"
                                                href={route('admin.comments.approve', {
                                                    comment: comment.id,
                                                })}
                                            >
                                                {locale === 'ar'
                                                    ? 'اعتماد'
                                                    : 'Approve'}
                                            </Link>
                                        )}
                                        {comment.deleted_at ? (
                                            <Link
                                                className="btn btn-sm btn-outline-success"
                                                as="button"
                                                method="put"
                                                href={route('admin.comments.restore', {
                                                    comment: comment.id,
                                                })}
                                            >
                                                {locale === 'ar'
                                                    ? 'استعادة'
                                                    : 'Restore'}
                                            </Link>
                                        ) : (
                                            <Link
                                                className="btn btn-sm btn-outline-danger"
                                                as="button"
                                                method="delete"
                                                href={route('admin.comments.destroy', {
                                                    comment: comment.id,
                                                })}
                                            >
                                                {locale === 'ar'
                                                    ? 'حذف'
                                                    : 'Delete'}
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {comments.data.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted">
                                        {locale === 'ar'
                                            ? 'لا توجد تعليقات بعد.'
                                            : 'No comments yet.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={comments.links} />
            </div>
        </AdminLayout>
    );
}
