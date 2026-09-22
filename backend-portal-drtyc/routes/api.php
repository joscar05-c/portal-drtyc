<?php

use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\ComplaintController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\DocumentEntryController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\JobCallController;
use App\Http\Controllers\Api\JobPostingController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\PostulateController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\QuickLinkController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\StaffController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // ==========================================
    // 1. LECTURA PÚBLICA (Rate Limit: 60 req/min)
    // ==========================================
    Route::middleware('throttle:api-public')->group(function () {
        Route::get('/posts', [PostController::class, 'index']);
        Route::get('/posts/{slug}', [PostController::class, 'show']);

        Route::get('/documents', [DocumentController::class, 'index']);
        Route::get('/projects', [ProjectController::class, 'index']);
        Route::get('/job-postings', [JobPostingController::class, 'index']);
        Route::get('/banners', [BannerController::class, 'index']);
        Route::get('/quick-links', [QuickLinkController::class, 'index']);
        Route::get('/staff', [StaffController::class, 'index']);
        Route::get('/faqs', [FaqController::class, 'index']);
        Route::get('/settings', [SettingController::class, 'index']);

        // IMPORTANTE: Pon las rutas específicas antes de las que tienen parámetros comodín {slug}
        Route::get('/job-calls', [JobCallController::class, 'index']);
        Route::get('/job-calls/type/{type}', [JobCallController::class, 'byType']);
        Route::get('/job-calls/{slug}', [JobCallController::class, 'show']);
    });

    // ==========================================
    // 2. ESCRITURA Y ACCIONES PÚBLICAS (Formularios)
    // ==========================================

    // Libro de Reclamaciones / Quejas
    Route::middleware('throttle:api-complaints')->group(function () {
        Route::post('/complaints', [ComplaintController::class, 'store']);
    });
    Route::middleware('throttle:api-track')->group(function () {
        Route::post('/complaints/track', [ComplaintController::class, 'track']);
    });

    // Convocatorias / Postulaciones
    Route::middleware('throttle:api-complaints')->group(function () {
        Route::post('/postulate', [PostulateController::class, 'store']);
        Route::post('/postulate/check-status', [PostulateController::class, 'checkStatus']);
    });

    // Mesa de Partes Virtual (Document Entries)
    Route::middleware('throttle:api-complaints')->group(function () {
        Route::post('/document-entries', [DocumentEntryController::class, 'store']);
    });
    Route::middleware('throttle:api-track')->group(function () {
        Route::post('/document-entries/track', [DocumentEntryController::class, 'track']);
    });

});
