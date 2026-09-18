<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_calls', function (Blueprint $table) {
            $table->dateTime('application_start_at')->nullable()->after('end_date');
            $table->dateTime('application_end_at')->nullable()->after('application_start_at');
            $table->json('schedule')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('job_calls', function (Blueprint $table) {
            $table->dropColumn(['application_start_at', 'application_end_at', 'schedule']);
        });
    }
};
