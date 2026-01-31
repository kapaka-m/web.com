<?php
// MOHAMED HASSANIN (KAPAKA)

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectImage;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (Project::query()->exists()) {
            return;
        }

        $projects = [
            [
                'title' => [
                    'ar' => 'منصة تجارة إلكترونية متعددة المتاجر',
                    'en' => 'Multi-vendor E-commerce Platform',
                ],
                'slug' => 'multi-vendor-ecommerce',
                'cover_image' => 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80',
                'gallery_images' => ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80'],
                'summary' => [
                    'ar' => 'منصة بيع متكاملة مع بوابات دفع ولوحة تحكم للبائعين.',
                    'en' => 'End-to-end selling platform with payments and vendor dashboards.',
                ],
                'description' => [
                    'ar' => 'بناء تجربة تسوق سريعة، إدارة مخزون، وتتبع الطلبات مع تكاملات دفع وشحن.',
                    'en' => 'Built a fast shopping experience, inventory management, and order tracking with payment and shipping integrations.',
                ],
                'client' => 'Retail Group',
                'year' => '2024',
                'stack' => ['Laravel', 'React', 'MySQL', 'Redis'],
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'title' => [
                    'ar' => 'بوابة خدمات حكومية رقمية',
                    'en' => 'Digital Government Services Portal',
                ],
                'slug' => 'government-services-portal',
                'cover_image' => 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80',
                'gallery_images' => ['https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80'],
                'summary' => [
                    'ar' => 'بوابة موحدة لتقديم الطلبات ومتابعة المعاملات إلكترونياً.',
                    'en' => 'Unified portal for submitting and tracking service requests online.',
                ],
                'description' => [
                    'ar' => 'تحسين رحلة المستخدم مع أمان عالي وتسجيل تدقيق شامل.',
                    'en' => 'Improved user journeys with high security and full audit logging.',
                ],
                'client' => 'Public Sector',
                'year' => '2023',
                'stack' => ['Laravel', 'Inertia', 'PostgreSQL'],
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'title' => [
                    'ar' => 'لوحة إدارة SaaS للتحليلات',
                    'en' => 'SaaS Analytics Admin Dashboard',
                ],
                'slug' => 'saas-analytics-dashboard',
                'cover_image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
                'gallery_images' => ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'],
                'summary' => [
                    'ar' => 'لوحة تحكم تفاعلية لقياس الأداء واتخاذ القرارات.',
                    'en' => 'Interactive dashboard for performance insights and decisions.',
                ],
                'description' => [
                    'ar' => 'تقارير مخصصة، صلاحيات متعددة، وواجهات مرنة لإدارة المشتركين.',
                    'en' => 'Custom reports, multi-role access, and flexible subscriber management.',
                ],
                'client' => 'SaaS Studio',
                'year' => '2022',
                'stack' => ['Laravel', 'React', 'Tailwind', 'MySQL'],
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'title' => [
                    'ar' => 'منصة حجوزات وخدمات',
                    'en' => 'Service Booking Platform',
                ],
                'slug' => 'service-booking-platform',
                'cover_image' => 'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1400&q=80',
                'gallery_images' => ['https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&q=80'],
                'summary' => [
                    'ar' => 'نظام حجز مرن مع إدارة مزودين ودفع إلكتروني.',
                    'en' => 'Flexible booking system with provider management and payments.',
                ],
                'description' => [
                    'ar' => 'واجهة مستخدم سلسة، تنبيهات فورية، وجدولة ذكية للمواعيد.',
                    'en' => 'Smooth UX, real-time alerts, and smart appointment scheduling.',
                ],
                'client' => 'Service Network',
                'year' => '2021',
                'stack' => ['Laravel', 'Bootstrap', 'MySQL'],
                'is_featured' => false,
                'is_active' => true,
            ],
        ];

        foreach ($projects as $projectData) {
            $project = Project::create([
                'title' => $projectData['title'],
                'slug' => $projectData['slug'],
                'summary' => $projectData['summary'],
                'description' => $projectData['description'],
                'client' => $projectData['client'],
                'year' => $projectData['year'],
                'stack' => $projectData['stack'],
                'cover_image' => $projectData['cover_image'] ?? null,
                'is_featured' => $projectData['is_featured'],
                'is_active' => $projectData['is_active'],
            ]);

            foreach ($projectData['gallery_images'] ?? [] as $index => $image) {
                ProjectImage::create([
                    'project_id' => $project->id,
                    'image_path' => $image,
                    'sort_order' => $index + 1,
                ]);
            }
        }
    }
}
