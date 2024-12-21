<script setup>
import { ref, onMounted, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { useRouter } from 'vue-router';


const storeAuth = useAuthStore();
const router = useRouter();

const newCredentials = computed(() => ({
  name: storeAuth.user.name,
  email: storeAuth.user.email,
  nickname: storeAuth.user.nickname,
  password: '',
  confirmPassword: '',
}));

const goToTransactionHistory = () => {
  router.push({ name: 'transactionHistory' });
};

const updateProfile = () => {
  storeAuth.updateProfile(newCredentials.value);
};

// Função para excluir a conta
const deleteAccount = async () => {
  const confirmDelete = confirm("Are you sure you want to delete your account? This action cannot be undone.");
  if (!confirmDelete) return;

  try {
    await axios.delete(`/users/${storeAuth.user.id}`);
    alert("Your account has been deleted.");
    storeAuth.logout(); // Desloga o usuário
    router.push('/'); // Redireciona para a página inicial
  } catch (error) {
    console.error("Failed to delete account:", error);
    alert(error.response?.data?.message || "An error occurred while trying to delete the account.");
  }
};
</script>

<template>
  <div class="container">
  <Card class="card w-[450px] mx-auto my-8 p-4 px-8">
    <CardHeader class="card-header">
      <CardTitle class="card-title">Update profile</CardTitle>
      <CardDescription class="card-description">Enter your new credentials to update.</CardDescription>
      <CardDescription  v-if="storeAuth.success" class="text-success">User updated successfully</CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="name">Name</Label>
            <Input id="name" type="name" placeholder="Name" v-model="newCredentials.name" />
            <ErrorMessage v-if="storeAuth.errorsUpdateProfile.name" :errorMessage="storeAuth.errorsUpdateProfile.name"></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="Email" v-model="newCredentials.email" />
            <ErrorMessage v-if="storeAuth.errorsUpdateProfile.email" :errorMessage="storeAuth.errorsUpdateProfile.email"></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="nickname">Nickname</Label>
            <Input id="nickname" type="name" placeholder="Nickname" v-model="newCredentials.nickname" />
            <ErrorMessage v-if="storeAuth.errorsUpdateProfile.nickname" :errorMessage="storeAuth.errorsUpdateProfile.nickname"></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="password">Password</Label>
            <Input id="password" type="password" placeholder="Password" v-model="newCredentials.password" />
            <ErrorMessage v-if="storeAuth.errorsUpdateProfile.password" :errorMessage="storeAuth.errorsUpdateProfile.password"></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="password">Confirm password</Label>
            <Input id="confirmpassword" type="password" placeholder="Confirm password" v-model="newCredentials.confirmPassword" />
            <ErrorMessage v-if="storeAuth.errorsUpdateProfile.confirmPassword" :errorMessage="storeAuth.errorsUpdateProfile.confirmPassword"></ErrorMessage>
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-between px-6 pb-6">
      <Button @click="goToTransactionHistory" class="mr-2">
        View Transaction History
      </Button>
      <Button @click="updateProfile">Update profile</Button>

    </CardFooter>
    <div style="margin-left: 30%;"><Button id="delete" class=" bg-red-600 hover:bg-red-700 text-white" @click="deleteAccount">Delete Account</Button></div>
  </Card>
</div>
</template>

<style scoped>

#delete {
  padding: 10px 20px;
  background: linear-gradient(145deg, rgb(230, 9, 9), rgba(0, 0, 0, 0.829)); /* Gradiente cinza escuro */
  color: white; /* Texto branco */
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4); /* Sombra */
}

#delete:hover {
  background: linear-gradient(145deg, rgb(0, 0, 0), rgba(0, 0, 0, 0.829)); /* Gradiente invertido */
  transform: translateY(-2px); /* Efeito de elevação */
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.6); /* Sombra mais intensa */
}

.container {
  display: flex;
  align-items: center;
  height: 100vh;
  background: rgba(0, 0, 0, 0.918); /* Fundo preto opaco */
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid rgb(80, 80, 80); /* Borda cinza escura */
  border-radius: 6px;
  background: rgb(245, 244, 244); /* Fundo escuro */
  color: rgba(0, 0, 0, 0.788); /* Texto claro */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2); /* Sombra interna */
  transition: border-color 0.2s ease-in-out;
}

input:focus {
  border-color: rgba(0, 0, 0, 0.966); /* Borda azul ao focar */
  outline: none;
}

button {
  display: flex;
  padding: 10px 20px;
  background: linear-gradient(145deg, rgb(50, 50, 50), rgb(70, 70, 70)); /* Gradiente cinza escuro */
  color: white; /* Texto branco */
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4); /* Sombra */
}

button:hover {
  background: linear-gradient(145deg, rgb(70, 70, 70), rgb(50, 50, 50)); /* Inversão do gradiente */
  transform: translateY(-2px); /* Efeito de elevação */
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.6); /* Sombra mais intensa */
}

button:disabled {
  background: rgb(80, 80, 80); /* Cor desativada */
  color: rgb(120, 120, 120);
  cursor: not-allowed;
}

.dash-button {
  background: linear-gradient(145deg, rgb(30, 144, 255), rgb(0, 123, 255)); /* Gradiente azul */
}

.dash-button:hover {
  background: linear-gradient(145deg, rgb(0, 123, 255), rgb(30, 144, 255)); /* Gradiente invertido */
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
}

.card {
  background: rgb(30, 30, 30); /* Fundo cinza escuro */
  border: 1px solid rgb(50, 50, 50); /* Borda escura */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5); /* Sombra */
  padding: 20px;
  margin: 10px auto;
}

.card-header {
  margin-bottom: 10px;
  text-align: center;
  font-weight: bold;
  color: rgb(220, 220, 220); /* Texto claro */
}

.card-title {
  font-size: 2.5rem;
}

.card-description {
  margin-top: 4%;
  font-size: 0.9rem;
  color: rgb(221, 218, 218); /* Texto claro */
  text-align: center;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  margin-top: 10px;
  border-top: 1px solid rgb(50, 50, 50); /* Separador escuro */
}

label {
  font-weight: bold;
  color: rgb(200, 200, 200); /* Texto claro */
}

.error-message {
  color: rgb(255, 80, 80); /* Vermelho claro */
  font-size: 0.9rem;
  margin-top: 5px;
}

.text-success {
  color: green;
  font-weight: bold;
}

</style>