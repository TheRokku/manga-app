<template>
  <div class="px-8 xl:px-20 py-10">
    <!-- Not logged in -->
    <div
      v-if="!userStore.user"
      class="flex flex-col items-center justify-center h-96 gap-4"
    >
      <p class="font-heading font-black text-3xl text-muted">
        You're not logged in
      </p>
      <RouterLink
        to="/login"
        class="border-2 border-accent text-accent font-heading font-black px-6 py-3 text-sm tracking-widest hover:bg-accent/10 transition-colors"
      >
        ACCESS
      </RouterLink>
    </div>

    <!-- Logged in -->
    <div v-else>
      <!-- Profile header -->
      <div class="flex items-center gap-6 py-10 relative">
        <div
          class="w-24 h-24 rounded-full bg-border flex items-center justify-center"
        >
          <CircleUser :size="48" class="text-muted" />
        </div>
        <div>
          <h1 class="font-heading font-black text-4xl uppercase">
            {{ userStore.user.email.split('@')[0] }}
          </h1>
          <p class="text-muted text-sm tracking-widest uppercase mt-1">
            THE SOPHISTICATED FANATIC
          </p>
          <div class="flex gap-6 mt-3">
            <div>
              <span class="font-heading font-black text-2xl">{{
                favoritesStore.favorites.length
              }}</span>
              <span class="text-muted text-sm ml-2">Saved</span>
            </div>
          </div>
        </div>
        <button
          class="ml-auto border border-border text-muted font-heading font-bold text-sm px-4 py-2 tracking-widest hover:border-accent hover:text-accent transition-colors"
        >
          EDIT PROFILE
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-6 border-b border-border mb-8">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="font-heading font-bold text-sm pb-3 tracking-widest transition-colors"
          :class="
            activeTab === tab.key
              ? 'text-accent border-b-2 border-accent'
              : 'text-muted'
          "
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Loading -->
      <p v-if="loading" class="text-accent font-heading font-black text-3xl">
        Loading...
      </p>

      <!-- Saved Manga -->
      <div v-if="activeTab === 'manga' && !loading">
        <div v-if="savedManga.length" class="flex flex-wrap gap-4">
          <MediaCard
            v-for="m in savedManga"
            :key="m.id"
            :media="m"
            :selected-genres="[]"
          />
        </div>
        <p v-else class="text-muted font-heading font-bold text-xl">
          No saved manga yet.
        </p>
      </div>

      <!-- Saved Anime -->
      <div v-if="activeTab === 'anime' && !loading">
        <div v-if="savedAnime.length" class="flex flex-wrap gap-4">
          <MediaCard
            v-for="m in savedAnime"
            :key="m.id"
            :media="m"
            :selected-genres="[]"
          />
        </div>
        <p v-else class="text-muted font-heading font-bold text-xl">
          No saved anime yet.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from '../stores/user.js';
import { useFavoritesStore } from '../stores/favorites.js';
import { CircleUser } from 'lucide-vue-next';
import MediaCard from '../components/MediaCard.vue';

const userStore = useUserStore();
const favoritesStore = useFavoritesStore();

const activeTab = ref('manga');
const loading = ref(false);
const savedManga = ref([]);
const savedAnime = ref([]);

const tabs = [
  { key: 'manga', label: 'SAVED MANGA' },
  { key: 'anime', label: 'SAVED ANIME' },
];

async function fetchSavedMedia() {
  if (!userStore.user) return;
  loading.value = true;

  const mangaIds = favoritesStore.favorites
    .filter((f) => f.media_type === 'MANGA')
    .map((f) => f.media_id);

  const animeIds = favoritesStore.favorites
    .filter((f) => f.media_type === 'ANIME')
    .map((f) => f.media_id);

  if (mangaIds.length) {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query ($ids: [Int]) {
            Page {
              media(id_in: $ids, type: MANGA) {
                id type title { romaji english } coverImage { large } averageScore genres
              }
            }
          }
        `,
        variables: { ids: mangaIds },
      }),
    });
    const json = await res.json();
    savedManga.value = json.data?.Page?.media ?? [];
  } else {
    savedManga.value = [];
  }

  if (animeIds.length) {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query ($ids: [Int]) {
            Page {
              media(id_in: $ids, type: ANIME) {
                id type title { romaji english } coverImage { large } averageScore genres
              }
            }
          }
        `,
        variables: { ids: animeIds },
      }),
    });
    const json = await res.json();
    savedAnime.value = json.data?.Page?.media ?? [];
  } else {
    savedAnime.value = [];
  }

  loading.value = false;
}

watch(() => favoritesStore.favorites, fetchSavedMedia, {
  deep: true,
  immediate: true,
});
</script>
