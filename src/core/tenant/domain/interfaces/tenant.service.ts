import type { TenantMetadata } from '../types/tenant.types'

/**
 * Interfaz del servicio de Tenant
 *
 * Define operaciones de negocio relacionadas con tenants
 */
export interface TenantService {
  /**
   * Obtiene el tenant actual
   */
  getCurrentTenant(): Promise<TenantMetadata | null>

  /**
   * Revalida el tenant actual
   */
  revalidate(): Promise<boolean>

  /**
   * Verifica si el tenant tiene una feature específica
   */
  hasFeature(feature: string): boolean

  /**
   * Verifica si el tenant ha alcanzado un límite
   */
  hasReachedLimit(limit: string, current: number): boolean

  /**
   * Obtiene estadísticas del tenant actual
   */
  getStats(): Promise<{
    users: number
    branches: number
    products: number
    salesThisMonth: number
  }>

  /**
   * Verifica si el tenant está en trial
   */
  isInTrial(): boolean

  /**
   * Verifica si el tenant está activo
   */
  isActive(): boolean

  /**
   * Obtiene días restantes de trial (si aplica)
   */
  getTrialDaysRemaining(): number | null
}
