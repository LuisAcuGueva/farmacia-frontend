import type { RouteRecordRaw } from 'vue-router'

/**
 * Auth Routes
 * Rutas del módulo de autenticación
 */
export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    name: 'Auth',
    redirect: '/auth/login',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../pages/LoginPage.vue'),
        meta: {
          requiresAuth: false,
          title: 'Iniciar Sesión',
        },
      },
      {
        path: 'recover-password',
        name: 'RecoverPassword',
        component: () => import('../pages/RecoverPasswordPage.vue'),
        meta: {
          requiresAuth: false,
          title: 'Recuperar Contraseña',
        },
      },
    ],
  },
]
