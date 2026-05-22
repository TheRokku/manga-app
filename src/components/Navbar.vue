<template>
  <nav
    class="bg-bg flex flex-nowrap justify-between items-center px-8 py-4 shadow-accent/3 shadow-lg font-heading font-bold text-nowrap tracking-wide text-lg text-muted"
  >
    <!-- Logo -->
    <div>
      <RouterLink
        to="/"
        class="text-accent text-2xl hover:text-accent-hover transition-colors tracking-wider font-black"
      >
        KAWAUMI
      </RouterLink>
    </div>

    <!-- Desktop Links -->
    <div class="hidden md:flex gap-5 justify-center">
      <RouterLink to="/" class="nav-link hover:text-accent-hover transition-all"
        >HOME</RouterLink
      >
      <div>
        <div class="relative group inline-block">
          <p
            class="hover:text-accent-hover transition-all nav-link hover:cursor-pointer"
          >
            BROWSE
          </p>
          <div
            class="absolute -left-1/2 top-full pt-2 scale-0 group-hover:scale-100 group-focus:scale-100 transition-all z-50"
          >
            <div class="flex flex-col gap-2 bg-bg/90 p-3 rounded-sm min-w-max">
              <RouterLink
                to="/manga"
                class="nav-link hover:text-accent-hover transition-all"
                >BROWSE MANGA</RouterLink
              >
              <RouterLink
                to="/anime"
                class="nav-link hover:text-accent-hover transition-all"
                >BROWSE ANIME</RouterLink
              >
            </div>
          </div>
        </div>
      </div>
      <RouterLink
        to="/profile"
        class="nav-link hover:text-accent-hover transition-all"
        >COMMUNITY</RouterLink
      >
      <RouterLink
        to="/profile"
        class="nav-link hover:text-accent-hover transition-all"
        >MY LIST</RouterLink
      >
    </div>

    <!-- Desktop Icons -->
    <div class="hidden md:flex items-center gap-4">
      <RouterLink to="/profile" class="hover:text-accent transition-all">
        <Bell :size="22" :strokeWidth="2.5" />
      </RouterLink>

      <!-- Logged in: user dropdown -->
      <div v-if="userStore.user" class="relative group inline-block">
        <RouterLink
          to="/profile"
          class="text-sm hover:text-accent transition-colors"
        >
          <button
            class="hover:text-accent transition-all flex items-center gap-2"
          >
            <CircleUser :size="28" />
            <span
              class="text-sm text-muted group-hover:text-accent transition-colors"
            >
              {{ userStore.user.email.split('@')[0] }}
            </span>
          </button>
        </RouterLink>
        <div
          class="absolute right-0 top-full w-full pt-2 scale-0 group-hover:scale-100 transition-all z-50"
        >
          <div
            class="flex flex-col gap-2 bg-bg/90 border border-border p-3 rounded-sm min-w-max"
          >
            <RouterLink
              to="/profile"
              class="text-sm hover:text-accent transition-colors"
              >My Profile</RouterLink
            >
            <div class="w-full h-0.5 bg-muted"></div>
            <button
              @click="handleSignOut"
              class="text-sm text-left hover:text-accent transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <!-- Logged out -->
      <RouterLink v-else to="/login" class="hover:text-accent transition-all">
        <CircleUser :size="28" />
      </RouterLink>
    </div>

    <!-- Mobile Hamburger -->
    <button
      class="md:hidden hover:text-accent transition-all"
      @click="menuOpen = !menuOpen"
    >
      <Menu v-if="!menuOpen" :size="28" />
      <X v-else :size="28" />
    </button>
  </nav>

  <!-- Mobile Menu -->
  <div
    v-if="menuOpen"
    class="md:hidden bg-bg border-t border-border flex flex-col gap-4 px-8 py-6 font-heading font-bold tracking-wide text-lg text-muted"
  >
    <RouterLink
      to="/"
      class="hover:text-accent transition-all"
      @click="menuOpen = false"
      >HOME</RouterLink
    >
    <RouterLink
      to="/manga"
      class="hover:text-accent transition-all"
      @click="menuOpen = false"
      >BROWSE MANGA</RouterLink
    >
    <RouterLink
      to="/anime"
      class="hover:text-accent transition-all"
      @click="menuOpen = false"
      >BROWSE ANIME</RouterLink
    >
    <RouterLink
      to="/profile"
      class="hover:text-accent transition-all"
      @click="menuOpen = false"
      >COMMUNITY</RouterLink
    >
    <RouterLink
      to="/profile"
      class="hover:text-accent transition-all"
      @click="menuOpen = false"
      >MY LIST</RouterLink
    >

    <div class="flex gap-4 pt-2 items-center border-t border-border">
      <RouterLink
        to="/profile"
        class="hover:text-accent transition-all"
        @click="menuOpen = false"
      >
        <CircleUser :size="28" />
      </RouterLink>
      <div v-if="userStore.user" class="flex flex-col gap-1">
        <span class="text-sm text-accent">{{
          userStore.user.email.split('@')[0]
        }}</span>
        <button
          @click="handleSignOut"
          class="text-sm text-left hover:text-accent transition-colors"
        >
          Sign Out
        </button>
      </div>
      <RouterLink
        v-else
        to="/login"
        class="text-sm hover:text-accent transition-all"
        @click="menuOpen = false"
      >
        Sign In
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Bell, CircleUser, Menu, X } from 'lucide-vue-next';
import { useUserStore } from '../stores/user.js';
import { useRouter } from 'vue-router';

const menuOpen = ref(false);
const userStore = useUserStore();
const router = useRouter();

async function handleSignOut() {
  const signOutConfirmation = confirm('Are you sure you want to Sign Out?');
  if (signOutConfirmation) {
    await userStore.signOut();
    menuOpen.value = false;
    router.push('/');
  }
}
</script>

<style scoped>
.nav-link {
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}
.nav-link:hover::after {
  transform: scaleX(1);
}
</style>
