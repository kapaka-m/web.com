<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Support;

use App\Models\SiteSetting;

class SiteData
{
    public static function forLocale(string $locale): array
    {
        $settings = SiteSetting::query()->first();

        if (!$settings) {
            return [
                'site_name' => 'Website',
                'tagline' => '',
                'hero' => [],
                'about' => [],
                'contact' => [],
                'social_links' => [],
                'stats' => [],
                'seo' => [
                    'meta_title' => '',
                    'meta_description' => '',
                    'default_og_image' => '',
                    'twitter_handle' => '',
                    'pages' => [],
                    'person' => [
                        'name' => '',
                        'job_title' => '',
                        'image' => '',
                    ],
                    'organization' => [
                        'name' => '',
                        'logo' => '',
                    ],
                ],
                'integrations' => [
                    'newsletter' => [
                        'enabled' => true,
                        'double_opt_in' => true,
                    ],
                    'calendly' => [
                        'enabled' => false,
                        'url' => '',
                    ],
                    'chat' => [
                        'provider' => 'none',
                        'crisp_website_id' => '',
                        'intercom_app_id' => '',
                        'custom_script' => '',
                    ],
                    'captcha' => [
                        'provider' => 'hcaptcha',
                        'enabled' => false,
                        'site_key' => '',
                    ],
                ],
                'legal' => [
                    'privacy_policy' => '',
                    'terms_of_use' => '',
                ],
                'consulting' => [],
                'careers' => [],
                'footer_note' => '',
            ];
        }

        $hero = $settings->hero ?? [];
        $about = $settings->about ?? [];
        $contact = $settings->contact ?? [];
        $stats = $settings->stats ?? [];
        $seo = $settings->seo ?? [];
        $seoPages = $seo['pages'] ?? [];
        $person = $seo['person'] ?? [];
        $organization = $seo['organization'] ?? [];
        $integrations = $settings->integrations ?? [];
        $consulting = $settings->consulting ?? [];
        $careers = $settings->careers ?? [];

        $pages = [];
        foreach ($seoPages as $key => $page) {
            if (is_array($page) && array_key_exists('key', $page)) {
                $key = $page['key'];
            }

            if (!is_string($key) || $key === '') {
                continue;
            }

            $pages[$key] = [
                'meta_title' => Translation::get($page['meta_title'] ?? null, $locale),
                'meta_description' => Translation::get($page['meta_description'] ?? null, $locale),
                'og_image' => $page['og_image'] ?? null,
                'robots' => $page['robots'] ?? null,
            ];
        }

        return [
            'site_name' => Translation::get($settings->site_name, $locale),
            'tagline' => Translation::get($settings->tagline, $locale),
            'hero' => [
                'badge' => Translation::get($hero['badge'] ?? null, $locale),
                'headline' => Translation::get($hero['headline'] ?? null, $locale),
                'subheadline' => Translation::get($hero['subheadline'] ?? null, $locale),
                'primary_cta' => Translation::get($hero['primary_cta'] ?? null, $locale),
                'secondary_cta' => Translation::get($hero['secondary_cta'] ?? null, $locale),
            ],
            'about' => [
                'title' => Translation::get($about['title'] ?? null, $locale),
                'summary' => Translation::get($about['summary'] ?? null, $locale),
                'body' => Translation::get($about['body'] ?? null, $locale),
                'highlights' => array_map(
                    static fn($highlight) => [
                        'title' => Translation::get($highlight['title'] ?? null, $locale),
                        'description' => Translation::get($highlight['description'] ?? null, $locale),
                    ],
                    $about['highlights'] ?? []
                ),
            ],
            'contact' => [
                'email' => $contact['email'] ?? null,
                'phone' => $contact['phone'] ?? null,
                'location' => Translation::get($contact['location'] ?? null, $locale),
                'availability' => Translation::get($contact['availability'] ?? null, $locale),
            ],
            'social_links' => $settings->social_links ?? [],
            'stats' => array_map(
                static fn($stat) => [
                    'value' => $stat['value'] ?? '',
                    'label' => Translation::get($stat['label'] ?? null, $locale),
                ],
                $stats
            ),
            'seo' => [
                'meta_title' => Translation::get($seo['meta_title'] ?? null, $locale),
                'meta_description' => Translation::get($seo['meta_description'] ?? null, $locale),
                'default_og_image' => $seo['default_og_image'] ?? null,
                'twitter_handle' => $seo['twitter_handle'] ?? null,
                'pages' => $pages,
                'person' => [
                    'name' => Translation::get($person['name'] ?? null, $locale),
                    'job_title' => Translation::get($person['job_title'] ?? null, $locale),
                    'image' => $person['image'] ?? null,
                ],
                'organization' => [
                    'name' => Translation::get($organization['name'] ?? null, $locale),
                    'logo' => $organization['logo'] ?? null,
                ],
            ],
            'integrations' => [
                'newsletter' => [
                    'enabled' => data_get($integrations, 'newsletter.enabled', true),
                    'double_opt_in' => data_get($integrations, 'newsletter.double_opt_in', true),
                ],
                'calendly' => [
                    'enabled' => data_get($integrations, 'calendly.enabled', false),
                    'url' => data_get($integrations, 'calendly.url'),
                ],
                'chat' => [
                    'provider' => data_get($integrations, 'chat.provider', 'none'),
                    'crisp_website_id' => data_get($integrations, 'chat.crisp_website_id'),
                    'intercom_app_id' => data_get($integrations, 'chat.intercom_app_id'),
                    'custom_script' => data_get($integrations, 'chat.custom_script'),
                ],
                'captcha' => [
                    'provider' => data_get($integrations, 'captcha.provider', 'hcaptcha'),
                    'enabled' => data_get($integrations, 'captcha.enabled', false),
                    'site_key' => data_get($integrations, 'captcha.site_key'),
                ],
            ],
            'legal' => [
                'privacy_policy' => Translation::get($settings->privacy_policy ?? null, $locale),
                'terms_of_use' => Translation::get($settings->terms_of_use ?? null, $locale),
            ],
            'consulting' => [
                'title' => Translation::get($consulting['title'] ?? null, $locale),
                'summary' => Translation::get($consulting['summary'] ?? null, $locale),
                'body' => Translation::get($consulting['body'] ?? null, $locale),
                'cta' => Translation::get($consulting['cta'] ?? null, $locale),
            ],
            'careers' => [
                'title' => Translation::get($careers['title'] ?? null, $locale),
                'summary' => Translation::get($careers['summary'] ?? null, $locale),
                'body' => Translation::get($careers['body'] ?? null, $locale),
                'cta' => Translation::get($careers['cta'] ?? null, $locale),
            ],
            'footer_note' => Translation::get($settings->footer_note ?? null, $locale),
        ];
    }
}
