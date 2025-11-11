import type {
  TenantMetadata,
  TenantStatus,
  TenantPlan,
  TenantFeatures,
  TenantBranding,
  TenantLimits,
} from '../types/tenant.types'

/**
 * Entidad de dominio para Tenant
 */
export class TenantEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly subdomain: string,
    public readonly schemaName: string,
    public readonly status: TenantStatus,
    public readonly plan: {
      id: number
      name: TenantPlan
      displayName: string
    },
    public readonly features: TenantFeatures,
    public readonly branding: TenantBranding,
    public readonly limits: TenantLimits,
    public readonly trialEndsAt: Date | null,
    public readonly createdAt: Date,
  ) {}

  /**
   * Verifica si el tenant está activo
   */
  get isActive(): boolean {
    return this.status === 'active' || this.status === 'trial'
  }

  /**
   * Verifica si el tenant está en periodo de prueba
   */
  get isInTrial(): boolean {
    return this.status === 'trial' && this.trialEndsAt !== null && this.trialEndsAt > new Date()
  }

  /**
   * Verifica si el trial ha expirado
   */
  get isTrialExpired(): boolean {
    return this.status === 'trial' && this.trialEndsAt !== null && this.trialEndsAt <= new Date()
  }

  /**
   * Verifica si el tenant está suspendido
   */
  get isSuspended(): boolean {
    return this.status === 'suspended'
  }

  /**
   * Verifica si tiene una feature específica
   */
  hasFeature(feature: keyof TenantFeatures): boolean {
    return this.features[feature] === true
  }

  /**
   * Obtiene la URL completa del tenant
   */
  getUrl(baseUrl: string): string {
    return `https://${this.subdomain}.${baseUrl}`
  }

  /**
   * Convierte a metadata simple
   */
  toMetadata(): TenantMetadata {
    return {
      id: this.id,
      name: this.name,
      subdomain: this.subdomain,
      schemaName: this.schemaName,
      status: this.status,
      plan: this.plan,
      features: this.features,
      branding: this.branding,
      limits: this.limits,
      trialEndsAt: this.trialEndsAt,
      createdAt: this.createdAt,
    }
  }

  /**
   * Crea instancia desde metadata
   */
  static fromMetadata(metadata: TenantMetadata): TenantEntity {
    return new TenantEntity(
      metadata.id,
      metadata.name,
      metadata.subdomain,
      metadata.schemaName,
      metadata.status,
      metadata.plan,
      metadata.features,
      metadata.branding,
      metadata.limits,
      metadata.trialEndsAt,
      metadata.createdAt,
    )
  }
}
