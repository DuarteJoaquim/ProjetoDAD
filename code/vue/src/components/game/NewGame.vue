<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCoinsStore } from '@/stores/coins';

const router = useRouter();
const storeAuth = useAuthStore();
const storeCoins = useCoinsStore();

// State
const isOpen = ref(false);
const boards = ref([]);
const selectedBoard = ref(null);

// Fetch boards from backend API
const fetchBoards = async () => {
  try {
    const bool = ref(storeAuth.user == null);
    const response = await axios.get('/boards', {
      params: { bool: bool.value },
    });
    boards.value = response.data.filter((board) => board.id !== 4);
  } catch (error) {
    console.error('Error fetching boards:', error);
  }
};

// Dropdown methods
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectBoard = (board) => {
  selectedBoard.value = board;
  isOpen.value = false;
};

// Start game method
const startGame = () => {
  if (!selectedBoard.value) return;

  if (selectedBoard.value.id !== 1) {
    if (storeCoins.gameCoins < 1) {
      alert('Insufficient coins to start this game.');
      return;
    }
    storeCoins.spendCoins(1);
  }

  router.push({
    name: 'game',
    query: { boardId: selectedBoard.value.id },
  });
};

onMounted(fetchBoards);
</script>

<template>
  <div class="game-new-container">
    <h1 class="title">New Game</h1>

    <!-- Dropdown -->
    <div class="dropdown">
      <button class="dropdown-button" @click="toggleDropdown">
        {{ selectedBoard ? `Board ${selectedBoard.board_cols}x${selectedBoard.board_rows}` : 'Select a Board' }}
      </button>
      <div v-if="isOpen" class="dropdown-menu">
        <button
          v-for="board in boards"
          :key="board.id"
          class="dropdown-item"
          @click="selectBoard(board)"
        >
          Board {{ board.board_cols }}x{{ board.board_rows }}
        </button>
      </div>
    </div>

    <!-- Start Game Button -->
    <div class="start-game-container">
      <button
        class="start-game-button"
        :disabled="!selectedBoard"
        @click="startGame"
      >
        Start Game
      </button>
    </div>
  </div>
</template>

<style scoped>
.game-new-container {
  background-color: #121212 !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 10px;
  background-color: var(--background); /* Fundo ajustado com tema */
  color: var(--foreground);
  text-align: center;
}

.title {
  font-size: 2.2rem;
  color: var(--primary); /* Cor principal */
  margin-bottom: 40px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.dropdown {
  position: relative;
  width: 300px;
  max-width: 90%;
}

.dropdown-button {
  width: 100%;
  background: linear-gradient(145deg, #2C3E50, #1A1A2E); /* Gradiente dark */
  color: var(--primary-foreground);
  padding: 12px 20px;
  border: 2px solid #3944BC;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.dropdown-button:hover {
  background: linear-gradient(145deg, #1A1A2E, #121212);
  border-color: #5763D6;
}

.dropdown-menu {
  position: absolute;
  top: 110%;
  left: 0;
  right: 0;
  background-color: slategray;
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  z-index: 1000;
}

.dropdown-item {
  padding: 12px 20px;
  text-align: center;
  border-bottom: 1px solid var(--muted-foreground);
  background: none;
  font-size: 1rem;
  color: var(--foreground);
  cursor: pointer;
  transition: background-color 0.3s;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: rgb(2, 4, 5, 0.5);
}

.start-game-container {
  margin-top: 20px;
  width: 300px;
  max-width: 90%;
}

.start-game-button {
  width: 100%;
  background: linear-gradient(145deg, #3944BC, #283593);
  color: var(--primary-foreground);
  padding: 14px 20px;
  border: 2px solid #5763D6;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.start-game-button:disabled {
  background-color: #555;
  color: #aaa;
  border-color: #444;
  cursor: not-allowed;
}

.start-game-button:hover:not(:disabled) {
  background: linear-gradient(145deg, #283593, #1A237E);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .dropdown-button,
  .start-game-button {
    font-size: 1rem;
    padding: 10px 16px;
  }

  .title {
    font-size: 1.8rem;
  }

  .dropdown-item {
    font-size: 0.9rem;
  }
}
</style>
