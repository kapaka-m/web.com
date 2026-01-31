// MOHAMED HASSANIN (KAPAKA)
import Pagination from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function ContactsIndex({ messages }) {
    const { locale } = usePage().props;
    const title = locale === 'ar' ? 'رسائل التواصل' : 'Contact Messages';

    return (
        <AdminLayout title={title}>
            <Head title={title} />
            <div className="content-card">
                <h5 className="mb-3">{title}</h5>
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>{locale === 'ar' ? 'المرسل' : 'Sender'}</th>
                                <th>{locale === 'ar' ? 'الموضوع' : 'Subject'}</th>
                                <th>{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                                <th>{locale === 'ar' ? 'التاريخ' : 'Date'}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.data.map((message) => (
                                <tr key={message.id}>
                                    <td>
                                        <div className="fw-semibold">{message.name}</div>
                                        <div className="text-muted small">
                                            {message.email}
                                        </div>
                                    </td>
                                    <td>{message.subject || '-'}</td>
                                    <td>
                                        {message.is_read ? (
                                            <span className="badge bg-secondary">
                                                {locale === 'ar' ? 'مقروء' : 'Read'}
                                            </span>
                                        ) : (
                                            <span className="badge bg-warning text-dark">
                                                {locale === 'ar' ? 'جديد' : 'New'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="text-muted small">
                                        {message.created_at}
                                    </td>
                                    <td className="text-end">
                                        <Link
                                            className="btn btn-sm btn-outline-primary me-2"
                                            href={route('admin.contacts.show', {
                                                contact: message.id,
                                            })}
                                        >
                                            {locale === 'ar' ? 'عرض' : 'View'}
                                        </Link>
                                        <Link
                                            className="btn btn-sm btn-outline-danger"
                                            as="button"
                                            method="delete"
                                            href={route('admin.contacts.destroy', {
                                                contact: message.id,
                                            })}
                                        >
                                            {locale === 'ar' ? 'حذف' : 'Delete'}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {messages.data.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">
                                        {locale === 'ar'
                                            ? 'لا توجد رسائل بعد.'
                                            : 'No messages yet.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={messages.links} />
            </div>
        </AdminLayout>
    );
}
