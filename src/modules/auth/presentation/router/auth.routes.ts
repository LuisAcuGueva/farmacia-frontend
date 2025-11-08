import type { RouteRecordRaw } from 'vue-router'

/**
 * Auth Routes
 * Rutas del módulo de autenticación
 */
export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('../pages/LoginPage.vue'),
    meta: {
      requiresGuest: true,
      title: 'Iniciar Sesión',
    },
  },
  {
    path: '/auth/recover-password',
    name: 'RecoverPassword',
    component: () => import('../pages/RecoverPasswordPage.vue'),
    meta: {
      requiresGuest: true,
      title: 'Recuperar Contraseña',
    },
  },
  {
    path: '/auth',
    redirect: '/auth/login',
  },
]
