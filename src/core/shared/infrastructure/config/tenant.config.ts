/**
 * Configuración del sistema multi-tenant
 */

/**
 * Modo de detección del tenant
 */
export enum TenantDetectionMode {
  SUBDOMAIN = 'subdomain', // tenant.example.com (Recomendado)
  HEADER = 'header', // X-Tenant-Subdomain header
  PATH = 'path', // /tenant/nombre-tenant/...
}

/**
 * Headers HTTP para tenant
 * Estos headers se agregan automáticamente a todas las requests
 */
export const TENANT_HEADERS = {
  SUBDOMAIN: 'X-Tenant-Subdomain',
  ID: 'X-Tenant-Id',
  SCHEMA: 'X-Tenant-Schema',
} as const

/**
 * Configuración de detección
 */
export const TENANT_CONFIG = {
  // Modo de detección principal
  MODE: (import.meta.env.VITE_TENANT_MODE as TenantDetectionMode) || TenantDetectionMode.SUBDOMAIN,

  // Subdomain por defecto en desarrollo
  DEFAULT_TENANT: import.meta.env.VITE_DEFAULT_TENANT || 'demo',

  // Subdomain para panel de administración
  ADMIN_SUBDOMAIN: import.meta.env.VITE_ADMIN_SUBDOMAIN || 'admin',

  // Subdomains reservados del sistema
  RESERVED_SUBDOMAINS: (
    import.meta.env.VITE_RESERVED_SUBDOMAINS || 'admin,www,api,app,static,cdn'
  ).split(','),

  // Cache
  ENABLE_CACHE: import.meta.env.VITE_ENABLE_TENANT_CACHE === 'true',
  CACHE_TTL: parseInt(import.meta.env.VITE_TENANT_CACHE_TTL) || 300000, // 5 minutos

  // Offline mode
  ENABLE_OFFLINE: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',

  // Desarrollo
  DEV_MODE: import.meta.env.VITE_DEV_MODE === 'true',
  SHOW_TENANT_INFO: import.meta.env.VITE_SHOW_TENANT_INFO === 'true',
} as const

/**
 * Validación de subdomain
 */
export const TENANT_VALIDATION = {
  // Regex para validar formato de subdomain
  SUBDOMAIN_REGEX: /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/,

  // Longitud mínima y máxima
  MIN_LENGTH: 3,
  MAX_LENGTH: 63,

  // Caracteres permitidos
  ALLOWED_CHARS: 'abcdefghijklmnopqrstuvwxyz0123456789-',
}

/**
 * Estrategias de fallback cuando no se detecta tenant
 */
export enum TenantFallbackStrategy {
  REDIRECT_TO_MAIN = 'redirect_to_main', // Redirigir a www.example.com
  SHOW_ERROR_PAGE = 'show_error_page', // Mostrar página de error
  USE_DEFAULT = 'use_default', // Usar tenant por defecto (dev)
}

export const TENANT_FALLBACK = TENANT_CONFIG.DEV_MODE
  ? TenantFallbackStrategy.USE_DEFAULT
  : TenantFallbackStrategy.SHOW_ERROR_PAGE

/**
 * URLs según el tenant
 */
export const TENANT_URLS = {
  /**
   * URL base del dominio principal
   */
  BASE_DOMAIN:
    import.meta.env.VITE_BASE_DOMAIN || (import.meta.env.DEV ? 'localhost:5173' : 'farmasys.com'),

  /**
   * Protocolo (http/https)
   */
  PROTOCOL: import.meta.env.VITE_PROTOCOL || (import.meta.env.DEV ? 'http' : 'https'),

  /**
   * Construye URL completa para un tenant
   */
  getTenantUrl(subdomain: string): string {
    const { PROTOCOL, BASE_DOMAIN } = TENANT_URLS
    return `${PROTOCOL}://${subdomain}.${BASE_DOMAIN}`
  },

  /**
   * Construye URL del admin
   */
  getAdminUrl(): string {
    return TENANT_URLS.getTenantUrl(TENANT_CONFIG.ADMIN_SUBDOMAIN)
  },

  /**
   * Obtiene subdomain desde URL
   */
  getSubdomainFromUrl(url: string): string | null {
    try {
      const hostname = new URL(url).hostname
      const parts = hostname.split('.')

      if (parts.length < 3) return null

      return parts[0]
    } catch {
      return null
    }
  },
}

/**
 * Características según plan
 */
export const TENANT_FEATURES_BY_PLAN = {
  free: {
    maxUsers: 2,
    maxBranches: 1,
    maxProducts: 100,
    maxSalesPerMonth: 100,
    reports: false,
    apiAccess: false,
    multipleLocations: false,
    advancedInventory: false,
    customBranding: false,
    prioritySupport: false,
  },
  standard: {
    maxUsers: 10,
    maxBranches: 3,
    maxProducts: 1000,
    maxSalesPerMonth: 1000,
    reports: true,
    apiAccess: false,
    multipleLocations: true,
    advancedInventory: true,
    customBranding: false,
    prioritySupport: false,
  },
  premium: {
    maxUsers: 50,
    maxBranches: 10,
    maxProducts: 10000,
    maxSalesPerMonth: 10000,
    reports: true,
    apiAccess: true,
    multipleLocations: true,
    advancedInventory: true,
    customBranding: true,
    prioritySupport: false,
  },
  enterprise: {
    maxUsers: -1, // Ilimitado
    maxBranches: -1,
    maxProducts: -1,
    maxSalesPerMonth: -1,
    reports: true,
    apiAccess: true,
    multipleLocations: true,
    advancedInventory: true,
    customBranding: true,
    prioritySupport: true,
  },
}

/**
 * Helper: Verifica si un subdomain es válido
 */
export function isValidSubdomain(subdomain: string): boolean {
  const { SUBDOMAIN_REGEX, MIN_LENGTH, MAX_LENGTH } = TENANT_VALIDATION

  if (subdomain.length < MIN_LENGTH || subdomain.length > MAX_LENGTH) {
    return false
  }

  return SUBDOMAIN_REGEX.test(subdomain)
}

/**
 * Helper: Verifica si un subdomain está reservado
 */
export function isReservedSubdomain(subdomain: string): boolean {
  return TENANT_CONFIG.RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())
}

/**
 * Helper: Verifica si es el subdomain de admin
 */
export function isAdminSubdomain(subdomain: string): boolean {
  return subdomain.toLowerCase() === TENANT_CONFIG.ADMIN_SUBDOMAIN.toLowerCase()
}
