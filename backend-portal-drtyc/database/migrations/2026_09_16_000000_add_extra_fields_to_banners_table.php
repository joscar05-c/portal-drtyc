<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->string('badge')->nullable()->after('title');
            $table->text('description')->nullable()->after('badge');
            $table->string('button_text')->nullable()->after('description');
            $table->string('button_icon')->nullable()->after('button_text');
        });
    }

    public function down(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->dropColumn(['badge', 'description', 'button_text', 'button_icon']);
        });
    }
};
