<script setup>
import { ref } from 'vue'

const selected = ref('')
</script>

<template>
  <div class="d-grid gap-2 text-center" role="group" aria-label="Bootstrap button variants">
    <div class="d-flex flex-wrap justify-content-center gap-2">
      <button type="button" class="btn btn-primary btn-sm" @click="selected = 'Primary'">Primary</button>
      <button type="button" class="btn btn-secondary btn-sm" @click="selected = 'Secondary'">Secondary</button>
      <button type="button" class="btn btn-outline-primary btn-sm" @click="selected = 'Outline'">Outline</button>
    </div>
    <div class="d-flex flex-wrap align-items-center justify-content-center gap-2">
      <button type="button" class="btn btn-outline-secondary btn-sm" @click="selected = 'Small'">Small</button>
      <button type="button" class="btn btn-outline-secondary" @click="selected = 'Default'">Default</button>
      <button type="button" class="btn btn-outline-secondary btn-lg" @click="selected = 'Large'">Large</button>
    </div>
    <p v-if="selected" class="small mb-0" role="status">{{ selected }} clicked.</p>
  </div>
</template>
