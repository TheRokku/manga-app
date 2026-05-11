<template>
  <Navbar />
  <RouterView v-slot="{ Component }">
    <Transition name="glitch" mode="out-in">
      <component :is="Component" :key="$route.path" />
    </Transition>
  </RouterView>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>
