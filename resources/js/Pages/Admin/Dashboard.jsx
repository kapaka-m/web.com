// MOHAMED HASSANIN (KAPAKA)
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ stats, recentMessages }) {
    const { locale } = usePage().props;

    const cards = [
        {
            label: locale === 'ar' ? 'الخدمات' : 'Services',
            value: stats.services,
            icon: 'bi-grid',
            href: route('admin.services.index'),
        },
        {
            label: locale === 'ar' ? 'المشاريع' : 'Projects',
            value: stats.projects,
            icon: 'bi-kanban',
            href: route('admin.projects.index'),
        },
        {
            label: locale === 'ar' ? 'المدونات' : 'Posts',
            value: stats.posts,
            icon: 'bi-journal-text',
            href: route('admin.posts.index'),
        },
        {
            label: locale === 'ar' ? 'الرسائل' : 'Messages',
            value: stats.messages,
            icon: 'bi-inbox',
            href: route('admin.contacts.index'),
        },
    ];

    return (
        <AdminLayout title={locale === 'ar' ? 'لوحة التحكم' : 'Dashboard'}>
            <Head title="Dashboard" />
            <div className="row g-4 mb-4">
                {cards.map((card) => (
                    <div className="col-md-6 col-lg-3" key={card.label}>
                        <Link className="text-decoration-none" href={card.href}>
                            <div className="content-card h-100">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <div className="text-muted small">
                                            {card.label}
                                        </div>
                                        <div className="h3 mb-0 fw-bold">
                                            {card.value}
                                        </div>
                                    </div>
                                    <span className="icon-badge">
                                        <i className={`bi ${card.icon}`}></i>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            <div className="content-card">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="mb-0">
                        {locale === 'ar'
                            ? 'آخر الرسائل'
                            : 'Recent Messages'}
                    </h5>
                    <Link
                        className="btn btn-sm btn-outline-primary"
                        href={route('admin.contacts.index')}
                    >
                        {locale === 'ar' ? 'عرض الكل' : 'View All'}
                    </Link>
                </div>
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>
                                    {locale === 'ar' ? 'الاسم' : 'Name'}
                                </th>
                                <th>{locale === 'ar' ? 'الموضوع' : 'Subject'}</th>
                                <th>
                                    {locale === 'ar' ? 'التاريخ' : 'Date'}
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentMessages.map((message) => (
                                <tr key={message.id}>
                                    <td>
                                        <div className="fw-semibold">
                                            {message.name}
                                        </div>
                                        <div className="text-muted small">
                                            {message.email}
                                        </div>
                                    </td>
                                    <td>
                                        {message.subject ||
                                            (locale === 'ar'
                                                ? 'بدون عنوان'
                                                : 'No subject')}
                                    </td>
                                    <td className="text-muted small">
                                        {message.created_at}
                                    </td>
                                    <td>
                                        <Link
                                            className="btn btn-sm btn-outline-secondary"
                                            href={route('admin.contacts.show', {
                                                contact: message.id,
                                            })}
                                        >
                                            {locale === 'ar' ? 'عرض' : 'View'}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {recentMessages.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted">
                                        {locale === 'ar'
                                            ? 'لا توجد رسائل بعد.'
                                            : 'No messages yet.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
