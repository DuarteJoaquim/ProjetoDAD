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
  const globalScores3by4 = ref([]);
  const globalScores4by4 = ref([]);
  const globalScores6by6 = ref([]);



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
  const fetchGlobalScores3by4 = async () => {
    try {
      const response = await axios.get('/scoreboard/global3por4');
      globalScores3by4.value = response.data;     
    } catch (error) {
      console.error("Error fetching Global Scoreboard data", error);
    }
  };

  const fetchGlobalScores4by4 = async () => {
    try {
      const response = await axios.get('/scoreboard/global4por4');
      globalScores4by4.value = response.data;
      console.log("Global Scores 4 by 4:", response.data);
    } catch (error) {
      console.error("Error fetching Global Scoreboard data", error);
    }
  };

  const fetchGlobalScores6by6 = async () => {
    try {
      const response = await axios.get('/scoreboard/global6por6');
      globalScores6by6.value = response.data;
    } catch (error) {
      console.error("Error fetching Global Scoreboard data", error);
    }
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
    fetchGlobalScores3by4();
    fetchGlobalScores4by4();
    fetchGlobalScores6by6();
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

    <!-- Global Scoreboard 3x4 -->
    <div class="global-scoreboard">
      <h2>Global Leaderboard 3x4</h2>
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
          <tr v-if="globalScores3by4.length === 0">
            <td colspan="5" class="no-data">No global scores available</td>
          </tr>
          <tr v-else v-for="(score, index) in globalScores3by4" :key="score.boardSize + score.player">
            <td :style="getMedalStyle(index)">{{ index + 1 }}</td>
            <td>{{ score.player }}</td>
            <td>{{ score.bestTime }} seconds</td>
            <td>{{ score.fewestTurns }} turns</td>
          </tr>
        </tbody>
      </table>
    </div>

    <hr />

    <!-- Global Scoreboard 4x4 -->
    <div class="global-scoreboard">
      <h2>Global Leaderboard 4x4</h2>
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
          <tr v-if="globalScores4by4.length === 0">
            <td colspan="5" class="no-data">No global scores available</td>
          </tr>
          <tr v-else v-for="(score, index) in globalScores4by4" :key="score.boardSize + score.player">
            <td :style="getMedalStyle(index)">{{ index + 1 }}</td>
            <td>{{ score.player }}</td>
            <td>{{ score.bestTime }} seconds</td>
            <td>{{ score.fewestTurns }} turns</td>
          </tr>
        </tbody>
      </table>
    </div>

    <hr />

    <!-- Global Scoreboard 6x6 -->
    <div class="global-scoreboard">
      <h2>Global Leaderboard 6x6</h2>
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
          <tr v-if="globalScores6by6.length === 0">
            <td colspan="5" class="no-data">No global scores available</td>
          </tr>
          <tr v-else v-for="(score, index) in globalScores6by6" :key="score.boardSize + score.player">
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
