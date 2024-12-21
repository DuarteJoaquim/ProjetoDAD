<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const stats = ref(null); // Armazena as estatísticas globais
const error = ref(null); // Armazena erros, caso existam
const loading = ref(true); // Controla o estado de carregamento

// Função para buscar estatísticas globais
const fetchGlobalStats = async () => {
  try {
    error.value = null; // Limpa erros anteriores
    loading.value = true; // Inicia o estado de carregamento

    const response = await axios.get("stats/global");
    stats.value = response.data;

    console.log("Estatísticas globais carregadas:", response.data);
  } catch (err) {
    console.error("Erro ao buscar estatísticas globais:", err);
    error.value = "Erro ao carregar estatísticas.";
  } finally {
    loading.value = false; // Finaliza o estado de carregamento
  }
};

// Chama a função ao montar o componente
onMounted(() => {
  fetchGlobalStats();
});
</script>

<template>
  <div class="stats-container">
    <h1>Estatísticas Gerais</h1>

    <!-- Exibe mensagem de erro se houver -->
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Exibe mensagem de carregamento enquanto os dados não estão disponíveis -->
    <p v-else-if="loading">Carregando...</p>

    <!-- Exibe as estatísticas quando disponíveis -->
    <div v-else>
      <div class="stat">
        <p>Total de Jogadores: <strong>{{ stats.totalPlayers }}</strong></p>
      </div>
      <div class="stat">
        <p>Total de Jogos: <strong>{{ stats.totalGames }}</strong></p>
      </div>
      <div class="stat">
        <p>Jogos na Última Semana: <strong>{{ stats.gamesLastWeek }}</strong></p>
      </div>
      <div class="stat">
        <p>Jogos no Último Mês: <strong>{{ stats.gamesLastMonth }}</strong></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-container {
  max-width: 600px;
  margin: auto;
  text-align: center;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.stat {
  margin: 15px 0;
  font-size: 1.2rem;
  color: #333;
}

h1 {
  font-size: 2rem;
  color: #3944bc;
  margin-bottom: 20px;
}

.error {
  color: red;
  font-weight: bold;
  margin-top: 20px;
}
</style>
