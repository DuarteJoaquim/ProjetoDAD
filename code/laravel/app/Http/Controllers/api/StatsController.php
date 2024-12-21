<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Game;

class StatsController extends Controller
{
    public function globalStats()
    {
        // Total de jogadores registados
        $totalPlayers = User::count();

        // Total de jogos jogados
        $totalGames = Game::count();

        // Jogos jogados na última semana
        $gamesLastWeek = Game::where('created_at', '>=', now()->subWeek())->count();

        // Jogos jogados no último mês
        $gamesLastMonth = Game::where('created_at', '>=', now()->subMonth())->count();

        // Retornar os dados como JSON
        return response()->json([
            'totalPlayers' => $totalPlayers,
            'totalGames' => $totalGames,
            'gamesLastWeek' => $gamesLastWeek,
            'gamesLastMonth' => $gamesLastMonth,
        ]);
    }
}
