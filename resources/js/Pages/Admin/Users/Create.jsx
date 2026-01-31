// MOHAMED HASSANIN (KAPAKA)
import UserForm from '@/Pages/Admin/Users/Form';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function UserCreate() {
    const { locale } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        role: 'editor',
        password: '',
        password_confirmation: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AdminLayout title={locale === 'ar' ? 'إضافة مستخدم' : 'Add User'}>
            <Head title="Add User" />
            <div className="content-card">
                <UserForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    submitLabel={locale === 'ar' ? 'حفظ' : 'Save'}
                    requirePassword={true}
                    locale={locale}
                />
            </div>
        </AdminLayout>
    );
}
