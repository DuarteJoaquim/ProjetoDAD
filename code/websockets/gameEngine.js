const createGameEngine = () => {
  const initGame = (lobby) => {
    const totalPairs = (lobby.boardSize * lobby.boardSize) / 2;

    const cards = Array.from({ length: totalPairs }, (_, i) => ({
      name: `${i}`,
      isFlipped: false,
      isMatched: false,
    }));

    lobby.gameState = [...cards, ...cards]
      .sort(() => Math.random() - 0.5) // Embaralhar as cartas
      .map((card) => ({ ...card }));

    lobby.currentTurn = lobby.players[0].id; // Define o primeiro jogador
  };

  const play = (lobby, moveIndex, playerId) => {
    const card = lobby.gameState[moveIndex];
  
    // Evitar virar cartas já viradas ou combinadas
    if (card.isFlipped || card.isMatched) {
      return { error: "Carta já virada ou combinada!" };
    }
  
    // Virar a carta
    card.isFlipped = true;
  
    // Verificar se 2 cartas estão viradas
    const flippedCards = lobby.gameState.filter(
      (c) => c.isFlipped && !c.isMatched
    );
  
    if (flippedCards.length === 2) {
      if (flippedCards[0].name === flippedCards[1].name) {
        // As cartas são um par
        flippedCards.forEach((c) => (c.isMatched = true));
      } else {
        // As cartas não são um par; volta a escondê-las
        setTimeout(() => {
          flippedCards.forEach((c) => (c.isFlipped = false));
        }, 1000);
      }
  
      // Após 2 jogadas, alterna o turno
      const nextPlayer = lobby.players.find((player) => player.id !== playerId);
      lobby.currentTurn = nextPlayer.id;
    }
  
    // Verificar fim do jogo
    const gameEnded = lobby.gameState.every((c) => c.isMatched);
  
    return { gameEnded, currentTurn: lobby.currentTurn };
  };
  
  

  return { initGame, play };
};

module.exports = { createGameEngine };
