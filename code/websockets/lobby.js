const games = {};
const gameEngine = require("./gameEngine").createGameEngine();

const addGame = (lobbies, lobbyId, player) => {
  const newGame = {
    id: lobbyId,
    players: [player],
    boardSize: player.boardSize || 4,
    gameState: [],
    currentTurn: player.id,
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

const playMove = (lobbyId, moveIndex, playerId) => {
  const game = games[lobbyId];
  if (game) {
    return gameEngine.play(game, moveIndex, playerId);
  }
  return null;
};

const getGame = (lobbyId) => games[lobbyId];

module.exports = { addGame, joinGame, playMove, getGame };
