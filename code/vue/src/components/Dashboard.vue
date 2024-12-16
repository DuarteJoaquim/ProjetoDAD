<script setup>
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  
  const router = useRouter()
  const storeAuth = useAuthStore()

  const goToNewGame = () => {
    router.push({ name: 'newGame' })
  }

  const goToGameHistory = () => {
    router.push({ name: 'gameHistory' })
  }

  const goToScoreboard = () => {
    router.push({ name: 'scoreboard' })
  }

  const goToCoins = () => {
    router.push({ name: 'coins' })
  }
</script>

<template>
  <div class="dashboard">
    <h1 class="title">Memory Game</h1>
    <div class="button-container">
      <button class="dashboard-button" @click="goToNewGame">New Game</button>
      <button v-if="storeAuth.user"  class="dashboard-button" @click="goToGameHistory">Game History</button>
      <button class="dashboard-button" @click="goToScoreboard">Scoreboard</button>
      <button v-if="storeAuth.user" class="dashboard-button" @click="goToCoins">Coins</button>
    </div>
  </div>
</template>

<style scoped>
  .dashboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    margin: 0;
    padding: 0;
    text-align: center;
    box-sizing: border-box;
  }

  .title {
    font-size: 2.5rem;
    color: #31485A;
    margin-bottom: 40px;
  }

  .button-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }

  .dashboard-button {
    background-color: #31485A;
    color: #ffffff;
    font-size: 1.2rem;
    padding: 12px 20px;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    transition: background-color 0.3s;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    flex: 0 0 calc(50% - 20px);
    max-width: 200px;
  }

  .dashboard-button:hover {
    background-color: #253544;
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.3);
  }


  @media (max-width: 768px) {
    .dashboard {
      justify-content: flex-start;
      padding-top: 35%;
    }

    .title {
      font-size: 2rem;
      margin-bottom: 20px;
    }

    .dashboard-button {
      flex: 0 0 90%;
      max-width: 100%;
    }
  }
</style>
