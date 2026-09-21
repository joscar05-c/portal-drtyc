<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('document_movements', function (Blueprint $table) {
            $table->foreignId('from_user_id')->nullable()->after('from_area_id')->constrained('users')->nullOnDelete();
            $table->foreignId('to_user_id')->nullable()->after('to_area_id')->constrained('users')->nullOnDelete();
            $table->boolean('is_received')->default(false)->after('observations');
            $table->timestamp('received_at')->nullable()->after('is_received');
        });
    }

    public function down(): void
    {
        Schema::table('document_movements', function (Blueprint $table) {
            $table->dropForeign(['from_user_id']);
            $table->dropForeign(['to_user_id']);
            $table->dropColumn(['from_user_id', 'to_user_id', 'is_received', 'received_at']);
        });
    }
};
