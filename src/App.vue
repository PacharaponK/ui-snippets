<script setup>
import { computed, onMounted, onUnmounted, useTemplateRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import AppSidebar from './components/layout/AppSidebar.vue'
import { componentRegistry } from './data/componentRegistry'
import { isCustomizeRoute } from './data/libraryAccess'
import { signedIn } from './data/librarySession'
import { galleryLocation, readGalleryFilters } from './router/galleryLocation'

const route = useRoute()
const router = useRouter()
const navigation = useTemplateRef('navigation')

const galleryActive = computed(() => route.name === 'gallery')
const detail = computed(() => componentRegistry.value.find(entry => entry.id === route.params.id))
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

watch([detail, () => route.name], () => {
  const title = detail.value?.name ?? (route.name === 'login' ? 'Sign in' : '')
  document.title = title ? `${title} · Ready Components` : 'Ready Components'
}, { immediate: true })

watch(() => route.path, closeNavigation)
watch(signedIn, value => {
  if (!value && isCustomizeRoute(route)) router.replace(galleryLocation())
})
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
      :sign-in-page="route.name === 'login'"
      @search="updateSearch"
      @open-navigation="openNavigation"
    />
    <main id="main-content" class="main-content" tabindex="-1">
      <RouterView />
    </main>
  </div>
</template>
