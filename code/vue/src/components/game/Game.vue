<script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import { useGameStore } from "@/stores/game";
  import { useCoinsStore } from "@/stores/coins";
  import { useAuthStore } from "@/stores/auth";

  const gameStore = useGameStore();
  const route = useRoute();
  const storeCoins = useCoinsStore();
  const authStore = useAuthStore();

  const isMockMode = ref(route.query.mock === "true");


  const lockBoard = ref(false);
  const lockDuration = 100; // Default lock duration in milliseconds
  let lockTimeout = null;

  const boardId = parseInt(route.query.boardId);

  const cards = ref([]);
  const cardsChosen = ref([]);
  const cardsChosenId = ref([]);
  const cardsWon = ref([]);

  const resultMessage = ref('0');
  const counter = ref(0);
  
  const gameStarted = ref(false);
  const gameFinished = ref(false);
  
  const timer = ref(0);
  const timerInterval = ref(null);
  
  const cols = ref();
  const rows = ref();
  
  gameStore.hintsUsed = 0; // Reinicia o contador de dicas
  gameStore.hintPairsRevealed = [];

  
  const hidden = new URL('@/assets/img/icon/hidden.png', import.meta.url).href;

  // Game data for backend
  const gameData = ref({
    total_time: 0,
    total_turns_winner: 0,
    board_id: isMockMode.value ? 4 : boardId,
  });



  // Initialize cards
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

  const mockCards = [
  { name: '0', img: new URL('@/assets/img/icon/0.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '0', img: new URL('@/assets/img/icon/0.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '1', img: new URL('@/assets/img/icon/1.png', import.meta.url).href, isFlipped: false, isMatched: false },
  { name: '1', img: new URL('@/assets/img/icon/1.png', import.meta.url).href, isFlipped: false, isMatched: false },
];


  const getBoard = async () => {
    try {
      const response = await axios.post('/board', {id: boardId} );
      cols.value = response.data.board_cols;
      rows.value = response.data.board_rows;
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  const startTimer = () => {
    timer.value = 0;
    timerInterval.value = setInterval(() => {
      timer.value++;
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerInterval.value);
  };


  // Generate the cards based on board dimensions
  const generateCards = () => {

    if (isMockMode.value) {
    cards.value = mockCards; // Use as cartas fixas para mock mode
    } else {
    const totalCards = cols.value * rows.value;
    const requiredPairs = Math.floor(totalCards / 2);

    if (requiredPairs > initialCards.value.length) {
      console.error("Not enough unique cards to generate the board!");
      return;
    }

    const shuffledInitialCards = [...initialCards.value].sort(() => Math.random() - 0.5);
    const cardsToUse = shuffledInitialCards.slice(0, requiredPairs);
    cards.value = [...cardsToUse, ...cardsToUse.map(card => ({ ...card }))].sort(() => Math.random() - 0.5);
    }
  };

  // Card flip logic
  const flipCard = (index) => {
  // Prevent interaction if the board is locked
  if (lockBoard.value) return;

  const card = cards.value[index];
  
  // Prevent flipping an already flipped or matched card
  if (card.isFlipped || card.isMatched) return;

  // Start the game timer on the first flip
  if (!gameStarted.value) {
    gameStarted.value = true;
    startTimer();
  }

  // Flip the selected card
  card.isFlipped = true;
  cardsChosen.value.push(card.name);
  cardsChosenId.value.push(index);

  // Check for a match when two cards are flipped
  if (cardsChosen.value.length === 2) {
    lockBoard.value = true; // Lock the board during the check
    setTimeout(() => checkForMatch(), 500); // Delay to show the second flipped card
    counter.value++;
  }
};

  // Check for a match
  const checkForMatch = () => {
  const [optionOneId, optionTwoId] = cardsChosenId.value;
  const [optionOneName, optionTwoName] = cardsChosen.value;

  if (optionOneName === optionTwoName) {
    // Cards match: Mark them as matched
    cards.value[optionOneId].isMatched = true;
    cards.value[optionTwoId].isMatched = true;
    cardsWon.value.push(cardsChosen.value);

    // Unlock the board immediately after a match
    lockBoard.value = false;
  } else {
    // Cards do not match: Flip them back after `lockDuration`
    setTimeout(() => {
      cards.value[optionOneId].isFlipped = false;
      cards.value[optionTwoId].isFlipped = false;
      lockBoard.value = false; // Unlock the board after the delay
    }, lockDuration);
  }

  // Reset chosen cards
  cardsChosen.value = [];
  cardsChosenId.value = [];
  
  // If the game is finished, update the message
  updateResultMessage();
};

  // Update result message and end game
  const updateResultMessage = () => {
    if (cardsWon.value.length === cards.value.length / 2) {
      resultMessage.value = 'Congratulations! You found all the pairs!';
      stopTimer(); // Stop the timer
      gameStore.sendGameData(gameData.value, timer.value, counter.value);
      gameFinished.value = true;
    } else {
      resultMessage.value = cardsWon.value.length;
    }
  };


  const lockInteraction = () => {
  isLocked.value = true;

  // Clear any existing lock timeout
  if (lockTimeout) clearTimeout(lockTimeout);

  // Set a new lock timeout
  lockTimeout = setTimeout(() => {
    lockBoard.value = false; // Unlock after the duration
  }, lockDuration);
};

  onMounted( async () => {
    await getBoard();
    generateCards();
  });


  const playAgain = () => {
  cards.value.forEach(card => {
    card.isFlipped = false;
    card.isMatched = false;
  });

  cards.value = [];
  cardsChosen.value = [];
  cardsChosenId.value = [];
  cardsWon.value = [];
  resultMessage.value = '0';
  counter.value = 0;
  timer.value = 0;
  gameFinished.value = false;
  gameStarted.value = false;

  // Reseta as dicas
  gameStore.hintsUsed = 0; // Reinicia o contador de dicas
  gameStore.hintPairsRevealed = []; // Limpa os pares revelados por dicas

  // Gera novas cartas
  generateCards();
};

const goToHome = () => {
  window.location.href = '/';
};
</script>


<template>
  <div class="text">
    <h3>Pares encontrados: <span>{{ resultMessage }}</span></h3>
    <h3>Número de jogadas: <span>{{ counter }}</span></h3>
    <h3>Tempo decorrido: <span>{{ timer }}</span>s</h3>

    <div class="board" :style="`grid-template-columns: repeat(${cols}, 1fr); grid-template-rows: repeat(${rows}, auto);`">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="card"
        :class="card.isFlipped ? 'flipped' : 'card'" 
        @click="flipCard(index)"
      >
        <img :src="card.isFlipped || card.isMatched ? card.img : hidden" />
      </div>
    </div>

    <div v-if="authStore.user" class="hint-container">
      <button 
        class="hint-button" 
        @click="gameStore.useHint(cards)" 
        :disabled="gameStore.hintsUsed >= gameStore.maxHints || storeCoins.getCoins < 1">
        Comprar Dica ({{ gameStore.maxHints - gameStore.hintsUsed }} restantes)
      </button>
    </div>

    <div v-if="gameFinished" class="button-container">
      <button class="dashboard-button" @click="playAgain">Jogar Novamente</button>
      <button class="dashboard-button" @click="goToHome">Voltar ao Início</button>
    </div>
  </div>
</template>

<style scoped>


.text {
  background-color: #121212 !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 10px;
    color: var(--foreground);
    text-align: center;
}

.board {
  padding-top: 20px;
  padding-bottom: 20px;
  display: grid;
  gap: 5px;
  width: 50%;
  max-width: 400px;
  justify-content: center;
  align-content: center;
}

.card img {
  width: 100%;
  height: auto;
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.card img:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.4);
}

h3 {
  margin: 10px 0;
  color: var(--primary); /* Cor do tema */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.button-container {
  padding-top: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.dashboard-button {
  background: linear-gradient(145deg, #3944BC, #283593);
  color: var(--primary-foreground); /* Texto claro */
  font-size: 1rem;
  padding: 10px 20px;
  border: 2px solid #5763D6;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
}

.dashboard-button:hover {
  background: linear-gradient(145deg, #283593, #1A237E);
  transform: translateY(-2px);
}

.hint-container {
  margin-top: 20px;
  text-align: center;
}

.hint-button {
  background: linear-gradient(145deg, #4CAF50, #45A049);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
}

.hint-button:disabled {
  background-color: #555;
  color: #aaa;
  cursor: not-allowed;
  border: 2px solid #444;
}

.hint-button:hover:not(:disabled) {
  background: linear-gradient(145deg, #45A049, #388E3C);
}

@media (max-width: 768px) {
  .board {
    width: 90%;
  }

  .card img {
    width: 80%;
  }

  .dashboard-button,
  .hint-button {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
}
</style>
