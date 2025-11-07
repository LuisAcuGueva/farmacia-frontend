import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, guestGuard } from '../core/application/guards/auth.guard'
import { authRoutes } from '../modules/auth/presentation/router/auth.routes'
import { useAuthStore } from '../modules/auth/presentation/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    // Auth routes
    ...authRoutes,
    // Dashboard route (temporal)
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Dashboard',
      },
    },
    // 404 Not Found
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue'),
      meta: {
        title: 'Página no encontrada',
      },
    },
  ],
})

// Global navigation guards
router.beforeEach((to, from, next) => {
  // Inicializar auth store desde localStorage
  const authStore = useAuthStore()
  authStore.initializeFromStorage()

  // Aplicar guard de autenticación
  if (to.meta.requiresAuth !== false) {
    authGuard(to, from, next)
  } else if (to.name === 'Login' || to.name === 'RecoverPassword') {
    // Aplicar guest guard a rutas de auth
    guestGuard(to, from, next)
  } else {
    next()
  }
})

// Set page title
router.afterEach((to) => {
  const defaultTitle = 'Sistema de Farmacia'
  document.title = to.meta.title ? `${to.meta.title} - ${defaultTitle}` : defaultTitle
})

export default router
