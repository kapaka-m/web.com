// MOHAMED HASSANIN (KAPAKA)
import Pagination from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function CategoriesIndex({ categories, filters }) {
    const { locale } = usePage().props;
    const title = locale === 'ar' ? 'إدارة التصنيفات' : 'Manage Categories';
    const showTrashed = Boolean(filters?.trashed);

    const handleFilterChange = (event) => {
        const value = event.target.value;
        router.get(
            route('admin.categories.index'),
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
                            href={route('admin.categories.create')}
                        >
                            {locale === 'ar' ? 'إضافة تصنيف' : 'Add Category'}
                        </Link>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>{locale === 'ar' ? 'الاسم' : 'Name'}</th>
                                <th>{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                                <th>{locale === 'ar' ? 'Slug' : 'Slug'}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.data.map((category) => (
                                <tr key={category.id}>
                                    <td className="fw-semibold">{category.name}</td>
                                    <td>
                                        {category.deleted_at ? (
                                            <span className="badge bg-secondary">
                                                {locale === 'ar'
                                                    ? 'محذوف'
                                                    : 'Deleted'}
                                            </span>
                                        ) : category.is_active ? (
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
                                    <td>{category.slug}</td>
                                    <td className="text-end">
                                        {!category.deleted_at && (
                                            <Link
                                                className="btn btn-sm btn-outline-primary me-2"
                                                href={route('admin.categories.edit', {
                                                    category: category.id,
                                                })}
                                            >
                                                {locale === 'ar'
                                                    ? 'تعديل'
                                                    : 'Edit'}
                                            </Link>
                                        )}
                                        {category.deleted_at ? (
                                            <Link
                                                className="btn btn-sm btn-outline-success"
                                                as="button"
                                                method="put"
                                                href={route('admin.categories.restore', {
                                                    category: category.id,
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
                                                href={route('admin.categories.destroy', {
                                                    category: category.id,
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
                            {categories.data.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted">
                                        {locale === 'ar'
                                            ? 'لا توجد تصنيفات بعد.'
                                            : 'No categories yet.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={categories.links} />
            </div>
        </AdminLayout>
    );
}
