// MOHAMED HASSANIN (KAPAKA)
export default function TableOfContents({ items = [], title }) {
    if (!items.length) {
        return null;
    }

    return (
        <div className="toc-card">
            {title && <h6 className="toc-title">{title}</h6>}
            <ul className="toc-list">
                {items.map((item) => (
                    <li key={item.id} className={`toc-item level-${item.level}`}>
                        <a href={`#${item.id}`}>{item.text}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
