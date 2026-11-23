<script setup>
import { computed, ref } from 'vue'
import { categories, findFramework } from '../../data/componentRegistry'
import ComponentPreview from './ComponentPreview.vue'
import CodeViewer from './CodeViewer.vue'
import CopyCodeButton from './CopyCodeButton.vue'

const props = defineProps({
  example: { type: Object, required: true },
})

const showSource = ref(false)
const framework = computed(() => findFramework(props.example.framework))
const category = computed(() => categories.find(item => item.id === props.example.category))
</script>

<template>
  <article class="gallery-card" :class="{ 'gallery-card-wide': example.widePreview }" :aria-labelledby="`${example.id}-title`">
    <header class="gallery-card-header">
      <div class="card-heading">
        <span class="component-icon"><i class="pi" :class="category.icon" aria-hidden="true"></i></span>
        <h3 :id="`${example.id}-title`">
          <RouterLink :to="{ name: 'component', params: { id: example.id } }">{{ example.name }}</RouterLink>
        </h3>
        <span class="framework-badge" :data-framework="framework.id">{{ framework.name }}</span>
      </div>
      <p>{{ example.description }}</p>
    </header>

    <div class="card-demo">
      <ComponentPreview v-show="!showSource" :example="example" />
      <CodeViewer v-if="showSource" :source="example.sourceCode" />
    </div>

    <footer class="gallery-card-footer">
      <div class="card-tabs" role="group" :aria-label="`${example.name} display`">
        <button class="text-button" type="button" :aria-pressed="!showSource" @click="showSource = false">
          <i class="pi pi-eye" aria-hidden="true"></i>
          Preview
        </button>
        <button class="text-button" type="button" :aria-pressed="showSource" @click="showSource = true">
          <i class="pi pi-code" aria-hidden="true"></i>
          Source
        </button>
      </div>
      <div class="card-actions">
        <CopyCodeButton :source="example.sourceCode" @failed="showSource = true" />
        <a
          v-if="example.documentationUrl"
          class="icon-button docs-button"
          :href="example.documentationUrl"
          :aria-label="`${framework.name} ${example.name} documentation`"
          title="Official documentation"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i class="pi pi-arrow-up-right" aria-hidden="true"></i>
        </a>
      </div>
    </footer>
  </article>
</template>
