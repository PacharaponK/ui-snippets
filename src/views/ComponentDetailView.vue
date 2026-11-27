<script setup>
import { computed, ref, watch } from 'vue'
import Button from 'primevue/button'
import { useRoute } from 'vue-router'
import CodeViewer from '../components/gallery/CodeViewer.vue'
import ComponentPreview from '../components/gallery/ComponentPreview.vue'
import CopyCodeButton from '../components/gallery/CopyCodeButton.vue'
import CustomizeSourceViewer from '../components/gallery/CustomizeSourceViewer.vue'
import { categories, componentRegistry, findFramework } from '../data/componentRegistry'
import { customizeCategoryId } from '../data/libraryAccess'
import { galleryLocation } from '../router/galleryLocation'

const route = useRoute()
const example = computed(() => componentRegistry.value.find(entry => entry.id === route.params.id))
const framework = computed(() => findFramework(example.value?.framework))
const category = computed(() => categories.find(item => item.id === example.value?.category))
const isCustomize = computed(() => example.value?.category === customizeCategoryId)
const sourceOpen = ref(false)
const sourceExpanded = ref(false)
watch(() => route.params.id, () => {
  sourceOpen.value = false
  sourceExpanded.value = false
})
</script>

<template>
  <RouterLink class="back-link" :to="galleryLocation()">
    <i class="pi pi-arrow-left" aria-hidden="true"></i> All components
  </RouterLink>

  <template v-if="example">
    <div class="detail-heading">
      <div>
        <div class="detail-meta">
          <span class="framework-badge" :data-framework="framework.id">{{ framework.name }}</span>
          <RouterLink :to="galleryLocation({ category: category.id })">{{ category.name }}</RouterLink>
        </div>
        <h1>{{ example.name }}</h1>
        <p>{{ example.description }}</p>
      </div>
      <a
        v-if="example.documentationUrl"
        class="detail-docs text-button"
        :href="example.documentationUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        Official documentation <i class="pi pi-arrow-up-right" aria-hidden="true"></i>
      </a>
    </div>

    <div :key="example.id" class="detail-grid" :class="{ 'detail-grid-wide': example.widePreview || isCustomize }">
      <section class="detail-panel" aria-labelledby="detail-preview">
        <header><h2 id="detail-preview"><i class="pi pi-eye" aria-hidden="true"></i> Live preview</h2></header>
        <ComponentPreview :example="example" />
      </section>
      <section
        class="detail-panel detail-source"
        :class="{ 'detail-source-customize': isCustomize, 'detail-source-expanded': sourceExpanded }"
        aria-labelledby="detail-source"
      >
        <header class="flex-wrap">
          <h2 id="detail-source"><i class="pi pi-code" aria-hidden="true"></i> Vue source</h2>
          <div class="d-flex flex-wrap align-items-center gap-2">
            <Button
              v-if="isCustomize"
              type="button"
              :label="sourceOpen ? 'Hide source' : 'Show source'"
              :aria-expanded="sourceOpen"
              aria-controls="detail-source-code"
              class="text-button"
              text
              size="small"
              @click="sourceOpen = !sourceOpen"
            />
            <Button
              v-if="isCustomize && sourceOpen"
              type="button"
              :label="sourceExpanded ? 'Collapse' : 'Expand'"
              aria-controls="detail-source-code"
              class="text-button"
              text
              size="small"
              @click="sourceExpanded = !sourceExpanded"
            />
            <CopyCodeButton :source="example.sourceCode" @failed="sourceOpen = true" />
          </div>
        </header>
        <CustomizeSourceViewer
          v-if="isCustomize"
          :source="example.sourceCode"
          :sections="example.sourceSections"
          :open="sourceOpen"
        />
        <CodeViewer v-else :source="example.sourceCode" />
      </section>
    </div>
  </template>

  <section v-else class="empty-state detail-empty">
    <span class="empty-icon"><i class="pi pi-search" aria-hidden="true"></i></span>
    <h1>Component not found</h1>
    <p>This address doesn’t match a component in the library.</p>
    <RouterLink class="primary-action" :to="galleryLocation()">Browse components</RouterLink>
  </section>
</template>
