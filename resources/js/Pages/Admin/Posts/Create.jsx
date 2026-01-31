// MOHAMED HASSANIN (KAPAKA)
import PostForm from '@/Pages/Admin/Posts/Form';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function PostCreate({ categories, tags, reviewStatusOptions }) {
    const { locale } = usePage().props;
    const [draftId, setDraftId] = useState(null);
    const { data, setData, post, processing, errors } = useForm({
        title_ar: '',
        title_en: '',
        slug: '',
        excerpt_ar: '',
        excerpt_en: '',
        content_ar: '',
        content_en: '',
        content_markdown_ar: '',
        content_markdown_en: '',
        use_markdown: false,
        cover_image: '',
        cover_image_file: null,
        remove_cover_image: false,
        category_id: '',
        tags: '',
        published_at: '',
        is_published: false,
        review_status: 'draft',
        seo_meta_title_ar: '',
        seo_meta_title_en: '',
        seo_meta_description_ar: '',
        seo_meta_description_en: '',
        seo_og_image: '',
        seo_robots: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('admin.posts.store'), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title={locale === 'ar' ? 'إضافة مقال' : 'Add Post'}>
            <Head title="Add Post" />
            <div className="content-card">
                <PostForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    submitLabel={locale === 'ar' ? 'حفظ' : 'Save'}
                    locale={locale}
                    categories={categories}
                    tagsOptions={tags}
                    reviewStatusOptions={reviewStatusOptions}
                    previewUrl={
                        draftId
                            ? route('admin.posts.preview', { post: draftId })
                            : null
                    }
                    autosaveUrl={route('admin.posts.autosave')}
                    autosaveExistingUrl={
                        draftId
                            ? route('admin.posts.autosave-existing', { post: draftId })
                            : null
                    }
                    onDraftSaved={(id) => setDraftId(id)}
                />
            </div>
        </AdminLayout>
    );
}
