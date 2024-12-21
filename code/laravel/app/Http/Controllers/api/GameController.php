<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;

class GameController extends Controller
{
    public function index()
    {
        $games = Game::with(['transactions', 'board', 'multiplayerGamesPlayed', 'creator', 'winner'])->get();
        return response()->json($games);
    }


    public function store(Request $request)
{
    $user = new UserResource($request->user());

    $validatedData = $request->validate([
        'winner_user_id' => 'nullable|exists:users,id',
        'type' => 'nullable|in:S,M', // Allow omission
        'status' => 'nullable|in:PE,PL,E,I', // Allow omission
        'total_time' => 'nullable|numeric',
        'total_turns_winner' => 'nullable|numeric',
        'board_id' => 'required|exists:boards,id',
        'began_at' => 'nullable|date',
        'ended_at' => 'nullable|date',

    ]);

    // Set created_user_id to the authenticated user's ID
    $validatedData['created_user_id'] = $user->id;

    // Set default values for type and status
    $validatedData['type'] = $validatedData['type'] ?? 'S';
    $validatedData['status'] = $validatedData['status'] ?? 'E';

    $user_id = $user->id;
    $board_id = $validatedData['board_id'];
    $total_time = $validatedData['total_time'];
    $total_turns = $validatedData['total_turns_winner'];

    $personalBest = Game::where('created_user_id', $user_id)
    ->where('board_id', $board_id) 
    ->whereNotNull('total_turns_winner')
    ->whereNotNull('total_time')
    ->orderBy('total_turns_winner', 'asc')
    ->orderBy('total_time', 'asc')
    ->first();

    \Log::info('Personal Best:', ['personalBest' => $personalBest]);


    $beatPersonalBest = (!$personalBest) || 
    ($total_turns < $personalBest->total_turns_winner) || 
    ($total_turns === $personalBest->total_turns_winner && $total_time < $personalBest->total_time); 

    // Check for global top 3 (prioritize turns, then time)
    $beatGlobalTop3 = $this->isGlobalTop3($board_id, $total_turns, $total_time);

    // Reward the user if they beat a personal best or achieved a global top 3
    if ($beatPersonalBest && $beatGlobalTop3) {
        $user = User::find($user_id);
        $user->increment('brain_coins_balance', 2); // Increment coins by 2
    } elseif ($beatPersonalBest || $beatGlobalTop3) {
        $user = User::find($user_id);
        $user->increment('brain_coins_balance', 1); // Increment coins by 1
    }

    // Create the game record
    $game = Game::create($validatedData);

    return response()->json([
        'message' => 'Game data saved successfully!',
        'game' => $game,
        'beat_personal_best' => $beatPersonalBest,
        'beat_global_top3' => $beatGlobalTop3,
    ]);
}

/**
 * Check if the given turns and time qualify as a global top 3 score for the board.
 */
private function isGlobalTop3($boardId, $turns, $time)
{
    $globalTop3 = Game::where('board_id', $boardId)
        ->whereNotNull('total_turns_winner')
        ->whereNotNull('total_time')
        ->orderBy('total_turns_winner', 'asc')
        ->orderBy('total_time', 'asc')
        ->limit(3)
        ->get(['total_turns_winner', 'total_time']);

    // Check if the current score beats the global top 3
    foreach ($globalTop3 as $record) {
        if ($turns < $record->total_turns_winner || 
           ($turns === $record->total_turns_winner && $time < $record->total_time)) {
            return true;
        }
    }

    return $globalTop3->count() < 3; // If less than 3 records, it's a top score
}



    public function show($id)
    {
        $game = Game::with(['transactions', 'board', 'creator', 'winner'])->findOrFail($id);
        return response()->json($game);
    }

