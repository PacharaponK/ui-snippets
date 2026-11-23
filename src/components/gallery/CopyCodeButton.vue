<script setup>
import { onUnmounted, ref } from 'vue'

const props = defineProps({
  source: { type: String, required: true },
})
const emit = defineEmits(['failed'])

const state = ref('idle')
let resetTimer

async function copyCode() {
  clearTimeout(resetTimer)
  state.value = 'pending'

  try {
    await navigator.clipboard.writeText(props.source)
    state.value = 'copied'
    resetTimer = setTimeout(() => { state.value = 'idle' }, 4000)
  } catch {
    state.value = 'failed'
    emit('failed')
  }
}

onUnmounted(() => clearTimeout(resetTimer))
</script>

<template>
  <div class="clipboard-control">
    <button
      type="button"
      class="text-button copy-button"
      :class="{ 'is-copied': state === 'copied' }"
      :disabled="state === 'pending'"
      @click="copyCode"
    >
      <i class="pi" :class="state === 'copied' ? 'pi-check' : 'pi-copy'" aria-hidden="true"></i>
      {{ state === 'copied' ? 'Copied!' : 'Copy code' }}
    </button>
    <span class="visually-hidden" role="status">{{ state === 'copied' ? 'Code copied to clipboard.' : '' }}</span>
    <span v-if="state === 'failed'" class="clipboard-error" role="alert">
      Clipboard unavailable. Select and copy the source manually.
    </span>
  </div>
</template>
