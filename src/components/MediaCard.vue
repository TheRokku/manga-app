<template>
  <div
    :title="
      [media.title.romaji, media.title.english].filter(Boolean).join('\n')
    "
    class="relative bg-bg shadow-2xl w-72 h-96 max-sm:w-full max-sm:h-80 rounded-md overflow-hidden font-heading hover:*:bg-bg/80 xl:hover:scale-x-105 xl:hover:scale-y-105 xl:hover:z-20 xl:hover:-rotate-1 xl:hover:*:rotate-0 xl:hover:shadow-accent/40 transition-all hover:cursor-pointer border-2 border-border hover:border-accent-hover hover:border-4"
  >
    <button
      @click.stop="toggleFavorite"
      class="absolute top-2 left-2 z-10 bg-bg/80 p-1.5 rounded-md hover:bg-accent/20 hover:cursor-pointer transition-colors"
    >
      <Heart
        :size="16"
        :fill="
          favoritesStore.isFavorite(media.id, mediaType)
            ? 'currentColor'
            : 'none'
        "
        class="transition-colors"
        :class="
          favoritesStore.isFavorite(media.id, mediaType)
            ? 'text-accent'
            : 'text-white'
        "
      />
    </button>
    <div
      v-if="media.averageScore"
      class="absolute top-2 right-2 z-20 bg-bg/80 px-2 py-1 rounded-md flex items-center gap-1 h-8"
    >
      <Star :size="12" fill="currentColor" class="text-accent" />
      <span class="text-accent text-sm font-bold font-heading">{{
        media.averageScore / 10
      }}</span>
    </div>

    <RouterLink :to="mediaType + '/' + media.id">
      <img
        :src="media.coverImage.large"
        :alt="media.title.romaji"
        :class="{
          'blur-sm':
            media.genres.includes('Ecchi') || media.genres.includes('Hentai'),
        }"
        class="absolute inset-0 w-full h-full object-cover"
      />
    </RouterLink>
    <div
      class="absolute bottom-0 left-0 right-0 bg-border/80 p-2 transition-colors duration-150"
    >
      <RouterLink :to="mediaType + '/' + media.id">
        <pre v-if="media.title.romaji" class="text-accent text-md font-bold">{{
          media.title.romaji
        }}</pre>
        <pre v-else class="h-6 w-full"></pre>
        <pre
          v-if="media.title.english"
          class="text-md text-low-accent/90 font-semibold"
          >{{ media.title.english }}</pre
        >

        <pre v-else class="h-6 w-full"></pre>
      </RouterLink>
      <ul class="flex overflow-scroll gap-2 py-4 md:py-5 sm:py-5">
        <li
          v-for="g in media.genres"
          @click.stop="selectedGenres.includes(g) ? '' : selectedGenres.push(g)"
          :key="g"
          class="border border-accent text-accent text-xs font-bold px-3 py-1 text-nowrap rounded-sm tracking-wider hover:bg-accent hover:text-bg transition-colors"
        >
          {{ g }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useRouter, RouterLink } from 'vue-router';
import { useUserStore } from '../stores/user.js';
import { useFavoritesStore } from '../stores/favorites.js';
import { Star, Heart, Magnet } from 'lucide-vue-next';
import { computed } from 'vue';

const router = useRouter();
const userStore = useUserStore();
const favoritesStore = useFavoritesStore();

const props = defineProps({
  media: { type: Object, required: true },
  selectedGenres: { type: Array, default: () => [] },
});

const mediaType = computed(
  () =>
    props.media.type ||
    (router.currentRoute.value.path.includes('manga') ? 'MANGA' : 'ANIME'),
);

function toggleFavorite() {
  if (!userStore.user) {
    router.push('/login');
    return;
  }
  const mediaType = props.media.type ?? 'MANGA';
  if (favoritesStore.isFavorite(props.media.id, mediaType)) {
    if (!confirm('Remove from your archive?')) return;
    favoritesStore.removeFavorite({
      userId: userStore.user.id,
      mediaId: props.media.id,
      mediaType,
    });
  } else {
    favoritesStore.addFavorite({
      userId: userStore.user.id,
      mediaId: props.media.id,
      mediaType,
    });
  }
}
</script>
