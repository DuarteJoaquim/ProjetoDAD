<template>
    <div class="general-statistics">
      <h1 class="title">Estatísticas Gerais</h1>
      <div class="charts-container">
        <!-- Gráfico de Pizza -->
        <div class="chart">
          <h2 class="chart-title">Distribuição de Jogos</h2>
          <canvas id="gameDistributionChart"></canvas>
        </div>
  
        <!-- Gráfico de Barras -->
        <div class="chart">
          <h2 class="chart-title">Estatísticas de Tempo de Jogo</h2>
          <canvas id="gameTimeChart"></canvas>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from '@/lib/axios';
  import Chart from 'chart.js/auto';
  
  // Dados para os gráficos
  const gameDistributionData = ref(null);
  const gameTimeData = ref(null);
  
  // Função para buscar estatísticas da API
  const fetchStatistics = async () => {
    try {
      const response = await axios.get('/statistics/general');
      console.log('Dados recebidos:', response.data);
      const data = response.data;
  
      // Configurando os dados recebidos
      gameDistributionData.value = {
        labels: ['Total de Jogos', 'Jogos Última Semana', 'Jogos Último Mês'],
        datasets: [
          {
            label: 'Distribuição de Jogos',
            data: [data.totalGames, data.lastWeekGames, data.lastMonthGames],
            backgroundColor: ['#007bff', '#ff4500', '#ffc107'],
          },
        ],
      };
  
      gameTimeData.value = {
        labels: ['Tempo Mais Curto', 'Tempo Médio', 'Tempo Mais Longo'],
        datasets: [
          {
            label: 'Tempo (segundos)',
            data: [data.shortestTime, data.averageTime, data.longestTime],
            backgroundColor: '#007bff',
          },
        ],
      };
  
      renderCharts();
    } catch (error) {
      console.error('Erro ao buscar estatísticas gerais:', error);
    }
  };
  
  // Função para renderizar os gráficos
  const renderCharts = () => {
    // Gráfico de Pizza
    const ctx1 = document.getElementById('gameDistributionChart').getContext('2d');
    new Chart(ctx1, {
      type: 'pie',
      data: gameDistributionData.value,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 12,
              },
            },
          },
        },
        layout: {
          padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          },
        },
      },
    });
  
    // Gráfico de Barras
    const ctx2 = document.getElementById('gameTimeChart').getContext('2d');
    new Chart(ctx2, {
      type: 'bar',
      data: gameTimeData.value,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };
  
  onMounted(fetchStatistics);
  </script>
  
  <style scoped>
  .general-statistics {
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
  
  .charts-container {
    display: flex;
    flex-wrap: wrap;
    gap: 40px; /* Maior espaçamento entre os gráficos */
    justify-content: center;
  }
  
  .chart {
    background: #1e1e2f;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    width: 420px; /* Ligeiramente maior para acomodar a legenda */
    height: 500px; /* Aumentado para acomodar o gráfico e a legenda */
    display: flex;
    flex-direction: column; /* Mantém o conteúdo organizado verticalmente */
    justify-content: space-evenly; /* Espaça os elementos igualmente */
  }
  
  #gameDistributionChart {
    max-height: 250px; /* Limita a altura do gráfico */
    margin: auto; /* Centraliza o gráfico no contêiner */
  }
  
  .chart:nth-child(2) canvas {
    max-height: 350px; /* Limita a altura do gráfico de barras */
    margin: auto;
  }
  
  .chart-title {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #ffa500;
  }
  
  @media (max-width: 768px) {
    .chart {
      width: 100%; /* O gráfico ocupará toda a largura disponível */
      height: auto; /* Altura será ajustada automaticamente */
    }
  }
  </style>
  