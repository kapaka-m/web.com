// MOHAMED HASSANIN (KAPAKA)
import WebhookForm from '@/Pages/Admin/Webhooks/Form';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function WebhooksEdit({ endpoint, availableEvents = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        name: endpoint.name || '',
        url: endpoint.url || '',
        secret: endpoint.secret || '',
        events: endpoint.events || [],
        is_active: Boolean(endpoint.is_active),
    });

    const submit = (event) => {
        event.preventDefault();
        put(route('admin.webhooks.update', endpoint.id));
    };

    return (
        <AdminLayout title="Edit Webhook">
            <Head title="Edit Webhook" />
            <WebhookForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={submit}
                submitLabel="Update"
                availableEvents={availableEvents}
            />
        </AdminLayout>
    );
}
