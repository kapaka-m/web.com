// MOHAMED HASSANIN (KAPAKA)
import PartnerForm from '@/Pages/Admin/Partners/Form';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function PartnerCreate() {
    const { locale } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        logo: '',
        url: '',
        sort_order: 0,
        is_active: true,
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('admin.partners.store'));
    };

    return (
        <AdminLayout title={locale === 'ar' ? 'إضافة شريك' : 'Add Partner'}>
            <Head title="Add Partner" />
            <div className="content-card">
                <PartnerForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    submitLabel={locale === 'ar' ? 'حفظ' : 'Save'}
                    locale={locale}
                />
            </div>
        </AdminLayout>
    );
}
