<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <div class="relative h-[70vh] flex items-end overflow-hidden">
      <transition name="fade">
        <img
          v-if="heroTitle"
          :key="heroTitle.id"
          :src="heroTitle.bannerImage"
          class="absolute inset-0 w-full h-full object-cover"
        />
      </transition>
      <div
        class="absolute inset-0 bg-linear-to-t from-bg via-bg/60 to-transparent"
      />
      <div class="absolute inset-0 bg-linear-to-r from-bg/80 to-transparent" />

      <div v-if="heroTitle" class="relative z-10 px-8 md:px-16 pb-12 max-w-2xl">
        <p
          class="text-accent text-xs font-bold tracking-widest uppercase font-heading mb-2"
        >
          {{ heroTitle.type === 'ANIME' ? 'Trending Anime' : 'Trending Manga' }}
        </p>
        <h1
          class="text-white font-black text-4xl md:text-6xl uppercase font-heading leading-none mb-3"
        >
          {{ heroTitle.title.english || heroTitle.title.romaji }}
        </h1>
        <div class="flex flex-wrap gap-2 mb-4">
          <span
            v-for="g in heroTitle.genres.slice(0, 3)"
            :key="g"
            class="border border-accent text-accent text-xs font-bold px-3 py-1 rounded-sm tracking-wider"
          >
            {{ g }}
          </span>
        </div>
        <RouterLink
          :to="`/${heroTitle.type.toLowerCase()}/${heroTitle.id}`"
          class="inline-flex items-center gap-2 bg-accent text-bg font-heading font-black px-6 py-3 text-sm tracking-widest hover:bg-accent-hover transition-colors"
        >
          <Play :size="14" fill="currentColor" /> VIEW TITLE
        </RouterLink>
      </div>
    </div>

    <!-- Sections -->
    <div class="px-4 md:px-8 xl:px-16 py-10 flex flex-col gap-14">
      <!-- Trending Anime -->
      <section>
        <div class="flex items-baseline gap-3 mb-4">
          <h2 class="text-white font-black text-2xl font-heading">Trending</h2>
          <span
            class="text-accent text-sm font-bold font-heading tracking-widest"
            >ANIME</span
          >
        </div>
        <div
          ref="trendingAnimeRow"
          class="flex gap-3 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing select-none"
        >
          <RouterLink
            v-for="m in trendingAnime"
            :key="m.id"
            :to="`/anime/${m.id}`"
            class="shrink-0 w-40 group"
          >
            <div class="relative w-40 h-56 rounded-sm overflow-hidden">
              <img
                :src="m.coverImage.large"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div
                class="absolute inset-0 bg-linear-to-t from-bg/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <div
                v-if="m.averageScore"
                class="absolute top-2 right-2 bg-bg/90 px-2 py-1 rounded text-accent font-bold font-heading text-xs"
              >
                {{ m.averageScore / 10 }}
              </div>
            </div>
            <p
              class="text-white text-xs font-bold font-heading mt-2 truncate group-hover:text-accent transition-colors"
            >
              {{ m.title.english || m.title.romaji }}
            </p>
          </RouterLink>
        </div>
      </section>

      <!-- Trending Manga -->
      <section>
        <div class="flex items-baseline gap-3 mb-4">
          <h2 class="text-white font-black text-2xl font-heading">Trending</h2>
          <span
            class="text-accent text-sm font-bold font-heading tracking-widest"
            >MANGA</span
          >
        </div>
        <div
          ref="trendingMangaRow"
          class="flex gap-3 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing select-none"
        >
          <RouterLink
            v-for="m in trendingManga"
            :key="m.id"
            :to="`/manga/${m.id}`"
            class="shrink-0 w-40 group"
          >
            <div class="relative w-40 h-56 rounded-sm overflow-hidden">
              <img
                :src="m.coverImage.large"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div
                class="absolute inset-0 bg-linear-to-t from-bg/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <div
                v-if="m.averageScore"
                class="absolute top-2 right-2 bg-bg/90 px-2 py-1 rounded text-accent font-bold font-heading text-xs"
              >
                {{ m.averageScore / 10 }}
              </div>
            </div>
            <p
              class="text-white text-xs font-bold font-heading mt-2 truncate group-hover:text-accent transition-colors"
            >
              {{ m.title.english || m.title.romaji }}
            </p>
          </RouterLink>
        </div>
      </section>

      <!-- Recently Added Anime -->
      <section>
        <div class="flex items-baseline gap-3 mb-4">
          <h2 class="text-white font-black text-2xl font-heading">
            Recently Added
          </h2>
          <span
            class="text-accent text-sm font-bold font-heading tracking-widest"
            >ANIME</span
          >
        </div>
        <div
          ref="recentAnimeRow"
          class="flex gap-3 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing select-none"
        >
          <RouterLink
            v-for="m in recentAnime"
            :key="m.id"
            :to="`/anime/${m.id}`"
            class="shrink-0 w-40 group"
          >
            <div class="relative w-40 h-56 rounded-sm overflow-hidden">
              <img
                :src="m.coverImage.large"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div
                class="absolute inset-0 bg-linear-to-t from-bg/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <div
                v-if="m.averageScore"
                class="absolute top-2 right-2 bg-bg/90 px-2 py-1 rounded text-accent font-bold font-heading text-xs"
              >
                {{ m.averageScore / 10 }}
              </div>
            </div>
            <p
              class="text-white text-xs font-bold font-heading mt-2 truncate group-hover:text-accent transition-colors"
            >
              {{ m.title.english || m.title.romaji }}
            </p>
          </RouterLink>
        </div>
      </section>

      <!-- Recently Added Manga -->
      <section>
        <div class="flex items-baseline gap-3 mb-4">
          <h2 class="text-white font-black text-2xl font-heading">
            Recently Added
          </h2>
          <span
            class="text-accent text-sm font-bold font-heading tracking-widest"
            >MANGA</span
          >
        </div>
        <div
          ref="recentMangaRow"
          class="flex gap-3 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing select-none"
        >
          <RouterLink
            v-for="m in recentManga"
            :key="m.id"
            :to="`/manga/${m.id}`"
            class="shrink-0 w-40 group"
          >
            <div class="relative w-40 h-56 rounded-sm overflow-hidden">
              <img
                :src="m.coverImage.large"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div
                class="absolute inset-0 bg-linear-to-t from-bg/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <div
                v-if="m.averageScore"
                class="absolute top-2 right-2 bg-bg/90 px-2 py-1 rounded text-accent font-bold font-heading text-xs"
              >
                {{ m.averageScore / 10 }}
              </div>
            </div>
            <p
              class="text-white text-xs font-bold font-heading mt-2 truncate group-hover:text-accent transition-colors"
            >
              {{ m.title.english || m.title.romaji }}
            </p>
          </RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Play } from 'lucide-vue-next';

