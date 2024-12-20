import { createRouter, createWebHistory } from 'vue-router';
import Login from "@/components/auth/Login.vue";
import Register from "@/components/auth/Register.vue";
import UserProfile from "@/components/auth/UserProfile.vue";
import Dashboard from '@/components/Dashboard.vue';
import Game from '@/components/game/Game.vue';
import NewGame from '@/components/game/NewGame.vue';
import GameHistory from '@/components/game/GameHistory.vue';
import Scoreboard from '@/components/game/Scoreboard.vue';
import Coins from '@/components/coins/Coins.vue';
import WebSocketTest from "@/components/WebSocketTest.vue";
import Lobby from "@/components/game/Lobby.vue";
import GameMultiplayer from "@/components/game/GameMultiplayer.vue";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/components/ui/toast/use-toast";
import AdminDashboard from '@/components/admin/AdminDashboard.vue'; // Importar o componente AdminDashboard para a rota
import TransactionHistory from '@/components/user/TransactionHistory.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'dashboard', component: Dashboard },
    { path: "/login", name: "login", component: Login },
    { path: "/register", name: "register", component: Register },
    { path: "/userProfile", name: "userProfile", component: UserProfile },
    { path: '/game/new', name: 'newGame', component: NewGame },
    { path: '/game/history', name: 'gameHistory', component: GameHistory },
    { path: '/game/scoreboard', name: 'scoreboard', component: Scoreboard },
    { path: '/game', name: 'game', component: Game },
    { path: '/coins', name: 'coins', component: Coins },
    { path: "/websocket", name: "websocket", component: WebSocketTest },


    // Rota para o componente AdminDashboard
    { path: '/admin', name: 'admin', component: AdminDashboard}, /*meta: { requiresAdmin: true }},*/

    {path: '/admin/manage-users',name: 'manageUsers',component: () => import('@/components/admin/ManageUsers.vue'),},

    {path: '/admin/view-games',name: 'viewAllGames',component: () => import('@/components/admin/ViewAllGames.vue'),},

    {path: '/admin/view-transactions',name: 'viewAllTransactions',component: () => import('@/components/admin/ViewAllTransactions.vue'),},
    {path: '/admin/view-stats',name: 'adminStats',component: () => import('@/components/admin/ViewStatistics.vue'),},

    {path: '/admin/create-admin',name: 'createAdmin',component: () => import('@/components/admin/CreateAdmin.vue'),},
    
    // Rota para Users
    
    { path: '/transactions/history', name: 'transactionHistory', component: TransactionHistory },

    {
      path: '/multi',
      name: 'multiPlayerGames',
      component: Lobby // Apenas para a lista de lobbys
    },
    {
      path: '/multi/lobby',
      name: 'lobby',
      component: Lobby // Página do lobby do jogo
    },
    {
      path: '/multi/game',
      name: 'multiPlayerGame',
      component: GameMultiplayer // Página do jogo multiplayer
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

let handlingFirstRoute = true;

router.beforeEach(async (to, from, next) => {
  const storeAuth = useAuthStore();
  const toast = useToast();

  if (handlingFirstRoute) {
    handlingFirstRoute = false;
    try {
      await storeAuth.restoreToken();
    } catch {
      storeAuth.logout();
      console.error("Token inválido, utilizador desconectado.");
    }
  }

  const boardId = parseInt(to.query.boardId, 10) || 1; // Valor padrão 1
  const allowedBoards = storeAuth.user ? [1, 2, 3] : [1];

  if ((to.name == "login" || to.name == "register") && storeAuth.user) {
    next({ name: "dashboard" });
    return;
  }

  if ((to.name == "game" && !allowedBoards.includes(boardId)) || 
      ((to.name == "gameHistory" || to.name == "coins" || to.name == "userProfile") && !storeAuth.user)) {
    toast({
      description: "Acesso restrito! Faça login para continuar.",
      className: "toast-warning",
    });
    next({ name: "dashboard" });
    return;
  }

  if (to.name === "lobby" && !storeAuth.user) {
    toast({
      description: "Acesso restrito ao lobby! Faça login para continuar.",
      className: "toast-warning",
    });
    next({ name: "dashboard" });
    return;
  }
  
  next();
});

export default router;
