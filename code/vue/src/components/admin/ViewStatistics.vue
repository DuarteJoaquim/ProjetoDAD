<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'vue-chartjs';

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const authStore = useAuthStore();
const isAdmin = ref(authStore.user?.role === 'admin');

// Dados reativos
const stats = ref({
  totalPlayers: 0,
  totalGames: 0,
  gamesLastWeek: 0,
  gamesLastMonth: 0,
  purchasesByPlayer: {},
});
const error = ref(null);

// Configuração inicial dos gráficos
const gameStatsData = ref({
  labels: [],
  datasets: [
    {
      label: 'Games Played by Week',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      data: [],
    },
  ],
});

const purchaseStatsData = ref({
  labels: [],
  datasets: [
    {
      label: 'Purchases by Player',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      data: [],
    },
  ],
});

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: 'white',
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: 'white',
      },
    },
    y: {
      ticks: {
        color: 'white',
      },
    },
  },
};

// Função para buscar dados estatísticos
const fetchStatistics = async () => {
  try {
    error.value = null;
    const response = await axios.get('/api/admin/statistics', {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    const data = response.data;

    stats.value = {
      totalPlayers: data.total_players,
      totalGames: data.total_games,
      gamesLastWeek: data.games_last_week,
      gamesLastMonth: data.games_last_month,
      purchasesByPlayer: data.purchases_by_player,
    };

    // Atualiza os gráficos
    gameStatsData.value.labels = data.games_by_week?.labels || [];
    gameStatsData.value.datasets[0].data = data.games_by_week?.data || [];

    purchaseStatsData.value.labels = Object.keys(data.purchases_by_player || {});
    purchaseStatsData.value.datasets[0].data = Object.values(data.purchases_by_player || {});
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred while fetching statistics.';
  }
};

// Busca os dados ao montar o componente
onMounted(fetchStatistics);
</script>

<template>
  <div class="view-container">
    <h1>Statistics</h1>

    <!-- Exibição de erro -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Estatísticas textuais -->
    <div class="stats-text">
      <p><strong>Total Players:</strong> {{ stats.totalPlayers }}</p>
      <p><strong>Total Games:</strong> {{ stats.totalGames }}</p>
      <p><strong>Games Last Week:</strong> {{ stats.gamesLastWeek }}</p>
      <p><strong>Games Last Month:</strong> {{ stats.gamesLastMonth }}</p>
    </div>

    <!-- Gráfico de jogos por semana -->
    <div class="chart-container">
      <h3>Games Played by Week</h3>
      <Bar :data="gameStatsData" :options="chartOptions" />
    </div>

    <!-- Estatísticas para administradores -->
    <div v-if="isAdmin" class="admin-stats">
      <h3>Purchases by Player</h3>
      <Bar :data="purchaseStatsData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.view-container {
  background-color: #121212;
  color: white;
  padding: 20px;
  min-height: 100vh;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.stats-text {
  margin: 20px 0;
  font-size: 1.2rem;
  text-align: left;
}

.stats-text p {
  margin: 5px 0;
}

.chart-container {
  margin: 20px 0;
}

.admin-stats {
  margin-top: 40px;
}

.error {
  color: red;
  margin-bottom: 20px;
  font-weight: bold;
}
</style>
