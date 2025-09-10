<?php

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SurveyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



// Public routes (no authentication)
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/survey/get-by-slug/{slug}', [SurveyController::class, 'getBySlug']);
Route::post("/survey/{survey}/answer",[SurveyController::class,"storeAnswer"]);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::apiResource("survey",SurveyController::class);
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/answers/survey/{survey}', [SurveyController::class, 'viewAnswers']);
});
