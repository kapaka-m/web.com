<?php
// MOHAMED HASSANIN (KAPAKA)

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (SiteSetting::query()->exists()) {
            return;
        }

        SiteSetting::create([
            'site_name' => [
                'ar' => 'محمد حسنين',
                'en' => 'Mohamed Hassanin',
            ],
            'tagline' => [
                'ar' => 'مطور ويب ومهندس منتجات رقمية',
                'en' => 'Full-stack developer & digital product engineer',
            ],
            'hero' => [
                'badge' => [
                    'ar' => 'متاح لمشاريع مختارة',
                    'en' => 'Available for select projects',
                ],
                'headline' => [
                    'ar' => 'أبني حلول ويب آمنة وسريعة تدعم نمو أعمالك',
                    'en' => 'I build secure, high-performance web products that scale',
                ],
                'subheadline' => [
                    'ar' => 'خبرة 10+ سنوات في تحويل الأفكار إلى منصات رقمية قابلة للنمو مع بنية تحتية قوية.',
                    'en' => '10+ years turning ideas into scalable platforms with solid architecture and delivery.',
                ],
                'primary_cta' => [
                    'ar' => 'شاهد الأعمال',
                    'en' => 'View Projects',
                ],
                'secondary_cta' => [
                    'ar' => 'تواصل معي',
                    'en' => 'Contact Me',
                ],
            ],
            'about' => [
                'title' => [
                    'ar' => 'نبذة عني',
                    'en' => 'About Me',
                ],
                'summary' => [
                    'ar' => 'أركز على بناء منتجات رقمية واضحة، قابلة للتوسع، وآمنة تساعد الفرق على تحقيق نتائج ملموسة.',
                    'en' => 'I focus on building clear, scalable, and secure digital products that drive measurable outcomes.',
                ],
                'body' => [
                    'ar' => 'أقود دورة المنتج كاملةً من الاستراتيجية والتصميم إلى التطوير والنشر، مع اهتمام كبير بالأداء والأمان وتجربة المستخدم.',
                    'en' => 'I lead the full product lifecycle from strategy and design to engineering and deployment with a focus on performance, security, and UX.',
                ],
                'highlights' => [
                    [
                        'title' => [
                            'ar' => 'خبرة تقنية عميقة',
                            'en' => 'Deep technical expertise',
                        ],
                        'description' => [
                            'ar' => 'Laravel، React، قواعد بيانات، تكاملات API، وأتمتة النشر.',
                            'en' => 'Laravel, React, databases, API integrations, and automated delivery.',
                        ],
                    ],
                    [
                        'title' => [
                            'ar' => 'تصميم موجّه للأعمال',
                            'en' => 'Business-driven design',
                        ],
                        'description' => [
                            'ar' => 'واجهات واضحة ومسارات تحويل محسنة مع تجربة مستخدم سلسة.',
                            'en' => 'Clear interfaces and optimized funnels with smooth user journeys.',
                        ],
                    ],
                    [
                        'title' => [
                            'ar' => 'أمان وموثوقية',
                            'en' => 'Security & reliability',
                        ],
                        'description' => [
                            'ar' => 'ممارسات حماية متقدمة، مراقبة، وخطط نسخ احتياطي.',
                            'en' => 'Hardened security practices, monitoring, and backup strategies.',
                        ],
                    ],
                ],
            ],
            'contact' => [
                'email' => 'info@Mohamed-hassanin.dev',
                'phone' => '+20 100 000 0000',
                'location' => [
                    'ar' => 'القاهرة، مصر',
                    'en' => 'Cairo, Egypt',
                ],
                'availability' => [
                    'ar' => 'متاح للاستشارات والمشاريع الجديدة',
                    'en' => 'Available for consulting and new projects',
                ],
            ],
            'social_links' => [
                [
                    'label' => 'GitHub',
                    'url' => 'https://github.com/',
                    'icon' => 'bi-github',
                ],
                [
                    'label' => 'LinkedIn',
                    'url' => 'https://www.linkedin.com/',
                    'icon' => 'bi-linkedin',
                ],
                [
                    'label' => 'Behance',
                    'url' => 'https://www.behance.net/',
                    'icon' => 'bi-behance',
                ],
            ],
            'stats' => [
                [
                    'value' => '10+',
                    'label' => [
                        'ar' => 'سنوات خبرة',
                        'en' => 'Years Experience',
                    ],
                ],
                [
                    'value' => '40+',
                    'label' => [
                        'ar' => 'مشروع مكتمل',
                        'en' => 'Projects Delivered',
                    ],
                ],
                [
                    'value' => '12',
                    'label' => [
                        'ar' => 'مجال صناعي',
                        'en' => 'Industries Served',
                    ],
                ],
            ],
            'seo' => [
                'meta_title' => [
                    'ar' => 'محمد حسنين | مطور ويب محترف',
                    'en' => 'Mohamed Hassanin | Senior Web Developer',
                ],
                'meta_description' => [
                    'ar' => 'مطور ويب بخبرة 10+ سنوات في Laravel وReact وأمن المعلومات وبنية الأنظمة.',
                    'en' => 'Senior web developer with 10+ years in Laravel, React, security, and system architecture.',
                ],
                'default_og_image' => 'https://dummyimage.com/1200x630/0b111f/ffffff&text=Mohamed+Hassanin',
                'twitter_handle' => '@mohamedhassanin',
            ],
            'privacy_policy' => [
                'ar' => 'نحترم خصوصيتك ولا نجمع إلا الحد الأدنى من البيانات اللازمة لتقديم الخدمة. يتم التعامل مع معلوماتك بأمان ولا تُشارك إلا عند الحاجة التشغيلية.',
                'en' => 'We respect your privacy and only collect the minimum data needed to deliver our services. Your information is handled securely and never shared unless required for operations.',
            ],
            'terms_of_use' => [
                'ar' => 'باستخدام هذا الموقع، توافق على استخدامه لأغراض قانونية وعدم إساءة استخدام المحتوى أو الخدمات. يمكن تحديث الشروط عند الحاجة.',
                'en' => 'By using this site, you agree to use it for lawful purposes and not misuse its content or services. Terms may be updated as needed.',
            ],
            'footer_note' => [
                'ar' => 'مصمم ومطور بعناية.',
                'en' => 'Designed and engineered with care.',
            ],
        ]);
    }
}
