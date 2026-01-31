// MOHAMED HASSANIN (KAPAKA)
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function AdminSearch({ query, results }) {
    const { locale } = usePage().props;
    const title = locale === 'ar' ? 'بحث لوحة التحكم' : 'Dashboard Search';

    return (
        <AdminLayout title={title}>
            <Head title={title} />
            <div className="content-card">
                <h5 className="mb-3">{title}</h5>
                <p className="text-muted">
                    {locale === 'ar' ? 'نتائج البحث عن:' : 'Search results for:'}{' '}
                    <span className="fw-semibold">{query || '-'}</span>
                </p>
                <div className="row g-3">
                    {(results || []).map((section) => (
                        <div key={section.type} className="col-12">
                            <div className="border rounded-4 p-3 bg-white">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <h6 className="mb-0">{section.label}</h6>
                                    <span className="text-muted small">
                                        {section.items?.length || 0}
                                    </span>
                                </div>
                                {section.items?.length ? (
                                    <div className="d-grid gap-2">
                                        {section.items.map((item) => (
                                            <div
                                                key={`${section.type}-${item.id}`}
                                                className="d-flex flex-wrap align-items-center justify-content-between gap-2 border rounded-3 p-2"
                                            >
                                                <div>
                                                    <div className="fw-semibold">
                                                        {item.title}
                                                    </div>
                                                    <div className="text-muted small">
                                                        {item.subtitle}
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center gap-2">
                                                    {item.deleted_at && (
                                                        <span className="badge bg-secondary">
                                                            {locale === 'ar'
                                                                ? 'محذوف'
                                                                : 'Deleted'}
                                                        </span>
                                                    )}
                                                    <Link
                                                        className="btn btn-sm btn-outline-primary"
                                                        href={item.url}
                                                    >
                                                        {locale === 'ar'
                                                            ? 'فتح'
                                                            : 'Open'}
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-muted small">
                                        {locale === 'ar'
                                            ? 'لا توجد نتائج.'
                                            : 'No results.'}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {(!results || results.length === 0) && (
                        <div className="col-12">
                            <div className="text-center text-muted">
                                {locale === 'ar'
                                    ? 'اكتب كلمة بحث لعرض النتائج.'
                                    : 'Type a query to view results.'}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
