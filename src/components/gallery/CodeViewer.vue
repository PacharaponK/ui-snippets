<script setup>
defineProps({
  source: { type: String, required: true },
})
</script>

<template>
  <pre class="source-code" tabindex="0" aria-label="Vue single-file component source"><code>{{ source }}</code></pre>
</template>
