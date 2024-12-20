<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Dados reativos
const users = ref([]);
const pagination = ref({});
const searchQuery = ref('');
const error = ref(null);

// Função para buscar usuários
const fetchUsers = async (url = '/admin/users') => {
  try {
    error.value = null; // Limpa erros anteriores

    const response = await axios.get(url, {
      params: {
        search: searchQuery.value, // Adiciona filtro de busca
      },
    });

    const { data, current_page, last_page, per_page, next_page_url, prev_page_url } = response.data;

    users.value = data;
    pagination.value = { current_page, last_page, per_page, next_page_url, prev_page_url };
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred while fetching users.';
  }
};

// Função para buscar com filtro
const applySearch = () => {
  fetchUsers();
};

// Buscar usuários ao carregar o componente
onMounted(fetchUsers);
</script>

<template>
  <div class="view-container">
    <h1>Manage Users</h1>

    <!-- Campo de busca -->
    <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search by name or email"
        class="search-input"
      />
      <button class="search-button" @click="applySearch">Search</button>
    </div>

    <!-- Exibição de erro -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Tabela de usuários -->
    <table v-if="users.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.created_at }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Mensagem caso não haja usuários -->
    <div v-else>No users found</div>

    <!-- Paginação -->
    <div class="pagination">
      <button :disabled="!pagination.prev_page_url" @click="fetchUsers(pagination.prev_page_url)">Previous</button>
      <span>Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
      <button :disabled="!pagination.next_page_url" @click="fetchUsers(pagination.next_page_url)">Next</button>
    </div>
  </div>
</template>

<style scoped>
.view-container {
  background-color: var(--background);
  color: var(--foreground);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-align: center;
}

.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.search-input {
  padding: 8px;
  font-size: 1rem;
  border: 2px solid var(--primary-dark);
  border-radius: 8px;
  margin-right: 10px;
}

.search-button {
  padding: 8px 15px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.search-button:hover {
  background: var(--primary-dark);
}

table {
  width: 100%;
  max-width: 1200px;
  border-collapse: collapse;
  margin: 20px 0;
}

thead {
  background-color: var(--primary-dark);
  color: #ffffff;
}

thead th {
  padding: 10px;
  text-align: left;
}

tbody tr:nth-child(even) {
  background-color: var(--background-light);
}

tbody td {
  padding: 10px;
  border-bottom: 1px solid var(--background-dark);
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}
</style>
