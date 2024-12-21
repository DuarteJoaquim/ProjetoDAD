import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { useToast } from '@/components/ui/toast/use-toast'
import { useCoinsStore } from '@/stores/coins';
import { ref} from 'vue';


export const useGameStore = defineStore("game", () => {
  const coinStore = useCoinsStore();
  const authStore = useAuthStore();

  const hintsUsed = ref(0); // Contador de dicas usadas
  const maxHints = ref(3); // Máximo de dicas permitidas por jogo
  const hintPairsRevealed = ref([]); // Armazena pares revelados por dicas

  const cols = ref(null);
  const rows = ref(null);


  const { toast } = useToast();

  const useHint = (cards) => {

    console.log("Coins available:", coinStore.gameCoins);

    if (!authStore.user) {
      toast({
        description: 'Você precisa estar autenticado para usar dicas!',
        className: 'toast-error',
      });
      return;
    }

    if (hintsUsed.value >= maxHints.value) {
      toast({
        description: 'Você já usou todas as dicas disponíveis!',
        className: 'toast-error',
      });
      return;
    }
  
    if (coinStore.gameCoins < 1) {
      toast({
        description: 'Você não tem moedas suficientes para comprar uma dica.',
        className: 'toast-error',
      });
      return;
    }

  
    // Encontra um par de cartas não reveladas e não combinadas
    const unmatchedCards = cards.filter(card => !card.isMatched && !hintPairsRevealed.value.includes(card.name));
  
    // Agrupa as cartas por nome para encontrar pares
    const pairs = unmatchedCards.reduce((acc, card) => {
      acc[card.name] = acc[card.name] || [];
      acc[card.name].push(card);
      return acc;
    }, {});
  
    // Procura o primeiro par
    const pairName = Object.keys(pairs).find(name => pairs[name].length === 2);
  
    if (!pairName) {
      toast({
        description: 'Não há mais pares disponíveis para dicas.',
        className: 'toast-error',
      });
    }
  
    // Revela o par temporariamente
    const pair = pairs[pairName];
    pair.forEach(card => card.isFlipped = true);
  
    // Reverte a dica após 3 segundos
    setTimeout(() => {
      pair.forEach(card => card.isFlipped = false);
    }, 2000);
  
    // Adiciona o par à lista de pares revelados
    hintPairsRevealed.value.push(pairName);
  
    // Incrementa o contador de dicas e debita a moeda
    hintsUsed.value++;
    coinStore.spendCoins(1);
    toast({
      description: `Par revelado temporariamente! (${maxHints.value - hintsUsed.value} dicas restantes)`,
      className: 'toast-info',
    });
  };

  const sendGameData = async (gameData, counter) => {
    try {
      // Check if the user is logged in
      if (!authStore.user) {
        return;
      }

      gameData.total_turns_winner = counter;

      console.log('Game data:', gameData);

      // Send POST request to backend
      const response = await axios.post('/game', gameData); // storeGame
      const { beat_personal_best, beat_global_top3 } = response.data; // storeGame
      console.log('Game data saved:', response.data);

      let toastMessage = "";

      // Build a consolidated toast message
      if (beat_personal_best && beat_global_top3) {
        toastMessage = "You beat your personal best and made it to Global Top 3! 🎉 +2 coins!";
      } else if (beat_personal_best) {
        toastMessage = "You beat your personal best! 🎉 +1 coin!";
      } else if (beat_global_top3) {
        toastMessage = "Global Top 3! 🎉 +1 coin!";
      }
      else {
        toastMessage = "Game completed! No records beaten this time. Try again!";
      }

      // Show toast if there's a message
      if (toastMessage) {
        setTimeout(() => {
          toast({
            description: toastMessage,
            className: beat_personal_best || beat_global_top3 ? "toast-success" : "toast-info",
          });
        }, 1000);

        if (beat_personal_best || beat_global_top3) {
          coinStore.getCoins();
        }
      }

    } catch (error) {
      console.error('Error sending game data:', error.response?.data || error.message);
      setTimeout(() => {
        toast({
          description: "Failed to save game data. Please try again.",
          className: "toast-error",
        });
      }, 1000);
    }
  };

  const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const startTimer = (timer,timerInterval) => {
    timer.value = 0;
    timerInterval.value = setInterval(() => {
      timer.value++;
    }, 1000);
  };

  const stopTimer = (timerInterval) => {
    clearInterval(timerInterval.value);
  };

  // Fetch boards from backend API
  const fetchBoards = async (isLooged, additionalParam = null) => {
    try {
      // Monta os parâmetros dinamicamente
      const params = { bool: isLooged };
      if (additionalParam !== null) {
        params.additional = additionalParam; // Adiciona o parâmetro opcional se estiver definido
      }
  
      // Faz a requisição com os parâmetros
      const response = await axios.get('/boards', { params });
      return response.data.filter((board) => board.id); // Filtra apenas boards válidos
    } catch (error) {
      console.error('Error fetching boards:', error);
      return [];
    }
  };

  // Busca dados de uma board específica
  const getBoard = async (boardId) => {
    try {
      const response = await axios.post("/board", { id: boardId });
      cols.value = response.data.board_cols;
      rows.value = response.data.board_rows;
    } catch (error) {
      console.error("Error fetching board details:", error);
    }
  };

  

  
  

  return {
    sendGameData,
    useHint,
    hintsUsed,
    maxHints,
    formatDateTime,
    startTimer,
    stopTimer,
    fetchBoards,
    getBoard,
    cols,
    rows
  };
});
