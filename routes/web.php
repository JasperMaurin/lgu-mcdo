<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ContactController;

Route::get('/', function () {
    return Inertia::render('AuthLanding');
});

Route::get('/about', function () {
    return Inertia::render('About');
});

Route::get('/services', function () {
    return Inertia::render('Services');
});

Route::get('/contact', [ContactController::class, 'index']);
Route::post('/contact', [ContactController::class, 'store']);
Route::get('/contact/track/{referenceNo}', [ContactController::class, 'track']);

Route::get('/cooperatives', function () {
    return Inertia::render('Cooperatives');
});

Route::get('/login', function () {
    return Inertia::render('Login');
});

Route::post('/login', [LoginController::class, 'login']);
Route::post('/login/verify-token', [LoginController::class, 'verifySecurityToken']);
Route::post('/login/resend-token', [LoginController::class, 'resendSecurityToken']);
Route::post('/logout', [LoginController::class, 'logout'])->middleware('token.auth');

Route::post('/profile/send-code', [ProfileController::class, 'sendCode'])->middleware(['token.auth', 'throttle:5,1']);
Route::post('/profile/verify', [ProfileController::class, 'verifyAndSave'])->middleware('token.auth');
Route::post('/profile/revoke-trusted-devices', [ProfileController::class, 'revokeTrustedDevices'])->middleware('token.auth');
Route::get('/profile/trusted-devices', [ProfileController::class, 'getTrustedDevices'])->middleware('token.auth');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware('token.auth');

Route::get('/feedback/generate-qr', [\App\Http\Controllers\QrCodeController::class, 'index'])->middleware('token.auth');
Route::post('/feedback/generate-qr', [\App\Http\Controllers\QrCodeController::class, 'store'])->middleware('token.auth');
Route::put('/feedback/generate-qr/{id}', [\App\Http\Controllers\QrCodeController::class, 'update'])->middleware('token.auth');
Route::delete('/feedback/generate-qr/{id}', [\App\Http\Controllers\QrCodeController::class, 'destroy'])->middleware('token.auth');

Route::get('/profile', function () {
    return Inertia::render('Profile');
})->middleware('token.auth');

Route::get('/feedback/create', function () {
    return Inertia::render('Feedback/Create');
})->middleware('token.auth');

Route::get('/feedback/all', [\App\Http\Controllers\FeedbackController::class, 'index'])->middleware('token.auth');
Route::put('/feedback/all/{id}/status', [\App\Http\Controllers\FeedbackController::class, 'updateStatus'])->middleware('token.auth');
Route::delete('/feedback/all/{id}', [\App\Http\Controllers\FeedbackController::class, 'destroy'])->middleware('token.auth');

Route::get('/feedback/{code}', [\App\Http\Controllers\FeedbackController::class, 'show']);
Route::post('/feedback/{code}', [\App\Http\Controllers\FeedbackController::class, 'store']);

Route::get('/cooperatives/profiling', [\App\Http\Controllers\CooperativeProfilingController::class, 'index'])->middleware('token.auth');
Route::post('/cooperatives/profiling', [\App\Http\Controllers\CooperativeProfilingController::class, 'store'])->middleware('token.auth');
Route::put('/cooperatives/profiling/{id}', [\App\Http\Controllers\CooperativeProfilingController::class, 'update'])->middleware('token.auth');
Route::delete('/cooperatives/profiling/{id}', [\App\Http\Controllers\CooperativeProfilingController::class, 'destroy'])->middleware('token.auth');


