import { ref } from 'vue';

export function useAnilist() {
  const results = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function query(graphqlQuery, variables = {}) {
    loading.value = true;
    error.value = null;

    const cleanVariables = Object.fromEntries(
      Object.entries(variables).filter(([_, v]) => v !== null),
    );

    try {
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: graphqlQuery,
          variables: cleanVariables,
        }),
      });
      const json = await response.json();
      results.value = json.data;
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  }

  return { results, loading, error, query };
}
