import type {
  TenantMetadata,
  TenantFeatures,
  TenantBranding,
} from '../../domain/types/tenant.types'

/**
 * Mapper para convertir datos de API a entidades de dominio
 */
export class TenantMapper {
  /**
   * Convierte respuesta de API a TenantMetadata
   */
  static toDomain(apiData: any): TenantMetadata {
    return {
      id: apiData.id,
      name: apiData.name,
      subdomain: apiData.subdomain,
      schemaName: apiData.schemaName || apiData.schema_name,
      status: apiData.status,
      plan: {
        id: apiData.plan?.id || apiData.planId,
        name: apiData.plan?.name || 'free',
        displayName: apiData.plan?.displayName || apiData.plan?.display_name || 'Plan Gratuito',
      },
      features: this.mapFeatures(apiData.plan?.features || {}),
      branding: this.mapBranding(apiData),
      limits: {
        maxUsers: apiData.maxUsers || apiData.max_users || 5,
        maxBranches: apiData.maxBranches || apiData.max_branches || 1,
        maxProducts: apiData.maxProducts || apiData.max_products || 100,
        maxSalesPerMonth: apiData.maxSalesPerMonth || 1000,
      },
      trialEndsAt: apiData.trialEndsAt ? new Date(apiData.trialEndsAt) : null,
      createdAt: new Date(apiData.createdAt || apiData.created_at),
    }
  }

  /**
   * Mapea features del plan
   */
  private static mapFeatures(featuresData: any): TenantFeatures {
    return {
      reports: featuresData.reports === true,
      apiAccess: featuresData.api_access === true || featuresData.apiAccess === true,
      multipleLocations:
        featuresData.multiple_locations === true || featuresData.multipleLocations === true,
      advancedInventory:
        featuresData.advanced_inventory === true || featuresData.advancedInventory === true,
      customBranding: featuresData.custom_branding === true || featuresData.customBranding === true,
      prioritySupport:
        featuresData.priority_support === true || featuresData.prioritySupport === true,
    }
  }

  /**
   * Mapea branding del tenant
   */
  private static mapBranding(apiData: any): TenantBranding {
    const branding = apiData.branding || {}

    return {
      primaryColor: branding.primaryColor || branding.primary_color || '#3B82F6',
      secondaryColor: branding.secondaryColor || branding.secondary_color || '#10B981',
      logo: branding.logo || null,
      favicon: branding.favicon || null,
      companyName: apiData.name || 'Farmacia',
      tagline: branding.tagline || null,
    }
  }

  /**
   * Convierte TenantMetadata a formato de API
   */
  static toApi(tenant: TenantMetadata): any {
    return {
      id: tenant.id,
      name: tenant.name,
      subdomain: tenant.subdomain,
      schema_name: tenant.schemaName,
      status: tenant.status,
      plan_id: tenant.plan.id,
      branding: {
        primary_color: tenant.branding.primaryColor,
        secondary_color: tenant.branding.secondaryColor,
        logo: tenant.branding.logo,
        favicon: tenant.branding.favicon,
        tagline: tenant.branding.tagline,
      },
    }
  }
}
