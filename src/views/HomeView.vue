<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ComponentCard from '../components/gallery/ComponentCard.vue'
import { categories, componentRegistry, findFramework, frameworks } from '../data/componentRegistry'
import { galleryLocation, readGalleryFilters } from '../router/galleryLocation'

const route = useRoute()
const router = useRouter()
const filters = computed(() => readGalleryFilters(route.query))
const frameworkOptions = [{ id: 'all', name: 'All' }, ...frameworks]

const heading = computed(() => {
  const { category, framework } = filters.value
  if (category) return categories.find(item => item.id === category).name
  if (framework !== 'all') return `${findFramework(framework).name} components`
  return 'All components'
})

const results = computed(() => {
  const { search, category, framework } = filters.value
  const terms = search.toLowerCase().trim().split(/\s+/).filter(Boolean)

  return componentRegistry.value.filter(entry => {
    const matchesFramework = framework === 'all' || entry.framework === framework
    const matchesCategory = !category || entry.category === category
    const searchable = [entry.name, ...entry.tags].join(' ').toLowerCase()

    return matchesFramework && matchesCategory && terms.every(term => searchable.includes(term))
  })
})

function selectFramework(framework) {
  router.push(galleryLocation({ ...filters.value, framework }))
}

function clearFilters() {
  router.push(galleryLocation())
}
</script>

<template>
  <section class="library-hero" aria-labelledby="library-title">
    <div class="hero-content">
      <h1 id="library-title">Component library</h1>
      <p>Browse live PrimeVue and Bootstrap examples, inspect the source, and copy reusable Vue snippets.</p>
    </div>
    <div class="hero-art" aria-hidden="true">
      <div class="hero-orbit"></div>
      <div class="hero-editor">
        <div class="hero-editor-bar"><span></span><span></span><span></span></div>
        <div class="hero-editor-code">
          <div><span>&lt;template&gt;</span></div>
          <div>&nbsp;&nbsp;&lt;<b>Button</b> <em>label</em>=<strong>"Run"</strong> /&gt;</div>
          <div><span>&lt;/template&gt;</span></div>
        </div>
      </div>
      <div class="hero-sample">
        <span><i class="pi pi-play" aria-hidden="true"></i> Run</span>
      </div>
      <i class="pi pi-code hero-code-icon"></i>
    </div>
  </section>

  <section class="gallery-section" aria-labelledby="gallery-heading">
    <div class="gallery-toolbar">
      <div class="gallery-heading">
        <h2 id="gallery-heading">{{ heading }}</h2>
        <p aria-live="polite">{{ results.length }} {{ results.length === 1 ? 'component' : 'components' }}</p>
      </div>
      <div class="framework-filter" role="group" aria-label="Filter by framework">
        <button
          v-for="item in frameworkOptions"
          :key="item.id"
          type="button"
          :aria-pressed="filters.framework === item.id"
          @click="selectFramework(item.id)"
        >
          {{ item.name }}
        </button>
      </div>
    </div>

    <div v-if="results.length" class="gallery-grid">
      <ComponentCard v-for="example in results" :key="example.id" :example="example" />
    </div>
    <div v-else class="empty-state">
      <span class="empty-icon"><i class="pi pi-search" aria-hidden="true"></i></span>
      <h3>No components found</h3>
      <p>Try another search term or clear the current filters.</p>
      <button class="primary-action" type="button" @click="clearFilters">Clear filters</button>
    </div>
  </section>
</template>
