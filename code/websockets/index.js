const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, { cors: { origin: "*" } });
const { addGame, joinGame, playMove, getGame } = require("./lobby");
const express = require("express");
const app = express();
const leaderboard = require("./leaderboard");

app.get("/leaderboard", (req, res) => {
  const leaderboardData = leaderboard.getLeaderboard();
  res.json(leaderboardData);
});

app.use(express.static("public")); // Serve a pasta public

const PORT = process.env.PORT || 8086;

const lobbies = {}; // Armazena todos os lobbies

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Criar lobby
  socket.on("createLobby", ({ nickname, boardSize }) => {
    if (!nickname) nickname = `Jogador ${socket.id.slice(-4)}`;
    if (!boardSize) boardSize = 4;

    addGame(lobbies, socket.id, { id: socket.id, nickname, boardSize });
    socket.join(socket.id);

    io.emit("lobbiesUpdated", { lobbies: Object.values(lobbies) });
    io.to(socket.id).emit("lobbyCreated", { lobbyId: socket.id });
  });

  // Enviar lista de lobbys ativos
  socket.on("getLobbies", () => {
    socket.emit("lobbiesUpdated", { lobbies: Object.values(lobbies) });
  });

  // Entrar no lobby
  socket.on("joinLobby", ({ lobbyId, nickname }) => {
    const game = joinGame(lobbies, lobbyId, socket.id, nickname ,);
    if (game) {
      socket.join(lobbyId);
      io.to(lobbyId).emit("gameStarted", {
        players: game.players.map((p) => ({ id: p.id, nickname: p.nickname })),
        scores: game.scores,
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

    if (!game.players || game.players.length === 0) {
      console.error(`Jogadores ausentes no lobby: ${lobbyId}`);
      io.to(lobbyId).emit("error", { message: "Jogadores ausentes no lobby!" });
      return;
    }

    const result = playMove(lobbyId, moveIndex, socket.id, io); // Usar playMove diretamente

    if (result) {
      io.to(lobbyId).emit("updateGameState", {
        gameState: game.gameState,
        currentTurn: game.currentTurn,
        scores: game.scores,
        players: game.players.map((p) => ({ id: p.id, nickname: p.nickname })),
      });

      if (result.gameEnded) {
        const winnerId = game.winner;
        const winnerNickname = game.players.find(player => player.id === winnerId)?.nickname || "Desconhecido";

        leaderboard.addWin(winnerId, winnerNickname);

        console.log("Evento gameEnded emitido com os seguintes dados:");
        console.log("Jogadores:", game.players.map((p) => ({ id: p.id, nickname: p.nickname })));
        console.log("Pontuações:", game.scores);
        console.log("Vencedor:", winnerNickname);

        io.to(lobbyId).emit("gameEnded", {
          message: `O jogo terminou! O vencedor é ${winnerNickname}`,
          winner: winnerNickname,
          scores: game.scores,
          players: game.players.map((p) => ({ id: p.id, nickname: p.nickname })),
        });

        io.emit("updateLeaderboard", leaderboard.getLeaderboard());
      }
    }
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
