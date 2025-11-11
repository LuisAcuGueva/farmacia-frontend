import type { RouteRecordRaw } from 'vue-router'
import { tenantGuard } from '@/core/router/guards/tenant.guard'

/**
 * Auth Routes
 * Rutas del módulo de autenticación
 */
export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('../pages/LoginPage.vue'),
    beforeEnter: [tenantGuard],
    meta: {
      requiresGuest: true,
      requiresTenant: true, // REQUIERE tenant válido
      title: 'Iniciar Sesión',
    },
  },
  {
    path: '/auth/recover-password',
    name: 'RecoverPassword',
    component: () => import('../pages/RecoverPasswordPage.vue'),
    beforeEnter: [tenantGuard],
    meta: {
      requiresGuest: true,
      requiresTenant: true, // REQUIERE tenant válido
      title: 'Recuperar Contraseña',
    },
  },
  {
    path: '/auth',
    redirect: '/auth/login',
  },
]
