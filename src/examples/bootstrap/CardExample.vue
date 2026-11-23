<script setup>
import { ref } from 'vue'

const added = ref(false)
</script>

<template>
  <div class="card" style="width: min(100%, 18rem)">
    <div class="card-body p-3">
      <h3 class="card-title fs-6">Starter project</h3>
      <p class="card-text small">A clean starting point for your next idea.</p>
      <button
        type="button"
        class="btn btn-primary btn-sm"
        :aria-pressed="added"
        @click="added = !added"
      >
        {{ added ? 'Added' : 'Add to projects' }}
      </button>
    </div>
  </div>
</template>
