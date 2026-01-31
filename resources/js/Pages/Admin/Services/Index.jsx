// MOHAMED HASSANIN (KAPAKA)
import Pagination from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function ServicesIndex({ services, filters }) {
    const { locale } = usePage().props;
    const title = locale === 'ar' ? 'إدارة الخدمات' : 'Manage Services';
    const showTrashed = Boolean(filters?.trashed);

    const handleFilterChange = (event) => {
        const value = event.target.value;
        router.get(
            route('admin.services.index'),
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
                            href={route('admin.services.create')}
                        >
                            {locale === 'ar' ? 'إضافة خدمة' : 'Add Service'}
                        </Link>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>{locale === 'ar' ? 'العنوان' : 'Title'}</th>
                                <th>{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                                <th>{locale === 'ar' ? 'الترتيب' : 'Order'}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.data.map((service) => (
                                <tr key={service.id}>
                                    <td>
                                        <div className="fw-semibold">
                                            {service.title}
                                        </div>
                                        <div className="text-muted small">
                                            {service.summary}
                                        </div>
                                    </td>
                                    <td>
                                        {service.deleted_at ? (
                                            <span className="badge bg-secondary">
                                                {locale === 'ar'
                                                    ? 'محذوف'
                                                    : 'Deleted'}
                                            </span>
                                        ) : service.is_active ? (
                                            <span className="badge bg-success">
                                                {locale === 'ar' ? 'نشط' : 'Active'}
                                            </span>
                                        ) : (
                                            <span className="badge bg-secondary">
                                                {locale === 'ar' ? 'غير نشط' : 'Inactive'}
                                            </span>
                                        )}
                                    </td>
                                    <td>{service.sort_order}</td>
                                    <td className="text-end">
                                        {!service.deleted_at && (
                                            <Link
                                                className="btn btn-sm btn-outline-primary me-2"
                                                href={route('admin.services.edit', {
                                                    service: service.id,
                                                })}
                                            >
                                                {locale === 'ar' ? 'تعديل' : 'Edit'}
                                            </Link>
                                        )}
                                        {service.deleted_at ? (
                                            <Link
                                                className="btn btn-sm btn-outline-success"
                                                as="button"
                                                method="put"
                                                href={route('admin.services.restore', {
                                                    service: service.id,
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
                                                href={route('admin.services.destroy', {
                                                    service: service.id,
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
                            {services.data.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted">
                                        {locale === 'ar'
                                            ? 'لا توجد خدمات بعد.'
                                            : 'No services yet.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={services.links} />
            </div>
        </AdminLayout>
    );
}
