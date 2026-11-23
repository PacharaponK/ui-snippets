<script setup>
defineProps({
  example: { type: Object, required: true },
})
</script>

<template>
  <div class="preview-stage" role="group" :aria-label="`${example.name} live preview`">
    <component :is="example.previewComponent" />
  </div>
</template>
