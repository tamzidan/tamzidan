<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CertificateController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\SocialMediaController;
use App\Http\Controllers\Api\TechStackController;
use App\Http\Controllers\Api\UploadController;
use Illuminate\Support\Facades\Route;

// Authentication routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/auth/me', [AuthController::class, 'me'])->middleware('auth:sanctum');

// Public API routes
Route::get('/portfolios', [PortfolioController::class, 'index']);
Route::get('/portfolios/{portfolio}', [PortfolioController::class, 'show']);

Route::get('/certificates', [CertificateController::class, 'index']);
Route::get('/certificates/{certificate}', [CertificateController::class, 'show']);

Route::get('/tech-stacks', [TechStackController::class, 'index']);
Route::get('/tech-stacks/{techStack}', [TechStackController::class, 'show']);

Route::get('/social-media', [SocialMediaController::class, 'index']);
Route::get('/social-media/{socialMedia}', [SocialMediaController::class, 'show']);

Route::post('/contact', [ContactMessageController::class, 'store']);

Route::get('/comments', [CommentController::class, 'index']);
Route::post('/comments', [CommentController::class, 'store']);
Route::post('/comments/{comment}/like', [CommentController::class, 'like']);
Route::post('/comments/{comment}/reply', [CommentController::class, 'reply']);

// Public file upload (for comments)
Route::post('/upload/comment-photo', [UploadController::class, 'uploadImage']);

// Admin protected routes
Route::prefix('admin')->middleware(['auth:sanctum'])->group(function () {
    // Portfolios management
    Route::post('/portfolios', [PortfolioController::class, 'store']);
    Route::put('/portfolios/{portfolio}', [PortfolioController::class, 'update']);
    Route::delete('/portfolios/{portfolio}', [PortfolioController::class, 'destroy']);

    // Certificates management
    Route::post('/certificates', [CertificateController::class, 'store']);
    Route::put('/certificates/{certificate}', [CertificateController::class, 'update']);
    Route::delete('/certificates/{certificate}', [CertificateController::class, 'destroy']);

    // Tech Stacks management
    Route::post('/tech-stacks', [TechStackController::class, 'store']);
    Route::put('/tech-stacks/{techStack}', [TechStackController::class, 'update']);
    Route::delete('/tech-stacks/{techStack}', [TechStackController::class, 'destroy']);

    // Social Media management
    Route::post('/social-media', [SocialMediaController::class, 'store']);
    Route::put('/social-media/{socialMedia}', [SocialMediaController::class, 'update']);
    Route::delete('/social-media/{socialMedia}', [SocialMediaController::class, 'destroy']);

    // Contact Messages management
    Route::get('/contact-messages', [ContactMessageController::class, 'index']);
    Route::get('/contact-messages/{contactMessage}', [ContactMessageController::class, 'show']);
    Route::put('/contact-messages/{contactMessage}', [ContactMessageController::class, 'update']);
    Route::delete('/contact-messages/{contactMessage}', [ContactMessageController::class, 'destroy']);

    // Comments management
    Route::put('/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    // File uploads
    Route::post('/upload/image', [UploadController::class, 'uploadImage']);
    Route::post('/upload/pdf', [UploadController::class, 'uploadPdf']);
    Route::delete('/upload', [UploadController::class, 'deleteFile']);
});
