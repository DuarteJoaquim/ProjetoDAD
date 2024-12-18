const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.APP_PORT || 8086;

const lobbies = []; // Array para guardar os jogos/lobbies ativos

httpServer.listen(PORT, () => {
  console.log(`WebSocket Server listening on localhost:${PORT}`);
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Criar um novo lobby
  socket.on("createLobby", (data) => {
    const lobby = {
      id: socket.id,
      players: [socket.id],
      board: null, // Tabuleiro do jogo
      status: "waiting", // waiting | in_progress | finished
    };
    lobbies.push(lobby);
    socket.join(lobby.id);
    io.to(lobby.id).emit("lobbyCreated", { lobbyId: lobby.id });
    console.log(`Lobby criado: ${lobby.id}`);
  });

  // Entrar num lobby existente
  socket.on("joinLobby", () => {
    const lobby = lobbies.find((l) => l.status === "waiting");
    if (lobby) {
      lobby.players.push(socket.id);
      socket.join(lobby.id);
      lobby.status = "in_progress";

      // Inicia o jogo quando o segundo jogador entra
      io.to(lobby.id).emit("gameStarted", { players: lobby.players });
      console.log(`Jogo iniciado: ${lobby.id}`);
    } else {
      socket.emit("noLobbyAvailable");
    }
  });

  // Enviar o turno do jogador
  socket.on("playerMove", ({ lobbyId, move }) => {
    io.to(lobbyId).emit("updateGameState", { move, player: socket.id });
  });

  // Desconexão
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});
