<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_call_id')->constrained('job_calls')->cascadeOnDelete();
            $table->string('document_number', 20);
            $table->string('full_name');
            $table->string('email');
            $table->string('phone', 20);
            $table->string('file_path');
            $table->string('status')->default('Recibido');
            $table->timestamps();
            $table->softDeletes();

            $table->index('job_call_id');
            $table->index('document_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
