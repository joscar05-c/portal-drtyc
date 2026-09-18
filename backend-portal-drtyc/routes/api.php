<?php

use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\ComplaintController;
use App\Http\Controllers\Api\DocumentController;
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

    // Lectura pública - Rate: 60 req/min por IP
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

        Route::get('/job-calls', [JobCallController::class, 'index']);
        Route::get('/job-calls/{slug}', [JobCallController::class, 'show']);
        Route::get('/job-calls/type/{type}', [JobCallController::class, 'byType']);
    });

    // Escritura pública - Rate más restrictivo
    Route::middleware('throttle:api-complaints')->group(function () {
        Route::post('/complaints', [ComplaintController::class, 'store']);
    });

    Route::middleware('throttle:api-track')->group(function () {
        Route::post('/complaints/track', [ComplaintController::class, 'track']);
    });

    Route::middleware('throttle:api-complaints')->group(function () {
        Route::post('/postulate', [PostulateController::class, 'store']);
        Route::post('/postulate/check-status', [PostulateController::class, 'checkStatus']);
    });

});
