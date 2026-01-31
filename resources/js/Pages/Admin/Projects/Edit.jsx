// MOHAMED HASSANIN (KAPAKA)
import ProjectForm from '@/Pages/Admin/Projects/Form';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function ProjectEdit({ project }) {
    const { locale } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        title_ar: project.title_ar || '',
        title_en: project.title_en || '',
        slug: project.slug || '',
        summary_ar: project.summary_ar || '',
        summary_en: project.summary_en || '',
        description_ar: project.description_ar || '',
        description_en: project.description_en || '',
        client: project.client || '',
        year: project.year || '',
        stack: project.stack || '',
        cover_image: project.cover_image || '',
        cover_image_file: null,
        remove_cover_image: false,
        gallery_images: project.gallery_images || [],
        gallery_removed: [],
        is_featured: project.is_featured || false,
        is_active: project.is_active || false,
        seo_meta_title_ar: project.seo_meta_title_ar || '',
        seo_meta_title_en: project.seo_meta_title_en || '',
        seo_meta_description_ar: project.seo_meta_description_ar || '',
        seo_meta_description_en: project.seo_meta_description_en || '',
        seo_og_image: project.seo_og_image || '',
        seo_robots: project.seo_robots || '',
    });

    const submit = (event) => {
        event.preventDefault();
        put(route('admin.projects.update', { project: project.id }), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title={locale === 'ar' ? 'تعديل مشروع' : 'Edit Project'}>
            <Head title="Edit Project" />
            <div className="content-card">
                <ProjectForm
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
