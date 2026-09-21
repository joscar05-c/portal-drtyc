<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_entry_id')->constrained('document_entries')->cascadeOnDelete();
            $table->foreignId('from_area_id')->constrained('areas');
            $table->foreignId('to_area_id')->constrained('areas');
            $table->foreignId('user_id')->constrained('users');
            $table->string('action_requested');
            $table->text('observations')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_movements');
    }
};
