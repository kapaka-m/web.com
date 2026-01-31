// MOHAMED HASSANIN (KAPAKA)
import { useEffect, useState } from 'react';

export default function ReadingProgress({ targetId = null, offset = 0 }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const update = () => {
            const target = targetId
                ? document.getElementById(targetId)
                : document.documentElement;

            if (!target) {
                setProgress(0);
                return;
            }

            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const start = targetId
                ? target.offsetTop - offset
                : 0;
            const height = targetId
                ? target.offsetHeight
                : document.documentElement.scrollHeight;
            const total = Math.max(1, height - window.innerHeight);
            const current = Math.min(
                Math.max((scrollTop - start) / total, 0),
                1,
            );

            setProgress(Number.isFinite(current) ? current : 0);
        };

        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);

        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, [targetId, offset]);

    return (
        <div className="reading-progress" aria-hidden="true">
            <span style={{ width: `${progress * 100}%` }} />
        </div>
    );
}
