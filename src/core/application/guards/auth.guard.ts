import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '../../../modules/auth/presentation/stores/auth.store'

/**
 * Auth Guard
 * Guard para proteger rutas que requieren autenticación
 */
export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const authStore = useAuthStore()

  // Verificar si el usuario está autenticado (localmente)
  if (!authStore.isAuthenticated) {
    // Redirigir al login
    next({
      name: 'Login',
      query: { redirect: to.fullPath },
    })
    return
  }

  // Usuario autenticado, permitir acceso
  next()
}

/**
 * Guest Guard
 * Guard para rutas que solo pueden acceder usuarios no autenticados
 */
export function guestGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const authStore = useAuthStore()

  // Si el usuario está autenticado, redirigir al dashboard
  if (authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }

  // Si no está autenticado, permitir acceso
  next()
}
