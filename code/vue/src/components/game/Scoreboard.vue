<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useAuthStore } from '@/stores/auth'
  import socket from "@/lib/socket";
  
  const storeAuth = useAuthStore();


  const multiplayerLeaderboard = ref([]); 

  // Personal Scoreboard Data
  const personalScores = ref([]);

  // Global Scoreboard Data
  const globalScores = ref({});



  const fetchMultiplayerLeaderboard = async () => {
    try {
      // Emitir o pedido para o leaderboard
      socket.emit("requestLeaderboard");

      // Escutar a resposta
      socket.on("receiveLeaderboard", (data) => {
        console.log("Leaderboard recebido:", data);
        multiplayerLeaderboard.value = data;
      });
    } catch (error) {
      console.error("Erro ao buscar leaderboard multiplayer:", error);
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
  await fetchGlobalScores(3, 4);
  await fetchGlobalScores(4, 4);
  await fetchGlobalScores(6, 6);
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
    return { color: 'black' };
  };

  // Load data on component mount
  onMounted(() => {
    fetchMultiplayerLeaderboard();
    fetchPersonalScores();
    loadAllGlobalScores();
  });
  
</script>


<template>
  <div class="scoreboard-container">

    <br>
    <!-- <h1>Scoreboard</h1> -->

    <!-- Multiplayer Leaderboard -->
    <div class="global-scoreboard">
      <h2>Multiplayer Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Player</th>
            <th>Wins</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="multiplayerLeaderboard.length === 0">
            <td colspan="3" class="no-data">No multiplayer scores available</td>
          </tr>
          <tr v-else v-for="(player, index) in multiplayerLeaderboard" :key="player.nickname">
            <td :style="getMedalStyle(index)">{{ index + 1 }}</td>
            <td>{{ player.nickname }}</td>
            <td>{{ player.wins }}</td>
          </tr>
        </tbody>
      </table>
    </div>
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

    <hr v-if="storeAuth.user" />

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
    margin-left: 20px;
    margin-right: 20px;
    color: #333;
    background-color: #fff;
  }


  h1 {
    margin-bottom: 30px;
  }

  h2 {
    margin-bottom: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  th, td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
  }

  th {
    background-color: #f4f4f4;
  }

  .no-data {
    text-align: center;
    color: black;
  }

  hr {
    margin: 40px 0;
    border: 0;
    border-top: 1px solid #ddd;
  }

  .personal-scoreboard,
  .global-scoreboard {
    margin-bottom: 40px;
  }

  td {
    text-align: center;
  }

  td[style] {
    color: black;
  }
</style>
