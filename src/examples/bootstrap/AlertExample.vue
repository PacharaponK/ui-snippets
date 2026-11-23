<script setup>
import { ref } from 'vue'

const visible = ref(true)
</script>

<template>
  <div class="alert-examples d-grid gap-2">
    <div class="alert alert-success py-1 px-2 mb-0">Changes saved successfully.</div>
    <div class="alert alert-warning py-1 px-2 mb-0">Your session expires soon.</div>
    <div v-if="visible" class="alert alert-danger d-flex align-items-center justify-content-between gap-2 py-1 px-2 mb-0">
      <span>Something went wrong.</span>
      <button class="btn-close" type="button" aria-label="Dismiss alert" @click="visible = false"></button>
    </div>
    <button v-else class="btn btn-sm btn-outline-secondary" type="button" @click="visible = true">
      Show alert
    </button>
  </div>
</template>

<style scoped>
.alert-examples {
  width: min(100%, 17rem);
  font-size: 0.8125rem;
}

.alert-examples .btn-close {
  font-size: 0.625rem;
}

.alert-examples > .btn {
  justify-self: start;
}
</style>
