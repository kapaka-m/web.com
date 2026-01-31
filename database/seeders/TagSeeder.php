<?php
// MOHAMED HASSANIN (KAPAKA)

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (Tag::query()->exists()) {
            return;
        }

        $tags = [
            [
                'name' => [
                    'ar' => 'لارافيل',
                    'en' => 'Laravel',
                ],
                'slug' => 'laravel',
            ],
            [
                'name' => [
                    'ar' => 'رياكت',
                    'en' => 'React',
                ],
                'slug' => 'react',
            ],
            [
                'name' => [
                    'ar' => 'الأمان',
                    'en' => 'Security',
                ],
                'slug' => 'security',
            ],
            [
                'name' => [
                    'ar' => 'ديف أوبس',
                    'en' => 'DevOps',
                ],
                'slug' => 'devops',
            ],
            [
                'name' => [
                    'ar' => 'البنية المعمارية',
                    'en' => 'Architecture',
                ],
                'slug' => 'architecture',
            ],
            [
                'name' => [
                    'ar' => 'الأداء',
                    'en' => 'Performance',
                ],
                'slug' => 'performance',
            ],
        ];

        foreach ($tags as $tag) {
            Tag::create($tag);
        }
    }
}
