// MOHAMED HASSANIN (KAPAKA)
export default function TestimonialForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    submitLabel,
    locale,
}) {
    return (
        <form onSubmit={onSubmit}>
            <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">
                        {locale === 'ar' ? 'الاسم' : 'Name'}
                    </label>
                    <input
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        value={data.name}
                        onChange={(event) => setData('name', event.target.value)}
                    />
                    {errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                    )}
                </div>
                <div className="col-md-6">
                    <label className="form-label">
                        {locale === 'ar' ? 'الشركة' : 'Company'}
                    </label>
                    <input
                        className={`form-control ${errors.company ? 'is-invalid' : ''}`}
                        value={data.company || ''}
                        onChange={(event) => setData('company', event.target.value)}
                    />
                    {errors.company && (
                        <div className="invalid-feedback">{errors.company}</div>
                    )}
                </div>
                <div className="col-md-6">
                    <label className="form-label">
                        {locale === 'ar' ? 'المنصب (عربي)' : 'Role (AR)'}
                    </label>
                    <input
                        className={`form-control ${errors.role_ar ? 'is-invalid' : ''}`}
                        value={data.role_ar || ''}
                        onChange={(event) => setData('role_ar', event.target.value)}
                    />
                    {errors.role_ar && (
                        <div className="invalid-feedback">{errors.role_ar}</div>
                    )}
                </div>
                <div className="col-md-6">
                    <label className="form-label">
                        {locale === 'ar' ? 'المنصب (إنجليزي)' : 'Role (EN)'}
                    </label>
                    <input
                        className={`form-control ${errors.role_en ? 'is-invalid' : ''}`}
                        value={data.role_en || ''}
                        onChange={(event) => setData('role_en', event.target.value)}
                    />
                    {errors.role_en && (
                        <div className="invalid-feedback">{errors.role_en}</div>
                    )}
                </div>
                <div className="col-md-6">
                    <label className="form-label">
                        {locale === 'ar' ? 'نص الشهادة (عربي)' : 'Quote (AR)'}
                    </label>
                    <textarea
                        rows="3"
                        className={`form-control ${errors.quote_ar ? 'is-invalid' : ''}`}
                        value={data.quote_ar}
                        onChange={(event) => setData('quote_ar', event.target.value)}
                    />
                    {errors.quote_ar && (
                        <div className="invalid-feedback">{errors.quote_ar}</div>
                    )}
                </div>
                <div className="col-md-6">
                    <label className="form-label">
                        {locale === 'ar' ? 'نص الشهادة (إنجليزي)' : 'Quote (EN)'}
                    </label>
                    <textarea
                        rows="3"
                        className={`form-control ${errors.quote_en ? 'is-invalid' : ''}`}
                        value={data.quote_en}
                        onChange={(event) => setData('quote_en', event.target.value)}
                    />
                    {errors.quote_en && (
                        <div className="invalid-feedback">{errors.quote_en}</div>
                    )}
                </div>
                <div className="col-md-6">
                    <label className="form-label">
                        {locale === 'ar' ? 'رابط الصورة الشخصية' : 'Avatar URL'}
                    </label>
                    <input
                        className={`form-control ${errors.avatar ? 'is-invalid' : ''}`}
                        value={data.avatar || ''}
                        onChange={(event) => setData('avatar', event.target.value)}
                    />
                    {errors.avatar && (
                        <div className="invalid-feedback">{errors.avatar}</div>
                    )}
                </div>
                <div className="col-md-3">
                    <label className="form-label">
                        {locale === 'ar' ? 'الترتيب' : 'Sort Order'}
                    </label>
                    <input
                        type="number"
                        className={`form-control ${errors.sort_order ? 'is-invalid' : ''}`}
                        value={data.sort_order}
                        onChange={(event) => setData('sort_order', event.target.value)}
                    />
                    {errors.sort_order && (
                        <div className="invalid-feedback">{errors.sort_order}</div>
                    )}
                </div>
                <div className="col-md-3 d-flex align-items-center">
                    <div className="form-check mt-4">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(event) => setData('is_active', event.target.checked)}
                            id="testimonial-active"
                        />
                        <label className="form-check-label" htmlFor="testimonial-active">
                            {locale === 'ar' ? 'نشط' : 'Active'}
                        </label>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <button className="btn btn-primary" disabled={processing} type="submit">
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
