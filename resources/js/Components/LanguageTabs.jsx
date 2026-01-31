// MOHAMED HASSANIN (KAPAKA)
import { useState } from 'react';

export default function LanguageTabs({ tabs = [], initial = 'ar', onChange }) {
    const [active, setActive] = useState(initial);

    return (
        <div className="language-tabs">
            <ul className="nav nav-tabs">
                {tabs.map((tab) => (
                    <li className="nav-item" key={tab.key}>
                        <button
                            className={`nav-link ${
                                active === tab.key ? 'active' : ''
                            }`}
                            type="button"
                            onClick={() => {
                                setActive(tab.key);
                                if (onChange) {
                                    onChange(tab.key);
                                }
                            }}
                        >
                            {tab.label}
                        </button>
                    </li>
                ))}
            </ul>
            <div className="tab-content border border-top-0 rounded-bottom p-3 bg-white">
                {tabs.map((tab) => (
                    <div
                        key={tab.key}
                        className={`tab-pane fade ${
                            active === tab.key ? 'show active' : ''
                        }`}
                    >
                        {tab.content}
                    </div>
                ))}
            </div>
        </div>
    );
}
