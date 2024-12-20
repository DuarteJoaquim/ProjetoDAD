<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{

    public function index()
    {
        $transactions = Transaction::with(['user', 'game'])->get();
        return response()->json($transactions);
    }


    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'transaction_datetime' => 'required|date',
            'user_id' => 'required|exists:users,id',
            'game_id' => 'nullable|exists:games,id',
            'type' => 'required|in:B,P,I',
            'euros' => 'required|numeric|min:0',
            'brain_coins' => 'required|integer|min:0',
            'payment_type' => 'required|in:MBWAY,PAYPAL,IBAN,MB,VISA',
            'payment_reference' => 'nullable|string|max:255',
        ]);


        $transaction = Transaction::create($validatedData);
        return response()->json($transaction, 201);
    }
    

    public function show($id)
    {
        $transaction = Transaction::with(['user', 'game'])->findOrFail($id);
        return response()->json($transaction);
    }


    public function update(Request $request, $id)
    {
        $transaction = Transaction::findOrFail($id);

        $validatedData = $request->validate([
            'transaction_datetime' => 'sometimes|date',
            'user_id' => 'sometimes|exists:users,id',
            'game_id' => 'nullable|exists:games,id',
            'type' => 'sometimes|in:B,P,I',
            'euros' => 'sometimes|numeric|min:0',
            'brain_coins' => 'sometimes|integer|min:0',
            'payment_type' => 'sometimes|in:MBWAY,PAYPAL,IBAN,MB,VISA',
            'payment_reference' => 'nullable|string|max:255',
        ]);

        $transaction->update($validatedData);
        return response()->json($transaction);
    }


    public function getCoins(Request $request)
    {
        try {
            $user = $request->user();

            return response()->json(['coins' => $user->brain_coins_balance]);
        } catch (\Exception $e) {
            \Log::error('Erro ao buscar moedas: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao buscar moedas'], 500);
        }
    }

    public function purchaseCoins(Request $request)
{
    try {
        $validated = $request->validate([
            'type' => 'required|string|in:MBWAY,PAYPAL,IBAN,MB,VISA',
            'reference' => 'required|string|max:255',
            'coinValue' => 'required|integer|min:1',
            'euros' => 'required|numeric|min:1',
        ]);

        $user = $request->user();

        // Atualiza o saldo de moedas do usuário
        $user->brain_coins_balance += $validated['coinValue'];
        $user->save();

        // Cria uma transação na tabela transactions
        Transaction::create([
            'transaction_datetime' => now(),
            'user_id' => $user->id,
            'game_id' => null, // Não relacionado a um jogo
            'type' => 'B', // Tipo "B" para compra de coins
            'euros' => $validated['euros'], // Valor em euros
            'brain_coins' => $validated['coinValue'], // Coins comprados
            'payment_type' => $validated['type'],
            'payment_reference' => $validated['reference'],
        ]);

        return response()->json(['coins' => $user->brain_coins_balance], 200);
    } catch (\Exception $e) {
        \Log::error('Error on the buying coins process: ' . $e->getMessage());
        return response()->json(['error' => 'Error buying coins'], 500);
    }
}


public function spendCoins(Request $request)
{
    try {
        $validated = $request->validate([
            'value' => 'required|integer|min:1',
        ]);

        $user = $request->user();

        if ($user->brain_coins_balance < $validated['value']) {
            return response()->json(['error' => 'Not enough coins'], 400);
        }

        // Deduz o saldo de moedas do usuário
        $user->brain_coins_balance -= $validated['value'];
        $user->save();

        // Cria uma transação na tabela transactions
        Transaction::create([
            'transaction_datetime' => now(),
            'user_id' => $user->id,
            'game_id' => null, // Não relacionado a um jogo
            'type' => 'P', // Tipo "P" para gasto de coins
            'euros' => 0, // Não há valor em euros
            'brain_coins' => -$validated['value'], // Coins gastos (valor negativo)
            'payment_type' => null, // Não aplicável
            'payment_reference' => null, // Não aplicável
        ]);

        return response()->json(['coins' => $user->brain_coins_balance], 200);
    } catch (\Exception $e) {
        \Log::error('Error on the spending coins process: ' . $e->getMessage());
        return response()->json(['error' => 'Error spending coins'], 500);
    }
}


    public function destroy($id)
    {
        $transaction = Transaction::findOrFail($id);
        $transaction->delete();
        return response()->json(['message' => 'Transaction deleted successfully']);
    }
}
