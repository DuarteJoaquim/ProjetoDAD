const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, { cors: { origin: "*" } });
const { addGame, joinGame, playMove, getGame } = require('./lobby');
const express = require("express");
const app = express();
const leaderboard = require("./leaderboard");

app.get("/leaderboard", (req, res) => {
  const leaderboardData = leaderboard.getLeaderboard();
  res.json(leaderboardData);
});

app.use(express.static("public")); // Serve a pasta public

const PORT = process.env.PORT || 8086;

const lobbies = {}; 


io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

 // Criar lobby
socket.on("createLobby", ({ nickname, boardSize }) => {
  if (!nickname) nickname = `Jogador ${socket.id.slice(-4)}`;
  if (!boardSize) boardSize = 4;

  const gameState = Array.from({ length: boardSize * boardSize / 2 }, (_, i) => ({
    name: `${i}`,
    img: `path/to/img/${i}.png`,
    isFlipped: false,
    isMatched: false,
  }))
    .flatMap(card => [card, { ...card }])
    .sort(() => Math.random() - 0.5);

  addGame(lobbies, socket.id, { id: socket.id, nickname, boardSize, gameState });
  socket.join(socket.id);

  io.emit("lobbiesUpdated", { lobbies: Object.values(lobbies) });
  io.to(socket.id).emit("lobbyCreated", { lobbyId: socket.id });
});
  
  // Enviar lista de lobbys ativos
  socket.on("getLobbies", () => {
    socket.emit("lobbiesUpdated", { lobbies });
  });



  // Entrar no lobby
  socket.on("joinLobby", ({ lobbyId, nickname }) => {
    const game = joinGame(lobbies, lobbyId, socket.id, nickname);
    if (game) {
      socket.join(lobbyId);
      io.to(lobbyId).emit("gameStarted", {
        players: game.players.map(p => p.nickname),
        gameState: game.gameState,
        currentTurn: game.currentTurn,
        lobbyId,
      });
    } else {
      socket.emit("error", { message: "Lobby não encontrado ou cheio!" });
    }
  });

  // Processar movimento do jogador
  socket.on("playerMove", ({ lobbyId, moveIndex }) => {
    const game = getGame(lobbyId); // Usar getGame diretamente
    if (!game) {
      socket.emit("error", { message: "Lobby não encontrado!" });
      return;
    }
  
    const result = playMove(lobbyId, moveIndex, socket.id); // Usar playMove diretamente
  
    if (result) {
      io.to(lobbyId).emit("updateGameState", {
        gameState: game.gameState,
        currentTurn: game.currentTurn,
      });
  
      if (result.gameEnded) {
        const winner = socket.id;
        leaderboard.addWin(winner, game.players.find(p => p.id === winner)?.nickname);
        io.to(lobbyId).emit("gameEnded", { message: "O jogo terminou!", winner });
      }
    }
  });
  
  
  socket.on("gameEnded", ({ lobbyId, winnerId }) => {
    const game = getGame(lobbyId); // Usar getGame diretamente
    if (!game) {
      return;
    }
  
    const winnerNickname = game.players.find(player => player.id === winnerId)?.nickname || "Desconhecido";
  
    leaderboard.addWin(winnerId, winnerNickname);
  
    io.emit("updateLeaderboard", leaderboard.getLeaderboard());
    io.to(lobbyId).emit("gameEnded", { message: "O jogo terminou!", winner: winnerNickname });
  });
  
  

  socket.on("requestLeaderboard", () => {
    const leaderboardData = leaderboard.getLeaderboard();
    console.log("Leaderboard enviado:", leaderboardData); // Deve aparecer no terminal
    socket.emit("receiveLeaderboard", leaderboardData);
  });
  
  
  

  // Jogador desconectado
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`WebSocket Server listening on http://localhost:${PORT}`);
});