    public function gamehistory(Request $request)
    {
        $user = new UserResource($request->user());

        $games = Game::with(['creator:id,nickname', 'winner:id,nickname'])
            ->where('created_user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $customGames = $games->map(function ($game) {
            return [
                'id' => $game->id,
                'nickname' => $game->creator->nickname ?? 'Nenhum',
                'status' => $game->status,
                'num_turns' => $game->total_turns_winner ?? '0',
                'created_at' => $game->created_at->format('d/m/Y H:i:s'),
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

    public function personalScoreboard(Request $request)
    {
        $user = new UserResource($request->user());

        $scores = Game::join('users', 'games.created_user_id', '=', 'users.id')
            ->join('boards', 'games.board_id', '=', 'boards.id')
            ->selectRaw('users.nickname as player, 
                        CONCAT(boards.board_cols, "x", boards.board_rows) as boardSize,  
                        games.total_time as bestTime, 
                        games.total_turns_winner as fewestTurns')
            ->where('games.created_user_id', $user->id)
            ->whereNotNull('games.total_time')
            ->where('games.board_id', '!=', 4)
            ->orderBy('games.total_turns_winner', 'asc')
            ->orderBy('games.total_time', 'asc')
            ->take(5)
            ->get();

        return response()->json($scores);
    }

    public function globalScoreboard(Request $request)
{
    $boardCols = $request->input('cols'); // Ex: 3
    $boardRows = $request->input('rows'); // Ex: 4

    $scores = Game::join('users', 'games.created_user_id', '=', 'users.id')
        ->join('boards', 'games.board_id', '=', 'boards.id')
        ->where('boards.board_cols', $boardCols)
        ->where('boards.board_rows', $boardRows)
        ->whereNotNull('games.total_time') // Garantir que total_time não é NULL
        ->whereNotNull('games.total_turns_winner') // Garantir que total_turns_winner não é NULL
        ->orderBy('games.total_time', 'asc')
        ->orderBy('games.total_turns_winner', 'asc')
        ->take(5)
        ->get([
            'users.nickname as player',
            'games.total_time as bestTime',
            'games.total_turns_winner as fewestTurns'
        ]);

    return response()->json($scores);
}

public function globalMultiplayerScoreboard(Request $request)
{
    $boardCols = $request->input('cols');
    $boardRows = $request->input('rows');

    try {
        $scores = Game::join('boards', 'games.board_id', '=', 'boards.id')
            ->leftJoin('users', 'games.winner_user_id', '=', 'users.id')
            ->leftJoin('multiplayer_games_played', 'games.id', '=', 'multiplayer_games_played.game_id')
            ->where('boards.board_cols', $boardCols)
            ->where('boards.board_rows', $boardRows)
            ->whereNotNull('games.winner_user_id')
            ->groupBy('users.id', 'users.nickname', 'boards.board_cols', 'boards.board_rows')
            ->orderByRaw('COUNT(games.winner_user_id) DESC, MIN(games.created_at) ASC')
            ->take(5)
            ->get([
                'users.nickname as player',
                'boards.board_cols',
                'boards.board_rows',
                \DB::raw('COUNT(games.winner_user_id) as victories'),
            ]);

        return response()->json($scores);
    } catch (\Exception $e) {
        \Log::error('Error fetching multiplayer scoreboard: ' . $e->getMessage());
        return response()->json(['error' => 'Error fetching multiplayer scoreboard.'], 500);
    }
}




public function personalMultiplayerScoreboard(Request $request)
{
    $userId = $request->user()->id;

    // Total de vitórias
    $victories = Game::where('winner_user_id', $userId)->count();


    // Total de derrotas
    $losses = Game::leftJoin('multiplayer_games_played', 'games.id', '=', 'multiplayer_games_played.game_id')
        ->where(function ($query) use ($userId) {
            $query->where('games.created_user_id', $userId) // Perdeu como criador
                  ->orWhere('multiplayer_games_played.user_id', $userId); // Perdeu como convidado
        })
        ->where('games.winner_user_id', '!=', $userId) // O jogador não foi o vencedor
        ->count();

    return response()->json([
        'victories' => $victories,
        'losses' => $losses,
    ]);
}

public function getStatistics()
    {
        // Estatísticas genéricas
        $totalPlayers = User::count();
        $totalGames = Game::count();
        $gamesLastWeek = Game::where('created_at', '>=', now()->subWeek())->count();
        $gamesLastMonth = Game::where('created_at', '>=', now()->subMonth())->count();

        // Estatísticas adicionais para administradores
        $totalPurchases = Transaction::where('type', 'purchase')->sum('amount');
        $purchasesByPlayer = Transaction::where('type', 'purchase')
            ->selectRaw('user_id, SUM(amount) as total')
            ->groupBy('user_id')
            ->with('user:id,name')
            ->get();

        return response()->json([
            'total_players' => $totalPlayers,
            'total_games' => $totalGames,
            'games_last_week' => $gamesLastWeek,
            'games_last_month' => $gamesLastMonth,
            'total_purchases' => $totalPurchases,
            'purchases_by_player' => $purchasesByPlayer,
        ]);
    }






    public function update(Request $request, $id)
    {
        $game = Game::findOrFail($id);

        $validatedData = $request->validate([
            'created_user_id' => 'sometimes|exists:users,id',
            'winner_user_id' => 'nullable|exists:users,id',
            'type' => 'sometimes|in:PE,PL,E,I',
            'status' => 'sometimes|in:S,M',
            'total_time' => 'nullable|numeric',
            'board_id' => 'sometimes|exists:boards,id',
        ]);

        $game->update($validatedData);
        return response()->json($game);
    }


    public function destroy($id)
    {
        $game = Game::findOrFail($id);
        $game->delete();
        return response()->json(['message' => 'Game deleted successfully']);
    }
}
