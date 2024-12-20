<script setup>
import { ref } from 'vue';
import axios from 'axios';

// Dados reativos
const games = ref([]);
const pagination = ref({});
const error = ref(null);

// Filtros reativos
const typeFilter = ref('all'); // Filtro por tipo
const statusFilter = ref('all'); // Filtro por status

// Função para buscar os jogos
const fetchGames = async (url = '/admin/all-games') => {
  try {
    error.value = null; // Limpa erros anteriores

    // Adiciona os filtros como parâmetros na URL
    const params = {};
    if (typeFilter.value !== 'all') params.type = typeFilter.value;
    if (statusFilter.value !== 'all') params.status = statusFilter.value;

    const response = await axios.get(url, { params });
    const { data, current_page, last_page, per_page, next_page_url, prev_page_url } = response.data;

    games.value = data;
    pagination.value = { current_page, last_page, per_page, next_page_url, prev_page_url };
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred while fetching games.';
  }
};

// Função para definir o filtro por tipo
const setTypeFilter = (type) => {
  typeFilter.value = type;
  fetchGames(); // Atualiza os jogos com o filtro
};

// Função para definir o filtro por status
const setStatusFilter = (status) => {
  statusFilter.value = status;
  fetchGames(); // Atualiza os jogos com o filtro
};

// Detalhes do jogo
const viewGameDetails = (game) => {
  console.log('Game details:', game);
};

// Buscar os jogos na montagem do componente
fetchGames();
</script>



<template>
    <div class="view-container">
      <h1>View All Games</h1>
  
      <!-- Exibição de erro, se houver -->
      <div v-if="error" class="error">{{ error }}</div>

      <!-- Botões de Filtro -->
    <div class="filter-container">
      <div class="filter-group">
        <h3>Filter by Type</h3>
        <button 
          class="filter-button" 
          :class="{ active: typeFilter === 'all' }" 
          @click="setTypeFilter('all')"
        >
          All Types
        </button>
        <button 
          class="filter-button" 
          :class="{ active: typeFilter === 'S' }" 
          @click="setTypeFilter('S')"
        >
          Single Player
        </button>
        <button 
          class="filter-button" 
          :class="{ active: typeFilter === 'M' }" 
          @click="setTypeFilter('M')"
        >
          Multiplayer
        </button>
      </div>

      <div class="filter-group">
        <h3>Filter by Status</h3>
        <button 
          class="filter-button" 
          :class="{ active: statusFilter === 'all' }" 
          @click="setStatusFilter('all')"
        >
          All Statuses
        </button>
        <button 
          class="filter-button" 
          :class="{ active: statusFilter === 'E' }" 
          @click="setStatusFilter('E')"
        >
          Ended
        </button>
        <button 
          class="filter-button" 
          :class="{ active: statusFilter === 'PE' }" 
          @click="setStatusFilter('PE')"
        >
          Pending
        </button>
        <button 
          class="filter-button" 
          :class="{ active: statusFilter === 'I' }" 
          @click="setStatusFilter('I')"
        >
          In Progress
        </button>
      </div>
    </div>
  
      <!-- Tabela de jogos -->
      <table v-if="games.length">
        <thead>
          <tr>
            <th>Game ID</th>
            <th>Type</th>
            <th>Creator</th>
            <th>Winner</th>
            <th>Status</th>
            <th>Board</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="game in games" :key="game.id">
            <td>{{ game.id }}</td>
            <td>{{ game.type }}</td>
            <td>{{ game.creator_nickname }}</td>
            <td>{{ game.winner_nickname }}</td>
            <td>{{ game.status }}</td>
            <td>{{ game.board.cols }}x{{ game.board.rows }}</td>
            <td>
              <button @click="viewGameDetails(game)">Details</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Mensagem caso não haja jogos -->
      <div v-else>No games found</div>
  
      <!-- Paginação -->
      <div class="pagination">
        <button :disabled="!pagination.prev_page_url" @click="fetchGames(pagination.prev_page_url)">Previous</button>
        <span>Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
        <button :disabled="!pagination.next_page_url" @click="fetchGames(pagination.next_page_url)">Next</button>
      </div>
    </div>
  </template>
  
  
  
  <style scoped>
.view-container {
  background-color: var(--background); /* Cor de fundo */
  color: var(--foreground); /* Cor do texto */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
}

h1 {
  font-size: 2.5rem;
  color: var(--primary); /* Cor principal */
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); /* Adiciona contraste */
}

table {
  width: 100%;
  max-width: 1200px;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Adiciona uma sombra */
  background-color: var(--card-background); /* Fundo da tabela */
}

thead {
  background-color: var(--primary-dark); /* Fundo do cabeçalho */
  color: #ffffff; /* Texto branco para contraste */
}

thead th {
  padding: 15px;
  text-align: left;
  font-size: 1.2rem;
  border-bottom: 2px solid var(--primary); /* Linha de separação */
}

tbody tr {
  transition: background-color 0.3s ease;
}

tbody tr:nth-child(even) {
  background-color: var(--background-light); /* Alterna cores */
}

tbody tr:hover {
  background-color: var(--primary-light); /* Realça ao passar o mouse */
  cursor: pointer;
}

td {
  padding: 15px;
  font-size: 1rem;
  color: var(--foreground); /* Garante contraste */
  border-bottom: 1px solid var(--background-dark);
}

button {
  background: linear-gradient(145deg, #2C3E50, #1A1A2E);
  color: #ffffff; /* Cor do texto do botão */
  padding: 8px 12px;
  font-size: 1rem;
  border: 2px solid var(--primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

button:hover {
  background: linear-gradient(145deg, var(--primary-dark), var(--primary-light));
  color: var(--background); /* Garante contraste */
  transform: translateY(-2px);
}

button:active {
  transform: translateY(1px);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.pagination {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 16px;
  font-size: 1rem;
  color: #ffffff; /* Cor do texto */
  background-color: var(--primary-dark); /* Fundo do botão */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination button:hover {
  background-color: var(--primary-light);
}

.error {
  color: red;
  margin-top: 10px;
  font-size: 1.2rem;
}

div, table, td, th {
  color: #000 !important;
  opacity: 1 !important;
  filter: none !important; /* Remove filtros como blur */
}
</style>