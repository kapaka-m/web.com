// MOHAMED HASSANIN (KAPAKA)
import Pagination from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function WebhooksIndex({ endpoints }) {
    return (
        <AdminLayout title="Webhooks">
            <Head title="Webhooks" />
            <div className="content-card">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Webhooks</h5>
                    <Link className="btn btn-primary" href={route('admin.webhooks.create')}>
                        New Webhook
                    </Link>
                </div>
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>URL</th>
                                <th>Events</th>
                                <th>Active</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {endpoints.data.map((endpoint) => (
                                <tr key={endpoint.id}>
                                    <td>{endpoint.name}</td>
                                    <td className="text-muted small">{endpoint.url}</td>
                                    <td className="text-muted small">
                                        {(endpoint.events || []).join(', ') || 'All'}
                                    </td>
                                    <td>
                                        {endpoint.is_active ? (
                                            <span className="badge bg-success">Active</span>
                                        ) : (
                                            <span className="badge bg-secondary">Paused</span>
                                        )}
                                    </td>
                                    <td className="text-end">
                                        <Link
                                            className="btn btn-sm btn-outline-secondary"
                                            href={route('admin.webhooks.edit', endpoint.id)}
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {endpoints.data.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">
                                        No webhooks yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={endpoints.links} />
            </div>
        </AdminLayout>
    );
}
