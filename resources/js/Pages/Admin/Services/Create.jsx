// MOHAMED HASSANIN (KAPAKA)
import ServiceForm from '@/Pages/Admin/Services/Form';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function ServiceCreate() {
    const { locale } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        title_ar: '',
        title_en: '',
        slug: '',
        summary_ar: '',
        summary_en: '',
        description_ar: '',
        description_en: '',
        features_ar: '',
        features_en: '',
        icon: '',
        sort_order: 0,
        is_active: true,
        seo_meta_title_ar: '',
        seo_meta_title_en: '',
        seo_meta_description_ar: '',
        seo_meta_description_en: '',
        seo_og_image: '',
        seo_robots: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('admin.services.store'));
    };

    return (
        <AdminLayout title={locale === 'ar' ? 'إضافة خدمة' : 'Add Service'}>
            <Head title="Add Service" />
            <div className="content-card">
                <ServiceForm
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
