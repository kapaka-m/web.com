<?php
// MOHAMED HASSANIN (KAPAKA)

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('webhook_endpoints', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('url');
            $table->json('events')->nullable();
            $table->string('secret')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_fired_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('webhook_endpoints');
    }
};
