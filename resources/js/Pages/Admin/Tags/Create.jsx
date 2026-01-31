// MOHAMED HASSANIN (KAPAKA)
import TagForm from '@/Pages/Admin/Tags/Form';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function TagCreate() {
    const { locale } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name_ar: '',
        name_en: '',
        slug: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('admin.tags.store'));
    };

    return (
        <AdminLayout title={locale === 'ar' ? 'إضافة وسم' : 'Add Tag'}>
            <Head title="Add Tag" />
            <div className="content-card">
                <TagForm
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
