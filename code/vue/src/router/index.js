import { createRouter, createWebHistory } from 'vue-router';
import Login from "@/components/auth/Login.vue";
import Register from "@/components/auth/Register.vue";
import UserProfile from "@/components/auth/UserProfile.vue";
import Dashboard from '@/components/Dashboard.vue';
import Game from '@/components/game/Game.vue'
import NewGame from '@/components/game/NewGame.vue';
import GameHistory from '@/components/game/GameHistory.vue';
import Scoreboard from '@/components/game/Scoreboard.vue';
import Coins from '@/components/coins/Coins.vue';
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/userProfile",
      name: "userProfile",
      component: UserProfile,
    },
    {
      path: '/game/new',
      name: 'newGame',
      component: NewGame,
    },
    {
      path: '/game/history',
      name: 'gameHistory',
      component: GameHistory,
    },
    {
      path: '/game/scoreboard',
      name: 'scoreboard',
      component: Scoreboard,
    },
    {
      path: '/game',
      name: 'game',
      component: Game,
    },
    {
      path: '/coins',
      name: 'coins',
      component: Coins,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

let handlingFirstRoute = true;

router.beforeEach(async (to, from, next) => {
  const storeAuth = useAuthStore();

  if (handlingFirstRoute) {
    handlingFirstRoute = false;
    await storeAuth.restoreToken();
  }

  const boardId = parseInt(to.query.boardId, 10);
  const allowedBoards = storeAuth.user ? [1, 2, 3] : [1];

  if ((to.name == "login" || to.name == "register") && storeAuth.user)    
  {
    next({ name: "dashboard" });
    return;
  }

  if ((to.name == "game" && !allowedBoards.includes(boardId)) || ((to.name == "gameHistory" || to.name == "coins" || to.name == "userProfile") && !storeAuth.user)) {
    next({ name: "dashboard" });
    return;
  }
  next();
});

export default router;
