import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ComponentDetailView from '../views/ComponentDetailView.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'gallery', component: HomeView },
    { path: '/components/:id', name: 'component', component: ComponentDetailView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: ComponentDetailView },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.path !== from.path) return { top: 0 }
  },
})
