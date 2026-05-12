<template>
  <SpeedInsights />
  <div v-if="!userStore.loading">
    <Navbar />
    <RouterView v-slot="{ Component }">
      <Transition name="glitch" mode="out-in">
        <component :is="Component" :key="$route.path" />
      </Transition>
    </RouterView>
  </div>
  <div v-else class="w-full h-screen flex items-center justify-center">
    <p class="text-accent font-heading font-black text-4xl">KAWAUMI</p>
  </div>
</template>

<script setup>
import { SpeedInsights } from '@vercel/speed-insights/vue';
import Navbar from './components/Navbar.vue';
import { onMounted, watch } from 'vue';
import { useUserStore } from './stores/user.js';
import { useFavoritesStore } from './stores/favorites.js';

const userStore = useUserStore();
const favoritesStore = useFavoritesStore();

watch(
  () => userStore.user,
  (user) => {
    if (user) favoritesStore.fetchFavorites(user.id);
  },
  { immediate: true },
);

onMounted(() => userStore.fetchUser());
</script>
