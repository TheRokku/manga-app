<template>
  <div class="px-4 sm:px-8 xl:px-20 py-6 sm:py-10">
    <!-- Not logged in -->
    <div
      v-if="!userStore.user"
      class="flex flex-col items-center justify-center h-96 gap-4"
    >
      <p
        class="font-heading font-black text-2xl sm:text-3xl text-muted text-center"
      >
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
      <div
        class="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 py-6 sm:py-10 relative text-center sm:text-left"
      >
        <div
          class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-border flex items-center justify-center shrink-0"
        >
          <CircleUser :size="40" class="text-muted sm:hidden" />
          <CircleUser :size="48" class="text-muted hidden sm:block" />
        </div>
        <div class="flex-1 min-w-0">
          <h1
            class="font-heading font-black text-2xl sm:text-4xl uppercase truncate"
          >
            {{ userStore.user.email.split('@')[0] }}
          </h1>
          <p
            class="text-muted text-xs sm:text-sm tracking-widest uppercase mt-1"
          >
            THE SOPHISTICATED FANATIC
          </p>
          <div class="flex gap-6 mt-3 justify-center sm:justify-start">
            <div>
              <span class="font-heading font-black text-xl sm:text-2xl">{{
                favoritesStore.favorites.length
              }}</span>
              <span class="text-muted text-sm ml-2">Saved</span>
            </div>
          </div>
        </div>
        <button
          class="sm:ml-auto border border-border text-muted font-heading font-bold text-sm px-4 py-2 tracking-widest hover:border-accent hover:text-accent transition-colors w-full sm:w-auto"
        >
          EDIT PROFILE
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-4 sm:gap-6 border-b border-border mb-6 sm:mb-8">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="font-heading font-bold text-xs sm:text-sm pb-3 tracking-widest transition-colors"
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
      <p
        v-if="loading"
        class="text-accent font-heading font-black text-2xl sm:text-3xl"
      >
        Loading...
      </p>

      <!-- Saved Manga -->
      <div v-if="activeTab === 'manga' && !loading">
        <div
          v-if="savedManga.length"
          class="flex flex-wrap gap-2 max-sm:gap-2 w-full justify-center max-sm:grid max-sm:grid-cols-2"
        >
          <MediaCard
            v-for="m in savedManga"
            :key="m.id"
            :media="m"
            :selected-genres="[]"
          />
        </div>
        <p v-else class="text-muted font-heading font-bold text-lg sm:text-xl">
          No saved manga yet.
        </p>
      </div>

      <!-- Saved Anime -->
      <div v-if="activeTab === 'anime' && !loading">
        <div
          v-if="savedAnime.length"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
        >
          <MediaCard
            v-for="a in savedAnime"
            :key="a.id"
            :media="a"
            :selected-genres="[]"
          />
        </div>
        <p v-else class="text-muted font-heading font-bold text-lg sm:text-xl">
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

  // FETCH MANGA
  if (mangaIds.length) {
    const mangaRes = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query ($ids: [Int]) {
            Page {
              media(id_in: $ids, type: MANGA) {
                id
                type
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                averageScore
                genres
              }
            }
          }
        `,
        variables: {
          ids: mangaIds,
        },
      }),
    });

    const mangaJson = await mangaRes.json();
    savedManga.value = mangaJson.data?.Page?.media ?? [];
  } else {
    savedManga.value = [];
  }

  // FETCH ANIME
  if (animeIds.length) {
    const animeRes = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query ($ids: [Int]) {
            Page {
              media(id_in: $ids, type: ANIME) {
                id
                type
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                averageScore
                genres
              }
            }
          }
        `,
        variables: {
          ids: animeIds,
        },
      }),
    });

    const animeJson = await animeRes.json();
    savedAnime.value = animeJson.data?.Page?.media ?? [];
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
