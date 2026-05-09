import { useAnilist } from './useAnilist';
import { computed } from 'vue';

const FETCH_GENRES = `
  query {
    GenreCollection
  }
`;

export function useGenres() {
  const { results, loading, error, query } = useAnilist();

  async function fetchGenres() {
    await query(FETCH_GENRES, {});
  }

  const genres = computed(() => results.value?.GenreCollection ?? []);

  return { genres, loading, error, fetchGenres };
}
