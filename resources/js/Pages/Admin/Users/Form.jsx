// MOHAMED HASSANIN (KAPAKA)
export default function UserForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    submitLabel,
    requirePassword = false,
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
                        {locale === 'ar' ? 'البريد' : 'Email'}
                    </label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={data.email}
                        onChange={(event) => setData('email', event.target.value)}
                    />
                    {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                    )}
                </div>
                <div className="col-md-6">
                    <label className="form-label">
                        {locale === 'ar' ? 'الصلاحية' : 'Role'}
                    </label>
                    <select
                        className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                        value={data.role}
                        onChange={(event) => setData('role', event.target.value)}
                    >
                        <option value="admin">
                            {locale === 'ar' ? 'مدير' : 'Admin'}
                        </option>
                        <option value="editor">
                            {locale === 'ar' ? 'محرر' : 'Editor'}
                        </option>
                    </select>
                    {errors.role && (
                        <div className="invalid-feedback">{errors.role}</div>
                    )}
                </div>
                <div className="col-md-6">
                    <label className="form-label">
                        {locale === 'ar' ? 'كلمة المرور' : 'Password'}
                    </label>
                    <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        value={data.password}
                        onChange={(event) => setData('password', event.target.value)}
                        required={requirePassword}
                    />
                    {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                    )}
                </div>
                <div className="col-md-6">
                    <label className="form-label">
                        {locale === 'ar'
                            ? 'تأكيد كلمة المرور'
                            : 'Confirm Password'}
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        value={data.password_confirmation}
                        onChange={(event) =>
                            setData('password_confirmation', event.target.value)
                        }
                        required={requirePassword}
                    />
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
