<?php

namespace App\Http\Controllers;
use App\Models\Game;
use Illuminate\Http\Request;

class AdminGameController extends Controller
{
    /**
     * Retorna todos os jogos apenas para administradores.
     */
    public function allGames(Request $request)
    {
        $query = Game::with(['creator:id,nickname', 'winner:id,nickname', 'board:id,board_cols,board_rows']);

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $games = $query->orderBy('created_at', 'desc')->paginate(10);

        $customGames = $games->map(function ($game) {
            return [
                'id' => $game->id,
                'creator_nickname' => $game->creator->nickname ?? 'Unknown',
                'winner_nickname' => $game->winner->nickname ?? 'No Winner',
                'status' => $game->status,
                'type' => $game->type === 'S' ? 'Single Player' : 'Multiplayer',
                'num_turns' => $game->total_turns_winner ?? '0',
                'created_at' => $game->created_at->format('d/m/Y H:i:s'),
                'board' => [
                    'cols' => $game->board->board_cols ?? 0,
                    'rows' => $game->board->board_rows ?? 0,
                ],
            ];
        });

        return response()->json([
            'current_page' => $games->currentPage(),
            'data' => $customGames,
            'total' => $games->total(),
            'last_page' => $games->lastPage(),
            'per_page' => $games->perPage(),
            'next_page_url' => $games->nextPageUrl(),
            'prev_page_url' => $games->previousPageUrl(),
        ]);
    }
}
