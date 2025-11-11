import { subdomainDetector } from '../../infrastructure/utils/subdomain-detector'
import { tenantCache } from '../../infrastructure/utils/tenant-cache'
import { tenantRepository } from '../../infrastructure/repositories/tenant.repository.impl'
import type { TenantMetadata } from '../../domain/types/tenant.types'

export interface DetectTenantResult {
  success: boolean
  tenant: TenantMetadata | null
  subdomain: string | null
  isAdmin: boolean
  error?: string
}

/**
 * Use Case: Detectar y cargar tenant actual
 */
export class DetectTenantUseCase {
  async execute(): Promise<DetectTenantResult> {
    // 1. Detectar subdomain
    const detection = subdomainDetector.detect()

    // 2. Si es admin, no cargar tenant
    if (detection.isAdmin) {
      return {
        success: true,
        tenant: null,
        subdomain: detection.subdomain,
        isAdmin: true,
      }
    }

    // 3. Si no hay subdomain válido
    if (!detection.subdomain) {
      return {
        success: false,
        tenant: null,
        subdomain: null,
        isAdmin: false,
        error: 'No se detectó un tenant válido',
      }
    }

    // 4. Si es subdomain reservado
    if (detection.isReserved) {
      return {
        success: false,
        tenant: null,
        subdomain: detection.subdomain,
        isAdmin: false,
        error: 'Subdomain reservado por el sistema',
      }
    }

    try {
      // 5. Intentar obtener del caché
      let tenant = tenantCache.get(detection.subdomain)

      // 6. Si no está en caché, obtener de API
      if (!tenant) {
        // Intentar restaurar del localStorage
        tenant = tenantCache.restore(detection.subdomain)

        if (!tenant) {
          // Obtener del backend
          tenant = await tenantRepository.getTenantBySubdomain(detection.subdomain)

          // Guardar en caché
          tenantCache.set(detection.subdomain, tenant)
          tenantCache.persist(detection.subdomain)
        }
      }

      // 7. Validar estado del tenant
      if (tenant.status === 'suspended') {
        return {
          success: false,
          tenant,
          subdomain: detection.subdomain,
          isAdmin: false,
          error: 'Cuenta suspendida. Contacte a soporte.',
        }
      }

      if (tenant.status === 'cancelled') {
        return {
          success: false,
          tenant,
          subdomain: detection.subdomain,
          isAdmin: false,
          error: 'Cuenta cancelada.',
        }
      }

      return {
        success: true,
        tenant,
        subdomain: detection.subdomain,
        isAdmin: false,
      }
    } catch (error: any) {
      return {
        success: false,
        tenant: null,
        subdomain: detection.subdomain,
        isAdmin: false,
        error: error.message || 'Error al cargar tenant',
      }
    }
  }
}

export const detectTenantUseCase = new DetectTenantUseCase()
