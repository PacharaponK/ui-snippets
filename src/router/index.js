import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ComponentDetailView from '../views/ComponentDetailView.vue'
import SignInView from '../views/SignInView.vue'
import { customizeCategoryId, isCustomizeRoute } from '../data/libraryAccess'
import { restoreSession, signedIn } from '../data/librarySession'
import { galleryLocation } from './galleryLocation'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'gallery', component: HomeView },
    { path: '/login', name: 'login', component: SignInView },
    { path: '/components/:id', name: 'component', component: ComponentDetailView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: ComponentDetailView },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.path !== from.path) return { top: 0 }
  },
})

router.beforeEach(async route => {
  await restoreSession()

  if (!signedIn.value && isCustomizeRoute(route)) {
    return { name: 'login', query: { next: route.fullPath }, replace: true }
  }
  if (signedIn.value && route.name === 'login') {
    return galleryLocation({ category: customizeCategoryId })
  }
})

export default router
