<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'
// Dados reativos
const games = ref([]);
const pagination = ref({});
const error = ref(null);
const router = useRouter();

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

// Função para voltar para a página anterior
const goBack = () => {
  router.back(); // Usa o histórico do navegador para voltar
};

// Buscar os jogos na montagem do componente
fetchGames();
</script>



<template>
    <div class="view-container">
        <!-- Botão para voltar -->
        <button class="back-button" @click="goBack">Back</button>
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
     <div class="table-container">  
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
    </div>
  </template>
  
  
  <style scoped>
  .view-container {
    background-color: #121212 !important;
    color: var(--foreground);
    padding: 20px;
    min-height: 100vh;
    text-align: center;
  }
  
  h1 {
    font-size: 3.5rem;
    margin-bottom: 20px;
  }

  th, td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
  }
  
  .back-button {
    padding: 5px 10px;
    background: linear-gradient(145deg, #2b0606, #e74c3c);
    color: #fff;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }
  
  .back-button:hover {
    background: linear-gradient(145deg, #c0392b, #e74c3c);
    transform: translateY(-2px);
  }
  
  .filter-button {
    padding: 10px 20px;
    background: linear-gradient(145deg, #5763D6, #3944BC);
    color: white;
    font-size: 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .filter-button:hover {
    background: linear-gradient(145deg, #151e7c, #5763D6);
    transform: translateY(-2px);
  }
  
  .filter-button.active {
    background: linear-gradient(145deg, #151e7c, #000000);
    color: white;
    font-weight: bold;
  }
  
  .filter-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .filter-group {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: #121212 !important;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  thead th {
    padding: 10px;
    background: linear-gradient(145deg, #3944BC, #5763D6);
    color: white;
    text-transform: uppercase;
  }
  
  tbody tr:nth-child(even) {
    background-color: #ffffff00 !important;
  }
  
  tbody tr:nth-child(odd) {
    background: #000000;
  }
  
  tbody td {
    padding: 10px;
    text-align: center;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    gap: 20px;
  }
  
  .pagination-button {
    background: linear-gradient(145deg, #2C3E50, #1A1A2E);
    color: #EAEAEA;
    font-size: 1rem;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }
  
  .pagination-button:disabled {
    background: #bbb;
    color: #666;
    cursor: not-allowed;
  }
  
  .pagination-button:hover:not(:disabled) {
    background: linear-gradient(145deg, #1A1A2E, #121212);
    transform: translateY(-3px);
  }
  
  .pagination span {
    font-weight: bold;
    color: var(--foreground);
  }
  
  /* Responsividade */
  @media (max-width: 768px) {
    .filter-group {
      flex-direction: column;
    }
     
    .table-container {
      overflow-x: auto;
    }
  
    table {
      font-size: 0.9rem;
    }
  
    .pagination {
      flex-direction: column;
      gap: 10px;
    }
  }
  
  </style>
  
    