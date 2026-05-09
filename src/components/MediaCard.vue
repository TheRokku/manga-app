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
          class="bg-card/90 p-1 px-3 rounded-md text-sm font-semibold text-nowrap text-center text-body"
        >
          {{ g }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { Type } from 'lucide-vue-next';
import { Star } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps({
  media: {
    type: Object,
    required: true,
  },
  selectedGenres: {
    type: Array,
    required: true,
  },
});
</script>
