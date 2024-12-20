<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const games = ref([]);
  
  const fetchGames = async () => {
    const response = await axios.get('/api/admin/games');
    games.value = response.data;
  };
  
  const viewGameDetails = (game) => {
    console.log('Game details:', game);
  };
  
  onMounted(fetchGames);
  </script>
  
<template>
    <div class="view-container">
      <h1>View All Games</h1>
  
      <!-- Botões de Filtro -->
      <div class="filter-buttons">
        <button 
          class="filter-button" 
          :class="{ active: filter === 'all' }"
          @click="setFilter('all')"
        >
          All Games
        </button>
        <button 
          class="filter-button" 
          :class="{ active: filter === 'single' }"
          @click="setFilter('single')"
        >
          Single Player
        </button>
        <button 
          class="filter-button" 
          :class="{ active: filter === 'multi' }"
          @click="setFilter('multi')"
        >
          Multiplayer
        </button>
      </div>
  
      <!-- Tabela de Jogos -->
      <table>
        <thead>
          <tr>
            <th>Game ID</th>
            <th>Type</th>
            <th>Players</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="game in filteredGames" :key="game.id">
            <td>{{ game.id }}</td>
            <td>{{ game.type }}</td>
            <td>{{ game.players.join(', ') }}</td>
            <td>{{ game.status }}</td>
            <td>
              <button @click="viewGameDetails(game)">Details</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  
  <style scoped>
.view-container {
  background-color: var(--background); /* Tema escuro */
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
  color: var(--primary);
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

table {
  width: 100%;
  max-width: 1200px;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: var(--card-background); /* Fundo similar aos cards */
}

thead {
  background-color: var(--primary-dark); /* Cabeçalho com cor de destaque */
  color: var(--foreground-light);
}

thead th {
  padding: 15px;
  text-align: left;
  font-size: 1.2rem;
  border-bottom: 2px solid var(--primary);
}

tbody tr {
  transition: background-color 0.3s ease;
}

tbody tr:nth-child(even) {
  background-color: var(--background-light); /* Alterna as cores */
}

tbody tr:hover {
  background-color: var(--primary-light);
  cursor: pointer;
}

td {
  padding: 15px;
  font-size: 1rem;
  border-bottom: 1px solid var(--background-dark);
}

button {
  background: linear-gradient(145deg, #2C3E50, #1A1A2E);
  color: #ffffff;
  padding: 8px 12px;
  font-size: 1rem;
  border: 2px solid var(--primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

button:hover {
  background: linear-gradient(145deg, var(--primary-dark), var(--primary-light));
  color: var(--background);
  transform: translateY(-2px);
}

button:active {
  transform: translateY(1px);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  table {
    font-size: 0.9rem;
  }

  thead th,
  td {
    padding: 10px;
  }

  h1 {
    font-size: 2rem;
  }

  button {
    font-size: 0.9rem;
    padding: 6px 10px;
  }
}
</style>

  