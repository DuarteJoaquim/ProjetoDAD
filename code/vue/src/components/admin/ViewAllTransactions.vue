<script setup>
import { ref } from 'vue';
import axios from 'axios';

// Dados reativos
const transactions = ref([]);
const pagination = ref({});
const error = ref(null);

// Filtros reativos
const typeFilter = ref('all');
const paymentFilter = ref('all');

// Função para buscar as transações
const fetchTransactions = async (url = '/admin/transactions') => {
  try {
    error.value = null;

    // Parâmetros de filtro
    const params = {};
    if (typeFilter.value !== 'all') params.type = typeFilter.value;
    if (paymentFilter.value !== 'all') params.payment_type = paymentFilter.value;

    const response = await axios.get(url, { params });
    const { data, current_page, last_page, per_page, next_page_url, prev_page_url } = response.data;

    transactions.value = data;
    console.log(transactions.value);

    pagination.value = { current_page, last_page, per_page, next_page_url, prev_page_url };
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred while fetching transactions.';
  }
};

// Funções para definir os filtros
const setTypeFilter = (type) => {
  typeFilter.value = type;
  fetchTransactions(); // Atualiza as transações
};

const setPaymentFilter = (paymentType) => {
  paymentFilter.value = paymentType;
  fetchTransactions(); // Atualiza as transações
};

// Carregar transações ao montar o componente
fetchTransactions();
</script>


<template>
    <div class="view-container">
      <h1>All Transactions</h1>
  
      <!-- Filtros -->
      <div class="filter-container">
        <div class="filter-group">
          <h3>Filter by Type</h3>
          <button 
            class="filter-button" 
            :class="{ active: typeFilter === 'all' }" 
            @click="setTypeFilter('all')"
          >
            All Types
          </button>
          <button 
            class="filter-button" 
            :class="{ active: typeFilter === 'B' }" 
            @click="setTypeFilter('B')"
          >
            Brain Coins Purchase
          </button>
          <button 
            class="filter-button" 
            :class="{ active: typeFilter === 'P' }" 
            @click="setTypeFilter('P')"
          >
            Prize
          </button>
        </div>
  
        <div class="filter-group">
          <h3>Filter by Payment Type</h3>
          <button 
            class="filter-button" 
            :class="{ active: paymentFilter === 'all' }" 
            @click="setPaymentFilter('all')"
          >
            All Payment Methods
          </button>
          <button 
            class="filter-button" 
            :class="{ active: paymentFilter === 'PAYPAL' }" 
            @click="setPaymentFilter('PAYPAL')"
          >
            PayPal
          </button>
          <button 
            class="filter-button" 
            :class="{ active: paymentFilter === 'MBWAY' }" 
            @click="setPaymentFilter('MBWAY')"
          >
            MBWay
          </button>
        </div>
      </div>
  
      <!-- Tabela de Transações -->
      <table v-if="transactions.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>User</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Game</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td>{{ transaction.id }}</td>
            <td>{{ transaction.transaction_datetime }}</td>
            <td>{{ transaction.user.name }} ({{ transaction.user.email }})</td>
            <td>{{ transaction.type }}</td>
            <td>{{ transaction.euros }} €</td>
            <td>{{ transaction.payment_type }}</td>
            <td>{{ transaction.game?.type || 'N/A' }}</td>
          </tr>
        </tbody>
      </table>
  
      <!-- Paginação -->
      <div class="pagination">
        <button :disabled="!pagination.prev_page_url" @click="fetchTransactions(pagination.prev_page_url)">Previous</button>
        <span>Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
        <button :disabled="!pagination.next_page_url" @click="fetchTransactions(pagination.next_page_url)">Next</button>
      </div>
    </div>
  </template>

<style scoped>
.view-container {
  background-color: var(--background);
  color: var(--foreground);
  padding: 20px;
  min-height: 100vh;
}

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.filter-container {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-button {
  padding: 8px 16px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.filter-button.active {
  background: var(--primary-dark);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 10px;
  border: 1px solid var(--background-dark);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 20px;
}

.pagination-button {
  background: linear-gradient(145deg, #2C3E50, #1A1A2E); /* Gradiente escuro */
  color: #EAEAEA; /* Texto claro */
  font-size: 1rem;
  padding: 10px 20px;
  border: 2px solid #3944BC; /* Borda azul */
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.pagination-button:disabled {
  background: #555; /* Cor desativada */
  color: #aaa;
  border-color: #444; /* Borda mais clara */
  cursor: not-allowed;
}

.pagination-button:hover:not(:disabled) {
  background: linear-gradient(145deg, #1A1A2E, #121212); /* Gradiente mais escuro */
  border-color: #5763D6; /* Azul vibrante */
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.5);
  transform: translateY(-3px);
}

.pagination span {
  color: var(--foreground); /* Cor do texto no tema */
  font-weight: bold;
}

div, table, td, th {
  color: #000 !important;
  opacity: 1 !important;
  filter: none !important; /* Remove filtros como blur */
}
</style>

  