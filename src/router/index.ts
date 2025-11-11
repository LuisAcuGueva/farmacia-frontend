import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, guestGuard } from '@shared/application/guards/auth.guard'
import { roleGuard } from '@shared/application/guards/role.guard'
import { tenantGuard } from '@shared/application/guards/tenant.guard'

// Layouts
import AdminLayout from '@shared/presentation/layouts/AdminLayout.vue'
import TenantLayout from '@shared/presentation/layouts/TenantLayout.vue'
import AuthLayout from '@shared/presentation/layouts/AuthLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ==================== ROOT REDIRECT ====================
    {
      path: '/',
      redirect: () => {
        // Redirigir según contexto (esto se puede mejorar)
        return '/app/dashboard'
      },
    },

    // ==================== AUTH ROUTES (con AuthLayout) ====================
    {
      path: '/auth',
      component: AuthLayout,
      meta: {
        requiresAuth: false,
        requiresTenant: true, // Las rutas de auth SÍ requieren tenant (excepto admin)
      },
      children: [
        {
          path: 'login',
          name: 'Login',
          component: () => import('@auth/presentation/pages/LoginPage.vue'),
          beforeEnter: [tenantGuard, guestGuard],
          meta: {
            requiresGuest: true,
            requiresTenant: true,
            title: 'Iniciar Sesión',
          },
        },
        {
          path: 'recover-password',
          name: 'RecoverPassword',
          component: () => import('@auth/presentation/pages/RecoverPasswordPage.vue'),
          beforeEnter: [tenantGuard, guestGuard],
          meta: {
            requiresGuest: true,
            requiresTenant: true,
            title: 'Recuperar Contraseña',
          },
        },
        {
          path: '',
          redirect: '/auth/login',
        },
      ],
    },

    // ==================== ADMIN ROUTES (con AdminLayout) ====================
    {
      path: '/admin',
      component: AdminLayout,
      beforeEnter: [authGuard, roleGuard(['SUPER_ADMIN', 'ADMIN'])],
      meta: {
        requiresAuth: true,
        requiresTenant: false, // Admin NO requiere tenant
      },
      children: [
        {
          path: 'dashboard',
          name: 'AdminDashboard',
          component: () => import('@admin/presentation/pages/DashboardPage.vue'),
          meta: {
            title: 'Dashboard Admin',
          },
        },
        {
          path: 'tenants',
          name: 'AdminTenants',
          component: () => import('@tenant/presentation/pages/TenantListPage.vue'),
          meta: {
            title: 'Gestión de Tenants',
          },
        },
        {
          path: '',
          redirect: '/admin/dashboard',
        },
      ],
    },

    // ==================== TENANT/APP ROUTES (con TenantLayout) ====================
    {
      path: '/app',
      component: TenantLayout,
      beforeEnter: [authGuard, tenantGuard],
      meta: {
        requiresAuth: true,
        requiresTenant: true,
      },
      children: [
        {
          path: 'dashboard',
          name: 'TenantDashboard',
          component: () => import('@admin/presentation/pages/DashboardPage.vue'),
          meta: {
            title: 'Dashboard',
          },
        },
        // TODO: Agregar más rutas de tenant (sales, products, inventory, etc.)
        {
          path: '',
          redirect: '/app/dashboard',
        },
      ],
    },

    // Redirect legacy /dashboard to /app/dashboard
    {
      path: '/dashboard',
      redirect: '/app/dashboard',
    },

    // ==================== ERROR PAGES (sin layout) ====================
    {
      path: '/tenant-not-found',
      name: 'TenantNotFound',
      component: () => import('@shared/presentation/pages/TenantNotFoundView.vue'),
      meta: {
        requiresAuth: false,
        requiresTenant: false,
        title: 'Tenant no encontrado',
      },
    },
    {
      path: '/suspended',
      name: 'TenantSuspended',
      component: () => import('@shared/presentation/pages/TenantSuspendedView.vue'),
      meta: {
        requiresAuth: false,
        requiresTenant: false,
        title: 'Cuenta suspendida',
      },
    },
    {
      path: '/invalid-tenant',
      name: 'InvalidTenant',
      component: () => import('@shared/presentation/pages/InvalidTenantView.vue'),
      meta: {
        requiresAuth: false,
        requiresTenant: false,
        title: 'Tenant inválido',
      },
    },

    // ==================== 404 NOT FOUND ====================
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@shared/presentation/pages/NotFoundView.vue'),
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
