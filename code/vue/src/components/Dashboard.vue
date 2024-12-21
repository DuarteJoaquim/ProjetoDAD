<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const storeAuth = useAuthStore();

// Navegação para diferentes páginas
const goToNewGame = () => {
  router.push({ name: 'newGame' });
};

const goToGameHistory = () => {
  router.push({ name: 'gameHistory' });
};

const goToScoreboard = () => {
  router.push({ name: 'scoreboard' });
};

const goToCoins = () => {
  router.push({ name: 'coins' });
};

const goToLobby = () => {
  router.push({ name: "lobby" });
};

<<<<<<< HEAD
const goToGeneralStatistics = () => {
  router.push({ name: "generalStatistics" });
};

=======
// Navegação para o painel do administrador
const goToAdminDashboard = () => {
  router.push({ name: 'admin' });
};

// Verificação se o utilizador é admin
const isAdmin = () => storeAuth.user?.type === 'A'; // Verifica se o tipo de utilizador é 'A' (Admin)

>>>>>>> eee742ff3bd85c96fc9a01a0a3bb1ddc9faf4d63
</script>

<template>
  <div class="dashboard">
    <h1 class="title">Memory Game</h1>
    <div class="button-container">
      <button v-if="!isAdmin()" class="dashboard-button" @click="goToNewGame">New Game</button>
      <button v-if="storeAuth.user && !isAdmin()" class="dashboard-button" @click="goToLobby">
        Multiplayer (Lobby)
      </button>
      <button v-if="storeAuth.user && !isAdmin()" class="dashboard-button" @click="goToGameHistory">
        Game History
      </button>
      <button class="dashboard-button" @click="goToScoreboard">
        Scoreboard
      </button>
      <button v-if="storeAuth.user && !isAdmin()" class="dashboard-button" @click="goToCoins">
        Coins
      </button>
<<<<<<< HEAD
      <!-- Botão para Estatísticas Gerais -->
      <button class="dashboard-button" @click="goToGeneralStatistics">
        General Statistics
=======
      <!-- Botão para o Admin Dashboard -->
      <button
        v-if="isAdmin()"
        class="dashboard-button admin-button"
        @click="goToAdminDashboard"
      >
        Admin Dashboard
>>>>>>> eee742ff3bd85c96fc9a01a0a3bb1ddc9faf4d63
      </button>
    </div>
  </div>
</template>


<style scoped>
.dashboard {
  background-color: #121212 !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  text-align: center;
  background-color: var(--background); /* Tema dark */
  color: var(--foreground);
  box-sizing: border-box;
}

.title {
  font-size: 2.5rem;
  color: var(--primary); /* Cor principal */
  margin-bottom: 40px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.button-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.dashboard-button {
  background: linear-gradient(145deg, #2C3E50, #1A1A2E); /* Gradiente escuro */
  color: #EAEAEA; /* Texto claro */
  font-size: 1.2rem;
  padding: 12px 20px;
  border: 2px solid #3944BC; /* Borda para destaque */
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  flex: 0 0 calc(50% - 20px);
  max-width: 200px;
  font-weight: bold;
}

.dashboard-button:hover {
  background: linear-gradient(145deg, #1A1A2E, #121212); /* Gradiente mais escuro */
  color: #ffffff;
  border-color: #5763D6; /* Azul vibrante no hover */
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.5);
  transform: translateY(-3px);
}

.dashboard-button:active {
  transform: translateY(1px);
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.4);
}

@media (max-width: 768px) {
  .dashboard {
    justify-content: flex-start;
    padding-top: 35%;
  }

  .title {
    font-size: 2rem;
    margin-bottom: 20px;
  }

  .dashboard-button {
    flex: 0 0 90%;
    max-width: 100%;
    font-size: 1rem;
  }
}
</style>
