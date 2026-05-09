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
      <RouterLink
        to="/manga"
        class="nav-link hover:text-accent-hover transition-all"
        >BROWSE</RouterLink
      >
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
      <RouterLink to="/notifications" class="hover:text-accent transition-all">
        <Bell :size="22" :strokeWidth="2.5" />
      </RouterLink>
      <RouterLink to="/profile" class="hover:text-accent transition-all">
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
      >BROWSE</RouterLink
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
    <div class="flex gap-4 pt-2 justify-left items-center">
      <RouterLink
        to="/profile"
        class="hover:text-accent transition-all"
        @click="menuOpen = false"
      >
        <CircleUser :size="28" />
      </RouterLink>
      <RouterLink
        to="/notifications"
        class="hover:text-accent transition-all"
        @click="menuOpen = false"
      >
        <Bell :size="22" :strokeWidth="2.5" />
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Bell, CircleUser, Menu, X } from 'lucide-vue-next';

const menuOpen = ref(false);
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
