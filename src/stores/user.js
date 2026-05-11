import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../lib/supabase.js';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const loading = ref(true);

  async function fetchUser() {
    const { data } = await supabase.auth.getSession();
    user.value = data.session?.user ?? null;
    loading.value = false;
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
  }

  async function signOut() {
    await supabase.auth.signOut();
    user.value = null;
  }

  return { user, loading, fetchUser, signUp, signIn, signOut };
});
