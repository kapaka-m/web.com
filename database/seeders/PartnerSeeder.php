<?php
// MOHAMED HASSANIN (KAPAKA)

namespace Database\Seeders;

use App\Models\Partner;
use Illuminate\Database\Seeder;

class PartnerSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (Partner::query()->exists()) {
            return;
        }

        $partners = [
            [
                'name' => 'NovaLabs',
                'logo' => 'https://dummyimage.com/140x60/0b1f2a/ffffff&text=NovaLabs',
                'url' => 'https://example.com',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'BrightPay',
                'logo' => 'https://dummyimage.com/140x60/1d887a/ffffff&text=BrightPay',
                'url' => 'https://example.com',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'AtlasGov',
                'logo' => 'https://dummyimage.com/140x60/f5b301/ffffff&text=AtlasGov',
                'url' => 'https://example.com',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'PulseOps',
                'logo' => 'https://dummyimage.com/140x60/ff6b35/ffffff&text=PulseOps',
                'url' => 'https://example.com',
                'sort_order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($partners as $partner) {
            Partner::create($partner);
        }
    }
}
