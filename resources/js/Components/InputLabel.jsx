// MOHAMED HASSANIN (KAPAKA)
export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={`form-label fw-semibold ${className}`}
        >
            {value ? value : children}
        </label>
    );
}
