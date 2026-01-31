<?php
// MOHAMED HASSANIN (KAPAKA)

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SiteSettingSeeder::class,
            ServiceSeeder::class,
            CategorySeeder::class,
            TagSeeder::class,
            ProjectSeeder::class,
            PostSeeder::class,
            TestimonialSeeder::class,
            PartnerSeeder::class,
        ]);
    }
}
