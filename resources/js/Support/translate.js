// MOHAMED HASSANIN (KAPAKA)
export const translateText = async ({ text, source, target }) => {
    const trimmed = String(text || '').trim();
    if (!trimmed) {
        return '';
    }

    const token = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

    const response = await fetch(route('admin.translate'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'X-CSRF-TOKEN': token } : {}),
        },
        body: JSON.stringify({ text: trimmed, source, target }),
    });

    if (!response.ok) {
        throw new Error('Translation failed.');
    }

    const payload = await response.json();
    return payload?.translation || '';
};
