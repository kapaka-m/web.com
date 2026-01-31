<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Support;

class ReadingTime
{
    public static function forText(?string $text, string $locale): array
    {
        $plain = trim(strip_tags($text ?? ''));
        if ($plain === '') {
            $wordCount = 0;
        } else {
            preg_match_all('/\p{L}+/u', $plain, $matches);
            $wordCount = count($matches[0] ?? []);

            if ($wordCount === 0) {
                $wordCount = str_word_count($plain);
            }
        }

        $minutes = max(1, (int) ceil($wordCount / 200));

        return [
            'minutes' => $minutes,
            'label' => $locale === 'ar'
                ? $minutes . ' دقيقة قراءة'
                : $minutes . ' min read',
        ];
    }
}
