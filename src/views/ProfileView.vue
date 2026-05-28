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
        <!-- Avatar -->
        <div
          class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-border flex items-center justify-center shrink-0 overflow-hidden"
        >
          <img
            v-if="userStore.profile?.avatar_url"
            :src="userStore.profile.avatar_url"
            class="w-full h-full object-cover"
          />
          <CircleUser v-else :size="48" class="text-muted" />
        </div>

        <div class="flex-1 min-w-0">
          <h1
            class="font-heading font-black text-2xl sm:text-4xl uppercase truncate w-full flex flex-wrap gap-4 items-center"
          >
            {{
              userStore.profile?.username || userStore.user.email.split('@')[0]
            }}
            <p
              v-if="
                userStore.profile.username === 'TheRokkunn' ||
                userStore.user.email === 'axelbarriosemanuel.2016@gmail.com'
              "
              class="px-4 text-accent max-w-fit rounded-sm"
            >
              Admin
            </p>
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
          @click="openEdit"
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
          class="flex flex-wrap gap-2 justify-center"
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
          class="flex flex-wrap gap-2 justify-center"
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

    <!-- Edit Profile Modal -->
    <div
      v-if="editOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      @click.self="editOpen = false"
    >
      <div
        class="bg-card border border-border rounded-sm p-6 w-full max-w-md mx-4 flex flex-col gap-5"
      >
        <h2 class="font-heading font-black text-xl tracking-widest">
          EDIT PROFILE
        </h2>

        <!-- Avatar upload -->
        <div class="flex flex-col gap-2">
          <label class="text-muted text-xs font-bold tracking-widest uppercase"
            >Avatar</label
          >
          <div class="flex items-center gap-4">
            <div
              class="w-16 h-16 rounded-full bg-border overflow-hidden flex items-center justify-center shrink-0"
            >
              <img
                v-if="avatarPreview"
                :src="avatarPreview"
                class="w-full h-full object-cover"
              />
              <CircleUser v-else :size="32" class="text-muted" />
            </div>
            <label
              class="border border-border text-muted text-sm font-heading font-bold px-4 py-2 cursor-pointer hover:border-accent hover:text-accent transition-colors"
            >
              CHOOSE FILE
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="onAvatarChange"
              />
            </label>
          </div>
        </div>

        <!-- Username -->
        <div class="flex flex-col gap-2">
          <label class="text-muted text-xs font-bold tracking-widest uppercase"
            >Username</label
          >
          <input
            v-model="editUsername"
            type="text"
            placeholder="Enter username..."
            class="bg-border py-2 px-3 rounded-sm outline-accent focus:outline-2 transition-all text-sm"
          />
        </div>

        <!-- Error -->
        <p v-if="editError" class="text-red-500 text-sm">{{ editError }}</p>

        <!-- Actions -->
        <div class="flex gap-3 mt-2">
          <button
            @click="saveProfile"
            :disabled="editSaving"
            class="bg-accent text-bg font-heading font-black px-6 py-3 text-sm tracking-widest hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {{ editSaving ? 'SAVING...' : 'SAVE' }}
          </button>
          <button
            @click="editOpen = false"
            class="border border-border text-muted font-heading font-bold px-6 py-3 text-sm tracking-widest hover:border-accent hover:text-accent transition-colors"
          >
            CANCEL
          </button>
        </div>
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

// Edit modal state
const editOpen = ref(false);
const editUsername = ref('');
const avatarFile = ref(null);
const avatarPreview = ref(null);
const editSaving = ref(false);
const editError = ref('');

function openEdit() {
  editUsername.value = userStore.profile?.username ?? '';
  avatarPreview.value = userStore.profile?.avatar_url ?? null;
  avatarFile.value = null;
  editError.value = '';
  editOpen.value = true;
}

function onAvatarChange(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    editError.value = 'Image must be under 2MB';
    return;
  }
  if (
    !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)
  ) {
    editError.value = 'Only JPEG, PNG, WebP, or GIF allowed';
    return;
  }

  editError.value = '';
  avatarFile.value = file;
  avatarPreview.value = URL.createObjectURL(file);
}

async function saveProfile() {
  editSaving.value = true;
  editError.value = '';
  try {
    await userStore.updateProfile({
      username: editUsername.value,
      avatarFile: avatarFile.value,
    });
    editOpen.value = false;
  } catch (e) {
    editError.value = e.message;
  } finally {
    editSaving.value = false;
  }
}

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
        query: `query ($ids: [Int]) { Page { media(id_in: $ids, type: MANGA) { id type title { romaji english } coverImage { large } averageScore genres } } }`,
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
        query: `query ($ids: [Int]) { Page { media(id_in: $ids, type: ANIME) { id type title { romaji english } coverImage { large } averageScore genres } } }`,
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
