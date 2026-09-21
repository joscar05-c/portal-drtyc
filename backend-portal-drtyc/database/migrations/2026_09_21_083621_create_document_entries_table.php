<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_entries', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_number', 30)->unique();
            $table->enum('sender_type', ['Persona Natural', 'Persona Jurídica']);
            $table->string('document_number', 20);
            $table->string('sender_name');
            $table->string('email')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('document_type');
            $table->text('subject');
            $table->unsignedSmallInteger('folios')->default(1);
            $table->string('main_file_path');
            $table->json('annexes_file_path')->nullable();
            $table->string('status', 30)->default('Pendiente');
            $table->text('official_response')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_entries');
    }
};
