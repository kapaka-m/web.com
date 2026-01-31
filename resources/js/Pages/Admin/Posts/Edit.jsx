// MOHAMED HASSANIN (KAPAKA)
import PostForm from '@/Pages/Admin/Posts/Form';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function PostEdit({ post, categories, tags, reviewStatusOptions }) {
    const { locale } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        title_ar: post.title_ar || '',
        title_en: post.title_en || '',
        slug: post.slug || '',
        excerpt_ar: post.excerpt_ar || '',
        excerpt_en: post.excerpt_en || '',
        content_ar: post.content_ar || '',
        content_en: post.content_en || '',
        content_markdown_ar: post.content_markdown_ar || '',
        content_markdown_en: post.content_markdown_en || '',
        use_markdown: post.use_markdown || false,
        cover_image: post.cover_image || '',
        cover_image_file: null,
        remove_cover_image: false,
        category_id: post.category_id || '',
        tags: post.tags || '',
        published_at: post.published_at || '',
        is_published: post.is_published || false,
        review_status: post.review_status || 'draft',
        seo_meta_title_ar: post.seo_meta_title_ar || '',
        seo_meta_title_en: post.seo_meta_title_en || '',
        seo_meta_description_ar: post.seo_meta_description_ar || '',
        seo_meta_description_en: post.seo_meta_description_en || '',
        seo_og_image: post.seo_og_image || '',
        seo_robots: post.seo_robots || '',
    });

    const submit = (event) => {
        event.preventDefault();
        put(route('admin.posts.update', { post: post.id }), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title={locale === 'ar' ? 'تعديل مقال' : 'Edit Post'}>
            <Head title="Edit Post" />
            <div className="content-card">
                <PostForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    submitLabel={locale === 'ar' ? 'تحديث' : 'Update'}
                    locale={locale}
                    categories={categories}
                    tagsOptions={tags}
                    reviewStatusOptions={reviewStatusOptions}
                    previewUrl={route('admin.posts.preview', { post: post.id })}
                    autosaveExistingUrl={route('admin.posts.autosave-existing', { post: post.id })}
                />
            </div>
        </AdminLayout>
    );
}
