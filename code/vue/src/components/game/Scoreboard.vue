<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useAuthStore } from '@/stores/auth'
  import { useRouter } from 'vue-router'

  const router = useRouter();
  const storeAuth = useAuthStore();


  // SinglePlayer Scoreboard Data
  const globalScores = ref({});
  const personalScores = ref([]);

  // Multiplayer Scoreboard Data
  const globalMultiplayerScores = ref({});

  const personalMultiplayerScores = ref({ victories: 0, losses: 0 });

  console.log("Global Multiplayer Scores:", globalMultiplayerScores.value);


// Fetch Personal Multiplayer Scoreboard
const fetchPersonalMultiplayerScores = async () => {
  try {
    const response = await axios.get('/scoreboard/multiplayer/personal');
    personalMultiplayerScores.value = response.data;
  } catch (error) {
    console.error('Error fetching Personal Multiplayer Scoreboard:', error);
  }
};


  // Função para buscar o scoreboard multiplayer por tamanho de tabuleiro
const fetchGlobalMultiplayerScores = async (cols, rows) => {
  try {
    const response = await axios.get(`/scoreboard/multiplayer?cols=${cols}&rows=${rows}`);
    globalMultiplayerScores.value[`${cols}x${rows}`] = response.data; // Armazena os dados com a chave "colsxrows"
  } catch (error) {
    console.error(`Error fetching Global Multiplayer Scoreboard for ${cols}x${rows}:`, error);
  }
};


  // Fetch Personal Scoreboard Data
  const fetchPersonalScores = async () => {
    try {
      const response = await axios.get('/scoreboard/personal', {id: storeAuth.user.id});
      console.log("Personal Scores:", response.data);
      personalScores.value = response.data;
    } catch (error) {
      console.error("Error fetching Personal Scoreboard data", error);
    }
  };

  // Fetch Global Scoreboard Data
  // Função genérica para buscar o scoreboard
const fetchGlobalScores = async (cols, rows) => {
  try {
    const response = await axios.get(`scoreboard?cols=${cols}&rows=${rows}`);
    globalScores.value[`${cols}x${rows}`] = response.data; // Armazena os dados usando "colsxrows" como chave
  } catch (error) {
    console.error(`Error fetching Global Scoreboard data for ${cols}x${rows}`, error);
  }
};

const loadAllGlobalScores = async () => {
  // Carregar Singleplayer
  await fetchGlobalScores(3, 4);
  await fetchGlobalScores(4, 4);
  await fetchGlobalScores(6, 6);

  // Carregar Multiplayer
  await fetchGlobalMultiplayerScores(3, 4);
  await fetchGlobalMultiplayerScores(4, 4);
  await fetchGlobalMultiplayerScores(6, 6);
};

  // Function to determine the medal background color based on the rank
  const getMedalStyle = (index) => {
    if (index === 0) {
      return { backgroundColor: 'gold', color: 'white' };
    } else if (index === 1) {
      return { backgroundColor: 'silver', color: 'white' };
    } else if (index === 2) {
      return { backgroundColor: '#cd7f32', color: 'white' };
    }
    return { color: 'white' };
  };

  // Função para voltar para a página anterior
  const goBack = () => {
    router.back(); // Usa o histórico do navegador para voltar
  };

  // Load data on component mount
  onMounted(() => {
    fetchPersonalScores();
    fetchPersonalMultiplayerScores();
    loadAllGlobalScores(); // Inclui a chamada de `fetchGlobalMultiplayerScores` internamente
  });
  
</script>


<template>
  <div class="scoreboard-container">
    <button class="back-button" @click="goBack">Back</button>
    <br>
    <!-- <h1>Scoreboard</h1> -->

    <hr />


    <!-- Personal Scoreboard -->
    <div v-if="storeAuth.user" class="personal-scoreboard">
      <h2>My Scoreboard</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Board Size</th>
            <th>Shortest Time</th>
            <th>Fewest Turns</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="personalScores.length === 0">
            <td colspan="4" class="no-data">No personal scores available</td>
          </tr>
          <tr v-else v-for="(score, index) in personalScores" :key="score.boardSize">
            <td :style="getMedalStyle(index)">{{ index + 1 }}</td>
            <td>{{ score.boardSize }}</td>
            <td>{{ score.bestTime }} seconds</td>
            <td>{{ score.fewestTurns }} turns</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Personal Multiplayer Scoreboard -->
<div  v-if="storeAuth.user" class="personal-multiplayer-scoreboard">
  <h2>My Multiplayer Scoreboard</h2>
  <table>
    <thead>
      <tr>
        <th>Total Victories</th>
        <th>Total Losses</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{{ personalMultiplayerScores.victories }}</td>
        <td>{{ personalMultiplayerScores.losses }}</td>
      </tr>
    </tbody>
  </table>
</div>

    <hr v-if="storeAuth.user" />

        <!-- Global Multiplayer Scoreboards -->
        <div v-if="Object.keys(globalMultiplayerScores).length > 0">
  <div v-for="(scores, boardSize) in globalMultiplayerScores" :key="boardSize" class="global-multiplayer-scoreboard">
    <h2>Global Multiplayer Leaderboard {{ boardSize }}</h2>
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Player</th>
          <th>Victories</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!scores || scores.length === 0">
          <td colspan="3" class="no-data">No multiplayer scores available for {{ boardSize }}</td>
        </tr>
        <tr v-else v-for="(score, index) in scores" :key="`${boardSize}-${index}`">
          <td :style="getMedalStyle(index)">{{ index + 1 }}</td>
          <td>{{ score.player }}</td>
          <td>{{ score.victories }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<div v-else>
  <p style="color: white;" class="no-data">No multiplayer scores available.</p>
</div>
<br>

    <!-- Global Scoreboards -->
    <div v-for="(scores, boardSize) in globalScores" :key="boardSize" class="global-scoreboard">
      <h2>Global Leaderboard {{ boardSize }}</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Player</th>
            <th>Best Time</th>
            <th>Fewest Turns</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!scores || scores.length === 0">
            <td colspan="4" class="no-data">No global scores available for {{ boardSize }}</td>
          </tr>
          <tr v-else v-for="(score, index) in scores" :key="score.player + index">
            <td :style="getMedalStyle(index)">{{ index + 1 }}</td>
            <td>{{ score.player }}</td>
            <td>{{ score.bestTime }} seconds</td>
            <td>{{ score.fewestTurns }} turns</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  
</template>


<style scoped>
  .scoreboard-container {
    background-color: #121212 !important;
    color: var(--foreground);
    padding: 20px;
    min-height: 100vh;
    text-align: center;
  }


  h1 {
    margin-bottom: 30px;
  }

  h2 {
    margin-bottom: 20px;
  }


  th, td {
    padding: 10px;
    text-align: left;
    /*border: 1px solid #ddd;*/
  }

  th {
    background-color: #f4f4f4;
  }

  .no-data {
    text-align: center;
    color: rgba(255, 255, 255, 0.486);
  }

  hr {
    margin: 40px 0;
    border: 0;
    border-top: 1px solid #ddd;
  }

  .global-multiplayer-scoreboard,
  .personal-multiplayer-scoreboard,
  .personal-scoreboard,
  .global-scoreboard {
    padding-bottom: 30px;
  }



  td {
    text-align: center;
  }

  td[style] {
    color: black;
  }

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

  
