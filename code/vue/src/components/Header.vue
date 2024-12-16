<script setup>
import { useTemplateRef, provide } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCoinsStore } from '@/stores/coins'
import GlobalAlertDialog from '@/components/common/GlobalAlertDialog.vue'

const storeAuth = useAuthStore()
const storeCoins = useCoinsStore()

const alertDialog = useTemplateRef('alert-dialog')
provide('alertDialog', alertDialog)

const logoutConfirmed = () => {
  storeAuth.logout()
}

const logout = () => {
  alertDialog.value.open(
    logoutConfirmed,
    'Logout confirmation?',
    'Cancel',
    'Yes, I want to log out',
    'Are you sure you want to log out? You can still access your account later with your credentials.'
  )
}
</script>

<template>
  <GlobalAlertDialog ref="alert-dialog"></GlobalAlertDialog>
  <header class="header">
    <div class="header-left">
      <router-link to="/" class="header-link">
        <h1 class="header-title">Memory Game</h1>
      </router-link>
    </div>
    <div class="header-center">
      <div v-if="storeAuth.user" class="user-info">
        <img class="user-avatar" :src="storeAuth.userPhotoUrl" alt="User Avatar">
        <router-link to="/userProfile" class="user-link">
          <span>{{ storeAuth.userNickname }}</span>
        </router-link>
      </div>
      <div v-else class="guest-info">
        <span class="guest">Anonymous</span>
      </div>
    </div>
    <div class="header-right">
      <div class="coins" v-if="storeAuth.user">
        <img src="@/assets/brain-coin.png" alt="Coins" class="coin-icon" />
        <span class="coin-count">{{ storeCoins.gameCoins }}</span>
      </div>
      <RouterLink v-show="!storeAuth.user" :to="{ name: 'login' }" class="login-button">
        Login
      </RouterLink>
      <button v-show="storeAuth.user" class="logout-button" @click="logout">
        Logout
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #31485A;
  color: #ffffff;
}

.header-left, .header-center, .header-right {
  display: flex;
  align-items: center;
}

.header-title {
  font-size: 1.8rem;
  margin: 0;
  color: #ffffff;
  text-decoration: none;
}

.user-info{
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 55px;
}

.guest-info{
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 150px;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.user-link {
  font-size: 1.2rem;
  color: #ffffff;
  text-decoration: none;
}

.guest {
  font-size: 1.2rem;
}

.coins {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-right: 35px;
}

.coin-icon {
  width: 24px;
  height: 24px;
}

.coin-count {
  font-size: 1.2rem;
}

.login-button, .logout-button {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  margin-left: 15px;
}

.login-button:hover, .logout-button:hover {
  text-decoration: underline;
}


@media (max-width: 768px) { 

  .guest-info{
    margin-right: 20px;
  }

}


</style>

