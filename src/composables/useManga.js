import { useAnilist } from './useAnilist.js';
import { computed, ref } from 'vue';

const SEARCH_MANGA = `
  query SearchManga(
    $search: String,
    $genres: [String],
    $tags: [String],
    $format: [MediaFormat],
    $sort: [MediaSort],
    $page: Int,
    $status: MediaStatus,
    $countryOfOrigin: CountryCode,
    $startDate_greater: FuzzyDateInt,
    $startDate_lesser: FuzzyDateInt
  ) {
    Page(page: $page, perPage: 20) {
      pageInfo {
        hasNextPage
      }
      media(
        search: $search,
        genre_in: $genres,
        tag_in: $tags,
        format_in: $format,
        type: MANGA,
        sort: $sort,
        status: $status,
        countryOfOrigin: $countryOfOrigin,
        startDate_greater: $startDate_greater,
        startDate_lesser: $startDate_lesser
      ) {
        id
        title {
          romaji
          english
        }
        genres
        tags {
          name
        }
        averageScore
        coverImage {
          large
        }
        description(asHtml: false)
        status
        countryOfOrigin
        startDate {
          year
        }
        format
      }
    }
  }
`;

const FETCH_MANGA = `
  query FetchManga($id: Int) {
    Media(id: $id, type: MANGA) {
      id
      type
      title {
        romaji
        english
        native
      }
      genres
      averageScore
      coverImage {
        large
        extraLarge
      }
      bannerImage
      description(asHtml: false)
      status
      startDate { year month day }
      format
      chapters
      volumes
      countryOfOrigin
      staff {
        edges {
          role
          node {
            name { full }
          }
        }
      }
      recommendations {
        nodes {
          mediaRecommendation {
            id
            type
            title {
              romaji
              english
            }
            coverImage { large }
            averageScore
            genres
          }
        }
      }
    }
  }
`;

export function useManga() {
  const { results, loading, error, query } = useAnilist();
  const manga = ref([]);
  const hasNextPage = ref(true);

  async function searchManga(
    {
      search = null,
      genres = null,
      tags = null,
      format = null,
      sort = ['POPULARITY_DESC'],
      page = 1,
      status = null,
      countryOfOrigin = null,
      startDate_greater = null,
      startDate_lesser = null,
    } = {},
    append = false,
  ) {
    await query(SEARCH_MANGA, {
      search,
      genres,
      tags,
      format,
      sort,
      page,
      status,
      countryOfOrigin,
      startDate_greater,
      startDate_lesser,
    });

    const newResults = results.value?.Page?.media ?? [];
    manga.value = append ? [...manga.value, ...newResults] : newResults;
    hasNextPage.value = results.value?.Page?.pageInfo?.hasNextPage ?? false;
  }

  async function fetchManga({ id }) {
    await query(FETCH_MANGA, { id });
  }

  const mangaDetail = computed(() => results.value?.Media ?? null);

  return {
    manga,
    hasNextPage,
    mangaDetail,
    loading,
    error,
    searchManga,
    fetchManga,
  };
}
