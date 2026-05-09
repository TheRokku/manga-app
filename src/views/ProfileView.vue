<template>
  <MediaCard v-for="m in manga" :key="m.id" :manga="m" />
</template>
<script setup>
import MediaCard from '../components/MediaCard.vue';
</script>
