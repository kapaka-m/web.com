// MOHAMED HASSANIN (KAPAKA)
import Pagination from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function UsersIndex({ users }) {
    const { locale } = usePage().props;
    const title = locale === 'ar' ? 'المستخدمون' : 'Users';

    return (
        <AdminLayout title={title}>
            <Head title={title} />
            <div className="content-card">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                    <h5 className="mb-0">{title}</h5>
                    <Link
                        className="btn btn-primary"
                        href={route('admin.users.create')}
                    >
                        {locale === 'ar' ? 'إضافة مستخدم' : 'Add User'}
                    </Link>
                </div>
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>{locale === 'ar' ? 'الاسم' : 'Name'}</th>
                                <th>{locale === 'ar' ? 'البريد' : 'Email'}</th>
                                <th>{locale === 'ar' ? 'الصلاحية' : 'Role'}</th>
                                <th>{locale === 'ar' ? 'تاريخ الإنشاء' : 'Created'}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td className="text-muted">{user.email}</td>
                                    <td>
                                        <span className="badge bg-secondary">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="text-muted">{user.created_at}</td>
                                    <td className="text-end">
                                        <Link
                                            className="btn btn-sm btn-outline-primary me-2"
                                            href={route('admin.users.edit', {
                                                user: user.id,
                                            })}
                                        >
                                            {locale === 'ar' ? 'تعديل' : 'Edit'}
                                        </Link>
                                        <Link
                                            className="btn btn-sm btn-outline-danger"
                                            as="button"
                                            method="delete"
                                            href={route('admin.users.destroy', {
                                                user: user.id,
                                            })}
                                        >
                                            {locale === 'ar' ? 'حذف' : 'Delete'}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {users.data.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">
                                        {locale === 'ar'
                                            ? 'لا يوجد مستخدمون بعد.'
                                            : 'No users found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={users.links} />
            </div>
        </AdminLayout>
    );
}
