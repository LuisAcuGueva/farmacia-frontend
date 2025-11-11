import type { TenantMetadata } from '../types/tenant.types'

/**
 * Interfaz del repositorio de Tenants
 *
 * Define el contrato para acceder a los datos de tenants
 */
export interface TenantRepository {
  /**
   * Obtiene la metadata de un tenant por su subdomain
   * @throws Error si el tenant no existe
   */
  getTenantBySubdomain(subdomain: string): Promise<TenantMetadata>

  /**
   * Valida que un tenant existe y está activo
   */
  validateTenant(subdomain: string): Promise<boolean>

  /**
   * Obtiene lista paginada de tenants (solo admin)
   */
  listTenants(
    page?: number,
    limit?: number,
  ): Promise<{
    data: TenantMetadata[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }>

  /**
   * Crea un nuevo tenant (solo admin)
   */
  createTenant(data: {
    name: string
    subdomain: string
    planId: number
    ownerEmail: string
    ownerName: string
    ownerPassword: string
  }): Promise<TenantMetadata>

  /**
   * Actualiza un tenant (solo admin)
   */
  updateTenant(
    id: number,
    data: Partial<{
      name: string
      status: string
      planId: number
    }>,
  ): Promise<TenantMetadata>

  /**
   * Suspende un tenant (solo admin)
   */
  suspendTenant(id: number, reason: string): Promise<void>

  /**
   * Activa un tenant suspendido (solo admin)
   */
  activateTenant(id: number): Promise<void>
}