const heroTitle = ref(null);
const trendingAnime = ref([]);
const trendingManga = ref([]);
const recentAnime = ref([]);
const recentManga = ref([]);
const heroPool = ref([]);
let heroInterval = null;
let heroIndex = 0;

const trendingAnimeRow = ref(null);
const trendingMangaRow = ref(null);
const recentAnimeRow = ref(null);
const recentMangaRow = ref(null);

const HOME_QUERY = `
  query HomeQuery {
    trendingAnime: Page(perPage: 20) {
      media(type: ANIME, sort: TRENDING_DESC) {
        id type
        title { romaji english }
        coverImage { large }
        bannerImage
        averageScore
        genres
      }
    }
    trendingManga: Page(perPage: 20) {
      media(type: MANGA, sort: TRENDING_DESC) {
        id type
        title { romaji english }
        coverImage { large }
        averageScore
        genres
      }
    }
    recentAnime: Page(perPage: 20) {
      media(type: ANIME, sort: START_DATE_DESC, status: RELEASING) {
        id type
        title { romaji english }
        coverImage { large }
        averageScore
        genres
      }
    }
    recentManga: Page(perPage: 20) {
      media(type: MANGA, sort: START_DATE_DESC, status: RELEASING) {
        id type
        title { romaji english }
        coverImage { large }
        averageScore
        genres
      }
    }
  }
`;

function makeDraggable(el) {
  if (!el) return;
  let isDown = false;
  let startX;
  let scrollLeft;

  el.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
    e.preventDefault();
  });
  el.addEventListener('mouseleave', () => {
    isDown = false;
  });
  el.addEventListener('mouseup', () => {
    isDown = false;
  });
  el.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeft - walk;
  });
}

onMounted(async () => {
  const res = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: HOME_QUERY }),
  });
  const data = await res.json();

  trendingAnime.value = data.data.trendingAnime.media;
  trendingManga.value = data.data.trendingManga.media;
  recentAnime.value = data.data.recentAnime.media;
  recentManga.value = data.data.recentManga.media;

  heroPool.value = trendingAnime.value.filter((m) => m.bannerImage);
  heroTitle.value = heroPool.value[0];

  heroInterval = setInterval(() => {
    heroIndex = (heroIndex + 1) % heroPool.value.length;
    heroTitle.value = heroPool.value[heroIndex];
  }, 4000);

  makeDraggable(trendingAnimeRow.value);
  makeDraggable(trendingMangaRow.value);
  makeDraggable(recentAnimeRow.value);
  makeDraggable(recentMangaRow.value);
});

onUnmounted(() => {
  clearInterval(heroInterval);
});
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
