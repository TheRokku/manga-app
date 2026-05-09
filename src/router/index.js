import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: () => import('../views/HomeView.vue') },
  { path: '/login', component: () => import('../views/LoginView.vue') },
  { path: '/profile', component: () => import('../views/ProfileView.vue') },
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

export default createRouter({
  history: createWebHistory(),
  routes,
});
