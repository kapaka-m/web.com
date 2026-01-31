<?php
// MOHAMED HASSANIN (KAPAKA)

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (Testimonial::query()->exists()) {
            return;
        }

        $testimonials = [
            [
                'name' => 'Omar Khaled',
                'role' => [
                    'ar' => 'مدير المنتج',
                    'en' => 'Product Manager',
                ],
                'company' => 'Fintech Lab',
                'quote' => [
                    'ar' => 'عمل احترافي ومنظم، والنتيجة كانت منصة مستقرة وسريعة ساعدتنا على النمو بثقة.',
                    'en' => 'Professional, structured delivery. The result was a stable, fast platform that helped us scale with confidence.',
                ],
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Sara Ahmed',
                'role' => [
                    'ar' => 'رئيسة قسم التقنية',
                    'en' => 'Head of Engineering',
                ],
                'company' => 'Gov Services',
                'quote' => [
                    'ar' => 'اهتمام واضح بالجودة والأمان وتجربة المستخدم. التنفيذ كان في الوقت وبمستوى ممتاز.',
                    'en' => 'Clear focus on quality, security, and UX. Execution was on time and at a high standard.',
                ],
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'James Miller',
                'role' => [
                    'ar' => 'مؤسس شركة',
                    'en' => 'Founder',
                ],
                'company' => 'SaaS Studio',
                'quote' => [
                    'ar' => 'تفكير استراتيجي مع تنفيذ تقني قوي. فريقنا اعتمد على الحل من اليوم الأول.',
                    'en' => 'Strategic thinking with strong technical execution. Our team relied on the solution from day one.',
                ],
                'sort_order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::create($testimonial);
        }
    }
}
