import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '../../../modules/auth/presentation/stores/auth.store'

/**
 * Auth Guard
 * Guard para proteger rutas que requieren autenticación
 */
export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const authStore = useAuthStore()

  // Si la ruta no requiere autenticación, permitir acceso
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  // Verificar si el usuario está autenticado
  if (!authStore.isAuthenticated) {
    // Redirigir al login
    next({
      name: 'Login',
      query: { redirect: to.fullPath },
    })
    return
  }

  // Verificar sesión con el servidor
  try {
    const isValid = await authStore.verifySession()

    if (!isValid) {
      // Sesión inválida, limpiar y redirigir al login
      await authStore.logout()
      next({
        name: 'Login',
        query: { redirect: to.fullPath },
      })
      return
    }

    // Sesión válida, permitir acceso
    next()
  } catch (error) {
    console.error('Error verifying session:', error)
    next({
      name: 'Login',
      query: { redirect: to.fullPath },
    })
  }
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
