import { createRouter, createWebHistory } from 'vue-router'
import Rezeptliste from '@/components/Rezeptliste.vue'

const routes = [
  { path: '/rezepte', name: 'rezepte', component: Rezeptliste },
  { path: '/', redirect: '/rezepte' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
