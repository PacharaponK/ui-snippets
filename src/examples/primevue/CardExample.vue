<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'

const saved = ref(false)
</script>

<template>
  <Card class="example-card">
    <template #header>
      <div class="card-header-strip">WORKSPACE</div>
    </template>
    <template #title>Design notes</template>
    <template #content>
      Keep ideas, references, and decisions together.
    </template>
    <template #footer>
      <Button
        :label="saved ? 'Saved' : 'Save note'"
        :aria-pressed="saved"
        size="small"
        @click="saved = !saved"
      />
    </template>
  </Card>
</template>

<style scoped>
.example-card {
  width: min(100%, 18rem);
  overflow: hidden;
  font-size: 0.8125rem;
  --p-card-body-padding: 0.875rem;
  --p-card-body-gap: 0.45rem;
  --p-card-title-font-size: 1rem;
}

.card-header-strip {
  padding: 0.65rem 0.875rem;
  background: #ecebff;
  color: #443ca7;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}
</style>
