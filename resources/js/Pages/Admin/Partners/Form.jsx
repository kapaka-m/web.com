// MOHAMED HASSANIN (KAPAKA)
export default function PartnerForm({
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
                        {locale === 'ar' ? 'اسم الشريك' : 'Partner Name'}
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
                        {locale === 'ar' ? 'رابط الشعار' : 'Logo URL'}
                    </label>
                    <input
                        className={`form-control ${errors.logo ? 'is-invalid' : ''}`}
                        value={data.logo || ''}
                        onChange={(event) => setData('logo', event.target.value)}
                    />
                    {errors.logo && (
                        <div className="invalid-feedback">{errors.logo}</div>
                    )}
                </div>
                <div className="col-md-6">
                    <label className="form-label">
                        {locale === 'ar' ? 'رابط الموقع' : 'Website URL'}
                    </label>
                    <input
                        className={`form-control ${errors.url ? 'is-invalid' : ''}`}
                        value={data.url || ''}
                        onChange={(event) => setData('url', event.target.value)}
                    />
                    {errors.url && (
                        <div className="invalid-feedback">{errors.url}</div>
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
                            id="partner-active"
                        />
                        <label className="form-check-label" htmlFor="partner-active">
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
