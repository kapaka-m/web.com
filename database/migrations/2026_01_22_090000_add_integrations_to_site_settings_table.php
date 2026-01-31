<?php
// MOHAMED HASSANIN (KAPAKA)

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->json('smtp')->nullable()->after('seo');
            $table->json('integrations')->nullable()->after('smtp');
            $table->json('consulting')->nullable()->after('integrations');
            $table->json('careers')->nullable()->after('consulting');
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn(['smtp', 'integrations', 'consulting', 'careers']);
        });
    }
};
