<script setup>
import { computed, onMounted, onUnmounted, useTemplateRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import AppSidebar from './components/layout/AppSidebar.vue'
import { componentRegistry } from './data/componentRegistry'
import { galleryLocation, readGalleryFilters } from './router/galleryLocation'

const route = useRoute()
const router = useRouter()
const navigation = useTemplateRef('navigation')

const galleryActive = computed(() => route.name === 'gallery')
const detail = computed(() => componentRegistry.find(entry => entry.id === route.params.id))
const filters = computed(() => readGalleryFilters(route.query))
const sidebarProps = computed(() => ({ ...filters.value, galleryActive: galleryActive.value }))

function updateSearch(searchValue) {
  const location = galleryLocation({ ...filters.value, search: searchValue })
  if (galleryActive.value) router.replace(location)
  else router.push(location)
}

function openNavigation() {
  if (!navigation.value.open) navigation.value.showModal()
}

function closeNavigation() {
  navigation.value?.close()
}

function closeOnBackdrop(event) {
  if (event.target === navigation.value) closeNavigation()
}

const desktop = window.matchMedia('(min-width: 901px)')
function closeOnDesktop(event) {
  if (event.matches) closeNavigation()
}
onMounted(() => desktop.addEventListener('change', closeOnDesktop))
onUnmounted(() => desktop.removeEventListener('change', closeOnDesktop))

watch(() => route.path, () => {
  document.title = detail.value ? `${detail.value.name} · Ready Components` : 'Ready Components'
  closeNavigation()
}, { immediate: true })
</script>

<template>
  <a href="#main-content" class="skip-link">Skip to content</a>
  <aside class="desktop-sidebar">
    <AppSidebar v-bind="sidebarProps" />
  </aside>
  <dialog ref="navigation" class="mobile-sidebar" aria-label="Navigation" @click="closeOnBackdrop">
    <AppSidebar v-bind="sidebarProps" mobile @close="closeNavigation" @navigate="closeNavigation" />
  </dialog>

  <div class="app-content">
    <AppHeader
      :search="filters.search"
      :detail-name="detail?.name"
      @search="updateSearch"
      @open-navigation="openNavigation"
    />
    <main id="main-content" class="main-content" tabindex="-1">
      <RouterView />
    </main>
  </div>
</template>
