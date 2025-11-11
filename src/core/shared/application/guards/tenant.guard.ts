import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useTenantStore } from '@tenant/presentation/stores/tenant.store'

/**
 * Guard para validar que existe un tenant válido
 */
export async function tenantGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): Promise<void> {
  const tenantStore = useTenantStore()

  // Rutas públicas que no requieren tenant
  const publicRoutes = ['/tenant-not-found', '/invalid-tenant', '/suspended']
  if (publicRoutes.includes(to.path)) {
    next()
    return
  }

  // Si es admin, permitir acceso
  if (tenantStore.isAdmin) {
    next()
    return
  }

  // Si no hay tenant cargado, intentar cargar
  if (!tenantStore.tenant) {
    const initialized = await tenantStore.initialize()

    if (!initialized) {
      next('/tenant-not-found')
      return
    }
  }

  // Verificar estado del tenant
  if (tenantStore.isSuspended) {
    next('/suspended')
    return
  }

  if (!tenantStore.isActive) {
    next('/invalid-tenant')
    return
  }

  next()
}
