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
    lobby.scores = {}; // Inicializa os pontos dos jogadores
    lobby.players.forEach((player) => {
      lobby.scores[player.id] = 0; // Inicializa os pontos de cada jogador
    });
  };

  const play = (lobby, moveIndex, playerId, io) => {
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
      // **As cartas são um par:**
      
      setTimeout(() => {
        flippedCards.forEach((c) => (c.isMatched = true));

        // Adicionar pontos ao jogador
        if (!lobby.scores[playerId]) {
          lobby.scores[playerId] = 0; 
        }
        lobby.scores[playerId] += 1;

        

        // Emitir estado atualizado após marcar como combinado
        io.to(lobby.id).emit("updateGameState", {
          gameState: lobby.gameState,
          currentTurn: lobby.currentTurn,
          scores: lobby.scores,
          players: lobby.players.map((p) => ({
            id: p.id,
            nickname: p.nickname,
          })),
        });

        // Verificar fim do jogo após encontrar um par
        const gameEnded = lobby.gameState.every((c) => c.isMatched);
        if (gameEnded) {
          finalizeGame(lobby, io);
        }

      }, 500);
      } else {
      // **As cartas não são um par:**
        setTimeout(() => {
            flippedCards.forEach((c) => (c.isFlipped = false)); // Vira as cartas de volta
          

          // Alternar o turno
          const nextPlayer = lobby.players.find((player) => player.id !== playerId);
          lobby.currentTurn = nextPlayer.id;

          // Emitir estado atualizado para os jogadores após as cartas virarem
          io.to(lobby.id).emit("updateGameState", {
            gameState: lobby.gameState,
            currentTurn: lobby.currentTurn,
            scores: lobby.scores,
            players: lobby.players.map((p) => ({
              id: p.id,
              nickname: p.nickname,
            })),
          });
      }, 1500); // Tempo para memorizar as cartas antes de virar

      }
    }

    return {
      gameEnded: false, // O jogo ainda não terminou aqui
      currentTurn: lobby.currentTurn,
      scores: lobby.scores,
    };
  };
  
  // Função para finalizar o jogo
  const finalizeGame = (lobby, io) => {
    const highestScore = Math.max(...Object.values(lobby.scores));
    const winnerId = Object.keys(lobby.scores).find(
      (id) => lobby.scores[id] === highestScore
    );
    const winnerNickname =
      lobby.players.find((p) => p.id === winnerId)?.nickname || "Desconhecido";
  
    io.to(lobby.id).emit("gameEnded", {
      message: `O jogo terminou! O vencedor é ${winnerNickname}`,
      winner: winnerNickname,
      scores: lobby.scores,
    });
  
    console.log(`Jogo finalizado no lobby ${lobby.id}. Vencedor: ${winnerNickname}`);
  };

  return { initGame, play };
};

module.exports = { createGameEngine };
