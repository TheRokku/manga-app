<template>
  <div
    @click="
      () => {
        console.log('clicked', media.id);
        router.push(`/manga/${media.id}`);
      }
    "
    :title="
      [media.title.romaji, media.title.english].filter(Boolean).join('\n')
    "
    class="relative bg-bg shadow-2xl w-72 h-96 rounded-md overflow-hidden font-heading hover:*:bg-bg/80 xl:hover:scale-x-105 xl:hover:scale-y-105 xl:hover:z-20 xl:hover:-rotate-1 xl:hover:*:rotate-0 xl:hover:shadow-accent/40 transition-all hover:cursor-pointer border-2 border-border hover:border-accent-hover hover:border-4"
  >
    <button
      @click.stop="toggleFavorite"
      class="absolute top-2 left-2 z-10 bg-bg/80 p-1.5 rounded-md hover:bg-accent/20 hover:cursor-pointer transition-colors"
    >
      <Heart
        :size="16"
        :fill="
          favoritesStore.isFavorite(media.id, media.type ?? 'MANGA')
            ? 'currentColor'
            : 'none'
        "
        class="transition-colors"
        :class="
          favoritesStore.isFavorite(media.id, media.type ?? 'MANGA')
            ? 'text-accent'
            : 'text-white'
        "
      />
    </button>
    <div
      v-if="media.averageScore"
      class="absolute top-2 right-2 z-10 bg-bg/80 px-2 py-1 rounded-md flex items-center gap-1 h-8"
    >
      <Star :size="12" fill="currentColor" class="text-accent" />
      <span class="text-accent text-sm font-bold font-heading">{{
        media.averageScore / 10
      }}</span>
    </div>
    <img
      :src="media.coverImage.large"
      :alt="media.title.romaji"
      :class="{
        'blur-sm':
          media.genres.includes('Ecchi') || media.genres.includes('Hentai'),
      }"
      class="absolute inset-0 w-full h-full object-cover"
    />
    <div
      class="absolute bottom-0 left-0 right-0 bg-border/80 p-2 transition-colors duration-150"
    >
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
      <ul class="flex overflow-scroll gap-2 py-4 md:py-5 sm:py-5">
        <li
          v-for="g in media.genres"
          @click.stop="selectedGenres.push(g)"
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
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user.js';
import { useFavoritesStore } from '../stores/favorites.js';
import { Star, Heart } from 'lucide-vue-next';

const router = useRouter();
const userStore = useUserStore();
const favoritesStore = useFavoritesStore();

const props = defineProps({
  media: { type: Object, required: true },
  selectedGenres: { type: Array, default: () => [] },
});

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
