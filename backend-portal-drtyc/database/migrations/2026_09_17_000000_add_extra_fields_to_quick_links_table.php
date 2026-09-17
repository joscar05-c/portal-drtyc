<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quick_links', function (Blueprint $table) {
            $table->text('description')->nullable()->after('title');
            $table->string('icon')->nullable()->after('description');
            $table->string('badge_text')->nullable()->after('icon');
            $table->string('badge_color')->nullable()->default('secondary')->after('badge_text');
            $table->string('footer_info')->nullable()->after('badge_color');
            $table->string('button_text')->nullable()->after('footer_info');
        });
    }

    public function down(): void
    {
        Schema::table('quick_links', function (Blueprint $table) {
            $table->dropColumn([
                'description',
                'icon',
                'badge_text',
                'badge_color',
                'footer_info',
                'button_text',
            ]);
        });
    }
};
