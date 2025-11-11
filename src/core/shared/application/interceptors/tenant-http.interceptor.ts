import type { InternalAxiosRequestConfig, AxiosError } from 'axios'
import { TENANT_HEADERS } from '@/core/shared/infrastructure/config/tenant.config'

/**
 * Interceptor para agregar el contexto del tenant en los headers HTTP
 *
 * Este interceptor se ejecuta ANTES de cada request HTTP y agrega:
 * - X-Tenant-Subdomain: El subdomain del tenant actual (REQUERIDO)
 * - X-Tenant-Id: El ID del tenant (REQUERIDO)
 * - X-Tenant-Schema: Nombre del schema de BD (OPCIONAL)
 *
 * El backend debe leer estos headers para:
 * 1. Identificar el schema de base de datos correcto
 * 2. Aplicar filtros de tenant en las queries
 * 3. Validar permisos específicos del tenant
 * 4. Prevenir acceso a datos de otros tenants
 *
 * @example
 * // Headers agregados automáticamente:
 * X-Tenant-Subdomain: farmacia1
 * X-Tenant-Id: 123
 * X-Tenant-Schema: tenant_farmacia1
 */
class TenantHttpInterceptor {
  /**
   * Interceptor de request
   * Agrega headers del tenant actual a la configuración de la request
   */
  async onRequest(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    try {
      // Importar el store dinámicamente para evitar dependencias circulares
      const { useTenantStore } = await import('@/core/tenant/presentation/stores/tenant.store')
      const tenantStore = useTenantStore()

      // Solo agregar headers si hay un tenant activo (no admin)
      if (tenantStore.tenant && tenantStore.subdomain && !tenantStore.isAdmin) {
        // Headers requeridos por el backend
        config.headers.set(TENANT_HEADERS.SUBDOMAIN, tenantStore.subdomain)
        config.headers.set(TENANT_HEADERS.ID, tenantStore.tenantId?.toString() || '')

        // Header opcional: nombre del schema de BD
        if (tenantStore.tenant.schemaName) {
          config.headers.set(TENANT_HEADERS.SCHEMA, tenantStore.tenant.schemaName)
        }

        // Log en desarrollo con información completa del contexto
        if (import.meta.env.DEV) {
          console.log('🏢 [Tenant Context]', {
            subdomain: tenantStore.subdomain,
            tenantId: tenantStore.tenantId,
            schema: tenantStore.tenant.schemaName,
            status: tenantStore.tenant.status,
            plan: tenantStore.tenant.plan.name,
            url: config.url,
          })
        }
      }

      // Log para contexto admin (sin agregar headers de tenant)
      if (tenantStore.isAdmin && import.meta.env.DEV) {
        console.log('👑 [Admin Context] No tenant headers:', config.url)
      }

      // Si no hay tenant y no es admin, log de advertencia
      if (!tenantStore.tenant && !tenantStore.isAdmin && import.meta.env.DEV) {
        console.warn('⚠️ [Tenant Context] No tenant loaded for request:', config.url)
      }
    } catch (error) {
      // Si hay error obteniendo el tenant store, continuar sin headers
      // Esto puede ocurrir en la carga inicial de la app
      if (import.meta.env.DEV) {
        console.warn('[Tenant Interceptor] Error al obtener tenant store:', error)
      }
    }

    return config
  }

  /**
   * Manejador de error en request
   */
  onRequestError(error: AxiosError): Promise<never> {
    console.error('[Tenant Interceptor] Error en request:', error)
    return Promise.reject(error)
  }
}

// Singleton
export const tenantHttpInterceptor = new TenantHttpInterceptor()
