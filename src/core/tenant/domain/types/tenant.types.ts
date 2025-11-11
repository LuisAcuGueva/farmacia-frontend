/**
 * Tipos y enums para el sistema multi-tenant
 */

// Estado del tenant
export enum TenantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  TRIAL = 'trial',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

// Plan del tenant
export enum TenantPlan {
  FREE = 'free',
  STANDARD = 'standard',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

// Features disponibles por plan
export interface TenantFeatures {
  reports: boolean
  apiAccess: boolean
  multipleLocations: boolean
  advancedInventory: boolean
  customBranding: boolean
  prioritySupport: boolean
}

// Branding del tenant
export interface TenantBranding {
  primaryColor: string
  secondaryColor: string
  logo: string | null
  favicon: string | null
  companyName: string
  tagline: string | null
}

// Límites del tenant según su plan
export interface TenantLimits {
  maxUsers: number
  maxBranches: number
  maxProducts: number
  maxSalesPerMonth: number
}

// Metadata completa del tenant
export interface TenantMetadata {
  id: number
  name: string
  subdomain: string
  schemaName: string
  status: TenantStatus
  plan: {
    id: number
    name: TenantPlan
    displayName: string
  }
  features: TenantFeatures
  branding: TenantBranding
  limits: TenantLimits
  trialEndsAt: Date | null
  createdAt: Date
}

// Contexto del tenant (usado en el store)
export interface TenantContext {
  tenant: TenantMetadata | null
  isLoading: boolean
  isValidating: boolean
  error: string | null
  lastUpdated: Date | null
}

// Configuración de detección
export interface TenantDetectionConfig {
  mode: 'subdomain' | 'header' | 'path'
  adminSubdomain: string
  reservedSubdomains: string[]
  enableCache: boolean
  cacheTTL: number
}
