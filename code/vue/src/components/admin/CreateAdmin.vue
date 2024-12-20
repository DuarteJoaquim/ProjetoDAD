<script setup>
import { useAuthStore } from "@/stores/auth";
import { ref } from 'vue';

// Objeto reativo para armazenar os dados do formulário
const authStore = useAuthStore();
const credentials = ref({
  name: '',
  email: '',
  password: '',
  nickname: '',
});

const errors = ref([]);
const successMessage = ref("");

const registerAdmin = async () => {
  errors.value = []; // Reseta os erros
  successMessage.value = "";

  try {
    console.log(credentials.value);
    const response = await authStore.registerAdmin(credentials.value);

    if (response) {
      successMessage.value = "Admin created successfully!";
      // Reseta o formulário
      credentials.value.name = "";
      credentials.value.email = "";
      credentials.value.password = "";
      credentials.value.nickname = "";
    }
  } catch (err) {
    errors.value = err.response?.data?.errors || ["An error occurred."];
  }
};
</script>

<template>
  <div class="form-container">
    <h1>Create Admin</h1>
    <div v-if="successMessage" class="success">{{ successMessage }}</div>
    <div v-if="errors.length" class="errors">
      <p v-for="error in errors" :key="error">{{ error }}</p>
    </div>
    <form @submit.prevent="registerAdmin">
      <div class="form-group">
        <label for="name">Name</label>
        <input v-model="credentials.name" id="name" type="text" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="credentials.email" id="email" type="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="credentials.password" id="password" type="password" required />
      </div>
      <div class="form-group">
        <label for="nickname">Nickname</label>
        <input v-model="credentials.nickname" id="nickname" type="text" required />
      </div>
      <button type="submit">Create Admin</button>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.errors {
  color: red;
  margin-bottom: 10px;
}

.success {
  color: green;
  margin-bottom: 10px;
}
</style>
