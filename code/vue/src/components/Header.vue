<script setup>
import { useTemplateRef, provide } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useCoinsStore } from '@/stores/coins';
import GlobalAlertDialog from '@/components/common/GlobalAlertDialog.vue';

const storeAuth = useAuthStore();
const storeCoins = useCoinsStore();

const alertDialog = useTemplateRef('alert-dialog');
provide('alertDialog', alertDialog);

const logoutConfirmed = () => {
  storeAuth.logout();
};

const logout = () => {
  alertDialog.value.open(
    logoutConfirmed,
    'Logout confirmation?',
    'Cancel',
    'Yes, I want to log out',
    'Are you sure you want to log out? You can still access your account later with your credentials.'
  );
};
</script>

<template>
  <GlobalAlertDialog ref="alert-dialog"></GlobalAlertDialog>
  <header class="header">
    <!-- Esquerda -->
    <div class="header-left">
      <router-link to="/" class="header-link">
        <h1 class="header-title">Memory Game</h1>
      </router-link>
    </div>

    <!-- Centro -->
    <div class="header-center">
      <div v-if="storeAuth.user" class="user-info">
        <img class="user-avatar" :src="storeAuth.userPhotoUrl" alt="User Avatar" />
        <router-link to="/userProfile" class="user-link">
          <span>{{ storeAuth.userNickname }}</span>
        </router-link>
      </div>
      <div v-else class="guest-info">
        <span class="guest">Anonymous</span>
      </div>
    </div>

    <!-- Direita -->
    <div class="header-right">
      <div class="coins" v-if="storeAuth.user">
        <img src="@/assets/brain-coin.png" alt="Coins" class="coin-icon" />
        <span class="coin-count">{{ storeCoins.gameCoins }}</span>
      </div>
      <router-link v-show="storeAuth.user" :to="{ name: 'websocket' }" class="websocket-button">
        WebSocket
      </router-link>
      <router-link v-show="!storeAuth.user" :to="{ name: 'login' }" class="login-button">
        Login
      </router-link>
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
  padding: 15px 20px;
  background: linear-gradient(135deg, #1A1A2E, #0F0F1A);
  color: var(--foreground);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.header-left,
.header-center,
.header-right {
  display: flex;
  align-items: center;
}

.header-title {
  font-size: 1.8rem;
  margin: 0;
  color: var(--primary);
  text-decoration: none;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.user-info,
.guest-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #5763D6; /* Destaque */
}

.user-link {
  font-size: 1.1rem;
  color: var(--primary-foreground);
  text-decoration: none;
  transition: color 0.3s;
}

.user-link:hover {
  color: #A3B8FF;
}

.guest {
  font-size: 1.2rem;
  color: var(--foreground);
}

.coins {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-right: 15px;
}

.coin-icon {
  width: 24px;
  height: 24px;
}

.coin-count {
  font-size: 1.1rem;
  font-weight: bold;
  color: #A3B8FF;
}

.login-button,
.logout-button,
.websocket-button {
  background: linear-gradient(145deg, #5763D6, #3944BC);
  color: #EAEAEA;
  font-size: 1rem;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  margin-left: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.login-button:hover,
.logout-button:hover,
.websocket-button:hover {
  background: linear-gradient(145deg, #3944BC, #283593);
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    text-align: center;
  }

  .guest-info,
  .user-info {
    margin-right: 0;
  }

  .login-button,
  .logout-button,
  .websocket-button {
    margin: 5px 0;
  }

  .header-title {
    font-size: 1.5rem;
  }
}
</style>
