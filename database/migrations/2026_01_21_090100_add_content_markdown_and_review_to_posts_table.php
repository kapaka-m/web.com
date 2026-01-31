<?php
// MOHAMED HASSANIN (KAPAKA)

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->json('content_markdown')->nullable()->after('content');
            $table->string('review_status')->default('draft')->after('author_id');
            $table->foreignId('reviewed_by')->nullable()->after('review_status')
                ->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropConstrainedForeignId('reviewed_by');
            $table->dropColumn(['content_markdown', 'review_status', 'reviewed_at']);
        });
    }
};
