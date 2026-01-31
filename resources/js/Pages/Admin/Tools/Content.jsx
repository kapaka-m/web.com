// MOHAMED HASSANIN (KAPAKA)
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

export default function ContentTools({ types }) {
    const { locale } = usePage().props;
    const title = locale === 'ar' ? 'أدوات المحتوى' : 'Content Tools';
    const csrf = useMemo(
        () =>
            document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content'),
        [],
    );

    return (
        <AdminLayout title={title}>
            <Head title={title} />
            <div className="content-card">
                <h5 className="mb-3">{title}</h5>
                <div className="row g-4">
                    <div className="col-lg-6">
                        <div className="border rounded-4 p-3 bg-white h-100">
                            <h6 className="mb-3">
                                {locale === 'ar' ? 'تصدير المحتوى' : 'Export Content'}
                            </h6>
                            <form
                                method="post"
                                action={route('admin.content-tools.export')}
                            >
                                <input type="hidden" name="_token" value={csrf} />
                                <div className="mb-3">
                                    <label className="form-label">
                                        {locale === 'ar' ? 'نوع المحتوى' : 'Type'}
                                    </label>
                                    <select className="form-select" name="type">
                                        {types.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">
                                        {locale === 'ar' ? 'الصيغة' : 'Format'}
                                    </label>
                                    <select className="form-select" name="format">
                                        <option value="json">JSON</option>
                                        <option value="csv">CSV</option>
                                    </select>
                                </div>
                                <button className="btn btn-outline-primary" type="submit">
                                    {locale === 'ar' ? 'تنزيل الملف' : 'Download'}
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="border rounded-4 p-3 bg-white h-100">
                            <h6 className="mb-3">
                                {locale === 'ar' ? 'استيراد المحتوى' : 'Import Content'}
                            </h6>
                            <form
                                method="post"
                                action={route('admin.content-tools.import')}
                                encType="multipart/form-data"
                            >
                                <input type="hidden" name="_token" value={csrf} />
                                <div className="mb-3">
                                    <label className="form-label">
                                        {locale === 'ar' ? 'نوع المحتوى' : 'Type'}
                                    </label>
                                    <select className="form-select" name="type">
                                        {types.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">
                                        {locale === 'ar' ? 'الصيغة' : 'Format'}
                                    </label>
                                    <select className="form-select" name="format">
                                        <option value="json">JSON</option>
                                        <option value="csv">CSV</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">
                                        {locale === 'ar' ? 'الملف' : 'File'}
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="file"
                                        required
                                    />
                                </div>
                                <button className="btn btn-outline-success" type="submit">
                                    {locale === 'ar' ? 'بدء الاستيراد' : 'Import'}
                                </button>
                            </form>
                            <div className="form-text mt-3">
                                {locale === 'ar'
                                    ? 'تأكد من مطابقة الأعمدة مع ملف التصدير.'
                                    : 'Ensure the file columns match the export format.'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
