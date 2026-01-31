// MOHAMED HASSANIN (KAPAKA)
import TagForm from '@/Pages/Admin/Tags/Form';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function TagEdit({ tag }) {
    const { locale } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        name_ar: tag.name_ar || '',
        name_en: tag.name_en || '',
        slug: tag.slug || '',
    });

    const submit = (event) => {
        event.preventDefault();
        put(route('admin.tags.update', { tag: tag.id }));
    };

    return (
        <AdminLayout title={locale === 'ar' ? 'تعديل وسم' : 'Edit Tag'}>
            <Head title="Edit Tag" />
            <div className="content-card">
                <TagForm
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
