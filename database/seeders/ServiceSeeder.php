<?php
// MOHAMED HASSANIN (KAPAKA)

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (Service::query()->exists()) {
            return;
        }

        $services = [
            [
                'title' => [
                    'ar' => 'تطوير تطبيقات ويب',
                    'en' => 'Web Application Development',
                ],
                'slug' => 'web-application-development',
                'summary' => [
                    'ar' => 'بناء منصات ويب قوية وسريعة مع بنية قابلة للتوسع.',
                    'en' => 'Build fast, reliable web platforms with scalable architecture.',
                ],
                'description' => [
                    'ar' => 'تطوير تطبيقات ويب من الفكرة حتى الإطلاق، ببنية قابلة للتوسع وأداء قوي وتجربة مستخدم واضحة. يشمل التحليل وتصميم واجهات API والتحسين المستمر.',
                    'en' => 'End-to-end web applications from discovery to launch, with scalable architecture, strong performance, and clear UX. Includes requirements analysis, API design, and ongoing optimization.',
                ],
                'features' => [
                    [
                        'ar' => 'Laravel + React بإعدادات إنتاجية',
                        'en' => 'Laravel + React production setups',
                    ],
                    [
                        'ar' => 'واجهة API نظيفة وقابلة للتوسع',
                        'en' => 'Clean, scalable API design',
                    ],
                    [
                        'ar' => 'اختبارات وضمان جودة',
                        'en' => 'Testing and quality assurance',
                    ],
                ],
                'icon' => 'bi-window-stack',
                'sort_order' => 1,
            ],
            [
                'title' => [
                    'ar' => 'تصميم واجهات وتجربة مستخدم',
                    'en' => 'UI/UX Design',
                ],
                'slug' => 'ui-ux-design',
                'summary' => [
                    'ar' => 'تصميم واجهات واضحة وتحسين تجربة المستخدم لرفع التحويل.',
                    'en' => 'Design clear interfaces and improve UX for higher conversion.',
                ],
                'description' => [
                    'ar' => 'تصميم واجهات وتجارب استخدام تركّز على الوضوح والتحويل، مع نظام تصميم متسق ودعم كامل لاتجاهات RTL/LTR.',
                    'en' => 'Design user interfaces and journeys focused on clarity and conversion, with consistent design systems and full RTL/LTR support.',
                ],
                'features' => [
                    [
                        'ar' => 'نظم تصميم متسقة',
                        'en' => 'Consistent design systems',
                    ],
                    [
                        'ar' => 'تجارب مستخدم مدروسة',
                        'en' => 'User flows and journey mapping',
                    ],
                    [
                        'ar' => 'واجهات متجاوبة RTL/LTR',
                        'en' => 'Responsive RTL/LTR layouts',
                    ],
                ],
                'icon' => 'bi-vector-pen',
                'sort_order' => 2,
            ],
            [
                'title' => [
                    'ar' => 'لوحات تحكم وإدارة محتوى',
                    'en' => 'Admin Panels & CMS',
                ],
                'slug' => 'admin-panels-cms',
                'summary' => [
                    'ar' => 'لوحات تحكم مرنة لإدارة المحتوى والبيانات بسهولة.',
                    'en' => 'Flexible dashboards to manage content and data effortlessly.',
                ],
                'description' => [
                    'ar' => 'لوحات تحكم مرنة لإدارة المحتوى والبيانات مع صلاحيات متعددة وتقارير تساعد على اتخاذ القرار.',
                    'en' => 'Flexible dashboards to manage content and data with role-based access and reporting to support decisions.',
                ],
                'features' => [
                    [
                        'ar' => 'صلاحيات متعددة (أدمن/محرر)',
                        'en' => 'Multi-role permissions (admin/editor)',
                    ],
                    [
                        'ar' => 'تقارير ولوحات بيانات',
                        'en' => 'Reports and analytics dashboards',
                    ],
                    [
                        'ar' => 'واجهات إدارة سريعة',
                        'en' => 'Fast, clean management UI',
                    ],
                ],
                'icon' => 'bi-layout-text-window-reverse',
                'sort_order' => 3,
            ],
            [
                'title' => [
                    'ar' => 'تكاملات API وأنظمة طرف ثالث',
                    'en' => 'API & Third-party Integrations',
                ],
                'slug' => 'api-integrations',
                'summary' => [
                    'ar' => 'ربط الأنظمة الداخلية بخدمات الدفع والإرسال والتحليلات.',
                    'en' => 'Connect internal systems with payments, messaging, and analytics.',
                ],
                'description' => [
                    'ar' => 'تصميم وربط واجهات API لدمج الأنظمة الداخلية مع الدفع والرسائل والتحليلات بسلاسة.',
                    'en' => 'Design and integrate APIs to connect internal systems with payments, messaging, and analytics.',
                ],
                'features' => [
                    [
                        'ar' => 'تكاملات دفع وشحن',
                        'en' => 'Payment and shipping integrations',
                    ],
                    [
                        'ar' => 'Webhook وتنبيهات فورية',
                        'en' => 'Webhooks and real-time alerts',
                    ],
                    [
                        'ar' => 'تأمين API بمستوى عال',
                        'en' => 'Secure API access controls',
                    ],
                ],
                'icon' => 'bi-plug',
                'sort_order' => 4,
            ],
            [
                'title' => [
                    'ar' => 'أمن التطبيقات',
                    'en' => 'Application Security',
                ],
                'slug' => 'application-security',
                'summary' => [
                    'ar' => 'تطبيق أفضل الممارسات الأمنية وحماية البيانات الحساسة.',
                    'en' => 'Apply security best practices and protect sensitive data.',
                ],
                'description' => [
                    'ar' => 'مراجعات أمان وتقوية للتطبيقات لحماية البيانات الحساسة، مع سياسات وصول صارمة ومراقبة مستمرة.',
                    'en' => 'Security reviews and hardening for sensitive data with strict access policies and continuous monitoring.',
                ],
                'features' => [
                    [
                        'ar' => 'مراجعة نقاط الضعف',
                        'en' => 'Vulnerability assessment',
                    ],
                    [
                        'ar' => 'سياسات وصول صارمة',
                        'en' => 'Strict access control policies',
                    ],
                    [
                        'ar' => 'مراقبة وتنبيهات',
                        'en' => 'Monitoring and alerts',
                    ],
                ],
                'icon' => 'bi-shield-lock',
                'sort_order' => 5,
            ],
            [
                'title' => [
                    'ar' => 'DevOps وتهيئة الاستضافة',
                    'en' => 'DevOps & Hosting Setup',
                ],
                'slug' => 'devops-hosting-setup',
                'summary' => [
                    'ar' => 'إعداد النشر الآمن على VPS أو استضافة مشتركة مع تحسين الأداء.',
                    'en' => 'Secure deployment on VPS or shared hosting with performance tuning.',
                ],
                'description' => [
                    'ar' => 'تهيئة الاستضافة والنشر الآمن على VPS أو الاستضافة المشتركة مع نسخ احتياطي ومراقبة الأداء.',
                    'en' => 'Secure hosting and deployment on VPS or shared hosting with backups and performance monitoring.',
                ],
                'features' => [
                    [
                        'ar' => 'إعداد Nginx وSSL',
                        'en' => 'Nginx + SSL setup',
                    ],
                    [
                        'ar' => 'نسخ احتياطي ومراقبة',
                        'en' => 'Backups and monitoring',
                    ],
                    [
                        'ar' => 'أتمتة النشر',
                        'en' => 'Automated deployments',
                    ],
                ],
                'icon' => 'bi-hdd-stack',
                'sort_order' => 6,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
