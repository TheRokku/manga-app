import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../lib/supabase.js';

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref([]);
  const loading = ref(false);

  async function fetchFavorites(userId) {
    loading.value = true;
    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId);
    favorites.value = data ?? [];
    loading.value = false;
  }

  async function addFavorite({ userId, mediaId, mediaType }) {
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, media_id: mediaId, media_type: mediaType });
    if (!error)
      favorites.value.push({
        user_id: userId,
        media_id: mediaId,
        media_type: mediaType,
      });
  }

  async function removeFavorite({ userId, mediaId, mediaType }) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('media_id', mediaId)
      .eq('media_type', mediaType);
    if (!error)
      favorites.value = favorites.value.filter(
        (f) => !(f.media_id === mediaId && f.media_type === mediaType),
      );
  }

  function isFavorite(mediaId, mediaType) {
    return favorites.value.some(
      (f) => f.media_id === mediaId && f.media_type === mediaType,
    );
  }

  return {
    favorites,
    loading,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
});
