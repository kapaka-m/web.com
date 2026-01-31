// MOHAMED HASSANIN (KAPAKA)
import TestimonialForm from '@/Pages/Admin/Testimonials/Form';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function TestimonialCreate() {
    const { locale } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        role_ar: '',
        role_en: '',
        quote_ar: '',
        quote_en: '',
        company: '',
        avatar: '',
        sort_order: 0,
        is_active: true,
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('admin.testimonials.store'));
    };

    return (
        <AdminLayout title={locale === 'ar' ? 'إضافة شهادة' : 'Add Testimonial'}>
            <Head title="Add Testimonial" />
            <div className="content-card">
                <TestimonialForm
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
