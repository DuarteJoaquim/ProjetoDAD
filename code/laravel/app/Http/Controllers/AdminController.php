<?php

namespace App\Http\Controllers;
use App\Models\Game;
use Illuminate\Http\Request;
use App\Models\Transaction;

class AdminController extends Controller
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

    public function allTransactions(Request $request)
{
    // Incluir transações apenas com usuários não apagados
    $query = Transaction::with(['user:id,name,email', 'game:id,type'])
        ->whereHas('user', function ($query) {
            $query->whereNull('deleted_at'); // Verifica se o usuário não está apagado
        });

    // Filtros opcionais
    if ($request->has('type')) {
        $query->where('type', $request->type);
    }

    if ($request->has('payment_type')) {
        $query->where('payment_type', $request->payment_type);
    }

    if ($request->has('user_id')) {
        $query->where('user_id', $request->user_id);
    }

    // Paginação
    $transactions = $query->orderBy('transaction_datetime', 'desc')->paginate(10);

    // Modifica o retorno para evitar `null` no `user`
    $transactions->getCollection()->transform(function ($transaction) {
        return [
            'id' => $transaction->id,
            'transaction_datetime' => $transaction->transaction_datetime,
            'type' => $transaction->type,
            'euros' => $transaction->euros,
            'brain_coins' => $transaction->brain_coins,
            'payment_type' => $transaction->payment_type,
            'payment_reference' => $transaction->payment_reference,
            'game' => $transaction->game,
            'user' => $transaction->user ? [
                'id' => $transaction->user->id,
                'name' => $transaction->user->name,
                'email' => $transaction->user->email,
            ] : null, // Garante que `user` não é acessado se for `null`
        ];
    });

    return response()->json($transactions);
}


}
