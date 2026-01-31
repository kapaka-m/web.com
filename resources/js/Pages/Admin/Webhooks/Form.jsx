// MOHAMED HASSANIN (KAPAKA)
export default function WebhookForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    submitLabel,
    availableEvents = [],
}) {
    const toggleEvent = (eventKey) => {
        const current = new Set(data.events || []);
        if (current.has(eventKey)) {
            current.delete(eventKey);
        } else {
            current.add(eventKey);
        }
        setData('events', Array.from(current));
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        value={data.name || ''}
                        onChange={(event) => setData('name', event.target.value)}
                    />
                    {errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                    )}
                </div>
                <div className="col-md-6">
                    <label className="form-label">URL</label>
                    <input
                        className={`form-control ${errors.url ? 'is-invalid' : ''}`}
                        value={data.url || ''}
                        onChange={(event) => setData('url', event.target.value)}
                    />
                    {errors.url && (
                        <div className="invalid-feedback">{errors.url}</div>
                    )}
                </div>
                <div className="col-md-6">
                    <label className="form-label">Secret</label>
                    <input
                        type="password"
                        className={`form-control ${errors.secret ? 'is-invalid' : ''}`}
                        value={data.secret || ''}
                        onChange={(event) => setData('secret', event.target.value)}
                        placeholder="Leave blank to keep current"
                    />
                    {errors.secret && (
                        <div className="invalid-feedback">{errors.secret}</div>
                    )}
                </div>
                <div className="col-md-6 d-flex align-items-center">
                    <div className="form-check form-switch mt-4">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="webhook-active"
                            checked={Boolean(data.is_active)}
                            onChange={(event) =>
                                setData('is_active', event.target.checked)
                            }
                        />
                        <label className="form-check-label" htmlFor="webhook-active">
                            Active
                        </label>
                    </div>
                </div>
                <div className="col-12">
                    <label className="form-label">Events</label>
                    <div className="d-flex flex-wrap gap-3">
                        {availableEvents.map((eventKey) => (
                            <div className="form-check" key={eventKey}>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`event-${eventKey}`}
                                    checked={(data.events || []).includes(eventKey)}
                                    onChange={() => toggleEvent(eventKey)}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor={`event-${eventKey}`}
                                >
                                    {eventKey}
                                </label>
                            </div>
                        ))}
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
