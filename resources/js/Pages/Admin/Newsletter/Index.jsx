// MOHAMED HASSANIN (KAPAKA)
import Pagination from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';

export default function NewsletterIndex({ subscribers, filters }) {
    const { locale } = usePage().props;
    const isArabic = locale === 'ar';
    const t = (ar, en) => (isArabic ? ar : en);

    const submitSearch = (event) => {
        event.preventDefault();
        router.get(
            route('admin.newsletter-subscribers.index'),
            { q: filters?.q || '', status: filters?.status || '' },
            { preserveState: true, replace: true },
        );
    };

    const updateFilter = (key, value) => {
        router.get(
            route('admin.newsletter-subscribers.index'),
            { ...filters, [key]: value },
            { preserveState: true, replace: true },
        );
    };

    const updateStatus = (id, status) => {
        router.put(
            route('admin.newsletter-subscribers.update', id),
            { status },
            { preserveScroll: true },
        );
    };

    const destroy = (id) => {
        if (!window.confirm(t('?? ??? ????? ?? ??????', 'Delete this subscriber?'))) {
            return;
        }
        router.delete(route('admin.newsletter-subscribers.destroy', id), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title={t('?????? ????????', 'Newsletter Subscribers')}>
            <Head title={t('?????? ????????', 'Newsletter Subscribers')} />
            <div className="content-card">
                <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center mb-3">
                    <form className="d-flex gap-2" onSubmit={submitSearch}>
                        <input
                            className="form-control form-control-sm"
                            placeholder={t('???? ??????? ?? ?????', 'Search email or name')}
                            value={filters?.q || ''}
                            onChange={(event) =>
                                updateFilter('q', event.target.value)
                            }
                        />
                    </form>
                    <select
                        className="form-select form-select-sm w-auto"
                        value={filters?.status || ''}
                        onChange={(event) =>
                            updateFilter('status', event.target.value)
                        }
                    >
                        <option value="">{t('?? ???????', 'All statuses')}</option>
                        <option value="pending">{t('??????? ???????', 'Pending')}</option>
                        <option value="confirmed">{t('????', 'Confirmed')}</option>
                        <option value="unsubscribed">{t('??? ?????', 'Unsubscribed')}</option>
                    </select>
                </div>

                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>{t('??????', 'Email')}</th>
                                <th>{t('?????', 'Name')}</th>
                                <th>{t('??????', 'Status')}</th>
                                <th>{t('????? ????????', 'Subscribed')}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers.data.map((subscriber) => (
                                <tr key={subscriber.id}>
                                    <td>{subscriber.email}</td>
                                    <td>{subscriber.name || '-'}</td>
                                    <td>
                                        <span className="badge bg-light text-dark border">
                                            {subscriber.status}
                                        </span>
                                    </td>
                                    <td className="text-muted small">
                                        {subscriber.subscribed_at || '-'}
                                    </td>
                                    <td className="text-end">
                                        <div className="d-flex flex-wrap gap-2 justify-content-end">
                                            {subscriber.status !== 'confirmed' && (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-success"
                                                    onClick={() =>
                                                        updateStatus(
                                                            subscriber.id,
                                                            'confirmed',
                                                        )
                                                    }
                                                >
                                                    {t('?????', 'Confirm')}
                                                </button>
                                            )}
                                            {subscriber.status !== 'unsubscribed' && (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() =>
                                                        updateStatus(
                                                            subscriber.id,
                                                            'unsubscribed',
                                                        )
                                                    }
                                                >
                                                    {t('?????', 'Unsubscribe')}
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => destroy(subscriber.id)}
                                            >
                                                {t('???', 'Delete')}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {subscribers.data.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">
                                        {t('?? ???? ??????? ??? ????.', 'No subscribers yet.')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={subscribers.links} />
            </div>
        </AdminLayout>
    );
}
