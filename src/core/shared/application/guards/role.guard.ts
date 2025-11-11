import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '../../../../modules/auth/presentation/stores/auth.store'

/**
 * Role Guard
 * Guard para proteger rutas basadas en roles de usuario
 */
export function roleGuard(allowedRoles: string[]) {
  return async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    const authStore = useAuthStore()

    // Verificar si el usuario está autenticado
    if (!authStore.isAuthenticated) {
      next({
        name: 'Login',
        query: { redirect: to.fullPath },
      })
      return
    }

    // Verificar si el usuario tiene uno de los roles permitidos
    const userRole = authStore.userRole
    if (userRole && allowedRoles.includes(userRole)) {
      next()
      return
    }

    // Usuario no tiene permisos, redirigir a página de error o dashboard
    next({
      name: 'Dashboard',
      query: { error: 'unauthorized' },
    })
  }
}

/**
 * Permission Guard
 * Guard para proteger rutas basadas en permisos específicos
 */
export function permissionGuard(requiredPermissions: string[]) {
  return async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    const authStore = useAuthStore()

    // Verificar si el usuario está autenticado
    if (!authStore.isAuthenticated) {
      next({
        name: 'Login',
        query: { redirect: to.fullPath },
      })
      return
    }

    // Verificar si el usuario tiene todos los permisos requeridos
    const hasAllPermissions = requiredPermissions.every((permission) =>
      authStore.hasPermission(permission),
    )

    if (hasAllPermissions) {
      next()
      return
    }

    // Usuario no tiene permisos, redirigir a página de error o dashboard
    next({
      name: 'Dashboard',
      query: { error: 'unauthorized' },
    })
  }
}
