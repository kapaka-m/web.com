// MOHAMED HASSANIN (KAPAKA)
import Pagination from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function ProjectsIndex({ projects, filters }) {
    const { locale } = usePage().props;
    const title = locale === 'ar' ? 'إدارة المشاريع' : 'Manage Projects';
    const showTrashed = Boolean(filters?.trashed);

    const handleFilterChange = (event) => {
        const value = event.target.value;
        router.get(
            route('admin.projects.index'),
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
                            href={route('admin.projects.create')}
                        >
                            {locale === 'ar' ? 'إضافة مشروع' : 'Add Project'}
                        </Link>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>{locale === 'ar' ? 'العنوان' : 'Title'}</th>
                                <th>{locale === 'ar' ? 'Slug' : 'Slug'}</th>
                                <th>{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.data.map((project) => (
                                <tr key={project.id}>
                                    <td>{project.title}</td>
                                    <td className="text-muted">{project.slug}</td>
                                    <td>
                                        {project.deleted_at ? (
                                            <span className="badge bg-secondary">
                                                {locale === 'ar'
                                                    ? 'محذوف'
                                                    : 'Deleted'}
                                            </span>
                                        ) : project.is_active ? (
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
                                        {project.is_featured && (
                                            <span className="badge bg-warning text-dark ms-2">
                                                {locale === 'ar'
                                                    ? 'مميز'
                                                    : 'Featured'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="text-end">
                                        {!project.deleted_at && (
                                            <Link
                                                className="btn btn-sm btn-outline-primary me-2"
                                                href={route('admin.projects.edit', {
                                                    project: project.id,
                                                })}
                                            >
                                                {locale === 'ar'
                                                    ? 'تعديل'
                                                    : 'Edit'}
                                            </Link>
                                        )}
                                        {project.deleted_at ? (
                                            <Link
                                                className="btn btn-sm btn-outline-success"
                                                as="button"
                                                method="put"
                                                href={route('admin.projects.restore', {
                                                    project: project.id,
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
                                                href={route('admin.projects.destroy', {
                                                    project: project.id,
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
                            {projects.data.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted">
                                        {locale === 'ar'
                                            ? 'لا توجد مشاريع بعد.'
                                            : 'No projects yet.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={projects.links} />
            </div>
        </AdminLayout>
    );
}
