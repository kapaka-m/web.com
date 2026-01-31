// MOHAMED HASSANIN (KAPAKA)
import UserForm from '@/Pages/Admin/Users/Form';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function UserEdit({ user }) {
    const { locale } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'editor',
        password: '',
        password_confirmation: '',
    });

    const submit = (event) => {
        event.preventDefault();
        put(route('admin.users.update', { user: user.id }));
    };

    return (
        <AdminLayout title={locale === 'ar' ? 'تعديل مستخدم' : 'Edit User'}>
            <Head title="Edit User" />
            <div className="content-card">
                <UserForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    submitLabel={locale === 'ar' ? 'تحديث' : 'Update'}
                    requirePassword={false}
                    locale={locale}
                />
            </div>
        </AdminLayout>
    );
}
