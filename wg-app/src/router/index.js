import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/putzplan',
    },
    {
      path: '/putzplan',
      name: 'putzplan',
      component: () => import('../components/Putzplan/Putzplan.vue'),
    },
    {
      path: '/money',
      name: 'money',
      component: () => import('../components/Money/Money.vue'),
    }
  ],
})

export default router
