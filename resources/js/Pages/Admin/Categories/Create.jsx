// MOHAMED HASSANIN (KAPAKA)
import CategoryForm from '@/Pages/Admin/Categories/Form';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function CategoryCreate() {
    const { locale } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name_ar: '',
        name_en: '',
        slug: '',
        is_active: true,
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('admin.categories.store'));
    };

    return (
        <AdminLayout title={locale === 'ar' ? 'إضافة تصنيف' : 'Add Category'}>
            <Head title="Add Category" />
            <div className="content-card">
                <CategoryForm
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
