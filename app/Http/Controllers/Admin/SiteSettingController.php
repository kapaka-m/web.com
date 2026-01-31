<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Support\ActivityLogger;
use App\Support\Translation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SiteSettingController extends Controller
{
    public function edit()
    {
        $settings = SiteSetting::query()->first();

        if (!$settings) {
            $settings = SiteSetting::create([
                'site_name' => ['ar' => '', 'en' => ''],
                'tagline' => ['ar' => '', 'en' => ''],
            ]);
        }

        $this->authorize('view', $settings);

        $hero = $settings->hero ?? [];
        $about = $settings->about ?? [];
        $contact = $settings->contact ?? [];

        $highlights = $about['highlights'] ?? [];
        $socialLinks = $settings->social_links ?? [];
        $stats = $settings->stats ?? [];
        $seo = $settings->seo ?? [];
        $person = $seo['person'] ?? [];
        $organization = $seo['organization'] ?? [];
        $smtp = $settings->smtp ?? [];
        $integrations = $settings->integrations ?? [];
        $captcha = $integrations['captcha'] ?? [];
        $alerts = $integrations['alerts'] ?? [];
        $newsletter = $integrations['newsletter'] ?? [];
        $mailchimp = $integrations['mailchimp'] ?? [];
        $sendinblue = $integrations['sendinblue'] ?? [];
        $calendly = $integrations['calendly'] ?? [];
        $chat = $integrations['chat'] ?? [];
        $consulting = $settings->consulting ?? [];
        $careers = $settings->careers ?? [];

        return Inertia::render('Admin/Settings/Edit', [
            'settings' => [
                'site_name_ar' => Translation::get($settings->site_name, 'ar'),
                'site_name_en' => Translation::get($settings->site_name, 'en'),
                'tagline_ar' => Translation::get($settings->tagline, 'ar'),
                'tagline_en' => Translation::get($settings->tagline, 'en'),
                'hero_badge_ar' => Translation::get($hero['badge'] ?? null, 'ar'),
                'hero_badge_en' => Translation::get($hero['badge'] ?? null, 'en'),
                'hero_headline_ar' => Translation::get($hero['headline'] ?? null, 'ar'),
                'hero_headline_en' => Translation::get($hero['headline'] ?? null, 'en'),
                'hero_subheadline_ar' => Translation::get($hero['subheadline'] ?? null, 'ar'),
                'hero_subheadline_en' => Translation::get($hero['subheadline'] ?? null, 'en'),
                'hero_primary_cta_ar' => Translation::get($hero['primary_cta'] ?? null, 'ar'),
                'hero_primary_cta_en' => Translation::get($hero['primary_cta'] ?? null, 'en'),
                'hero_secondary_cta_ar' => Translation::get($hero['secondary_cta'] ?? null, 'ar'),
                'hero_secondary_cta_en' => Translation::get($hero['secondary_cta'] ?? null, 'en'),
                'about_title_ar' => Translation::get($about['title'] ?? null, 'ar'),
                'about_title_en' => Translation::get($about['title'] ?? null, 'en'),
                'about_summary_ar' => Translation::get($about['summary'] ?? null, 'ar'),
                'about_summary_en' => Translation::get($about['summary'] ?? null, 'en'),
                'about_body_ar' => Translation::get($about['body'] ?? null, 'ar'),
                'about_body_en' => Translation::get($about['body'] ?? null, 'en'),
                'about_highlights' => $this->normalizeHighlights($highlights),
                'contact_email' => $contact['email'] ?? null,
                'contact_phone' => $contact['phone'] ?? null,
                'contact_location_ar' => Translation::get($contact['location'] ?? null, 'ar'),
                'contact_location_en' => Translation::get($contact['location'] ?? null, 'en'),
                'contact_availability_ar' => Translation::get($contact['availability'] ?? null, 'ar'),
                'contact_availability_en' => Translation::get($contact['availability'] ?? null, 'en'),
                'social_links' => $this->normalizeSocialLinks($socialLinks),
                'stats' => $this->normalizeStats($stats),
                'seo_meta_title_ar' => Translation::get($seo['meta_title'] ?? null, 'ar'),
                'seo_meta_title_en' => Translation::get($seo['meta_title'] ?? null, 'en'),
                'seo_meta_description_ar' => Translation::get($seo['meta_description'] ?? null, 'ar'),
                'seo_meta_description_en' => Translation::get($seo['meta_description'] ?? null, 'en'),
                'seo_default_og_image' => $seo['default_og_image'] ?? null,
                'seo_twitter_handle' => $seo['twitter_handle'] ?? null,
                'seo_person_name_ar' => Translation::get($person['name'] ?? null, 'ar'),
                'seo_person_name_en' => Translation::get($person['name'] ?? null, 'en'),
                'seo_person_job_title_ar' => Translation::get($person['job_title'] ?? null, 'ar'),
                'seo_person_job_title_en' => Translation::get($person['job_title'] ?? null, 'en'),
                'seo_person_image' => $person['image'] ?? null,
                'seo_org_name_ar' => Translation::get($organization['name'] ?? null, 'ar'),
                'seo_org_name_en' => Translation::get($organization['name'] ?? null, 'en'),
                'seo_org_logo' => $organization['logo'] ?? null,
                'seo_pages' => $this->normalizeSeoPages($seo['pages'] ?? []),
                'privacy_policy_ar' => Translation::get($settings->privacy_policy ?? null, 'ar'),
                'privacy_policy_en' => Translation::get($settings->privacy_policy ?? null, 'en'),
                'terms_of_use_ar' => Translation::get($settings->terms_of_use ?? null, 'ar'),
                'terms_of_use_en' => Translation::get($settings->terms_of_use ?? null, 'en'),
                'footer_note_ar' => Translation::get($settings->footer_note ?? null, 'ar'),
                'footer_note_en' => Translation::get($settings->footer_note ?? null, 'en'),
                'smtp_enabled' => $smtp['enabled'] ?? false,
                'smtp_mailer' => $smtp['mailer'] ?? 'smtp',
                'smtp_host' => $smtp['host'] ?? null,
                'smtp_port' => $smtp['port'] ?? null,
                'smtp_username' => $smtp['username'] ?? null,
                'smtp_password' => '',
                'smtp_encryption' => $smtp['encryption'] ?? null,
                'smtp_from_address' => $smtp['from_address'] ?? null,
                'smtp_from_name' => $smtp['from_name'] ?? null,
                'captcha_provider' => $captcha['provider'] ?? 'hcaptcha',
                'captcha_enabled' => $captcha['enabled'] ?? false,
                'captcha_site_key' => $captcha['site_key'] ?? null,
                'captcha_secret' => '',
                'alerts_enabled' => $alerts['enabled'] ?? false,
                'alerts_slack_webhook' => $alerts['slack_webhook'] ?? null,
                'alerts_telegram_bot_token' => '',
                'alerts_telegram_chat_id' => $alerts['telegram_chat_id'] ?? null,
                'newsletter_enabled' => $newsletter['enabled'] ?? true,
                'newsletter_double_opt_in' => $newsletter['double_opt_in'] ?? true,
                'mailchimp_enabled' => $mailchimp['enabled'] ?? false,
                'mailchimp_api_key' => '',
                'mailchimp_list_id' => $mailchimp['list_id'] ?? null,
                'mailchimp_datacenter' => $mailchimp['datacenter'] ?? null,
                'sendinblue_enabled' => $sendinblue['enabled'] ?? false,
                'sendinblue_api_key' => '',
                'sendinblue_list_id' => $sendinblue['list_id'] ?? null,
                'calendly_enabled' => $calendly['enabled'] ?? false,
                'calendly_url' => $calendly['url'] ?? null,
                'chat_provider' => $chat['provider'] ?? 'none',
                'crisp_website_id' => $chat['crisp_website_id'] ?? null,
                'intercom_app_id' => $chat['intercom_app_id'] ?? null,
                'chat_custom_script' => $chat['custom_script'] ?? null,
                'consulting_title_ar' => Translation::get($consulting['title'] ?? null, 'ar'),
                'consulting_title_en' => Translation::get($consulting['title'] ?? null, 'en'),
                'consulting_summary_ar' => Translation::get($consulting['summary'] ?? null, 'ar'),
                'consulting_summary_en' => Translation::get($consulting['summary'] ?? null, 'en'),
                'consulting_body_ar' => Translation::get($consulting['body'] ?? null, 'ar'),
                'consulting_body_en' => Translation::get($consulting['body'] ?? null, 'en'),
                'consulting_cta_ar' => Translation::get($consulting['cta'] ?? null, 'ar'),
                'consulting_cta_en' => Translation::get($consulting['cta'] ?? null, 'en'),
                'careers_title_ar' => Translation::get($careers['title'] ?? null, 'ar'),
                'careers_title_en' => Translation::get($careers['title'] ?? null, 'en'),
                'careers_summary_ar' => Translation::get($careers['summary'] ?? null, 'ar'),
                'careers_summary_en' => Translation::get($careers['summary'] ?? null, 'en'),
                'careers_body_ar' => Translation::get($careers['body'] ?? null, 'ar'),
                'careers_body_en' => Translation::get($careers['body'] ?? null, 'en'),
                'careers_cta_ar' => Translation::get($careers['cta'] ?? null, 'ar'),
                'careers_cta_en' => Translation::get($careers['cta'] ?? null, 'en'),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $settings = SiteSetting::query()->firstOrFail();
        $this->authorize('update', $settings);
        $before = $settings->toArray();

        $validated = $request->validate([
            'site_name_ar' => ['required', 'string', 'max:190'],
            'site_name_en' => ['required', 'string', 'max:190'],
            'tagline_ar' => ['nullable', 'string', 'max:255'],
            'tagline_en' => ['nullable', 'string', 'max:255'],
            'hero_badge_ar' => ['nullable', 'string', 'max:255'],
            'hero_badge_en' => ['nullable', 'string', 'max:255'],
            'hero_headline_ar' => ['nullable', 'string', 'max:255'],
            'hero_headline_en' => ['nullable', 'string', 'max:255'],
            'hero_subheadline_ar' => ['nullable', 'string', 'max:500'],
            'hero_subheadline_en' => ['nullable', 'string', 'max:500'],
            'hero_primary_cta_ar' => ['nullable', 'string', 'max:120'],
            'hero_primary_cta_en' => ['nullable', 'string', 'max:120'],
            'hero_secondary_cta_ar' => ['nullable', 'string', 'max:120'],
            'hero_secondary_cta_en' => ['nullable', 'string', 'max:120'],
            'about_title_ar' => ['nullable', 'string', 'max:255'],
            'about_title_en' => ['nullable', 'string', 'max:255'],
            'about_summary_ar' => ['nullable', 'string', 'max:500'],
            'about_summary_en' => ['nullable', 'string', 'max:500'],
            'about_body_ar' => ['nullable', 'string'],
            'about_body_en' => ['nullable', 'string'],
            'about_highlights' => ['nullable', 'array'],
            'about_highlights.*.title_ar' => ['nullable', 'string', 'max:190'],
            'about_highlights.*.title_en' => ['nullable', 'string', 'max:190'],
            'about_highlights.*.description_ar' => ['nullable', 'string', 'max:500'],
            'about_highlights.*.description_en' => ['nullable', 'string', 'max:500'],
            'contact_email' => ['nullable', 'email', 'max:190'],
            'contact_phone' => ['nullable', 'string', 'max:60'],
            'contact_location_ar' => ['nullable', 'string', 'max:190'],
            'contact_location_en' => ['nullable', 'string', 'max:190'],
            'contact_availability_ar' => ['nullable', 'string', 'max:190'],
            'contact_availability_en' => ['nullable', 'string', 'max:190'],
            'social_links' => ['nullable', 'array'],
            'social_links.*.label' => ['nullable', 'string', 'max:120'],
            'social_links.*.url' => ['nullable', 'string', 'max:255'],
            'social_links.*.icon' => ['nullable', 'string', 'max:120'],
            'stats' => ['nullable', 'array'],
            'stats.*.value' => ['nullable', 'string', 'max:50'],
            'stats.*.label_ar' => ['nullable', 'string', 'max:120'],
            'stats.*.label_en' => ['nullable', 'string', 'max:120'],
            'seo_meta_title_ar' => ['nullable', 'string', 'max:255'],
            'seo_meta_title_en' => ['nullable', 'string', 'max:255'],
            'seo_meta_description_ar' => ['nullable', 'string', 'max:500'],
            'seo_meta_description_en' => ['nullable', 'string', 'max:500'],
            'seo_default_og_image' => ['nullable', 'string', 'max:255'],
            'seo_twitter_handle' => ['nullable', 'string', 'max:50'],
            'seo_person_name_ar' => ['nullable', 'string', 'max:190'],
            'seo_person_name_en' => ['nullable', 'string', 'max:190'],
            'seo_person_job_title_ar' => ['nullable', 'string', 'max:190'],
            'seo_person_job_title_en' => ['nullable', 'string', 'max:190'],
            'seo_person_image' => ['nullable', 'string', 'max:255'],
            'seo_org_name_ar' => ['nullable', 'string', 'max:190'],
            'seo_org_name_en' => ['nullable', 'string', 'max:190'],
            'seo_org_logo' => ['nullable', 'string', 'max:255'],
            'seo_pages' => ['nullable', 'array'],
            'seo_pages.*.key' => ['required', Rule::in($this->seoPageKeys())],
            'seo_pages.*.meta_title_ar' => ['nullable', 'string', 'max:255'],
            'seo_pages.*.meta_title_en' => ['nullable', 'string', 'max:255'],
            'seo_pages.*.meta_description_ar' => ['nullable', 'string', 'max:500'],
            'seo_pages.*.meta_description_en' => ['nullable', 'string', 'max:500'],
            'seo_pages.*.og_image' => ['nullable', 'string', 'max:255'],
            'seo_pages.*.robots' => ['nullable', 'string', 'max:60'],
            'privacy_policy_ar' => ['nullable', 'string'],
            'privacy_policy_en' => ['nullable', 'string'],
            'terms_of_use_ar' => ['nullable', 'string'],
            'terms_of_use_en' => ['nullable', 'string'],
            'footer_note_ar' => ['nullable', 'string', 'max:255'],
            'footer_note_en' => ['nullable', 'string', 'max:255'],
            'smtp_enabled' => ['nullable', 'boolean'],
            'smtp_mailer' => ['nullable', 'string', 'max:50'],
            'smtp_host' => ['nullable', 'string', 'max:190'],
            'smtp_port' => ['nullable', 'integer', 'min:1', 'max:65535'],
            'smtp_username' => ['nullable', 'string', 'max:190'],
            'smtp_password' => ['nullable', 'string', 'max:190'],
            'smtp_encryption' => ['nullable', 'string', 'max:20'],
            'smtp_from_address' => ['nullable', 'string', 'max:190'],
            'smtp_from_name' => ['nullable', 'string', 'max:190'],
            'captcha_provider' => ['nullable', 'string', 'in:hcaptcha,turnstile'],
            'captcha_enabled' => ['nullable', 'boolean'],
            'captcha_site_key' => ['nullable', 'string', 'max:190'],
            'captcha_secret' => ['nullable', 'string', 'max:190'],
            'alerts_enabled' => ['nullable', 'boolean'],
            'alerts_slack_webhook' => ['nullable', 'string', 'max:255'],
            'alerts_telegram_bot_token' => ['nullable', 'string', 'max:190'],
            'alerts_telegram_chat_id' => ['nullable', 'string', 'max:50'],
            'newsletter_enabled' => ['nullable', 'boolean'],
            'newsletter_double_opt_in' => ['nullable', 'boolean'],
            'mailchimp_enabled' => ['nullable', 'boolean'],
            'mailchimp_api_key' => ['nullable', 'string', 'max:190'],
            'mailchimp_list_id' => ['nullable', 'string', 'max:100'],
            'mailchimp_datacenter' => ['nullable', 'string', 'max:30'],
            'sendinblue_enabled' => ['nullable', 'boolean'],
            'sendinblue_api_key' => ['nullable', 'string', 'max:190'],
            'sendinblue_list_id' => ['nullable', 'string', 'max:100'],
            'calendly_enabled' => ['nullable', 'boolean'],
            'calendly_url' => ['nullable', 'url', 'max:255'],
            'chat_provider' => ['nullable', 'string', 'max:30'],
            'crisp_website_id' => ['nullable', 'string', 'max:190'],
            'intercom_app_id' => ['nullable', 'string', 'max:190'],
            'chat_custom_script' => ['nullable', 'string'],
            'consulting_title_ar' => ['nullable', 'string', 'max:255'],
            'consulting_title_en' => ['nullable', 'string', 'max:255'],
            'consulting_summary_ar' => ['nullable', 'string', 'max:500'],
            'consulting_summary_en' => ['nullable', 'string', 'max:500'],
            'consulting_body_ar' => ['nullable', 'string'],
            'consulting_body_en' => ['nullable', 'string'],
            'consulting_cta_ar' => ['nullable', 'string', 'max:120'],
            'consulting_cta_en' => ['nullable', 'string', 'max:120'],
            'careers_title_ar' => ['nullable', 'string', 'max:255'],
            'careers_title_en' => ['nullable', 'string', 'max:255'],
            'careers_summary_ar' => ['nullable', 'string', 'max:500'],
            'careers_summary_en' => ['nullable', 'string', 'max:500'],
            'careers_body_ar' => ['nullable', 'string'],
            'careers_body_en' => ['nullable', 'string'],
            'careers_cta_ar' => ['nullable', 'string', 'max:120'],
            'careers_cta_en' => ['nullable', 'string', 'max:120'],
        ]);

        $smtpSettings = $settings->smtp ?? [];
        $integrations = $settings->integrations ?? [];
        $captchaSettings = $integrations['captcha'] ?? [];
        $alertSettings = $integrations['alerts'] ?? [];
        $mailchimpSettings = $integrations['mailchimp'] ?? [];
        $sendinblueSettings = $integrations['sendinblue'] ?? [];

        $smtpPassword = $validated['smtp_password'] ?? '';
        if ($smtpPassword === '') {
            $smtpPassword = $smtpSettings['password'] ?? null;
        }

        $captchaSecret = $validated['captcha_secret'] ?? '';
        if ($captchaSecret === '') {
            $captchaSecret = $captchaSettings['secret'] ?? null;
        }

        $alertsSlack = $validated['alerts_slack_webhook'] ?? '';
        if ($alertsSlack === '') {
            $alertsSlack = $alertSettings['slack_webhook'] ?? null;
        }

        $alertsToken = $validated['alerts_telegram_bot_token'] ?? '';
        if ($alertsToken === '') {
            $alertsToken = $alertSettings['telegram_bot_token'] ?? null;
        }

        $mailchimpApi = $validated['mailchimp_api_key'] ?? '';
        if ($mailchimpApi === '') {
            $mailchimpApi = $mailchimpSettings['api_key'] ?? null;
        }

        $sendinblueApi = $validated['sendinblue_api_key'] ?? '';
        if ($sendinblueApi === '') {
            $sendinblueApi = $sendinblueSettings['api_key'] ?? null;
        }

        $settings->update([
            'site_name' => [
                'ar' => $validated['site_name_ar'],
                'en' => $validated['site_name_en'],
            ],
            'tagline' => [
                'ar' => $validated['tagline_ar'] ?? null,
                'en' => $validated['tagline_en'] ?? null,
            ],
            'hero' => [
                'badge' => [
                    'ar' => $validated['hero_badge_ar'] ?? null,
                    'en' => $validated['hero_badge_en'] ?? null,
                ],
                'headline' => [
                    'ar' => $validated['hero_headline_ar'] ?? null,
                    'en' => $validated['hero_headline_en'] ?? null,
                ],
                'subheadline' => [
                    'ar' => $validated['hero_subheadline_ar'] ?? null,
                    'en' => $validated['hero_subheadline_en'] ?? null,
                ],
                'primary_cta' => [
                    'ar' => $validated['hero_primary_cta_ar'] ?? null,
                    'en' => $validated['hero_primary_cta_en'] ?? null,
                ],
                'secondary_cta' => [
                    'ar' => $validated['hero_secondary_cta_ar'] ?? null,
                    'en' => $validated['hero_secondary_cta_en'] ?? null,
                ],
            ],
            'about' => [
                'title' => [
                    'ar' => $validated['about_title_ar'] ?? null,
                    'en' => $validated['about_title_en'] ?? null,
                ],
                'summary' => [
                    'ar' => $validated['about_summary_ar'] ?? null,
                    'en' => $validated['about_summary_en'] ?? null,
                ],
                'body' => [
                    'ar' => $validated['about_body_ar'] ?? null,
                    'en' => $validated['about_body_en'] ?? null,
                ],
                'highlights' => $this->buildHighlights($validated['about_highlights'] ?? []),
            ],
            'contact' => [
                'email' => $validated['contact_email'] ?? null,
                'phone' => $validated['contact_phone'] ?? null,
                'location' => [
                    'ar' => $validated['contact_location_ar'] ?? null,
                    'en' => $validated['contact_location_en'] ?? null,
                ],
                'availability' => [
                    'ar' => $validated['contact_availability_ar'] ?? null,
                    'en' => $validated['contact_availability_en'] ?? null,
                ],
            ],
            'social_links' => $this->buildSocialLinks($validated['social_links'] ?? []),
            'stats' => $this->buildStats($validated['stats'] ?? []),
            'seo' => [
                'meta_title' => [
                    'ar' => $validated['seo_meta_title_ar'] ?? null,
                    'en' => $validated['seo_meta_title_en'] ?? null,
                ],
                'meta_description' => [
                    'ar' => $validated['seo_meta_description_ar'] ?? null,
                    'en' => $validated['seo_meta_description_en'] ?? null,
                ],
                'default_og_image' => $validated['seo_default_og_image'] ?? null,
                'twitter_handle' => $validated['seo_twitter_handle'] ?? null,
                'person' => [
                    'name' => $this->buildTranslatedValue(
                        $validated['seo_person_name_ar'] ?? null,
                        $validated['seo_person_name_en'] ?? null,
                    ),
                    'job_title' => $this->buildTranslatedValue(
                        $validated['seo_person_job_title_ar'] ?? null,
                        $validated['seo_person_job_title_en'] ?? null,
                    ),
                    'image' => $validated['seo_person_image'] ?? null,
                ],
                'organization' => [
                    'name' => $this->buildTranslatedValue(
                        $validated['seo_org_name_ar'] ?? null,
                        $validated['seo_org_name_en'] ?? null,
                    ),
                    'logo' => $validated['seo_org_logo'] ?? null,
                ],
                'pages' => $this->buildSeoPages($validated['seo_pages'] ?? []),
            ],
            'privacy_policy' => [
                'ar' => $validated['privacy_policy_ar'] ?? null,
                'en' => $validated['privacy_policy_en'] ?? null,
            ],
            'terms_of_use' => [
                'ar' => $validated['terms_of_use_ar'] ?? null,
                'en' => $validated['terms_of_use_en'] ?? null,
            ],
            'footer_note' => [
                'ar' => $validated['footer_note_ar'] ?? null,
                'en' => $validated['footer_note_en'] ?? null,
            ],
            'smtp' => [
                'enabled' => (bool) ($validated['smtp_enabled'] ?? false),
                'mailer' => $validated['smtp_mailer'] ?? 'smtp',
                'host' => $validated['smtp_host'] ?? null,
                'port' => $validated['smtp_port'] ?? null,
                'username' => $validated['smtp_username'] ?? null,
                'password' => $smtpPassword,
                'encryption' => $validated['smtp_encryption'] ?? null,
                'from_address' => $validated['smtp_from_address'] ?? null,
                'from_name' => $validated['smtp_from_name'] ?? null,
            ],
            'integrations' => [
                'captcha' => [
                    'provider' => $validated['captcha_provider'] ?? 'hcaptcha',
                    'enabled' => (bool) ($validated['captcha_enabled'] ?? false),
                    'site_key' => $validated['captcha_site_key'] ?? null,
                    'secret' => $captchaSecret,
                ],
                'alerts' => [
                    'enabled' => (bool) ($validated['alerts_enabled'] ?? false),
                    'slack_webhook' => $alertsSlack,
                    'telegram_bot_token' => $alertsToken,
                    'telegram_chat_id' => $validated['alerts_telegram_chat_id'] ?? null,
                ],
                'newsletter' => [
                    'enabled' => (bool) ($validated['newsletter_enabled'] ?? true),
                    'double_opt_in' => (bool) ($validated['newsletter_double_opt_in'] ?? true),
                ],
                'mailchimp' => [
                    'enabled' => (bool) ($validated['mailchimp_enabled'] ?? false),
                    'api_key' => $mailchimpApi,
                    'list_id' => $validated['mailchimp_list_id'] ?? null,
                    'datacenter' => $validated['mailchimp_datacenter'] ?? null,
                ],
                'sendinblue' => [
                    'enabled' => (bool) ($validated['sendinblue_enabled'] ?? false),
                    'api_key' => $sendinblueApi,
                    'list_id' => $validated['sendinblue_list_id'] ?? null,
                ],
                'calendly' => [
                    'enabled' => (bool) ($validated['calendly_enabled'] ?? false),
                    'url' => $validated['calendly_url'] ?? null,
                ],
                'chat' => [
                    'provider' => $validated['chat_provider'] ?? 'none',
                    'crisp_website_id' => $validated['crisp_website_id'] ?? null,
                    'intercom_app_id' => $validated['intercom_app_id'] ?? null,
                    'custom_script' => $validated['chat_custom_script'] ?? null,
                ],
            ],
            'consulting' => [
                'title' => $this->buildTranslatedValue(
                    $validated['consulting_title_ar'] ?? null,
                    $validated['consulting_title_en'] ?? null,
                ),
                'summary' => $this->buildTranslatedValue(
                    $validated['consulting_summary_ar'] ?? null,
                    $validated['consulting_summary_en'] ?? null,
                ),
                'body' => $this->buildTranslatedValue(
                    $validated['consulting_body_ar'] ?? null,
                    $validated['consulting_body_en'] ?? null,
                ),
                'cta' => $this->buildTranslatedValue(
                    $validated['consulting_cta_ar'] ?? null,
                    $validated['consulting_cta_en'] ?? null,
                ),
            ],
            'careers' => [
                'title' => $this->buildTranslatedValue(
                    $validated['careers_title_ar'] ?? null,
                    $validated['careers_title_en'] ?? null,
                ),
                'summary' => $this->buildTranslatedValue(
                    $validated['careers_summary_ar'] ?? null,
                    $validated['careers_summary_en'] ?? null,
                ),
                'body' => $this->buildTranslatedValue(
                    $validated['careers_body_ar'] ?? null,
                    $validated['careers_body_en'] ?? null,
                ),
                'cta' => $this->buildTranslatedValue(
                    $validated['careers_cta_ar'] ?? null,
                    $validated['careers_cta_en'] ?? null,
                ),
            ],
        ]);

        ActivityLogger::logWithDiff($request, 'settings.update', $settings, $before, $settings->fresh()->toArray(), [
            'site_name_ar' => $validated['site_name_ar'],
            'site_name_en' => $validated['site_name_en'],
        ]);

        return redirect()
            ->route('admin.settings.edit')
            ->with('success', 'Settings updated successfully.');
    }

    private function normalizeHighlights(array $highlights): array
    {
        $normalized = [];
        for ($index = 0; $index < 3; $index++) {
            $highlight = $highlights[$index] ?? [];
            $normalized[] = [
                'title_ar' => Translation::get($highlight['title'] ?? null, 'ar'),
                'title_en' => Translation::get($highlight['title'] ?? null, 'en'),
                'description_ar' => Translation::get($highlight['description'] ?? null, 'ar'),
                'description_en' => Translation::get($highlight['description'] ?? null, 'en'),
            ];
        }

        return $normalized;
    }

    private function normalizeSocialLinks(array $links): array
    {
        $normalized = [];
        for ($index = 0; $index < 3; $index++) {
            $link = $links[$index] ?? [];
            $normalized[] = [
                'label' => $link['label'] ?? '',
                'url' => $link['url'] ?? '',
                'icon' => $link['icon'] ?? '',
            ];
        }

        return $normalized;
    }

    private function normalizeStats(array $stats): array
    {
        $normalized = [];
        for ($index = 0; $index < 3; $index++) {
            $stat = $stats[$index] ?? [];
            $normalized[] = [
                'value' => $stat['value'] ?? '',
                'label_ar' => $stat['label_ar'] ?? '',
                'label_en' => $stat['label_en'] ?? '',
            ];
        }

        return $normalized;
    }

    private function seoPageKeys(): array
    {
        return [
            'home',
            'about',
            'services',
            'projects',
            'consulting',
            'careers',
            'blog',
            'contact',
            'privacy',
            'terms',
        ];
    }

    private function normalizeSeoPages(array $pages): array
    {
        $normalized = [];

        foreach ($this->seoPageKeys() as $key) {
            $page = $pages[$key] ?? null;

            $normalized[] = [
                'key' => $key,
                'meta_title_ar' => Translation::get($page['meta_title'] ?? null, 'ar'),
                'meta_title_en' => Translation::get($page['meta_title'] ?? null, 'en'),
                'meta_description_ar' => Translation::get($page['meta_description'] ?? null, 'ar'),
                'meta_description_en' => Translation::get($page['meta_description'] ?? null, 'en'),
                'og_image' => $page['og_image'] ?? null,
                'robots' => $page['robots'] ?? null,
            ];
        }

        return $normalized;
    }

    private function buildHighlights(array $highlights): array
    {
        $results = [];

        foreach ($highlights as $highlight) {
            $titleAr = trim($highlight['title_ar'] ?? '');
            $titleEn = trim($highlight['title_en'] ?? '');
            $descAr = trim($highlight['description_ar'] ?? '');
            $descEn = trim($highlight['description_en'] ?? '');

            if ($titleAr === '' && $titleEn === '' && $descAr === '' && $descEn === '') {
                continue;
            }

            $results[] = [
                'title' => [
                    'ar' => $titleAr ?: $titleEn,
                    'en' => $titleEn ?: $titleAr,
                ],
                'description' => [
                    'ar' => $descAr ?: $descEn,
                    'en' => $descEn ?: $descAr,
                ],
            ];
        }

        return $results;
    }

    private function buildSeoPages(array $pages): array
    {
        $results = [];

        foreach ($pages as $page) {
            $key = $page['key'] ?? null;
            if (!$key || !in_array($key, $this->seoPageKeys(), true)) {
                continue;
            }

            $metaTitle = $this->buildTranslatedValue(
                $page['meta_title_ar'] ?? null,
                $page['meta_title_en'] ?? null,
            );
            $metaDescription = $this->buildTranslatedValue(
                $page['meta_description_ar'] ?? null,
                $page['meta_description_en'] ?? null,
            );

            $ogImage = trim((string) ($page['og_image'] ?? ''));
            $robots = trim((string) ($page['robots'] ?? ''));

            $results[$key] = [
                'meta_title' => $metaTitle,
                'meta_description' => $metaDescription,
                'og_image' => $ogImage !== '' ? $ogImage : null,
                'robots' => $robots !== '' ? $robots : null,
            ];
        }

        return $results;
    }

    private function buildSocialLinks(array $links): array
    {
        $results = [];

        foreach ($links as $link) {
            $label = trim($link['label'] ?? '');
            $url = trim($link['url'] ?? '');
            $icon = trim($link['icon'] ?? '');

            if ($label === '' && $url === '') {
                continue;
            }

            $results[] = [
                'label' => $label,
                'url' => $url,
                'icon' => $icon,
            ];
        }

        return $results;
    }

    private function buildStats(array $stats): array
    {
        $results = [];

        foreach ($stats as $stat) {
            $value = trim($stat['value'] ?? '');
            $labelAr = trim($stat['label_ar'] ?? '');
            $labelEn = trim($stat['label_en'] ?? '');

            if ($value === '' && $labelAr === '' && $labelEn === '') {
                continue;
            }

            $results[] = [
                'value' => $value,
                'label' => [
                    'ar' => $labelAr ?: $labelEn,
                    'en' => $labelEn ?: $labelAr,
                ],
            ];
        }

        return $results;
    }

    private function buildTranslatedValue(?string $ar, ?string $en): ?array
    {
        $ar = trim((string) $ar);
        $en = trim((string) $en);

        if ($ar === '' && $en === '') {
            return null;
        }

        return [
            'ar' => $ar !== '' ? $ar : $en,
            'en' => $en !== '' ? $en : $ar,
        ];
    }
}
