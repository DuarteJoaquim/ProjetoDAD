<template>
    <div class="view-container">
      <h1>Manage Users</h1>
      <table>
        <thead>
          <tr>
            <th>Nickname</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.nickname }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.blocked ? 'Blocked' : 'Active' }}</td>
            <td>
              <button @click="toggleBlock(user)">
                {{ user.blocked ? 'Unblock' : 'Block' }}
              </button>
              <button @click="removeUser(user)">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const users = ref([]);
  
  const fetchUsers = async () => {
    const response = await axios.get('/api/admin/users');
    users.value = response.data;
  };
  
  const toggleBlock = async (user) => {
    await axios.patch(`/api/admin/users/${user.id}/block`);
    user.blocked = !user.blocked;
  };
  
  const removeUser = async (user) => {
    await axios.delete(`/api/admin/users/${user.id}`);
    users.value = users.value.filter(u => u.id !== user.id);
  };
  
  onMounted(fetchUsers);
  </script>
  
  <style scoped>
  /* Adicione seu estilo aqui */
  </style>
  