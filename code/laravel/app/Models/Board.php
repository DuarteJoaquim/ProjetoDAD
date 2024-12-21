<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Board extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'board_cols',
        'board_rows',
    ];

    // Adiciona atributos calculados
    protected $appends = ['size'];

    /**
     * Relação com Jogos
     */
    public function games(): HasMany
    {
        return $this->hasMany(Game::class, 'board_id', 'id');
    }

    /**
     * Atributo Personalizado: Tamanho do Tabuleiro
     */
    public function getSizeAttribute(): string
    {
        return "{$this->board_rows}x{$this->board_cols}";
    }
}
