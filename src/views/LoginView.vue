<template>
  <div class="flex min-h-screen">
    <!-- Left panel - Form -->
    <div
      class="w-full md:w-5/12 flex flex-col justify-center px-12 py-16 relative"
    >
      <!-- Faint kanji background -->
      <p
        class="absolute top-10 left-6 text-white/5 font-heading font-black text-9xl select-none pointer-events-none"
      >
        川
      </p>

      <RouterLink
        to="/"
        class="text-accent font-heading font-black text-2xl tracking-wider mb-16"
      >
        KAWAUMI
      </RouterLink>

      <h1 class="font-heading font-black text-5xl mb-2">Access</h1>

      <!-- Tab switcher -->
      <div class="flex gap-6 border-b border-border mb-8">
        <button
          @click="isLogin = true"
          class="font-heading font-bold text-sm pb-3 tracking-widest transition-colors"
          :class="
            isLogin ? 'text-accent border-b-2 border-accent' : 'text-muted'
          "
        >
          Login
        </button>
        <button
          @click="isLogin = false"
          class="font-heading font-bold text-sm pb-3 tracking-widest transition-colors"
          :class="
            !isLogin ? 'text-accent border-b-2 border-accent' : 'text-muted'
          "
        >
          Sign Up
        </button>
      </div>

      <!-- Error message -->
      <p v-if="error" class="text-red-500 text-sm mb-4 font-semibold">
        {{ error }}
      </p>
      <p v-if="success" class="text-accent text-sm mb-4 font-semibold">
        {{ success }}
      </p>

      <!-- Form -->
      <div class="flex flex-col gap-4 max-w-sm">
        <input
          v-model="email"
          type="email"
          placeholder="Email Address"
          class="bg-transparent border border-white/30 rounded-sm px-4 py-3 text-sm outline-accent focus:outline-1 focus:border-accent transition-colors"
        />
        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            class="bg-transparent border border-white/30 rounded-sm px-4 py-3 text-sm outline-accent focus:outline-1 focus:border-accent transition-colors w-full"
          />
          <button
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-accent transition-colors"
          >
            <Eye v-if="!showPassword" :size="16" />
            <EyeOff v-else :size="16" />
          </button>
        </div>

        <p
          v-if="isLogin"
          class="text-muted text-xs cursor-pointer hover:text-accent transition-colors"
        >
          Forgot Password?
        </p>

        <button
          @click="handleSubmit"
          :disabled="loading"
          class="border-2 border-accent text-accent font-heading font-black px-6 py-3 text-sm tracking-widest flex items-center justify-center gap-2 hover:bg-accent/10 transition-colors mt-2 disabled:opacity-50"
        >
          {{ loading ? 'LOADING...' : isLogin ? 'ENTER' : 'CREATE ACCOUNT' }}
          <ArrowRight :size="16" />
        </button>
      </div>
    </div>

    <!-- Right panel - Dark empty -->
    <div class="hidden md:block flex-1 bg-border/20 relative overflow-hidden">
      <p
        class="absolute bottom-10 right-10 text-white/5 font-heading font-black text-[20rem] leading-none select-none pointer-events-none"
      >
        川
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Eye, EyeOff, ArrowRight } from 'lucide-vue-next';
import { useUserStore } from '../stores/user.js';

const router = useRouter();
const userStore = useUserStore();

const isLogin = ref(true);
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const error = ref(null);
const success = ref(null);

async function handleSubmit() {
  error.value = null;
  success.value = null;
  loading.value = true;

  try {
    if (isLogin.value) {
      await userStore.signIn({ email: email.value, password: password.value });
      router.push('/profile');
    } else {
      await userStore.signUp({ email: email.value, password: password.value });
      success.value = 'Account created! Check your email to confirm.';
    }
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>
