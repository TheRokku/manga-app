<template>
  <div class="min-h-screen">
    <p v-if="loading" class="text-accent font-heading font-black text-4xl p-10">
      Loading...
    </p>
    <p v-if="error" class="text-red-500 p-10">{{ error }}</p>

    <div v-if="animeDetail" class="relative">
      <!-- Banner -->
      <img
        v-if="animeDetail.bannerImage"
        :src="animeDetail.bannerImage"
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
          <button
            @click.stop="toggleFavorite"
            class="absolute top-2 left-2 z-10 rounded-md hover:bg-accent/20 hover:cursor-pointer transition-colors"
          >
            <Heart
              :size="30"
              :color="'#e8b923'"
              stroke-width="3"
              :fill="
                favoritesStore.isFavorite(animeDetail.id, 'ANIME')
                  ? 'currentColor'
                  : 'none'
              "
              :class="
                favoritesStore.isFavorite(animeDetail.id, 'ANIME')
                  ? 'text-accent'
                  : 'text-white'
              "
              class="transition-colors"
            />
          </button>
          <img
            :src="animeDetail.coverImage.large"
            class="w-52 md:w-64 rounded-sm object-cover"
          />
          <div
            v-if="animeDetail.averageScore"
            class="absolute top-2 right-2 bg-bg/90 px-3 py-2 rounded-md text-center"
          >
            <p class="text-accent font-bold font-heading text-xl">
              {{ animeDetail.averageScore / 10 }}
            </p>
            <p class="text-muted text-xs tracking-widest">SCORE</p>
          </div>
        </div>

        <!-- Info -->
        <div class="flex flex-col gap-4 flex-1 font-heading">
          <div>
            <h1
              v-if="animeDetail.title.english"
              class="text-white font-black text-4xl xl:text-5xl uppercase"
            >
              {{ animeDetail.title.english }}
            </h1>
            <h2
              v-if="animeDetail.title.romaji"
              class="text-accent font-black text-2xl xl:text-3xl italic"
            >
              {{ animeDetail.title.romaji }}
            </h2>
            <h3
              v-if="animeDetail.title.native"
              class="text-muted font-bold text-sm mt-1"
            >
              {{ animeDetail.title.native }}
            </h3>
          </div>

          <!-- Meta -->
          <p class="text-muted text-sm font-semibold tracking-widest">
            {{ animeDetail.format }} &bull;
            {{ animeDetail.startDate?.year }} &bull;
            {{
              animeDetail.chapters ? animeDetail.chapters + ' CH' : 'Ongoing'
            }}
          </p>

          <!-- Genres -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="g in animeDetail.genres"
              :key="g"
              @click="router.push({ path: '/anime', query: { genre: g } })"
              class="border border-accent text-accent text-xs font-bold px-3 py-1 rounded-sm tracking-wider hover:bg-accent/10 transition-colors"
            >
              {{ g }}
            </button>
          </div>

          <!-- Description -->
          <div
            class="border-l-2 border-accent pl-4 text-sm text-white/80 leading-relaxed max-w-2xl font-body font-semibold"
            v-html="animeDetail.description"
          ></div>

          <!-- Staff -->
          <div
            v-if="animeDetail.staff.edges.length"
            class="grid grid-cols-2 md:grid-cols-3 gap-px bg-border border border-border rounded-sm overflow-hidden max-w-2xl mt-2"
          >
            <div
              v-for="edge in animeDetail.staff.edges.slice(0, 3)"
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
              class="border-2 border-accent text-accent font-heading font-black px-6 py-3 text-sm tracking-widest flex items-center gap-2 hover:bg-accent/10 transition-colors"
            >
              <Plus :size="14" /> ADD TO ARCHIVE
            </button>
          </div>
        </div>
      </div>

      <!-- Similar titles -->
      <div
        v-if="animeDetail.recommendations.nodes.length"
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
            v-for="rec in animeDetail.recommendations.nodes.slice(0, 4)"
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
import { useAnime } from '../../composables/useAnime.js';
import { ArrowLeft, Play, Plus, Star, Heart } from 'lucide-vue-next';
import { useUserStore } from '../../stores/user.js';
import { useFavoritesStore } from '../../stores/favorites.js';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const favoritesStore = useFavoritesStore();
const { animeDetail, loading, error, fetchAnime } = useAnime();

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchAnime({ id: parseInt(newId) });
    }
  },
);

function toggleFavorite() {
  if (!userStore.user) {
    router.push('/login');
    return;
  }
  if (favoritesStore.isFavorite(animeDetail.value.id, 'ANIME')) {
    if (!confirm('Remove from your archive?')) return;
    favoritesStore.removeFavorite({
      userId: userStore.user.id,
      mediaId: animeDetail.value.id,
      mediaType: 'ANIME',
    });
  } else {
    favoritesStore.addFavorite({
      userId: userStore.user.id,
      mediaId: animeDetail.value.id,
      mediaType: 'ANIME',
    });
  }
}

onMounted(() => {
  fetchAnime({ id: parseInt(route.params.id) });
});

const trailer = ref(false);
</script>
