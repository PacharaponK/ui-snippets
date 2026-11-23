<script setup>
import { computed } from 'vue'
import { categories, componentRegistry, frameworks } from '../../data/componentRegistry'
import { galleryLocation } from '../../router/galleryLocation'

const props = defineProps({
  framework: { type: String, required: true },
  category: { type: String, required: true },
  search: { type: String, required: true },
  galleryActive: { type: Boolean, required: true },
  mobile: Boolean,
})

defineEmits(['navigate', 'close'])

const categoryCounts = computed(() => {
  const available = props.framework === 'all'
    ? componentRegistry
    : componentRegistry.filter(entry => entry.framework === props.framework)

  return Object.fromEntries(
    categories.map(({ id }) => [id, available.filter(entry => entry.category === id).length]),
  )
})
</script>

<template>
  <div class="sidebar-content">
    <div class="sidebar-top">
      <RouterLink class="brand" :to="galleryLocation()" @click="$emit('navigate')">
        <img src="/favicon.png" width="36" height="36" alt="">
        <span>Ready Components</span>
      </RouterLink>
      <button v-if="mobile" type="button" class="icon-button" aria-label="Close navigation" @click="$emit('close')">
        <i class="pi pi-times" aria-hidden="true"></i>
      </button>
    </div>

    <nav class="sidebar-section" aria-label="Frameworks">
      <p class="sidebar-label">Library</p>
      <RouterLink
        class="sidebar-link"
        :class="{ 'is-active': galleryActive && framework === 'all' && !category }"
        :aria-current-value="galleryActive && framework === 'all' && !category ? 'page' : 'false'"
        :to="galleryLocation()"
        @click="$emit('navigate')"
      >
        <i class="pi pi-th-large" aria-hidden="true"></i>
        <span>All Components</span>
        <span class="sidebar-count" aria-hidden="true">{{ componentRegistry.length }}</span>
      </RouterLink>
      <RouterLink
        v-for="item in frameworks"
        :key="item.id"
        class="sidebar-link"
        :class="{ 'is-active': galleryActive && framework === item.id }"
        :aria-current-value="galleryActive && framework === item.id ? 'page' : 'false'"
        :to="galleryLocation({ framework: item.id })"
        @click="$emit('navigate')"
      >
        <i class="pi" :class="item.icon" aria-hidden="true"></i>
        <span>{{ item.name }}</span>
      </RouterLink>
    </nav>

    <nav class="sidebar-section" aria-label="Categories">
      <p class="sidebar-label">Categories</p>
      <RouterLink
        v-for="item in categories"
        :key="item.id"
        class="sidebar-link"
        :class="{ 'is-active': galleryActive && category === item.id }"
        :aria-current-value="galleryActive && category === item.id ? 'true' : 'false'"
        :to="galleryLocation({ framework, category: category === item.id ? '' : item.id, search })"
        @click="$emit('navigate')"
      >
        <i class="pi" :class="item.icon" aria-hidden="true"></i>
        <span>{{ item.name }}</span>
        <span class="sidebar-count" aria-hidden="true">{{ categoryCounts[item.id] }}</span>
      </RouterLink>
    </nav>

    <nav class="sidebar-section sidebar-docs" aria-label="Framework documentation">
      <p class="sidebar-label">Documentation</p>
      <a v-for="item in frameworks" :key="item.id" class="sidebar-link" :href="item.url" target="_blank" rel="noopener noreferrer">
        <i class="pi pi-book" aria-hidden="true"></i>
        <span>{{ item.name }} docs</span>
        <i class="pi pi-arrow-up-right sidebar-external" aria-hidden="true"></i>
      </a>
    </nav>
  </div>
</template>
