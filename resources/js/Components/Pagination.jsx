// MOHAMED HASSANIN (KAPAKA)
import { Link } from '@inertiajs/react';

export default function Pagination({ links = [] }) {
    if (links.length <= 1) {
        return null;
    }

    return (
        <nav>
            <ul className="pagination justify-content-center">
                {links.map((link, index) => (
                    <li
                        key={`${link.label}-${index}`}
                        className={`page-item ${
                            link.active ? 'active' : ''
                        } ${link.url ? '' : 'disabled'}`}
                    >
                        {link.url ? (
                            <Link
                                className="page-link"
                                href={link.url}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ) : (
                            <span
                                className="page-link"
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
}
