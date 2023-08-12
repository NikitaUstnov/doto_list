<template>
  <section class="main">
    <MainView />
  </section>
</template>

<script setup lang="ts">
import MainView from "@/components/MainView.vue";
</script>

<style scoped>
.main {
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
