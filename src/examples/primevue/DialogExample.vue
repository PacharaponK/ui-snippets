<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

const visible = ref(false)
const confirmed = ref(false)

function openDialog() {
  confirmed.value = false
  visible.value = true
}

function confirmChanges() {
  confirmed.value = true
  visible.value = false
}
</script>

<template>
  <div class="dialog-example">
    <Button label="Open dialog" icon="pi pi-window-maximize" size="small" outlined @click="openDialog" />
    <p v-if="confirmed" role="status">Changes confirmed.</p>
    <Dialog v-model:visible="visible" modal header="Confirm changes" :style="{ width: 'min(24rem, 90vw)' }">
      <p>Apply your changes to this workspace?</p>
      <template #footer>
        <Button label="Cancel" severity="secondary" autofocus @click="visible = false" />
        <Button label="Confirm" @click="confirmChanges" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.dialog-example {
  text-align: center;
}

.dialog-example > p {
  margin: 0.5rem 0 0;
  font-size: 0.8125rem;
}
</style>
