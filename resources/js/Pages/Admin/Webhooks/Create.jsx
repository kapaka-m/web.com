// MOHAMED HASSANIN (KAPAKA)
import WebhookForm from '@/Pages/Admin/Webhooks/Form';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function WebhooksCreate({ availableEvents = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        url: '',
        secret: '',
        events: [],
        is_active: true,
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('admin.webhooks.store'));
    };

    return (
        <AdminLayout title="New Webhook">
            <Head title="New Webhook" />
            <WebhookForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={submit}
                submitLabel="Save"
                availableEvents={availableEvents}
            />
        </AdminLayout>
    );
}
