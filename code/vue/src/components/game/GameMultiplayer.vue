<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import socket from "@/lib/socket";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const route = useRoute();
const storeAuth = useAuthStore();


const lobbyId = ref(route.query.lobbyId); // ID do lobby recebido via query params
const boardSize = ref(parseInt(route.query.boardSize) || 4); // Tamanho do tabuleiro recebido
const hidden = new URL('@/assets/img/icon/empty.png', import.meta.url).href;
const scores = ref({}); // Pontuação dos jogadores
const playerMap = ref({}); // Mapeamento de ID de jogador para nome

const initialCards = ref([
    // Populate with card details as in your existing setup
    { name: '0', img: new URL('@/assets/img/icon/0.png', import.meta.url).href, isFlipped: false, isMatched: false },
    { name: '1', img: new URL('@/assets/img/icon/1.png', import.meta.url).href, isFlipped: false, isMatched: false },
    { name: '2', img: new URL('@/assets/img/icon/2.png', import.meta.url).href, isFlipped: false, isMatched: false },
    { name: '3', img: new URL('@/assets/img/icon/3.png', import.meta.url).href, isFlipped: false, isMatched: false },
    { name: '4', img: new URL('@/assets/img/icon/4.png', import.meta.url).href, isFlipped: false, isMatched: false },
    { name: '5', img: new URL('@/assets/img/icon/5.png', import.meta.url).href, isFlipped: false, isMatched: false },
    { name: '6', img: new URL('@/assets/img/icon/6.png', import.meta.url).href, isFlipped: false, isMatched: false },
    { name: '7', img: new URL('@/assets/img/icon/7.png', import.meta.url).href, isFlipped: false, isMatched: false },
    { name: '8', img: new URL('@/assets/img/icon/8.png', import.meta.url).href, isFlipped: false, isMatched: false },
    { name: '9', img: new URL('@/assets/img/icon/9.png', import.meta.url).href, isFlipped: false, isMatched: false },
    { name: '10', img: new URL('@/assets/img/icon/10.png', import.meta.url).href, isFlipped: false, isMatched: false },
    { name: '11', img: new URL('@/assets/img/icon/11.png', import.meta.url).href, isFlipped: false, isMatched: false },
    { name: '12', img: new URL('@/assets/img/icon/12.png', import.meta.url).href, isFlipped: false, isMatched: false },
    { name: '13', img: new URL('@/assets/img/icon/13.png', import.meta.url).href, isFlipped: false, isMatched: false },
    { name: '14', img: new URL('@/assets/img/icon/14.png', import.meta.url).href, isFlipped: false, isMatched: false },
    { name: '15', img: new URL('@/assets/img/icon/15.png', import.meta.url).href, isFlipped: false, isMatched: false },
    { name: '16', img: new URL('@/assets/img/icon/16.png', import.meta.url).href, isFlipped: false, isMatched: false },
    { name: '17', img: new URL('@/assets/img/icon/17.png', import.meta.url).href, isFlipped: false, isMatched: false },
    { name: '18', img: new URL('@/assets/img/icon/18.png', import.meta.url).href, isFlipped: false, isMatched: false },
    { name: '19', img: new URL('@/assets/img/icon/19.png', import.meta.url).href, isFlipped: false, isMatched: false },
    { name: '20', img: new URL('@/assets/img/icon/20.png', import.meta.url).href, isFlipped: false, isMatched: false },
  ]);


const cards = ref([]); // Estado do tabuleiro
const currentTurn = ref(null);
const playerId = ref(socket.id);
const lockBoard = ref(false);
const resultMessage = ref("0");

// Inicializar o tabuleiro com base no tamanho e no estado recebido
const initializeBoard = (gameState) => {
  cards.value = gameState.map((card) => ({
    ...card,
    img: initialCards.value.find((c) => c.name === card.name).img,
  }));
};

