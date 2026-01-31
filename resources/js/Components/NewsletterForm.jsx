// MOHAMED HASSANIN (KAPAKA)
import { useForm, usePage } from '@inertiajs/react';

export default function NewsletterForm({ className = '' }) {
    const { locale } = usePage().props;
    const isArabic = locale === 'ar';
    const t = (ar, en) => (isArabic ? ar : en);

    const { data, setData, post, processing, errors, reset, wasSuccessful } =
        useForm({
            name: '',
            email: '',
        });

    const submit = (event) => {
        event.preventDefault();
        post(route('newsletter.store', { locale }), {
            preserveScroll: true,
            onSuccess: () => reset('email', 'name'),
        });
    };

    return (
        <form className={className} onSubmit={submit}>
            <div className="d-flex flex-column gap-2">
                <label className="form-label mb-0">
                    {t('????? ?? ?????? ????????', 'Join the newsletter')}
                </label>
                <div className="d-flex flex-column flex-md-row gap-2">
                    <input
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        placeholder={t('???? (???????)', 'Your name (optional)')}
                        value={data.name}
                        onChange={(event) => setData('name', event.target.value)}
                    />
                    <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder={t('????? ??????????', 'Email address')}
                        value={data.email}
                        onChange={(event) => setData('email', event.target.value)}
                        required
                    />
                    <button className="btn btn-dark" disabled={processing} type="submit">
                        {processing ? t('???? ???????', 'Submitting') : t('?????', 'Subscribe')}
                    </button>
                </div>
                {(errors.email || errors.name) && (
                    <div className="text-danger small">
                        {errors.email || errors.name}
                    </div>
                )}
                {wasSuccessful && (
                    <div className="text-success small">
                        {t('?? ????? ???? ??????? ??? ?????.', 'Check your inbox for confirmation.')}
                    </div>
                )}
            </div>
        </form>
    );
}
