/**
 * Configuración de endpoints de la API
 *
 * IMPORTANTE: El baseURL de Axios ya incluye /api/v1
 * Por lo tanto, BASE_PATH debe ser vacío o relativo sin /api/v1
 */

// Base path vacío porque axios.config.ts ya tiene /api/v1 en baseURL
const BASE_PATH = ''

/**
 * Endpoints de la API
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${BASE_PATH}/auth/login`,
    LOGOUT: `${BASE_PATH}/auth/logout`,
    REFRESH: `${BASE_PATH}/auth/refresh`,
    ME: `${BASE_PATH}/auth/me`,
    VERIFY: `${BASE_PATH}/auth/verify`,
    PASSWORD_RESET_REQUEST: `${BASE_PATH}/auth/password-reset/request`,
    PASSWORD_RESET_CONFIRM: `${BASE_PATH}/auth/password-reset/confirm`,
    PASSWORD_CHANGE: `${BASE_PATH}/auth/password/change`,
  },

  // Tenants
  TENANTS: {
    BASE: `${BASE_PATH}/tenants`,
    BY_SUBDOMAIN: (subdomain: string) => `${BASE_PATH}/tenants/${subdomain}`,
    VALIDATE: (subdomain: string) => `${BASE_PATH}/tenants/${subdomain}/validate`,
    SUSPEND: (id: number) => `${BASE_PATH}/tenants/${id}/suspend`,
    ACTIVATE: (id: number) => `${BASE_PATH}/tenants/${id}/activate`,
    STATS: `${BASE_PATH}/tenants/stats`,
  },

  // Usuarios
  USERS: {
    BASE: `${BASE_PATH}/users`,
    BY_ID: (id: number) => `${BASE_PATH}/users/${id}`,
    ACTIVATE: (id: number) => `${BASE_PATH}/users/${id}/activate`,
    DEACTIVATE: (id: number) => `${BASE_PATH}/users/${id}/deactivate`,
  },

  // Sucursales
  BRANCHES: {
    BASE: `${BASE_PATH}/branches`,
    BY_ID: (id: number) => `${BASE_PATH}/branches/${id}`,
    USERS: (id: number) => `${BASE_PATH}/branches/${id}/users`,
  },

  // Productos
  PRODUCTS: {
    BASE: `${BASE_PATH}/products`,
    BY_ID: (id: number) => `${BASE_PATH}/products/${id}`,
    SEARCH: `${BASE_PATH}/products/search`,
    LOW_STOCK: `${BASE_PATH}/products/low-stock`,
    EXPIRED: `${BASE_PATH}/products/expired`,
  },

  // Ventas
  SALES: {
    BASE: `${BASE_PATH}/sales`,
    BY_ID: (id: number) => `${BASE_PATH}/sales/${id}`,
    DAILY: `${BASE_PATH}/sales/daily`,
    MONTHLY: `${BASE_PATH}/sales/monthly`,
    STATS: `${BASE_PATH}/sales/stats`,
  },

  // Inventario
  INVENTORY: {
    BASE: `${BASE_PATH}/inventory`,
    MOVEMENTS: `${BASE_PATH}/inventory/movements`,
    ADJUSTMENTS: `${BASE_PATH}/inventory/adjustments`,
  },

  // Reportes
  REPORTS: {
    BASE: `${BASE_PATH}/reports`,
    SALES: `${BASE_PATH}/reports/sales`,
    INVENTORY: `${BASE_PATH}/reports/inventory`,
    FINANCIAL: `${BASE_PATH}/reports/financial`,
    EXPORT: (type: string) => `${BASE_PATH}/reports/export/${type}`,
  },

  // Health
  HEALTH: `${BASE_PATH}/health`,
}

/**
 * Configuración de timeouts por tipo de operación
 */
export const API_TIMEOUTS = {
  DEFAULT: 30000, // 30 segundos
  UPLOAD: 120000, // 2 minutos
  REPORT: 60000, // 1 minuto
  EXPORT: 180000, // 3 minutos
}

/**
 * Configuración de reintentos
 */
export const API_RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 segundo
  RETRYABLE_STATUS_CODES: [408, 429, 500, 502, 503, 504],
}

/**
 * Helper para construir URL con query params
 */
export function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean>,
): string {
  if (!params) return endpoint

  const queryString = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')

  return queryString ? `${endpoint}?${queryString}` : endpoint
}
