<template>
  <div class="newtodo-container">
    <Button
      label="New todo"
      rounded
      icon="pi pi-plus"
      @click="$emit('openAddTaskBar')"
      raised
    />
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
</script>

<style scoped>
.newtodo-container,
.newtodo-container button {
  width: 100%;
}
</style>
