<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'

const selected = ref('')
</script>

<template>
  <div class="button-example">
    <div class="button-variants" role="group" aria-label="PrimeVue button variants">
      <Button label="Primary" size="small" @click="selected = 'Primary'" />
      <Button label="Secondary" size="small" severity="secondary" @click="selected = 'Secondary'" />
      <Button label="Success" size="small" severity="success" @click="selected = 'Success'" />
      <Button label="Danger" size="small" severity="danger" @click="selected = 'Danger'" />
      <Button label="Disabled" size="small" disabled />
      <Button label="Loading" size="small" loading outlined />
    </div>
    <p v-if="selected" class="button-feedback" role="status">{{ selected }} clicked.</p>
  </div>
</template>

<style scoped>
.button-example {
  max-width: 23rem;
  text-align: center;
}

.button-variants {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.button-feedback {
  margin: 0.5rem 0 0;
  font-size: 0.8125rem;
}
</style>
