<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'

const router = useRouter();
// Dados reativos
const users = ref([]);
const pagination = ref({});
const searchQuery = ref('');
const error = ref(null);

// Função para buscar usuários
const fetchUsers = async (url = 'admin/users') => {
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

// Função para aplicar filtro de busca
const applySearch = () => {
  fetchUsers();
};

// Função para bloquear/desbloquear um usuário
const toggleBlockUser = async (user) => {
  const action = user.blocked ? 'unblock' : 'block';
  const confirmAction = confirm(`Are you sure you want to ${action} ${user.name}?`);
  if (!confirmAction) return;

  try {
    const response = await axios.patch(`users/${user.id}/toggle-block`);
    user.blocked = response.data.blocked;
    alert(response.data.message); // Exibe mensagem de sucesso
  } catch (err) {
    console.error(err);
    alert('Failed to update user status.');
  }
};

// Função para excluir um usuário
const deleteUser = async (user) => {
  const confirmAction = confirm(
    `Are you sure you want to delete ${user.name}? This action cannot be undone.`
  );
  if (!confirmAction) return;

  try {
    const response = await axios.delete(`users/${user.id}`);
    alert(response.data.message); // Exibe mensagem de sucesso

    // Atualiza a lista de usuários após exclusão
    fetchUsers();
  } catch (err) {
    console.error(err);
    alert('Failed to delete user.');
  }
};

// Função para tratar URLs de paginação
const handlePagination = (url) => {
  if (!url) return;
  fetchUsers(url);
};

// Função para voltar para a página anterior
const goBack = () => {
  router.back(); // Usa o histórico do navegador para voltar
};


// Buscar usuários ao carregar o componente
onMounted(fetchUsers);
</script>

<template>
  <div class="view-container">
    <button class="back-button" @click="goBack">Back</button>
    <h1>Manage Users</h1>

    <!-- Campo de busca -->
    <div class="search-container">
      <input style="color: black;"
        type="text"
        v-model="searchQuery"
        placeholder="Search by name or email"
        class="search-input"
      />
      <button class="filter-button" @click="applySearch">Search</button>
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
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.created_at }}</td>
          <td>{{ user.blocked ? "Blocked" : "Active" }}</td>
          <td style="display: table-cell;">
            <button class="button-block" @click="toggleBlockUser(user)">
              {{ user.blocked ? "Unblock" : "Block" }}
            </button>
            <button class="delete-button" @click="deleteUser(user)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Mensagem caso não haja usuários -->
    <div v-else>No users found</div>

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
/* Estilos existentes */
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
  width: 200px;
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
}

button {
  padding: 8px 12px;
  background-color: var(--primary);
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: var(--primary-dark);
}

.delete-button {
  background-color: #d9534f; /* Vermelho para excluir */
  margin-left: 10px;
}

.delete-button:hover {
  background-color: #c9302c;
}

.button-block {
  background-color: #1a1c9b; /* Verde para bloquear/desbloquear */
}
.button-block:hover {
  background-color: #0d0e4f;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

div, table, td, th {
  opacity: 1 !important;
  filter: none !important; /* Remove filtros como blur */
}

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
  }

</style>

  