import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../lib/supabase.js';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const profile = ref(null);
  const loading = ref(true);

  async function fetchUser() {
    const { data } = await supabase.auth.getSession();
    user.value = data.session?.user ?? null;
    loading.value = false;
    if (user.value) await fetchProfile();
  }

  async function fetchProfile() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single();
    profile.value = data;
  }

  async function updateProfile({ username, avatarFile }) {
    let avatar_url = profile.value?.avatar_url ?? null;

    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop();
      const path = `${user.value.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, avatarFile, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(path);
      avatar_url = urlData.publicUrl;
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.value.id, username, avatar_url });
    if (error) throw error;

    profile.value = { ...profile.value, username, avatar_url };
  }

  async function signUp({ email, password }) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    user.value = data.user;
  }

  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    user.value = data.user;
    await fetchProfile();
  }

  async function signOut() {
    await supabase.auth.signOut();
    user.value = null;
    profile.value = null;
  }

  return {
    user,
    profile,
    loading,
    fetchUser,
    fetchProfile,
    updateProfile,
    signUp,
    signIn,
    signOut,
  };
});
