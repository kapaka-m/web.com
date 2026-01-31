// MOHAMED HASSANIN (KAPAKA)
import PartnerForm from '@/Pages/Admin/Partners/Form';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function PartnerEdit({ partner }) {
    const { locale } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        name: partner.name || '',
        logo: partner.logo || '',
        url: partner.url || '',
        sort_order: partner.sort_order ?? 0,
        is_active: partner.is_active ?? false,
    });

    const submit = (event) => {
        event.preventDefault();
        put(route('admin.partners.update', { partner: partner.id }));
    };

    return (
        <AdminLayout title={locale === 'ar' ? 'تعديل شريك' : 'Edit Partner'}>
            <Head title="Edit Partner" />
            <div className="content-card">
                <PartnerForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    submitLabel={locale === 'ar' ? 'تحديث' : 'Update'}
                    locale={locale}
                />
            </div>
        </AdminLayout>
    );
}
