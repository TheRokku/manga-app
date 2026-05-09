<template>
  <div class="flex flex-col px-4 md:px-10 xl:px-20 mt-6">
    <h1
      class="text-3xl md:text-4xl xl:text-5xl font-black tracking-tight font-heading mt-10 italic"
    >
      Browse the <span class="text-accent">Archive</span>
    </h1>
    <p
      class="my-6 md:my-8 text-sm md:text-base xl:text-lg font-semibold font-body text-low-accent max-w-full md:max-w-[78%] xl:max-w-[42%]"
    >
      Discover masterpieces across genres. From high-octane shonen to
      contemplative slice-of-life, curate your definitive collection.
    </p>

    <div
      class="flex flex-col gap-4 bg-border/40 border-border/80 border-2 py-6 px-4 rounded-sm"
    >
      <!-- Search -->
      <div class="flex flex-col gap-2 w-full">
        <h2 class="text-low-accent text-sm font-semibold">Search Titles</h2>
        <div class="flex flex-row w-full">
          <input
            v-model="searchQuery"
            @input="debouncedSearch"
            @keyup.enter="debouncedSearch"
            type="search"
            placeholder="e.g: Neon Genesis..."
            class="bg-border py-1 px-2 rounded-l-sm flex-1 h-12 mr-0.5 outline-accent focus:outline-2 transition-all"
          />
          <button
            @click="debouncedSearch"
            class="bg-border/80 px-4 rounded-r-sm cursor-pointer flex items-center justify-center h-12"
          >
            <Search :size="16" />
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div
        class="flex flex-row bg-[#1C1C1C] pb-4 gap-2 mt-2 not-landscape:flex-col"
      >
        <!-- Genre & Tags -->
        <div class="flex flex-col gap-1 overflow-visible">
          <h2 class="text-low-accent text-sm font-semibold">Genre & Tags</h2>
          <div ref="dropdownRef" class="relative">
            <button
              @click="isOpen = !isOpen"
              class="border-border/80 border-2 rounded-md px-4 py-3 text-sm whitespace-nowrap min-w-36 max-sm:w-full"
            >
              {{
                selectedGenres.length + selectedTags.length
                  ? `${selectedGenres.length + selectedTags.length} selected`
                  : 'All Genres & Tags'
              }}
              <button
                v-if="selectedGenres.length >= 1"
                @click="selectedGenres = []"
                class="ml-5 align-middle"
              >
                <Delete size="20" />
              </button>
            </button>
            <div
              v-if="isOpen"
              class="z-40 absolute bg-border/95 rounded-b-md mt-1 w-70 text-nowrap"
            >
              <div class="p-2">
                <!-- Search -->
                <input
                  v-model="genreTagSearch"
                  type="text"
                  placeholder="Search genres & tags..."
                  class="bg-bg border border-border rounded-sm px-3 py-2 text-sm w-full outline-accent focus:outline-1 mb-2"
                />
                <div class="max-h-72 overflow-y-scroll flex flex-col gap-3">
                  <!-- Genres section -->
                  <div
                    v-if="
                      genres.filter((g) =>
                        g.toLowerCase().includes(genreTagSearch.toLowerCase()),
                      ).length
                    "
                  >
                    <p
                      class="text-low-accent text-xs font-bold uppercase px-2 mb-1"
                    >
                      Genres
                    </p>
                    <label
                      v-for="genre in genres.filter((g) =>
                        g.toLowerCase().includes(genreTagSearch.toLowerCase()),
                      )"
                      :key="genre"
                      class="flex items-center gap-2 px-3 py-1.5 rounded-sm hover:bg-accent/20 hover:text-accent transition-colors cursor-pointer text-sm"
                      :class="{ 'text-accent': selectedGenres.includes(genre) }"
                    >
                      <input
                        type="checkbox"
                        :value="genre"
                        v-model="selectedGenres"
                        class="accent-accent"
                      />
                      {{ genre }}
                    </label>
                  </div>
                  <!-- Tags by category -->
                  <template
                    v-for="(tags, category) in tagsByCategory"
                    :key="category"
                  >
                    <div
                      v-if="
                        tags.filter((t) =>
                          t
                            .toLowerCase()
                            .includes(genreTagSearch.toLowerCase()),
                        ).length
                      "
                    >
                      <p
                        class="text-low-accent text-xs font-bold uppercase px-2 mb-1"
                      >
                        {{ category }}
                      </p>
                      <label
                        v-for="tag in tags.filter((t) =>
                          t
                            .toLowerCase()
                            .includes(genreTagSearch.toLowerCase()),
                        )"
                        :key="tag"
                        class="flex items-center gap-2 px-3 py-1.5 rounded-sm hover:bg-accent/20 hover:text-accent transition-colors cursor-pointer text-sm"
                        :class="{ 'text-accent': selectedTags.includes(tag) }"
                      >
                        <input
                          @click="
                            () => {
                              console.log('clicked', g);
                              router.push({
                                path: '/manga',
                                query: { genres: [selectedGenres] },
                              });
                            }
                          "
                          type="checkbox"
                          :value="tag"
                          v-model="selectedTags"
                          class="accent-accent"
                        />
                        {{ tag }}
                      </label>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Format -->
        <div class="flex flex-col gap-1">
          <h2 class="text-low-accent text-sm font-semibold">Format</h2>
          <div ref="formatDropdownRef" class="relative">
            <button
              @click="isFormatOpen = !isFormatOpen"
              class="border-border/80 border-2 rounded-md px-4 py-3 text-sm whitespace-nowrap min-w-36 max-sm:w-full"
            >
              {{
                selectedFormat.length
                  ? `${selectedFormat.length} selected`
                  : 'Any Format'
              }}
              <button
                v-if="selectedFormat.length >= 1"
                @click="selectedFormat = []"
                class="ml-5 align-middle"
              >
                <Delete size="20" />
              </button>
            </button>
            <div
              v-if="isFormatOpen"
              class="z-20 absolute bg-border/95 rounded-b-md mt-1 w-full"
            >
              <div class="flex flex-col gap-1 p-2">
                <label
                  v-for="o in formatOptions"
                  :key="o.value"
                  class="flex items-center gap-2 px-3 py-2 rounded-sm hover:bg-accent/20 hover:text-accent transition-colors cursor-pointer text-sm"
                  :class="{ 'text-accent': selectedFormat.includes(o.value) }"
                >
                  <input
                    type="checkbox"
                    :value="o.value"
                    v-model="selectedFormat"
                    class="accent-accent"
                  />
                  {{ o.label }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Status -->
        <div class="flex flex-col gap-1">
          <h2 class="text-low-accent text-sm font-semibold">Status</h2>
          <div ref="statusDropdownRef" class="relative">
            <button
              @click="isStatusOpen = !isStatusOpen"
              class="border-border/80 border-2 rounded-md px-4 py-3 text-sm whitespace-nowrap min-w-36 max-sm:w-full"
            >
              {{
                statusOptions.find((o) => o.value === selectedStatus)?.label ||
                'Any Status'
              }}
              <button
                v-if="selectedStatus != null"
                @click="selectedStatus = null"
                class="ml-5 align-middle"
              >
                <Delete size="20" />
              </button>
            </button>
            <div
              v-if="isStatusOpen"
              class="z-20 absolute bg-border/95 rounded-b-md mt-1 w-full"
            >
              <div class="flex flex-col gap-1 p-2">
                <button
                  v-for="o in statusOptions"
                  :key="o.value"
                  @click="
                    () => {
                      selectedStatus =
                        selectedStatus === o.value ? null : o.value;
                      isStatusOpen = false;
                    }
                  "
                  class="text-left px-3 py-2 rounded-sm hover:bg-accent/20 hover:text-accent transition-colors text-sm"
                  :class="{ 'text-accent': selectedStatus === o.value }"
                >
                  {{ o.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Country -->
        <div class="flex flex-col gap-1">
          <h2 class="text-low-accent text-sm font-semibold">Country</h2>
          <div ref="countryDropdownRef" class="relative">
            <button
              @click="isCountryOpen = !isCountryOpen"
              class="border-border/80 border-2 rounded-md px-4 py-3 text-sm whitespace-nowrap min-w-36 max-sm:w-full"
            >
              {{
                countryOptions.find((o) => o.value === selectedCountry)
                  ?.label || 'Any Country'
              }}
              <button
                v-if="selectedCountry != null"
                @click="selectedCountry = null"
                class="ml-5 align-middle"
              >
                <Delete size="20" />
              </button>
            </button>
            <div
              v-if="isCountryOpen"
              class="z-20 absolute bg-border/95 rounded-b-md mt-1 w-full"
            >
              <div class="flex flex-col gap-1 p-2">
                <button
                  v-for="o in countryOptions"
                  :key="o.value"
                  @click="
                    () => {
                      selectedCountry =
                        selectedCountry === o.value ? null : o.value;
                      isCountryOpen = false;
                    }
                  "
                  class="text-left px-3 py-2 rounded-sm hover:bg-accent/20 hover:text-accent transition-colors text-sm"
                  :class="{ 'text-accent': selectedCountry === o.value }"
                >
                  {{ o.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Year -->
        <div class="flex flex-col gap-1">
          <h2 class="text-low-accent text-sm font-semibold">Year</h2>
          <div ref="yearDropdownRef" class="relative">
            <button
              @click="isYearOpen = !isYearOpen"
              class="border-border/80 border-2 rounded-md px-4 py-3 text-sm whitespace-nowrap min-w-36 max-sm:w-full"
            >
              {{ selectedYear || 'Any Year' }}
              <button
                v-if="selectedYear != null"
                @click="selectedYear = null"
                class="ml-5 align-middle"
              >
                <Delete size="20" />
              </button>
            </button>
            <div
              v-if="isYearOpen"
              class="z-20 absolute bg-border/95 rounded-b-md mt-1 w-full"
            >
              <div class="flex flex-col gap-1 p-2 max-h-64 overflow-y-scroll">
                <button
                  v-for="year in years"
                  :key="year"
                  @click="
                    () => {
                      selectedYear = selectedYear === year ? null : year;
                      isYearOpen = false;
                    }
                  "
                  class="text-left px-3 py-2 rounded-sm hover:bg-accent/20 hover:text-accent transition-colors text-sm"
                  :class="{ 'text-accent': selectedYear === year }"
                >
                  {{ year }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sort -->
        <div class="flex flex-col gap-1">
          <h2 class="text-low-accent text-sm font-semibold">Sort By</h2>
          <div ref="sortDropdownRef" class="relative">
            <button
              @click="isSortOpen = !isSortOpen"
              class="border-border/80 border-2 rounded-md px-4 py-3 text-sm whitespace-nowrap min-w-36 max-sm:w-full"
            >
              {{
                sortOptions.find((o) => o.value === selectedSort[0])?.label ||
                'Sort By'
              }}
            </button>
            <div
              v-if="isSortOpen"
              class="z-20 absolute bg-border/95 rounded-b-md mt-1 w-full"
            >
              <div class="flex flex-col gap-1 p-2">
                <button
                  v-for="o in sortOptions"
                  :key="o.value"
                  @click="
                    () => {
                      selectedSort = [o.value];
                      isSortOpen = false;
                    }
                  "
                  class="text-left px-3 py-2 rounded-sm hover:bg-accent/20 hover:text-accent transition-colors text-sm"
                  :class="{ 'text-accent': selectedSort[0] === o.value }"
                >
                  {{ o.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Manga cards -->
  <div class="px-4 sm:px-5 md:px-10 xl:px-11 my-8">
    <h3
      v-if="loading"
      class="text-3xl xl:text-5xl text-accent font-bold font-heading pl-10"
    >
      Loading...
    </h3>
    <p v-if="error" class="text-red-500">{{ error }}</p>
    <div v-if="!loading" class="flex flex-wrap gap-2 justify-center">
      <MediaCard
        v-for="m in manga"
        :key="m.id"
        :media="m"
        :selected-genres="selectedGenres"
      />
    </div>
  </div>
</template>

<script setup>
import MediaCard from '../../components/MediaCard.vue';
import { onMounted, ref, watch, toRaw } from 'vue';
import { useManga } from '../../composables/useManga.js';
import { useDebounceFn, onClickOutside } from '@vueuse/core';
import { useGenres } from '../../composables/useGenres.js';
import { Search, Delete } from 'lucide-vue-next';
import { useTags } from '../../composables/useTags.js';
import { useRoute } from 'vue-router';

const route = useRoute();
const { tagsByCategory, allTags, fetchTags } = useTags();
const { genres, fetchGenres } = useGenres();
const { manga, loading, error, searchManga } = useManga();
const searchQuery = ref();
const genreTagSearch = ref('');

const selectedGenres = ref([]);
const selectedTags = ref([]);
const selectedSort = ref(['POPULARITY_DESC']);
const selectedYear = ref(null);
const selectedStatus = ref(null);
const selectedCountry = ref(null);
const selectedFormat = ref([]);

const isOpen = ref(false);
const isSortOpen = ref(false);
const isStatusOpen = ref(false);
const isCountryOpen = ref(false);
const isFormatOpen = ref(false);
const isYearOpen = ref(false);
const yearDropdownRef = ref(null);

const dropdownRef = ref(null);
const sortDropdownRef = ref(null);
const statusDropdownRef = ref(null);
const countryDropdownRef = ref(null);
const formatDropdownRef = ref(null);

const sortOptions = [
  { label: 'Most Popular', value: 'POPULARITY_DESC' },
  { label: 'Highest Rated', value: 'SCORE_DESC' },
  { label: 'Trending', value: 'TRENDING_DESC' },
  { label: 'Newest', value: 'START_DATE_DESC' },
];

const statusOptions = [
  { label: 'Finished', value: 'FINISHED' },
  { label: 'Releasing', value: 'RELEASING' },
  { label: 'Upcoming', value: 'NOT_YET_RELEASED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'On Hiatus', value: 'HIATUS' },
];

const countryOptions = [
  { label: 'Japan', value: 'JP' },
  { label: 'Korea', value: 'KR' },
  { label: 'China', value: 'CN' },
];

const formatOptions = [
  { label: 'Manga', value: 'MANGA' },
  { label: 'Light Novel', value: 'NOVEL' },
  { label: 'One Shot', value: 'ONE_SHOT' },
];

const years = Array.from(
  { length: new Date().getFullYear() - 1940 + 1 },
  (_, i) => new Date().getFullYear() - i,
);

onClickOutside(dropdownRef, () => (isOpen.value = false));
onClickOutside(sortDropdownRef, () => (isSortOpen.value = false));
onClickOutside(statusDropdownRef, () => (isStatusOpen.value = false));
onClickOutside(countryDropdownRef, () => (isCountryOpen.value = false));
onClickOutside(yearDropdownRef, () => (isYearOpen.value = false));
onClickOutside(formatDropdownRef, () => (isFormatOpen.value = false));

onMounted(() => {
  if (route.query.genre) {
    selectedGenres.value = [route.query.genre];
  }
  searchManga(buildSearch());
  fetchGenres();
  fetchTags();
});

function buildSearch() {
  return {
    search: searchQuery.value,
    genres: selectedGenres.value.length ? toRaw(selectedGenres.value) : null,
    tags: selectedTags.value.length ? toRaw(selectedTags.value) : null,
    format: selectedFormat.value.length ? toRaw(selectedFormat.value) : null,
    sort: toRaw(selectedSort.value),
    status: selectedStatus.value,
    countryOfOrigin: selectedCountry.value,
    startDate_greater: selectedYear.value
      ? parseInt(`${selectedYear.value}0101`)
      : null,
    startDate_lesser: selectedYear.value
      ? parseInt(`${selectedYear.value}1231`)
      : null,
  };
}

const debouncedSearch = useDebounceFn(() => searchManga(buildSearch()), 400);

watch(selectedGenres, () => searchManga(buildSearch()), { deep: true });
watch(selectedTags, () => searchManga(buildSearch()), { deep: true });
watch(selectedSort, () => searchManga(buildSearch()));
watch(selectedStatus, () => searchManga(buildSearch()));
watch(selectedCountry, () => searchManga(buildSearch()));
watch(selectedFormat, () => searchManga(buildSearch()), { deep: true });
watch(selectedYear, () => searchManga(buildSearch()));
</script>
