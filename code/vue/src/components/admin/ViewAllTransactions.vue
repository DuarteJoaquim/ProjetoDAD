<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'

// Dados reativos
const transactions = ref([]);
const pagination = ref({});
const error = ref(null);
const router = useRouter();

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

// Função para voltar para a página anterior
const goBack = () => {
  router.back(); // Usa o histórico do navegador para voltar
};


// Carregar transações ao montar o componente
fetchTransactions();
</script>


<template>
    <div class="view-container">
      <!-- Botão para voltar -->
      <button class="back-button" @click="goBack">Back</button>
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
       <div class="table-container">
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
    </div>
  </template>

<style scoped>
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
th, td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
  }

</style>

  