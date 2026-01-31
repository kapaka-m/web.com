// MOHAMED HASSANIN (KAPAKA)
import Pagination from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function TestimonialsIndex({ testimonials, filters }) {
    const { locale } = usePage().props;
    const title = locale === 'ar' ? 'إدارة الشهادات' : 'Manage Testimonials';
    const showTrashed = Boolean(filters?.trashed);

    const handleFilterChange = (event) => {
        const value = event.target.value;
        router.get(
            route('admin.testimonials.index'),
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
                        <Link
                            className="btn btn-primary"
                            href={route('admin.testimonials.create')}
                        >
                            {locale === 'ar' ? 'إضافة شهادة' : 'Add Testimonial'}
                        </Link>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>{locale === 'ar' ? 'الاسم' : 'Name'}</th>
                                <th>{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                                <th>{locale === 'ar' ? 'الترتيب' : 'Order'}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {testimonials.data.map((testimonial) => (
                                <tr key={testimonial.id}>
                                    <td className="fw-semibold">{testimonial.name}</td>
                                    <td>
                                        {testimonial.deleted_at ? (
                                            <span className="badge bg-secondary">
                                                {locale === 'ar'
                                                    ? 'محذوف'
                                                    : 'Deleted'}
                                            </span>
                                        ) : testimonial.is_active ? (
                                            <span className="badge bg-success">
                                                {locale === 'ar' ? 'نشط' : 'Active'}
                                            </span>
                                        ) : (
                                            <span className="badge bg-secondary">
                                                {locale === 'ar'
                                                    ? 'غير نشط'
                                                    : 'Inactive'}
                                            </span>
                                        )}
                                    </td>
                                    <td>{testimonial.sort_order}</td>
                                    <td className="text-end">
                                        {!testimonial.deleted_at && (
                                            <Link
                                                className="btn btn-sm btn-outline-primary me-2"
                                                href={route('admin.testimonials.edit', {
                                                    testimonial: testimonial.id,
                                                })}
                                            >
                                                {locale === 'ar'
                                                    ? 'تعديل'
                                                    : 'Edit'}
                                            </Link>
                                        )}
                                        {testimonial.deleted_at ? (
                                            <Link
                                                className="btn btn-sm btn-outline-success"
                                                as="button"
                                                method="put"
                                                href={route('admin.testimonials.restore', {
                                                    testimonial: testimonial.id,
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
                                                href={route('admin.testimonials.destroy', {
                                                    testimonial: testimonial.id,
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
                            {testimonials.data.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted">
                                        {locale === 'ar'
                                            ? 'لا توجد شهادات بعد.'
                                            : 'No testimonials yet.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={testimonials.links} />
            </div>
        </AdminLayout>
    );
}
