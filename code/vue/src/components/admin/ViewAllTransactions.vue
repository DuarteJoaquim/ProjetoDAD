<template>
    <div class="view-container">
      <h1>View All Transactions</h1>
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>User</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td>{{ transaction.id }}</td>
            <td>{{ transaction.user.nickname }}</td>
            <td>{{ transaction.type }}</td>
            <td>{{ transaction.amount }}</td>
            <td>{{ transaction.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const transactions = ref([]);
  
  const fetchTransactions = async () => {
    const response = await axios.get('/api/admin/transactions');
    transactions.value = response.data;
  };
  
  onMounted(fetchTransactions);
  </script>
  
  <style scoped>
  /* Adicione seu estilo aqui */
  </style>
  