// Lógica para virar cartas
const flipCard = (index) => {
  if (currentTurn.value !== playerId.value || lockBoard.value) return; // Apenas o jogador atual pode jogar

  const flippedCards = cards.value.filter((c) => c.isFlipped && !c.isMatched);
  if (flippedCards.length >= 2) return; // Bloqueia a ação após 2 cartas viradas

  const card = cards.value[index];
  if (card.isFlipped || card.isMatched) return;

  // Emitir jogada para o backend
  socket.emit("playerMove", { lobbyId: lobbyId.value, moveIndex: index });
};

// Eventos do WebSocket
onMounted(() => {
  // Receber o estado inicial do jogo
  socket.on("gameStarted", (data) => {
    console.log("Jogo iniciado:", data);
    initializeBoard(data.gameState);
    currentTurn.value = data.currentTurn;

    scores.value = data.scores || {}; // Inicializar pontuação
    playerMap.value = Object.fromEntries(data.players.map(p => [p.id, p.nickname]));
    
  });

  // Atualizar o estado do jogo
  socket.on("updateGameState", (data) => {
    console.log("Estado do jogo atualizado:", data);

    initializeBoard(data.gameState);

    // Atualiza o turno atual
    currentTurn.value = data.currentTurn;

    // Atualiza as pontuações
    scores.value = data.scores;

    // Atualiza o mapeamento dos jogadores e seus apelidos
    playerMap.value = Object.fromEntries(
      data.players.map((p) => [p.id, p.nickname])
    );
  });


  // Receber o fim do jogo
  socket.on("gameEnded", (data) => {
    console.log("Jogo terminado:", data);

    if (Array.isArray(data.players) && data.players.length > 0) {
      playerMap.value = Object.fromEntries(data.players.map(p => [p.id, p.nickname]));
    } else {
      console.error("Jogadores ausentes ou inválidos no estado do jogo terminado:", data);
      playerMap.value = {};
    }

    scores.value = data.scores;
    resultMessage.value = data.message;
  });

});

// Voltar ao lobby
const goToLobby = () => {
  router.push({ name: "lobby" });
};
</script>

<template>
  <div class="multiplayer-game">
    <h1>Jogo Multiplayer</h1>
    <p v-if="currentTurn === playerId">O teu turno!</p>
    <p v-else>Aguarda o adversário...</p>

    <!-- Tabuleiro -->
    <div class="board" :class="{ locked: currentTurn !== playerId }"  :style="`grid-template-columns: repeat(${boardSize}, 1fr);`">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="card"
        :class="{ flipped: card.isFlipped , removed: card.isMatched }"
        @click="flipCard(index)"
      >
        <img :src="card.isFlipped || card.isMatched ? card.img : hidden" />
      </div>
    </div>

    <!-- Placar -->
    <div class="scoreboard">
      <h2>Placar</h2>
      <ul>
        <li v-for="(score, playerId) in scores" :key="playerId">
          {{ playerMap[playerId] || "Desconhecido" }}: {{ score }} pares
        </li>
      </ul>
    </div>

    <!-- Mensagem de resultado -->
    <div class="game-result" v-if="resultMessage">
      <p>{{ resultMessage }}</p>
    </div>

    <!-- Botão para voltar ao lobby -->
    <button @click="goToLobby" class="button">Voltar ao Lobby</button>
  </div>
</template>

<style scoped>
.multiplayer-game {
  text-align: center;
  padding: 20px;
  background-color: black;
  height: max-content;
}

.board {
  display: grid;
  gap: 10px;
  margin: 20px auto;
  max-width: 600px;
}

.card {
  width: 70px;
  height: 70px;
  background-color: #31485a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 10px;
}

.card.removed {
  visibility: hidden; /* Esconde as cartas combinadas */
}


.locked {
  pointer-events: none; 
  opacity: 0.6; 
}
.card img {
  width: 100%;
  height: auto;
}

.card.flipped {
  transform: rotateY(180deg);
}

.scoreboard {
  margin-top: 20px;
  text-align: left;
  font-size: 1.2rem;
}

.button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #388e3c;
}

.game-result {
  margin-top: 20px;
  font-size: 1.5rem;
  color: #4caf50;
}
</style>