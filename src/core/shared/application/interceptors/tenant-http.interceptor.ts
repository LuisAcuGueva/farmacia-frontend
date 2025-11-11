import type { InternalAxiosRequestConfig, AxiosError } from 'axios'

/**
 * Interceptor para agregar el subdomain del tenant en los headers
 *
 * Este interceptor se ejecuta ANTES de cada request HTTP y agrega:
 * - X-Tenant-Subdomain: El subdomain del tenant actual
 * - X-Tenant-ID: El ID del tenant (opcional)
 *
 * El backend debe leer estos headers para:
 * 1. Identificar el schema de base de datos correcto
 * 2. Aplicar filtros de tenant en las queries
 * 3. Validar permisos específicos del tenant
 */
class TenantHttpInterceptor {
  /**
   * Interceptor de request
   */
  async onRequest(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    try {
      // Importar el store dinámicamente para evitar dependencias circulares
      const { useTenantStore } = await import('@/core/tenant/presentation/stores/tenant.store')
      const tenantStore = useTenantStore()

      // Solo agregar headers si hay un tenant activo (no admin)
      if (tenantStore.tenant && tenantStore.subdomain && !tenantStore.isAdmin) {
        // Header principal: subdomain
        config.headers.set('X-Tenant-Subdomain', tenantStore.subdomain)

        // Header secundario: ID del tenant (REQUERIDO por el backend)
        if (tenantStore.tenantId) {
          config.headers.set('X-Tenant-Id', tenantStore.tenantId.toString())
        }

        // Header opcional: nombre del schema (si el backend lo necesita)
        if (tenantStore.tenant?.schemaName) {
          config.headers.set('X-Tenant-Schema', tenantStore.tenant.schemaName)
        }

        // Log en desarrollo
        if (import.meta.env.DEV) {
          console.log('🏢 [Tenant Interceptor]', {
            subdomain: tenantStore.subdomain,
            tenantId: tenantStore.tenantId,
            url: config.url,
          })
        }
      }

      // Log para contexto admin (sin agregar headers)
      if (tenantStore.isAdmin && import.meta.env.DEV) {
        console.log('👑 [Admin Context] Request sin headers de tenant:', config.url)
      }
    } catch (error) {
      // Si hay error obteniendo el tenant store, continuar sin headers
      console.warn('[Tenant Interceptor] Error al obtener tenant store:', error)
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
