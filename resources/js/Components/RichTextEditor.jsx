// MOHAMED HASSANIN (KAPAKA)
import { useEffect, useRef } from 'react';

const defaultActions = [
    { command: 'bold', icon: 'bi-type-bold', label: 'Bold' },
    { command: 'italic', icon: 'bi-type-italic', label: 'Italic' },
    { command: 'underline', icon: 'bi-type-underline', label: 'Underline' },
    { command: 'insertUnorderedList', icon: 'bi-list-ul', label: 'Bullets' },
    { command: 'insertOrderedList', icon: 'bi-list-ol', label: 'Numbered' },
    { command: 'link', icon: 'bi-link-45deg', label: 'Insert link', handler: 'link' },
    { command: 'gallery', icon: 'bi-images', label: 'Insert gallery', handler: 'gallery' },
    { command: 'code', icon: 'bi-code-slash', label: 'Insert code block', handler: 'code' },
];

export default function RichTextEditor({
    value,
    onChange,
    placeholder,
    actions = defaultActions,
}) {
    const editorRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== (value || '')) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const exec = (command, argument = null) => {
        document.execCommand(command, false, argument);
        editorRef.current?.focus();
    };

    const insertHtml = (html) => {
        document.execCommand('insertHTML', false, html);
        editorRef.current?.focus();
    };

    const escapeHtml = (value) =>
        String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

    const handleLink = () => {
        const url = window.prompt('Enter a URL');
        if (url) {
            exec('createLink', url);
        }
    };

    const handleGallery = () => {
        const value = window.prompt('Enter image URLs separated by commas');
        if (!value) {
            return;
        }

        const urls = value
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

        if (!urls.length) {
            return;
        }

        const images = urls
            .map(
                (url) =>
                    `<img src="${escapeHtml(
                        url,
                    )}" alt="Gallery image" loading="lazy" />`,
            )
            .join('');
        insertHtml(`<figure class="content-gallery">${images}</figure>`);
    };

    const handleCode = () => {
        const language =
            window.prompt('Language (e.g. html, js, php, bash)', 'plaintext') ||
            'plaintext';
        const code = window.prompt('Paste your code');
        if (!code) {
            return;
        }

        const escaped = escapeHtml(code);
        insertHtml(
            `<pre><code class="language-${escapeHtml(
                language,
            )}">${escaped}</code></pre>`,
        );
    };

    const handlers = {
        link: handleLink,
        gallery: handleGallery,
        code: handleCode,
    };

    const handleAction = (action) => {
        if (action.handler && handlers[action.handler]) {
            handlers[action.handler]();
            return;
        }

        exec(action.command, action.argument);
    };

    const handleInput = () => {
        onChange(editorRef.current?.innerHTML || '');
    };

    return (
        <div className="rich-editor">
            <div className="rich-editor__toolbar">
                {actions.map((action) => (
                    <button
                        type="button"
                        key={action.command}
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleAction(action)}
                        aria-label={action.label}
                    >
                        <i className={`bi ${action.icon}`}></i>
                    </button>
                ))}
            </div>
            <div
                ref={editorRef}
                className="rich-editor__content"
                contentEditable
                role="textbox"
                data-placeholder={placeholder}
                onInput={handleInput}
            ></div>
        </div>
    );
}
