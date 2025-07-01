import { createRouter, createWebHistory } from 'vue-router'

import CdnCore from '../views/CdnCore.vue'
import Home from '../views/Home.vue'
import LoadScript from '../views/LoadScript.vue'
import Performance from '../views/Performance.vue'
import Sandbox from '../views/Sandbox.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/load-script',
    name: 'LoadScript',
    component: LoadScript
  },
  {
    path: '/sandbox',
    name: 'Sandbox',
    component: Sandbox
  },
  {
    path: '/performance',
    name: 'Performance',
    component: Performance
  },
  {
    path: '/cdn-core',
    name: 'CdnCore',
    component: CdnCore
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
