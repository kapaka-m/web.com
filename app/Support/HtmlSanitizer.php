<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Support;

use DOMDocument;
use DOMElement;

class HtmlSanitizer
{
    private const ALLOWED_TAGS = [
        'p',
        'br',
        'strong',
        'b',
        'em',
        'i',
        'u',
        'ul',
        'ol',
        'li',
        'a',
        'h2',
        'h3',
        'blockquote',
        'figure',
        'figcaption',
        'img',
        'pre',
        'code',
    ];

    public static function clean(?string $html): ?string
    {
        if ($html === null || trim($html) === '') {
            return $html;
        }

        libxml_use_internal_errors(true);

        $document = new DOMDocument();
        $document->loadHTML(
            '<div>' . $html . '</div>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
        );

        self::sanitizeNode($document->documentElement, $document);

        $clean = '';
        foreach ($document->documentElement->childNodes as $child) {
            $clean .= $document->saveHTML($child);
        }

        libxml_clear_errors();

        return $clean;
    }

    private static function sanitizeNode(DOMElement $element, DOMDocument $document): void
    {
        $nodes = [];
        foreach ($element->childNodes as $child) {
            if ($child instanceof DOMElement) {
                $nodes[] = $child;
            }
        }

        foreach ($nodes as $child) {
            if (!in_array($child->tagName, self::ALLOWED_TAGS, true)) {
                $fragment = $document->createDocumentFragment();
                while ($child->firstChild) {
                    $fragment->appendChild($child->firstChild);
                }
                $child->parentNode->replaceChild($fragment, $child);
                continue;
            }

            self::sanitizeAttributes($child);
            self::sanitizeNode($child, $document);
        }
    }

    private static function sanitizeAttributes(DOMElement $element): void
    {
        $allowedAttributes = [];

        if ($element->tagName === 'a') {
            $allowedAttributes = ['href', 'target', 'rel'];
        }

        if ($element->tagName === 'img') {
            $allowedAttributes = ['src', 'alt', 'title', 'loading', 'width', 'height'];
        }

        if (in_array($element->tagName, ['figure', 'pre', 'code'], true)) {
            $allowedAttributes = ['class'];
        }

        foreach (iterator_to_array($element->attributes) as $attribute) {
            if (!in_array($attribute->name, $allowedAttributes, true)) {
                $element->removeAttribute($attribute->name);
            }
        }

        if ($element->tagName === 'a') {
            $href = $element->getAttribute('href');
            if ($href && !self::isSafeLink($href)) {
                $element->removeAttribute('href');
            }

            if ($element->hasAttribute('target')) {
                $element->setAttribute('rel', 'noopener noreferrer');
            }
        }

        if ($element->tagName === 'img') {
            $src = $element->getAttribute('src');
            if ($src && !self::isSafeMedia($src)) {
                $element->removeAttribute('src');
            }
        }
    }

    private static function isSafeLink(string $url): bool
    {
        if (str_starts_with($url, '/')) {
            return true;
        }

        $scheme = parse_url($url, PHP_URL_SCHEME);

        return in_array($scheme, ['http', 'https', 'mailto', 'tel'], true);
    }

    private static function isSafeMedia(string $url): bool
    {
        if (str_starts_with($url, '/')) {
            return true;
        }

        if (str_starts_with($url, 'data:image/')) {
            return true;
        }

        $scheme = parse_url($url, PHP_URL_SCHEME);

        return in_array($scheme, ['http', 'https'], true);
    }
}
