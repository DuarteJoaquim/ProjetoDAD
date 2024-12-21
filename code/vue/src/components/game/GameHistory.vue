<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router'

  const router = useRouter();
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

  // Função para voltar para a página anterior
  const goBack = () => {
    router.back(); // Usa o histórico do navegador para voltar
  };
  
</script>


<template>
  <div class="view-container">
  <div class="game-history-container">
    <br>
    <button class="back-button" @click="goBack">Back</button>
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
</div>
</template>


<style scoped>

  .game-history-container {
    margin-left: 20px;
    margin-right: 20px;
    color: var(--foreground);
    background-color: rgba(0, 0, 0, 0);
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
    color: white;
  }

  th {
    background-color: #f4f4f4;
    color: rgb(255, 255, 255);
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
  
.view-container {
  background-color: #121212 !important;
  color: var(--foreground);
  padding: 20px;
  min-height: 100vh;
  text-align: center;
}

h1 {
  color: var(--foreground);
  font-size: 3.5rem;
  margin-bottom: 20px;
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
th, td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
  }

</style>