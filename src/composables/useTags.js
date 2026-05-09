import { useAnilist } from './useAnilist.js';
import { computed } from 'vue';

const FETCH_TAGS = `
  query {
    MediaTagCollection {
      name
      category
      isAdult
    }
  }
`;

export function useTags() {
  const { results, loading, error, query } = useAnilist();

  async function fetchTags() {
    await query(FETCH_TAGS, {});
  }

  const tagsByCategory = computed(() => {
    const tags = results.value?.MediaTagCollection ?? [];
    const filtered = tags.filter((t) => !t.isAdult);

    return filtered.reduce((groups, tag) => {
      const category = tag.category || 'Other';
      if (!groups[category]) groups[category] = [];
      groups[category].push(tag.name);
      return groups;
    }, {});
  });

  const allTags = computed(() => {
    return Object.values(tagsByCategory.value).flat();
  });

  return { tagsByCategory, allTags, loading, error, fetchTags };
}
