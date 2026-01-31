// MOHAMED HASSANIN (KAPAKA)
import ServiceForm from '@/Pages/Admin/Services/Form';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function ServiceEdit({ service }) {
    const { locale } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        title_ar: service.title_ar || '',
        title_en: service.title_en || '',
        slug: service.slug || '',
        summary_ar: service.summary_ar || '',
        summary_en: service.summary_en || '',
        description_ar: service.description_ar || '',
        description_en: service.description_en || '',
        features_ar: service.features_ar || '',
        features_en: service.features_en || '',
        icon: service.icon || '',
        sort_order: service.sort_order ?? 0,
        is_active: service.is_active ?? false,
        seo_meta_title_ar: service.seo_meta_title_ar || '',
        seo_meta_title_en: service.seo_meta_title_en || '',
        seo_meta_description_ar: service.seo_meta_description_ar || '',
        seo_meta_description_en: service.seo_meta_description_en || '',
        seo_og_image: service.seo_og_image || '',
        seo_robots: service.seo_robots || '',
    });

    const submit = (event) => {
        event.preventDefault();
        put(route('admin.services.update', { service: service.id }));
    };

    return (
        <AdminLayout title={locale === 'ar' ? 'تعديل الخدمة' : 'Edit Service'}>
            <Head title="Edit Service" />
            <div className="content-card">
                <ServiceForm
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
