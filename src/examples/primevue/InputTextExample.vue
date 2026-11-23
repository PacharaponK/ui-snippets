<script setup>
import { ref, useId } from 'vue'
import InputText from 'primevue/inputtext'

const inputId = useId()
const name = ref('')
</script>

<template>
  <div class="input-example">
    <label :for="inputId">Name</label>
    <InputText :id="inputId" v-model="name" placeholder="Enter your name" size="small" fluid />
    <div class="input-value" aria-live="polite">
      Value: <code>{{ name || '—' }}</code>
    </div>
  </div>
</template>

<style scoped>
.input-example {
  display: grid;
  gap: 0.4rem;
  width: min(100%, 18rem);
  font-size: 0.8125rem;
}

.input-example label {
  font-weight: 600;
}

.input-value {
  color: #555d70;
  overflow-wrap: anywhere;
}
</style>
