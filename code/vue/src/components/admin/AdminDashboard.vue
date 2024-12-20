<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter();
const storeAuth = useAuthStore();

const goToManageUsers = () => {
  router.push({ name: 'manageUsers' });
};

const goToAdminStats = () => {
  router.push({ name: 'adminStats' });
};

const goToCreateAdmin = () => {
  router.push({ name: 'createAdmin' });
};

const goToViewAllGames = () => {
  router.push({ name: 'viewAllGames' });
};

const goToViewAllTransactions = () => {
  router.push({ name: 'viewAllTransactions' });
};

</script>



<template>
    <div class="dashboard">
      <h1 class="title">Admin Dashboard</h1>
      <div class="button-container">
        <button class="dashboard-button" @click="goToManageUsers">
          Manage Users
        </button>
        <button class="dashboard-button" @click="goToViewAllGames">
          View All Games
        </button>
        <button class="dashboard-button" @click="goToViewAllTransactions">
          View All transactions
        </button>
        <button class="dashboard-button" @click="goToAdminStats">
          View Statistics
        </button>
        <button class="dashboard-button" @click="goToCreateAdmin">
          Create Admin
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
  justify-content: center; /* Alinha verticalmente no centro */
  width: 100%;
  height: 100vh; /* Garante que ocupa a altura total da janela */
  margin: 0;
  padding: 20px;
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
  display: grid; /* Usa grid para alinhar os botões */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Ajusta dinamicamente o número de colunas */
  gap: 20px; /* Espaçamento entre os botões */
  width: 100%; /* Ocupa a largura completa */
  max-width: 800px; /* Limite máximo para o container */
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
  font-weight: bold;
  text-align: center;
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
    padding-top: 10%; /* Ajusta em telas menores */
  }

  .title {
    font-size: 2rem;
    margin-bottom: 20px;
  }

  .button-container {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* Ajusta para botões menores */
  }

  .dashboard-button {
    font-size: 1rem;
    padding: 10px 16px;
  }
}
</style>

  