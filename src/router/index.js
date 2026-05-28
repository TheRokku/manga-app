import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/user.js';

const routes = [
  { path: '/', component: () => import('../views/HomeView.vue') },
  { path: '/login', component: () => import('../views/LoginView.vue') },
  {
    path: '/profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true },
  },
  { path: '/manga', component: () => import('../views/manga/MangaBrowse.vue') },
  {
    path: '/manga/:id',
    component: () => import('../views/manga/MangaDetail.vue'),
  },
  { path: '/anime', component: () => import('../views/anime/AnimeBrowse.vue') },
  {
    path: '/anime/:id',
    component: () => import('../views/anime/AnimeDetail.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const userStore = useUserStore();
  if (to.meta.requiresAuth && !userStore.user) {
    return '/login';
  }
});

export default router;
