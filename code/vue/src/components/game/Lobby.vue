<template>
  <div class="lobby">
    <div class="lobby-container">
      <!-- Lista de Lobbys -->
      <template v-if="!inLobby">
        <h1>Lista de Lobbys</h1>
        <div>
          <label for="boardSize">Tamanho do Tabuleiro:</label>
          <select v-model="boardSize" id="boardSize">
            <option value="4">4x4</option>
            <option value="6">6x6</option>
            <option value="8">8x8</option>
          </select>
        </div>
        <button @click="createLobby" class="lobby-button">Criar Lobby</button>

        <table>
          <thead>
            <tr>
              <th>ID do Lobby</th>
              <th>Dono</th>
              <th>Tamanho</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lobby in lobbies" :key="lobby.id">
              <td>{{ lobby.id }}</td>
              <td>{{ lobby.owner }}</td>
              <td>{{ lobby.boardSize }}x{{ lobby.boardSize }}</td>
              <td>
                <button @click="joinLobby(lobby.id)" class="join-button">Entrar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <!-- Lobby do Jogo -->
      <template v-else>
        <h1>Lobby do Jogo</h1>
        <p>ID do Lobby: {{ lobbyId }}</p>
        <h2>Jogadores:</h2>
        <ul>
          <li v-for="player in players" :key="player">{{ player }}</li>
        </ul>
        <p>Aguardando outros jogadores...</p>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "@/components/ui/toast/use-toast";
import { useAuthStore } from "@/stores/auth"; // Importa a store de autenticação
import socket from "@/lib/socket";

const router = useRouter();
const { toast } = useToast();
const storeAuth = useAuthStore();

const inLobby = ref(false); // Flag para alternar entre lista e lobby do jogo
const lobbyId = ref(""); // Para armazenar o ID do lobby introduzido pelo utilizador
const players = ref([]);
const lobbies = ref([]); // Lista de lobbys ativos
const gameStarted = ref(false);
const nickname = storeAuth.userNickname;

// Tamanho do tabuleiro (4x4 por padrão)
const boardSize = ref(4);

// Criar um novo lobby
const createLobby = () => {
  if (nickname) {
    socket.emit("createLobby", { nickname, boardSize: boardSize.value });
  toast({
    description: "A criar um lobby...",
    className: "toast-info",
  });
  } else {
    toast({
      description: "Nickname não encontrado. Verifique a autenticação!",
      className: "toast-error",
    });
  }
};

// Obter lista de lobbys
const getLobbies = () => {
  socket.emit("getLobbies");
};

// Entrar no lobby selecionado
const joinLobby = (lobbyId) => {
  if (lobbyId && nickname) {
    socket.emit("joinLobby", { lobbyId, nickname });
    toast({
      description: `A entrar no lobby ${lobbyId}...`,
      className: "toast-info",
    });
  } else {
    toast({
      description: "Erro: ID do lobby ou nickname inválido.",
      className: "toast-error",
    });
  }
};

// Eventos do WebSocket
onMounted(() => {
  getLobbies(); // Obter a lista inicial de lobbys

  socket.on("lobbiesUpdated", (data) => {
    lobbies.value = data.lobbies;
    console.log("Lobbies:", data.lobbies);
  });


  socket.on("lobbyCreated", (data) => {
    router.push({ name: "multiPlayerGame", query: { lobbyId: data.lobbyId } });
    lobbyId.value = data.lobbyId;
    inLobby.value = true;
    players.value = [nickname];
    console.log("Lobby criado:", data.lobbyId);
    toast({
      description: `Lobby criado com sucesso! ID: ${data.lobbyId}`,
      className: "toast-success",
    });
  });

  socket.on("gameStarted", (data) => {
    console.log("Jogo iniciado:", data);
    lobbyId.value = data.lobbyId;
    players.value = data.players;
    //inLobby.value = false; // Sai do lobby de espera
    //gameStarted.value = true;

    toast({
      description: "Jogo iniciado!",
      className: "toast-success",
    });

    // Redirecionar para GameMultiplayer.vue
    router.push({
    name: "multiPlayerGame",
    query: {
      lobbyId: data.lobbyId,
      boardSize: boardSize.value, // Garante que o tamanho do tabuleiro é passado
    },
  });
  });

  socket.on("noLobbyAvailable", () => {
    toast({
      description: "Nenhum lobby disponível. Tente criar um novo!",
      className: "toast-warning",
    });
  });

  socket.on("error", (error) => {
    console.error("Erro do servidor:", error.message);
    toast({
      description: error.message,
      className: "toast-error",
    });
  });
});
</script>

<style scoped>
.lobby {
  background-color: #121212;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  color: white;
  font-family: "Metrophobic", sans-serif;
}

table {
  width: 100%;
  margin: 20px auto;
  border-collapse: collapse;
}


th, td {
  padding: 10px;
  border: 1px solid #444;
}

th {
  background-color: #3944bc;
  color: white;
}


select {
  margin: 10px 0;
  padding: 5px;
}

.lobby-container {
  text-align: center;
  padding: 2rem;
  background-color: #1e1e1e;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
  max-width: 400px;
  width: 100%;
}

input.lobby-input {
  padding: 10px;
  margin: 10px 0;
  width: 80%;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #3944bc;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

button:hover {
  background-color: #283593;
  transform: translateY(-2px);
}
</style>
