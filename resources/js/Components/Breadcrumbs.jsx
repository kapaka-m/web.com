// MOHAMED HASSANIN (KAPAKA)
import { Link } from '@inertiajs/react';

export default function Breadcrumbs({ items = [] }) {
    if (!items.length) {
        return null;
    }

    return (
        <nav aria-label="breadcrumb" className="breadcrumbs mb-3">
            <ol className="breadcrumb mb-0">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    const key = `${item.label}-${index}`;

                    return (
                        <li
                            key={key}
                            className={`breadcrumb-item ${isLast ? 'active' : ''}`}
                            aria-current={isLast ? 'page' : undefined}
                        >
                            {item.href && !isLast ? (
                                <Link href={item.href}>{item.label}</Link>
                            ) : (
                                <span>{item.label}</span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
