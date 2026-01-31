// MOHAMED HASSANIN (KAPAKA)
import ProjectForm from '@/Pages/Admin/Projects/Form';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function ProjectCreate() {
    const { locale } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        title_ar: '',
        title_en: '',
        slug: '',
        summary_ar: '',
        summary_en: '',
        description_ar: '',
        description_en: '',
        client: '',
        year: '',
        stack: '',
        cover_image: '',
        cover_image_file: null,
        remove_cover_image: false,
        gallery_images: [],
        gallery_removed: [],
        is_featured: false,
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
        post(route('admin.projects.store'), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title={locale === 'ar' ? 'إضافة مشروع' : 'Add Project'}>
            <Head title="Add Project" />
            <div className="content-card">
                <ProjectForm
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
