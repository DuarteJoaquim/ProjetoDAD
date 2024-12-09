import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue'; // Página inicial
import LoginPage from '../views/LoginPage.vue'; // Página de Login
import RegisterPage from '../views/RegisterPage.vue'; // Página de Registro
import PlayAnonymous from '../views/PlayAnonymous.vue'; // Página para Jogar Anônimo

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/play-anonymous',
    name: 'PlayAnonymous',
    component: PlayAnonymous,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
