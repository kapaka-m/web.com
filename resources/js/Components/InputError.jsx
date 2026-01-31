// MOHAMED HASSANIN (KAPAKA)
export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={`invalid-feedback d-block ${className}`}
        >
            {message}
        </p>
    ) : null;
}
