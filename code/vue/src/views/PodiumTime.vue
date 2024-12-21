<template>
    <div class="page-container">
      <h1 class="page-title">Pódios por Tempo</h1>
      <div class="card-container">
        <div v-for="(podium, index) in podiums" :key="index" class="card">
          <h2 class="card-title">{{ podium.title }}</h2>
          <p>Jogador: {{ podium.player }}</p>
          <p>Tempo: {{ podium.time }} segundos</p>
          <p>Moves: {{ podium.moves }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  
  const podiums = ref([
    { title: "1º Lugar", player: "Jogador1", time: 20, moves: 15 },
    { title: "2º Lugar", player: "Jogador2", time: 30, moves: 25 },
    { title: "3º Lugar", player: "Jogador3", time: 40, moves: 35 },
  ]);
  </script>
  
  <style scoped>
  .page-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    background-color: #121212;
    color: #ffffff;
    min-height: 100vh;
    padding: 20px;
  }
  
  .page-title {
    font-size: 2rem;
    font-weight: bold;
    color: #ffa500;
  }
  
  .card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }
  
  .card {
    background: #1e1e2f;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    width: 300px;
    color: #fff;
  }
  
  .card-title {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #ffa500;
  }
  </style>
  