import { useAnilist } from './useAnilist.js';
import { computed, ref } from 'vue';

const SEARCH_ANIME = `
  query SearchAnime(
    $search: String,
    $genres: [String],
    $tags: [String],
    $format: [MediaFormat],
    $sort: [MediaSort],
    $page: Int,
    $status: MediaStatus,
    $countryOfOrigin: CountryCode,
    $startDate_greater: FuzzyDateInt,
    $startDate_lesser: FuzzyDateInt,
    $season: MediaSeason
    ) {
    Page(page: $page, perPage: 20) {
      pageInfo{
        hasNextPage
      }
      media(
      search: $search,
      genre_in: $genres,
      tag_in: $tags,
      format_in: $format,
      type: ANIME,
      sort: $sort,
      status: $status,
      countryOfOrigin: $countryOfOrigin,
      startDate_greater: $startDate_greater,
      startDate_lesser: $startDate_lesser,
      season: $season
    ) {
  id
  type
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

const FETCH_ANIME = `
  query FetchAnime($id: Int) {
    Media(id: $id, type: ANIME) {
      id
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
            title { romaji english }
            coverImage { large }
            averageScore
            genres
          }
        }
      }
    }
  }
`;

export function useAnime() {
  const { results, loading, error, query } = useAnilist();
  const anime = ref([]);
  const hasNextPage = ref(true);

  async function searchAnime(
    {
      search = null,
      genres = null,
      tags = null,
      format = null,
      sort = ['POPULARITY_DESC'],
      page = 1,
      status = null,
      season = null,
      countryOfOrigin = null,
      startDate_greater = null,
      startDate_lesser = null,
    } = {},
    append = false,
  ) {
    await query(SEARCH_ANIME, {
      search,
      genres,
      tags,
      format,
      sort,
      page,
      status,
      countryOfOrigin,
      season,
      startDate_greater,
      startDate_lesser,
    });

    const newResults = results.value?.Page?.media ?? [];
    anime.value = append ? [...anime.value, ...newResults] : newResults;
    hasNextPage.value = results.value?.Page?.pageInfo?.hasNextPage ?? false;
  }

  async function fetchAnime({ id }) {
    await query(FETCH_ANIME, { id });
  }

  const animeDetail = computed(() => results.value?.Media ?? null);

  return {
    anime,
    hasNextPage,
    animeDetail,
    loading,
    error,
    searchAnime,
    fetchAnime,
  };
}
