<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'created_user_id',
        'winner_user_id',
        'type',
        'status',
        'total_turns_winner', //fixed typo
        'total_time',
        'board_id',
        'began_at',
        'ended_at',
    ];

    protected $appends = ['player_name', 'board_size'];

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'game_id', 'id');
    }


    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }


    public function multiplayerGamesPlayed(): HasMany
    {
        return $this->hasMany(MultiplayerGamePlayed::class, 'game_id', 'id');
    }


    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_user_id');
    }


    public function winner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'winner_user_id');
    }

    public function getPlayerNameAttribute()
    {
        // Associa o ID do vencedor ao nome do usuário
        return $this->winner ? $this->winner->name : 'N/A';
    }

    public function getBoardSizeAttribute()
    {
        // Recupera o tamanho do tabuleiro associado ao jogo
        return $this->board ? $this->board->size : 'N/A';
    }
}
