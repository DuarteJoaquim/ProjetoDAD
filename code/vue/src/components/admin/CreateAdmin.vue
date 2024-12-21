<script setup>
import { useAuthStore } from "@/stores/auth";
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter();

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

  // Função para voltar para a página anterior
  const goBack = () => {
    router.back(); // Usa o histórico do navegador para voltar
  };
</script>

<template>
  <div class="container">
    
  <div class="form-container">
    <button class="back-button" @click="goBack">Back</button>
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
  </div>
</template>

<style scoped>

.container {
  display: flex;
  align-items: center;
  height: 100vh;
  background: rgba(0, 0, 0, 0.918);
}

.form-container {
  width: 400px;
  margin: 40px auto;
  padding: 30px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: rgba(48, 29, 143, 0.048);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-container {
    background-color: #121212 !important;
    color: var(--foreground);
    padding: 20px;
    text-align: center;
  }

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: var(--primary); /* Cor primária */
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 1rem;
  color: var(--foreground);
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid rgb(200, 200, 200); /* Cor da borda */
  border-radius: 6px;
  background: rgba(245, 245, 245, 0.904); /* Cor de fundo */
  color: rgb(50, 50, 50); /* Cor do texto */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra interna */
  transition: border-color 0.2s ease-in-out;
}

input:focus {
  border-color: rgb(0, 123, 255); /* Cor da borda ao focar */
  outline: none;
}

button {
  padding: 10px 20px;
  background: linear-gradient(145deg, #5763D6, #3944BC);
  color: rgba(255, 255, 255, 0.822);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  display: block;
  width: 100%;
}

button:hover {
  background: linear-gradient(145deg, #3944BC, #5763D6);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.errors {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 20px;
  text-align: center;
}


.back-button {
  display: inline-block;
  width: 20%;
  padding: 5px 10px;
  margin-bottom: 4%;
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
</style>