<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const transactions = ref([]);
const pagination = ref({});
const error = ref(null);

const fetchTransactionHistory = async (url = '/transactions/history') => {
  try {
    error.value = null; // Limpa erros anteriores

    const response = await axios.get(url);
    const { data, current_page, last_page, per_page, next_page_url, prev_page_url } = response.data;

    transactions.value = data;
    pagination.value = { current_page, last_page, per_page, next_page_url, prev_page_url };
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred while fetching transaction history.';
  }
};

// Paginação
const handlePagination = (url) => {
  if (url) fetchTransactionHistory(url);
};

// Busca o histórico na montagem
onMounted(fetchTransactionHistory);
</script>

<template>
  <div class="transaction-history-container">
    <h1>Transaction History</h1>

    <!-- Exibição de erro -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Tabela de transações -->
    <table v-if="transactions.length" class="transaction-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Type</th>
          <th>Amount (€)</th>
          <th>Coins</th>
          <th>Game</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactions" :key="transaction.id">
          <td>{{ transaction.id }}</td>
          <td>{{ transaction.transaction_datetime }}</td>
          <td>{{ transaction.type }}</td>
          <td>{{ transaction.euros }}</td>
          <td>{{ transaction.brain_coins }}</td>
          <td>{{ transaction.game ? transaction.game.type : 'N/A' }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Mensagem caso não haja transações -->
    <div v-else>No transactions found</div>

    <!-- Paginação -->
    <div class="pagination">
      <button :disabled="!pagination.prev_page_url" @click="handlePagination(pagination.prev_page_url)">
        Previous
      </button>
      <span>Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
      <button :disabled="!pagination.next_page_url" @click="handlePagination(pagination.next_page_url)">
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>

div, table, td, th {
  color: #000 !important;
  opacity: 1 !important;
  filter: none !important; /* Remove filtros como blur */
}
.transaction-history-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: var(--background);
  color: var(--foreground);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.error {
  color: red;
  text-align: center;
  margin-bottom: 20px;
}

.transaction-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.transaction-table th,
.transaction-table td {
  padding: 10px;
  text-align: left;
  border: 1px solid var(--foreground);
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
