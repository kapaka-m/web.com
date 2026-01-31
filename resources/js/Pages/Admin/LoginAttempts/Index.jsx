// MOHAMED HASSANIN (KAPAKA)
import Pagination from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage } from '@inertiajs/react';

export default function LoginAttemptsIndex({ attempts }) {
    const { locale } = usePage().props;
    const title = locale === 'ar' ? 'محاولات الدخول' : 'Login Attempts';

    return (
        <AdminLayout title={title}>
            <Head title={title} />
            <div className="content-card">
                <h5 className="mb-3">{title}</h5>
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>{locale === 'ar' ? 'البريد' : 'Email'}</th>
                                <th>{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                                <th>{locale === 'ar' ? 'الحارس' : 'Guard'}</th>
                                <th>{locale === 'ar' ? 'العنوان' : 'IP'}</th>
                                <th>{locale === 'ar' ? 'الوقت' : 'Time'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attempts.data.map((attempt) => (
                                <tr key={attempt.id}>
                                    <td>
                                        <div className="fw-semibold">
                                            {attempt.email || '-'}
                                        </div>
                                        {attempt.user_id && (
                                            <div className="text-muted small">
                                                ID: {attempt.user_id}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        {attempt.succeeded ? (
                                            <span className="badge bg-success">
                                                {locale === 'ar'
                                                    ? 'ناجح'
                                                    : 'Succeeded'}
                                            </span>
                                        ) : (
                                            <span className="badge bg-danger">
                                                {locale === 'ar'
                                                    ? 'فشل'
                                                    : 'Failed'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="text-muted">{attempt.guard}</td>
                                    <td className="text-muted">
                                        {attempt.ip_address || '-'}
                                    </td>
                                    <td className="text-muted small">
                                        {attempt.created_at}
                                    </td>
                                </tr>
                            ))}
                            {attempts.data.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">
                                        {locale === 'ar'
                                            ? 'لا توجد محاولات دخول مسجلة.'
                                            : 'No login attempts yet.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={attempts.links} />
            </div>
        </AdminLayout>
    );
}
