import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    isLoggedIn: false,
    gameCoins: 0,
    gameHistory: [],
    scoreboard: []
  }),
  actions: {
    setLoginStatus(status) {
      this.isLoggedIn = status
    },
    setGameCoins(coins) {
      this.gameCoins = coins
    },
    setGameHistory(history) {
      this.gameHistory = history
    },
    setScoreboard(scores) {
      this.scoreboard = scores
    },

    async fetchGameHistory() {
      try {
        const response = await axios.get('/game/history');
        this.setGameHistory(response.data); 
      } catch (error) {
        console.error('Erro ao buscar histórico do jogo:', error);
      }
    },
  }
})
