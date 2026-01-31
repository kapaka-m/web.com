// MOHAMED HASSANIN (KAPAKA)
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function ContactsShow({ message }) {
    const { locale } = usePage().props;
    const title = locale === 'ar' ? 'تفاصيل الرسالة' : 'Message Details';

    return (
        <AdminLayout title={title}>
            <Head title={title} />
            <div className="content-card">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                    <h5 className="mb-0">{title}</h5>
                    <Link
                        className="btn btn-sm btn-outline-secondary"
                        href={route('admin.contacts.index')}
                    >
                        {locale === 'ar' ? 'عودة' : 'Back'}
                    </Link>
                </div>
                <div className="mb-3">
                    <div className="text-muted small">
                        {locale === 'ar' ? 'الاسم' : 'Name'}
                    </div>
                    <div className="fw-semibold">{message.name}</div>
                </div>
                <div className="mb-3">
                    <div className="text-muted small">
                        {locale === 'ar' ? 'البريد' : 'Email'}
                    </div>
                    <div className="fw-semibold">{message.email}</div>
                </div>
                {message.phone && (
                    <div className="mb-3">
                        <div className="text-muted small">
                            {locale === 'ar' ? 'الهاتف' : 'Phone'}
                        </div>
                        <div className="fw-semibold">{message.phone}</div>
                    </div>
                )}
                <div className="mb-3">
                    <div className="text-muted small">
                        {locale === 'ar' ? 'الموضوع' : 'Subject'}
                    </div>
                    <div className="fw-semibold">
                        {message.subject || '-'}
                    </div>
                </div>
                <div className="mb-3">
                    <div className="text-muted small">
                        {locale === 'ar' ? 'الرسالة' : 'Message'}
                    </div>
                    <p className="text-muted mb-0">{message.message}</p>
                </div>
                <div className="text-muted small">
                    {locale === 'ar' ? 'اللغة' : 'Locale'}: {message.locale}
                </div>
            </div>
        </AdminLayout>
    );
}
