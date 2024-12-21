<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;
use Illuminate\Support\Facades\Log;

class StatisticsController extends Controller
{
    public function generalStatistics()
    {
        $totalGames = Game::count();
        $lastWeekGames = Game::where('created_at', '>=', now()->subWeek())->count();
        $lastMonthGames = Game::where('created_at', '>=', now()->subMonth())->count();

        $averageTime = Game::avg('total_time');
        $shortestTime = Game::min('total_time');
        $longestTime = Game::max('total_time');

        return response()->json([
            'totalGames' => $totalGames,
            'lastWeekGames' => $lastWeekGames,
            'lastMonthGames' => $lastMonthGames,
            'averageTime' => $averageTime,
            'shortestTime' => $shortestTime,
            'longestTime' => $longestTime,
        ]);
    }
    public function podiumByMoves()
    {
        try {
            // Ordena pelo menor número de movimentos e limita os resultados
            $data = Game::with('board', 'winner') // Inclui as relações
                ->whereNotNull('winner_user_id') // Garante que tenha um vencedor
                ->orderBy('total_turns_winner', 'asc')
                ->take(3)
                ->get()
                ->map(function ($game) {
                    return [
                        'player' => $game->player_name,
                        'moves' => $game->total_turns_winner,
                        'time' => $game->total_time,
                        'board' => $game->board_size,
                    ];
                });

            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Erro no método podiumByMoves: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao buscar pódio por moves.'], 500);
        }
    }
}
