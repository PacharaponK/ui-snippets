<script setup>
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import { galleryLocation } from '../../router/galleryLocation'

defineProps({
  search: { type: String, required: true },
  detailName: { type: String, default: '' },
})

const emit = defineEmits(['search', 'open-navigation'])
const input = useTemplateRef('searchInput')

function focusSearch(event) {
  const editing = event.target instanceof Element && event.target.closest(
    'input, textarea, select, [contenteditable]:not([contenteditable="false"])',
  )
  if (event.defaultPrevented || event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey || editing) return
  if (document.querySelector('dialog[open], [aria-modal="true"]')) return

  event.preventDefault()
  input.value?.focus()
}

function clearSearch() {
  emit('search', '')
  input.value?.focus()
}

onMounted(() => window.addEventListener('keydown', focusSearch))
onUnmounted(() => window.removeEventListener('keydown', focusSearch))
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="header-leading">
        <button
          type="button"
          class="icon-button menu-toggle"
          aria-label="Open navigation"
          aria-haspopup="dialog"
          @click="$emit('open-navigation')"
        >
          <i class="pi pi-bars" aria-hidden="true"></i>
        </button>
        <RouterLink class="mobile-brand brand" :to="galleryLocation()">
          <img src="/favicon.png" width="31" height="31" alt="">
          <span>Ready Components</span>
        </RouterLink>
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <RouterLink :to="galleryLocation()" class="breadcrumb-home">
            <i class="pi pi-home" aria-hidden="true"></i>
            <span>Library</span>
          </RouterLink>
          <i class="pi pi-angle-right" aria-hidden="true"></i>
          <RouterLink v-if="detailName" :to="galleryLocation()">Components</RouterLink>
          <span v-else aria-current="page">Components</span>
          <template v-if="detailName">
            <i class="pi pi-angle-right" aria-hidden="true"></i>
            <span aria-current="page">{{ detailName }}</span>
          </template>
        </nav>
      </div>

      <div class="search-field" role="search">
        <i class="pi pi-search" aria-hidden="true"></i>
        <input
          ref="searchInput"
          :value="search"
          type="search"
          aria-label="Search components"
          placeholder="Search components…"
          autocomplete="off"
          @input="$emit('search', $event.target.value)"
          @keydown.esc="clearSearch"
        >
        <button v-if="search" type="button" class="search-clear" aria-label="Clear search" @click="clearSearch">
          <i class="pi pi-times" aria-hidden="true"></i>
        </button>
        <kbd v-else title="Focus search">/</kbd>
      </div>
    </div>
  </header>
</template>
