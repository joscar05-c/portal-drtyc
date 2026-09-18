<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_calls', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type'); // CAS, CAP, Prácticas
            $table->string('status')->default('Vigente'); // Vigente, En Evaluación, Concluida, Cancelada
            $table->date('start_date');
            $table->date('end_date');
            $table->text('description')->nullable();
            $table->json('documents')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_calls');
    }
};
