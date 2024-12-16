<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  const games = ref([]);
  const currentPage = ref(1);
  const lastPage = ref(1);

  const fetchGames = async (page = 1) => {
    if (page < 1 || page > lastPage.value) return;

    try {
      const response = await axios.get(`/game/gamehistory?page=${page}`);
      console.log(response.data);
      games.value = response.data.data;
      currentPage.value = response.data.current_page;
      lastPage.value = response.data.last_page;
    } catch (error) {
      console.error("Erro ao buscar o histórico de jogos", error);
    }
  };

  fetchGames();
  
</script>


<template>
  <div class="game-history-container">
    <br>
    <h1>Histórico de Jogos</h1>
    <table>
      <thead>
        <tr>
          <th>ID do Jogo</th>
          <th>Status</th>
          <th>Number of turns</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="game in games" :key="game.id">
          <td>{{ game.id }}</td>
          <td>{{ game.status }}</td>
          <td>{{ game.num_turns }}</td>
          <td>{{ game.created_at }}</td>
        </tr>
      </tbody>
    </table>
    <div class="pagination-controls">
      <button class="gameHistory-button" @click="fetchGames(currentPage - 1)" :disabled="currentPage === 1">
        Anterior
      </button>
      <span>Página {{ currentPage }} de {{ lastPage }}</span>
      <button class="gameHistory-button" @click="fetchGames(currentPage + 1)" :disabled="currentPage === lastPage">
        Próxima
      </button>
    </div>
  </div>
</template>


<style scoped>
  .game-history-container {
    margin-left: 20px;
    margin-right: 20px;
    color: #333;
    background-color: #fff;
  }

  h1 {
    margin-bottom: 30px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
    color: #333;
  }

  th {
    background-color: #f4f4f4;
    color: #333;
  }

  button {
    padding: 8px 16px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  span {
    font-size: 1rem;
  }

  .pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
  }

  .gameHistory-button {
    background-color: #31485A;
    color: #ffffff;
    font-size: 1rem;
    padding: 8px 16px;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  }

  .gameHistory-button:hover {
    background-color: #253544;
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.3);
    transform: translateY(-2px);
  }

  .gameHistory-button:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  span {
    font-size: 1.2rem;
    color: #31485A;
  }
</style>
