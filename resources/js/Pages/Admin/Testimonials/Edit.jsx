// MOHAMED HASSANIN (KAPAKA)
import TestimonialForm from '@/Pages/Admin/Testimonials/Form';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function TestimonialEdit({ testimonial }) {
    const { locale } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        name: testimonial.name || '',
        role_ar: testimonial.role_ar || '',
        role_en: testimonial.role_en || '',
        quote_ar: testimonial.quote_ar || '',
        quote_en: testimonial.quote_en || '',
        company: testimonial.company || '',
        avatar: testimonial.avatar || '',
        sort_order: testimonial.sort_order ?? 0,
        is_active: testimonial.is_active ?? false,
    });

    const submit = (event) => {
        event.preventDefault();
        put(route('admin.testimonials.update', { testimonial: testimonial.id }));
    };

    return (
        <AdminLayout title={locale === 'ar' ? 'تعديل شهادة' : 'Edit Testimonial'}>
            <Head title="Edit Testimonial" />
            <div className="content-card">
                <TestimonialForm
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
