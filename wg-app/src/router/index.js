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
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../components/Auth/Auth.vue'),
    },
    {
      path: '/quittungen',
      name: 'quittungen',
      component: () => import('../components/Quittungen/Quittungen.vue'),
    },
    {
      path: '/quittung/:name',
      name: 'quittung',
      component: () => import('../components/Quittungen/Quittung.vue'),
    }
  ],
})

export default router
