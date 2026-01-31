<?php
// MOHAMED HASSANIN (KAPAKA)

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (Category::query()->exists()) {
            return;
        }

        $categories = [
            [
                'name' => [
                    'ar' => 'الاستراتيجية والمنتج',
                    'en' => 'Strategy & Product',
                ],
                'slug' => 'strategy-product',
                'is_active' => true,
            ],
            [
                'name' => [
                    'ar' => 'الأمن السيبراني',
                    'en' => 'Security',
                ],
                'slug' => 'security',
                'is_active' => true,
            ],
            [
                'name' => [
                    'ar' => 'الهندسة والبنية',
                    'en' => 'Engineering',
                ],
                'slug' => 'engineering',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
