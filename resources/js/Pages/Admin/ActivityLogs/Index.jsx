// MOHAMED HASSANIN (KAPAKA)
import Pagination from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage } from '@inertiajs/react';
import { Fragment } from 'react';

const flattenDiff = (diff, prefix = '') => {
    if (!diff || typeof diff !== 'object') {
        return [];
    }

    return Object.entries(diff).flatMap(([key, value]) => {
        const path = prefix ? `${prefix}.${key}` : key;
        if (
            value &&
            typeof value === 'object' &&
            Object.prototype.hasOwnProperty.call(value, 'from') &&
            Object.prototype.hasOwnProperty.call(value, 'to')
        ) {
            return [{ path, from: value.from, to: value.to }];
        }

        return flattenDiff(value, path);
    });
};

export default function ActivityLogsIndex({ logs }) {
    const { locale } = usePage().props;
    const title = locale === 'ar' ? 'سجل النشاط' : 'Activity Logs';

    return (
        <AdminLayout title={title}>
            <Head title={title} />
            <div className="content-card">
                <h5 className="mb-3">{title}</h5>
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>{locale === 'ar' ? 'المستخدم' : 'User'}</th>
                                <th>{locale === 'ar' ? 'الإجراء' : 'Action'}</th>
                                <th>{locale === 'ar' ? 'المصدر' : 'Subject'}</th>
                                <th>{locale === 'ar' ? 'الوقت' : 'Time'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.data.map((log) => {
                                const diffRows = flattenDiff(
                                    log.properties?.diff || {},
                                );

                                return (
                                    <Fragment key={log.id}>
                                        <tr>
                                            <td>
                                                {log.user ? (
                                                    <>
                                                        <div className="fw-semibold">
                                                            {log.user.name}
                                                        </div>
                                                        <div className="text-muted small">
                                                            {log.user.email}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td className="text-muted">{log.action}</td>
                                            <td className="text-muted">
                                                {log.subject_type
                                                    ? `${log.subject_type} #${log.subject_id}`
                                                    : '-'}
                                            </td>
                                            <td className="text-muted small">
                                                {log.created_at}
                                            </td>
                                        </tr>
                                        {diffRows.length > 0 && (
                                            <tr className="activity-diff-row">
                                                <td colSpan="4">
                                                    <div className="activity-diff">
                                                        <div className="fw-semibold mb-2">
                                                            {locale === 'ar'
                                                                ? 'تفاصيل التغييرات'
                                                                : 'Change Details'}
                                                        </div>
                                                        <div className="activity-diff__list">
                                                            {diffRows.map((item) => (
                                                                <div
                                                                    key={item.path}
                                                                    className="activity-diff__item"
                                                                >
                                                                    <span className="activity-diff__key">
                                                                        {item.path}
                                                                    </span>
                                                                    <span className="activity-diff__from">
                                                                        {String(item.from ?? '')}
                                                                    </span>
                                                                    <span className="activity-diff__arrow">
                                                                        →
                                                                    </span>
                                                                    <span className="activity-diff__to">
                                                                        {String(item.to ?? '')}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                );
                            })}
                            {logs.data.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted">
                                        {locale === 'ar'
                                            ? 'لا يوجد نشاط بعد.'
                                            : 'No activity yet.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={logs.links} />
            </div>
        </AdminLayout>
    );
}
