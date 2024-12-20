<template>
    <div class="view-container">
      <h1>Create Admin</h1>
      <form @submit.prevent="createAdmin">
        <div>
          <label>Email:</label>
          <input v-model="email" type="email" required />
        </div>
        <div>
          <label>Nickname:</label>
          <input v-model="nickname" type="text" required />
        </div>
        <div>
          <label>Password:</label>
          <input v-model="password" type="password" required />
        </div>
        <button type="submit">Create Admin</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  
  const email = ref('');
  const nickname = ref('');
  const password = ref('');
  
  const createAdmin = async () => {
    await axios.post('/api/admin/create', { email, nickname, password });
    alert('Admin created successfully!');
  };
  </script>
  
  <style scoped>
  /* Adicione seu estilo aqui */
  </style>
  