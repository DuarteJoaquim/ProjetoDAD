<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\GameController;
use App\Http\Controllers\api\BoardController;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\UserController;
use App\Http\Controllers\api\TransactionController;
use App\Http\Controllers\MultiplayerGameController;
use App\Http\Controllers\AdminGameController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refreshtoken', [AuthController::class, 'refreshToken']);
    Route::put('/auth/updateProfile', [AuthController::class, 'updateProfile']);

    Route::get('/users/me', [UserController::class, 'showMe']);

    Route::get('/scoreboard/personal', [GameController::class, 'personalScoreboard']);
    Route::get('/game/gamehistory', [GameController::class, 'gamehistory']);
    
    Route::get('/users/me/coins', [TransactionController::class, 'getCoins']);
    Route::post('/users/me/coins/purchase', [TransactionController::class, 'purchaseCoins']);
    Route::post('/users/me/coins/spend', [TransactionController::class, 'spendCoins']);
    
    Route::post('/game', [GameController::class, 'store']);

    Route::post('/multiplayer/create', [MultiplayerGameController::class, 'create']);
    Route::post('/multiplayer/join', [MultiplayerGameController::class, 'join']);
    Route::post('/multiplayer/turn', [MultiplayerGameController::class, 'submitTurn']);

});

Route::middleware(['auth:sanctum', 'isAdmin'])->group(function () {
    Route::get('/admin/all-games', [AdminGameController::class, 'allGames']);
});

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

Route::get('/boards', [BoardController::class, 'index']);
Route::post('/board', [BoardController::class, 'board']);

Route::get('/scoreboard/global3por4', [GameController::class, 'globalScoreboard_3por4']);
Route::get('/scoreboard/global4por4', [GameController::class, 'globalScoreboard_4por4']);
Route::get('/scoreboard/global6por6', [GameController::class, 'globalScoreboard_6por6']);


