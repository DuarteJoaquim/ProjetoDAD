const games = {};
const gameEngine = require("./gameEngine").createGameEngine();

const addGame = (lobbies, lobbyId, player) => {
  const newGame = {
    id: lobbyId,
    players: [{ id: player.id, nickname: player.nickname }],
    boardSize: player.boardSize || 4,
    gameState: [],
    currentTurn: player.id,
    scores: {},
  };
  // Inicializa o estado do jogo usando o gameEngine
  gameEngine.initGame(newGame);
  games[lobbyId] = newGame;
  lobbies[lobbyId] = newGame; // Atualiza o objeto lobbies
};

const joinGame = (lobbies, lobbyId, playerId, playerNickname) => {
  const game = lobbies[lobbyId];
  if (game && game.players.length < 2) {
    game.players.push({ id: playerId, nickname: playerNickname });
    return game;
  }
  return null;
};

const playMove = (lobbyId, moveIndex, playerId, io) => {
  // Verificar se o lobby existe no objeto games
  const game = games[lobbyId];
  if (!game) {
    console.error(`Lobby não encontrado para lobbyId: ${lobbyId}`);
    return null;
  }

  try {
    // Chamar a função play no gameEngine
    return gameEngine.play(game, moveIndex, playerId, io);
  } catch (error) {
    console.error(`Erro ao processar movimento no lobby ${lobbyId}:`, error);
    return null;
  }
};

const getGame = (lobbyId) => {
  const game = games[lobbyId];
  if (!game) {
    console.error(`Erro: Jogo com ID ${lobbyId} não encontrado.`);
  } else {
    console.log(`Estado do jogo para lobby ${lobbyId}:`, game);
  }
  return game;
};


module.exports = { addGame, joinGame, playMove, getGame };
