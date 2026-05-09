<template>
  <div>
    <p v-if="loading">Loading...</p>
    <p v-if="error">{{ error }}</p>
    <div v-if="mangaDetail" class="relative flex py-20 px-10 h-full w-full">
      <img
        :src="mangaDetail.bannerImage"
        class="absolute top-0 left-0 -z-20 opacity-10 w-full h-full object-top overflow-hidden max-sm:hidden max-md:hidden"
      />
      <div
        class="flex max-sm:flex-col max-md:flex-col max-sm:gap-4 max-md:gap-4"
      >
        <img :src="mangaDetail.coverImage.large" />
        <div class="flex flex-col px-2 font-heading mx-10">
          <h1
            v-if="mangaDetail.title.english"
            class="text-accent font-bold text-5xl mb-2"
          >
            {{ mangaDetail.title.english }}
          </h1>
          <h2
            v-if="mangaDetail.title.romaji"
            class="text-low-accent font-bold text-md"
          >
            Romaji: {{ mangaDetail.title.romaji }}
          </h2>
          <h3
            v-if="mangaDetail.title.native"
            class="text-low-accent font-bold text-md"
          >
            Navive: {{ mangaDetail.title.native }}
          </h3>
          <p
            class="font-body font-semibold mt-2 text-white/80"
            v-html="mangaDetail.description"
          ></p>
          <div class="flex gap-5 mt-5">
            <button
              v-for="g in mangaDetail.genres"
              @click="
                () => {
                  console.log('clicked', g);
                  router.push({ path: '/manga', query: { genres: [g] } });
                }
              "
              class="font-body font-semibold bg-accent px-2 py-1 rounded-md"
            >
              {{ g }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useManga } from '../../composables/useManga.js';

const route = useRoute();
const router = useRouter();
const { mangaDetail, loading, error, fetchManga } = useManga();

onMounted(() => {
  fetchManga({ id: parseInt(route.params.id) });
});
</script>
