<template>
  <div class="podium-moves">
    <h1 class="title">Pódios por Moves</h1>
    <div class="podium-places">
      <div class="podium-place" v-for="(place, index) in podiums" :key="index">
        <h3 class="place-title">{{ index + 1 }}º Lugar</h3>
        <p>Jogador: <strong>{{ place.player }}</strong></p>
        <p>Moves: {{ place.moves }}</p>
        <p>Tempo: {{ place.time }} segundos</p>
        <p>Board: {{ place.board }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/lib/axios"; // Certifique-se de que seu `axios` está configurado corretamente

const podiums = ref([]);

const fetchPodiumMoves = async () => {
  try {
    const response = await axios.get("/statistics/podium/moves");
    podiums.value = response.data;
  } catch (error) {
    console.error("Erro ao buscar o pódio por moves:", error);
  }
};

onMounted(fetchPodiumMoves);
</script>

<style scoped>
.podium-moves {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background-color: #121212;
  color: #ffffff;
  padding: 20px;
  min-height: 100vh;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: #ffa500;
}

.podium-places {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 600px;
}

.podium-place {
  background: #1e1e2f;
  border-radius: 8px;
  padding: 15px;
  color: #ffffff;
  text-align: center;
  border: 1px solid #404054;
}

.place-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffa500;
}
</style>
