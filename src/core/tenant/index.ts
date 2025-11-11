/**
 * Exports centralizados del módulo Tenant
 *
 * Este archivo facilita las importaciones desde otros módulos
 */

// Domain
export * from './domain/entities/tenant.entity'
export * from './domain/types/tenant.types'
export type { TenantRepository } from './domain/interfaces/tenant.repository'
export type { TenantService } from './domain/interfaces/tenant.service'

// Application
export { tenantAdminService } from './application/services/tenant-admin.service'
export type {
  CreateTenantDto,
  TenantListResponse,
} from './application/services/tenant-admin.service'
export { detectTenantUseCase } from './application/use-cases/detect-tenant.use-case'
export type { DetectTenantResult } from './application/use-cases/detect-tenant.use-case'

// Infrastructure
export { TenantMapper } from './infrastructure/mappers/tenant.mapper'
export { tenantRepository } from './infrastructure/repositories/tenant.repository.impl'
export { subdomainDetector } from './infrastructure/utils/subdomain-detector'
export { tenantCache } from './infrastructure/utils/tenant-cache'

// Presentation
export { useTenant } from './presentation/composables/useTenant'
export { useTenantStore } from './presentation/stores/tenant.store'
export { default as TenantDebugInfo } from './presentation/components/TenantDebugInfo.vue'
export { default as TenantLogo } from './presentation/components/TenantLogo.vue'
