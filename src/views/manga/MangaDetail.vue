<template>
  <div class="min-h-screen">
    <p v-if="loading" class="text-accent font-heading font-black text-4xl p-10">
      Loading...
    </p>
    <p v-if="error" class="text-red-500 p-10">{{ error }}</p>

    <div v-if="mangaDetail" class="relative">
      <!-- Banner -->
      <img
        v-if="mangaDetail.bannerImage"
        :src="mangaDetail.bannerImage"
        class="absolute top-0 left-0 -z-20 opacity-10 w-full h-full object-cover"
      />

      <!-- Back button -->
      <div class="px-8 pt-6">
        <button
          @click="router.back()"
          class="flex items-center gap-2 text-muted hover:text-accent transition-colors text-sm font-heading font-bold tracking-widest"
        >
          <ArrowLeft :size="16" /> RETURN
        </button>
      </div>

      <!-- Hero -->
      <div class="flex flex-col md:flex-row gap-8 px-8 py-10">
        <!-- Cover -->
        <div class="relative shrink-0">
          <div
            class="absolute top-2 left-2 z-10 rounded-md hover:bg-accent/20 hover:cursor-pointer transition-colors"
          >
            <div
              v-if="mangaDetail.averageScore"
              class="relative bg-bg/90 px-3 py-2 rounded-md text-center"
            >
              <p class="text-accent font-bold font-heading text-xl">
                {{ mangaDetail.averageScore / 10 }}
              </p>
              <p class="text-muted text-xs tracking-widest">SCORE</p>
            </div>
          </div>
          <img
            :src="mangaDetail.coverImage.large"
            class="w-52 md:w-64 rounded-sm object-cover"
          />
        </div>

        <!-- Info -->
        <div class="flex flex-col gap-4 flex-1 font-heading">
          <div>
            <h1
              v-if="mangaDetail.title.english"
              class="text-white font-black text-4xl xl:text-5xl uppercase"
            >
              {{ mangaDetail.title.english }}
            </h1>
            <h2
              v-if="mangaDetail.title.romaji"
              class="text-accent font-black text-2xl xl:text-3xl italic"
            >
              {{ mangaDetail.title.romaji }}
            </h2>
            <h3
              v-if="mangaDetail.title.native"
              class="text-muted font-bold text-sm mt-1"
            >
              {{ mangaDetail.title.native }}
            </h3>
          </div>

          <!-- Meta -->
          <p class="text-muted text-sm font-semibold tracking-widest">
            {{ mangaDetail.format }} &bull;
            {{ mangaDetail.startDate?.year }} &bull;
            {{
              mangaDetail.chapters ? mangaDetail.chapters + ' CH' : 'Ongoing'
            }}
          </p>

          <!-- Genres -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="g in mangaDetail.genres"
              :key="g"
              @click="router.push({ path: '/manga', query: { genre: g } })"
              class="border border-accent text-accent text-xs font-bold px-3 py-1 rounded-sm tracking-wider hover:bg-accent/10 transition-colors"
            >
              {{ g }}
            </button>
          </div>

          <!-- Description -->
          <div
            class="border-l-2 border-accent pl-4 text-sm text-white/80 leading-relaxed max-w-2xl font-body font-semibold"
            v-html="mangaDetail.description"
          ></div>

          <!-- Staff -->
          <div
            v-if="mangaDetail.staff.edges.length"
            class="grid grid-cols-2 md:grid-cols-3 gap-px bg-border border border-border rounded-sm overflow-hidden max-w-2xl mt-2"
          >
            <div
              v-for="edge in mangaDetail.staff.edges.slice(0, 3)"
              :key="edge.role"
              class="bg-bg px-4 py-3"
            >
              <p class="text-muted text-xs tracking-widest uppercase">
                {{ edge.role }}
              </p>
              <p class="text-accent font-semibold text-sm mt-1">
                {{ edge.node.name.full }}
              </p>
            </div>
          </div>

          <!-- CTAs -->
          <div class="flex flex-wrap gap-4 mt-2">
            <button
              v-if="trailer == true"
              class="bg-accent text-bg font-heading font-black px-6 py-3 text-sm tracking-widest flex items-center gap-2 hover:bg-accent-hover transition-colors"
            >
              <Play :size="14" fill="currentColor" /> WATCH TRAILER
            </button>
            <button
              @click="toggleFavorite"
              class="border-2 border-accent text-accent font-heading font-black px-8 py-3 text-sm tracking-widest flex items-center align-middle text-center gap-2 hover:bg-accent/10 transition-colors"
            >
              <Heart
                :size="18"
                :color="'#e8b923'"
                stroke-width="2"
                :fill="
                  favoritesStore.isFavorite(mangaDetail.id, 'MANGA')
                    ? 'currentColor'
                    : 'none'
                "
                :class="
                  favoritesStore.isFavorite(mangaDetail.id, 'MANGA')
                    ? 'text-accent'
                    : 'text-white'
                "
                class="transition-colors mb-0.5"
              />
              {{
                favoritesStore.isFavorite(mangaDetail.id, 'MANGA')
                  ? 'SAVED'
                  : 'ADD TO ARCHIVE'
              }}
            </button>
          </div>
        </div>
      </div>

      <!-- Similar titles -->
      <div
        v-if="mangaDetail.recommendations.nodes.length"
        class="px-8 py-10 border-t border-border"
      >
        <p
          class="text-muted text-xs font-bold tracking-widest uppercase mb-1 font-heading"
        >
          Related Archives
        </p>
        <h3 class="font-heading font-black text-3xl mb-6">
          Similar Atmosphere
        </h3>
        <div class="flex flex-wrap gap-4">
          <MediaCard
            v-for="rec in mangaDetail.recommendations.nodes.slice(0, 4)"
            :key="rec.mediaRecommendation.id"
            :media="rec.mediaRecommendation"
            :selected-genres="[]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MediaCard from '../../components/MediaCard.vue';
import { onMounted, watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useManga } from '../../composables/useManga.js';
import { ArrowLeft, Play, Plus, Star, Heart } from 'lucide-vue-next';
import { useUserStore } from '../../stores/user.js';
import { useFavoritesStore } from '../../stores/favorites.js';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const favoritesStore = useFavoritesStore();
const { mangaDetail, loading, error, fetchManga } = useManga();

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchManga({ id: parseInt(newId) });
    }
  },
);

function toggleFavorite() {
  if (!userStore.user) {
    router.push('/login');
    return;
  }
  if (favoritesStore.isFavorite(mangaDetail.value.id, 'MANGA')) {
    if (!confirm('Remove from your archive?')) return;
    favoritesStore.removeFavorite({
      userId: userStore.user.id,
      mediaId: mangaDetail.value.id,
      mediaType: 'MANGA',
    });
  } else {
    favoritesStore.addFavorite({
      userId: userStore.user.id,
      mediaId: mangaDetail.value.id,
      mediaType: 'MANGA',
    });
  }
}

onMounted(() => {
  fetchManga({ id: parseInt(route.params.id) });
});

const trailer = ref(false);
</script>
