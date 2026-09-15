<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->string('document_number');
            $table->string('full_name');
            $table->string('email');
            $table->string('phone');
            $table->enum('type', ['queja', 'reclamo']);
            $table->text('details');
            $table->text('reply')->nullable();
            $table->enum('status', ['pendiente', 'en_proceso', 'atendido'])->default('pendiente');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
