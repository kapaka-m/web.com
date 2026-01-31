// MOHAMED HASSANIN (KAPAKA)
import CategoryForm from '@/Pages/Admin/Categories/Form';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function CategoryEdit({ category }) {
    const { locale } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        name_ar: category.name_ar || '',
        name_en: category.name_en || '',
        slug: category.slug || '',
        is_active: category.is_active ?? false,
    });

    const submit = (event) => {
        event.preventDefault();
        put(route('admin.categories.update', { category: category.id }));
    };

    return (
        <AdminLayout title={locale === 'ar' ? 'تعديل تصنيف' : 'Edit Category'}>
            <Head title="Edit Category" />
            <div className="content-card">
                <CategoryForm
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
