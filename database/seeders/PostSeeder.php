<?php
// MOHAMED HASSANIN (KAPAKA)

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class PostSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (Post::query()->exists()) {
            return;
        }

        $posts = [
            [
                'title' => [
                    'ar' => 'كيف نبني منتجات رقمية قابلة للتوسع',
                    'en' => 'How to Build Scalable Digital Products',
                ],
                'category_slug' => 'strategy-product',
                'tag_slugs' => ['architecture', 'performance', 'laravel'],
                'cover_image' => 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
                'slug' => 'building-scalable-digital-products',
                'excerpt' => [
                    'ar' => 'خطوات عملية لوضع بنية تقنية مرنة تساعد على النمو بدون تعقيد.',
                    'en' => 'Practical steps to design architecture that scales without complexity.',
                ],
                'content' => [
                    'ar' => 'نبدأ بتحليل المتطلبات، ثم نحدد حدود المجال، ونصمم الخدمات بحيث يمكن تطويرها تدريجياً. الأمان والأداء لا يأتيان لاحقاً، بل يتم تضمينهما منذ البداية.',
                    'en' => 'We start with clear requirements, define domain boundaries, and design services that evolve gradually. Security and performance are built in from day one, not added later.',
                ],
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(10),
            ],
            [
                'title' => [
                    'ar' => 'أفضل ممارسات الأمان في Laravel',
                    'en' => 'Laravel Security Best Practices',
                ],
                'category_slug' => 'security',
                'tag_slugs' => ['security', 'laravel'],
                'cover_image' => 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
                'slug' => 'laravel-security-best-practices',
                'excerpt' => [
                    'ar' => 'قائمة مختصرة بأهم الإجراءات لحماية تطبيقات Laravel.',
                    'en' => 'A concise checklist of the most important Laravel security practices.',
                ],
                'content' => [
                    'ar' => 'تأكد من تفعيل الحماية من CSRF، استخدام سياسات الوصول، تشفير البيانات الحساسة، وتحديث التبعيات بشكل دوري.',
                    'en' => 'Enable CSRF protection, enforce authorization policies, encrypt sensitive data, and keep dependencies up to date.',
                ],
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(6),
            ],
            [
                'title' => [
                    'ar' => 'من التطوير إلى النشر: خطة DevOps بسيطة',
                    'en' => 'From Development to Deployment: A Simple DevOps Plan',
                ],
                'slug' => 'devops-delivery-plan',
                'excerpt' => [
                    'ar' => 'كيف تجهز خط نشر آمن على VPS أو استضافة مشتركة.',
                    'en' => 'How to prepare a secure delivery pipeline on VPS or shared hosting.',
                ],
                'content' => [
                    'ar' => 'اعتمد على إعدادات بيئة واضحة، نسخ احتياطية، ومراقبة مستمرة للأداء والأخطاء. هذا يقلل المخاطر ويضمن استقرار الخدمة.',
                    'en' => 'Use clear environment configuration, backups, and continuous monitoring for performance and errors. This lowers risk and improves reliability.',
                ],
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(2),
            ],
        ];

        $categories = Category::query()->get()->keyBy('slug');
        $tags = Tag::query()->get()->keyBy('slug');

        foreach ($posts as $postData) {
            $category = $categories->get($postData['category_slug'] ?? null);

            $post = Post::create([
                'title' => $postData['title'],
                'slug' => $postData['slug'],
                'excerpt' => $postData['excerpt'],
                'content' => $postData['content'],
                'cover_image' => $postData['cover_image'] ?? null,
                'is_published' => $postData['is_published'],
                'published_at' => $postData['published_at'],
                'category_id' => $category?->id,
            ]);

            $tagSlugs = $postData['tag_slugs'] ?? [];
            if ($tagSlugs) {
                $tagIds = $tags->only($tagSlugs)->pluck('id')->all();
                $post->tags()->sync($tagIds);
            }
        }
    }
}
