<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import CodeViewer from '../components/gallery/CodeViewer.vue'
import ComponentPreview from '../components/gallery/ComponentPreview.vue'
import CopyCodeButton from '../components/gallery/CopyCodeButton.vue'
import { categories, componentRegistry, findFramework } from '../data/componentRegistry'
import { galleryLocation } from '../router/galleryLocation'

const route = useRoute()
const example = computed(() => componentRegistry.value.find(entry => entry.id === route.params.id))
const framework = computed(() => findFramework(example.value?.framework))
const category = computed(() => categories.find(item => item.id === example.value?.category))
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

    <div :key="example.id" class="detail-grid" :class="{ 'detail-grid-wide': example.widePreview }">
      <section class="detail-panel" aria-labelledby="detail-preview">
        <header><h2 id="detail-preview"><i class="pi pi-eye" aria-hidden="true"></i> Live preview</h2></header>
        <ComponentPreview :example="example" />
      </section>
      <section class="detail-panel detail-source" aria-labelledby="detail-source">
        <header>
          <h2 id="detail-source"><i class="pi pi-code" aria-hidden="true"></i> Vue source</h2>
          <CopyCodeButton :source="example.sourceCode" />
        </header>
        <CodeViewer :source="example.sourceCode" />
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
