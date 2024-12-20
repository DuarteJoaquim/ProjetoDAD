<?php

namespace App\Http\Controllers\api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Game;
class UserController extends Controller
{

    public function index()
    {
        return User::all();
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
        ]);

        $user = User::create($validatedData);
        return response()->json($user, 201);
    }

    public function show($id)
    {
        $user = User::with(['transactions', 'gamesCreated', 'gamesWon', 'multiplayerGamesPlayed'])->firstOrFail($id);
        return response()->json($user);
    }

    public function showMe(Request $request)
    {
        return new UserResource($request->user());
    }


    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->all());
        return response()->json($user);
    }



    public function deleteUser(Request $request, $id)
    {
        // Obter o usuário que será excluído
        $user = User::firstOrFail($id);
    
        // Obter o usuário autenticado
        $authUser = $request->user();
    
        // Regras de exclusão
        if ($authUser->id === $user->id) {
            // Usuário autenticado pode excluir sua própria conta
            return $this->handleUserDeletion($user);
        }
    
        if ($authUser->type !== 'A') {
            // Usuários normais não podem excluir outros usuários
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }
    
        if ($user->type === 'A') {
            // Administradores não podem excluir outros administradores
            return response()->json(['message' => 'Admins cannot delete other admins.'], 403);
        }
    
        // Admin pode excluir outros usuários
        return $this->handleUserDeletion($user);
    }
    
    private function handleUserDeletion(User $user)
    {
        // Verificar se o usuário tem transações ou jogos
        $hasTransactions = Transaction::where('user_id', $user->id)->exists();
        $hasGames = Game::where('created_user_id', $user->id)->exists() || Game::where('winner_user_id', $user->id)->exists();
    
        if ($hasTransactions || $hasGames) {
            // Aplicar Soft Delete
            $user->delete();
            return response()->json(['message' => 'User has been soft deleted.'], 200);
        } else {
            // Eliminar permanentemente
            $user->forceDelete();
            return response()->json(['message' => 'User has been permanently deleted.'], 200);
        }
    }
    

}
