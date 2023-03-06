<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TodoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);


    Route::get('/todos', [TodoController::class, 'index']);
    Route::post('/todos', [TodoController::class, 'create']);
    Route::post('/todos/update/{todo}', [TodoController::class, 'update']);
    Route::get('/todos/toggle/{todo}', [TodoController::class, 'toggleCompleted']);
    Route::delete('/todos/complete', [TodoController::class, 'destroyCompleted']);
    Route::delete('/todos/{todo}', [TodoController::class, 'destroy']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
 