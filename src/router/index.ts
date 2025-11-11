import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, guestGuard } from '@/core/shared/application/guards/auth.guard'
import { roleGuard } from '@/core/shared/application/guards/role.guard'
import { tenantGuard } from '@/core/router/guards/tenant.guard'

import { authRoutes } from '@/modules/auth/presentation/router/auth.routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    // Auth routes
    ...authRoutes,
    // Rutas protegidas
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        requiresAuth: true,
        requiresTenant: true,
        title: 'Dashboard',
      },
    },

    // Rutas de admin (sin tenant)
    {
      path: '/admin',
      children: [
        {
          path: 'dashboard',
          name: 'AdminDashboard',
          component: () => import('@admin/presentation/pages/AdminDashboardPage.vue'),
          beforeEnter: [authGuard, roleGuard(['SUPER_ADMIN', 'ADMIN'])],
          meta: {
            requiresAuth: true,
            requiresTenant: false, // Admin NO requiere tenant
            title: 'Dashboard Admin',
          },
        },
        {
          path: 'tenants',
          name: 'AdminTenants',
          component: () => import('@admin/presentation/pages/TenantListPage.vue'),
          beforeEnter: [authGuard, roleGuard(['SUPER_ADMIN', 'ADMIN'])],
          meta: {
            requiresAuth: true,
            requiresTenant: false, // Admin NO requiere tenant
            title: 'Gestión de Tenants',
          },
        },
      ],
    },

    // Rutas de error de tenant
    {
      path: '/tenant-not-found',
      name: 'TenantNotFound',
      component: () => import('../views/TenantNotFoundView.vue'),
      meta: {
        requiresAuth: false,
        requiresTenant: false,
        title: 'Tenant no encontrado',
      },
    },
    {
      path: '/suspended',
      name: 'TenantSuspended',
      component: () => import('../views/TenantSuspendedView.vue'),
      meta: {
        requiresAuth: false,
        requiresTenant: false,
        title: 'Cuenta suspendida',
      },
    },
    {
      path: '/invalid-tenant',
      name: 'InvalidTenant',
      component: () => import('../views/InvalidTenantView.vue'),
      meta: {
        requiresAuth: false,
        requiresTenant: false,
        title: 'Tenant inválido',
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

// ==================== GLOBAL NAVIGATION GUARDS ====================
// El orden es CRÍTICO para el funcionamiento multitenant

router.beforeEach(async (to, from, next) => {
  // 1️⃣ PRIMERO: Validar tenant (si la ruta lo requiere)
  if (to.meta.requiresTenant !== false) {
    // Por defecto, todas las rutas requieren tenant excepto admin y páginas de error
    const tenantResult = await new Promise<boolean>((resolve) => {
      tenantGuard(to, from, (result) => {
        if (result === undefined) {
          resolve(true) // Continuar
        } else if (typeof result === 'boolean') {
          resolve(result)
        } else {
          // Es una redirección
          next(result)
          resolve(false)
        }
      })
    })

    if (!tenantResult) {
      return // El tenant guard ya manejó la redirección
    }
  }

  // 2️⃣ SEGUNDO: Validar autenticación (si la ruta lo requiere)
  if (to.meta.requiresAuth === true) {
    const authResult = await new Promise<boolean>((resolve) => {
      authGuard(to, from, (result) => {
        if (result === undefined) {
          resolve(true)
        } else if (typeof result === 'boolean') {
          resolve(result)
        } else {
          next(result)
          resolve(false)
        }
      })
    })

    if (!authResult) {
      return
    }
  }

  // 3️⃣ TERCERO: Validar guest (rutas solo para no autenticados)
  if (to.meta.requiresGuest === true) {
    const guestResult = await new Promise<boolean>((resolve) => {
      guestGuard(to, from, (result) => {
        if (result === undefined) {
          resolve(true)
        } else if (typeof result === 'boolean') {
          resolve(result)
        } else {
          next(result)
          resolve(false)
        }
      })
    })

    if (!guestResult) {
      return
    }
  }

  // ✅ Todas las validaciones pasaron
  next()
})

// Set page title
router.afterEach((to) => {
  const defaultTitle = 'Sistema de Farmacia'
  document.title = to.meta.title ? `${to.meta.title} - ${defaultTitle}` : defaultTitle
})

export default router
