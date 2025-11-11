import axios, { type AxiosInstance } from 'axios'
import { tenantHttpInterceptor } from '@/core/shared/application/interceptors/tenant-http.interceptor'
import { authHttpInterceptor } from '@/core/shared/application/interceptors/auth-http.interceptor'
import { errorHttpInterceptor } from '@/core/shared/application/interceptors/error-http.interceptor'

/**
 * Configuración centralizada de Axios
 */

/**
 * Construye la URL base del backend
 *
 * IMPORTANTE: El backend siempre está en localhost:PORT (o dominio centralizado en producción)
 * La identificación del tenant se hace mediante headers HTTP (X-Tenant-Id, X-Tenant-Subdomain)
 * NO mediante subdominios en la URL del backend.
 */
function buildDynamicBaseURL(): string {
  const protocol = window.location.protocol
  const apiPort = import.meta.env.VITE_API_PORT || '3000'
  const apiPath = import.meta.env.VITE_API_PATH || '/api/v1'

  // Determinar si estamos en desarrollo o producción
  const hostname = window.location.hostname
  const isDevelopment =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.includes('.localhost') ||
    hostname.includes('.local')

  let backendURL = ''

  if (isDevelopment) {
    // DESARROLLO: Backend siempre en localhost:PORT (sin subdominios)
    backendURL = `${protocol}//localhost:${apiPort}${apiPath}`
  } else {
    // PRODUCCIÓN: Usar URL configurada en ENV o dominio centralizado
    const envURL = import.meta.env.VITE_API_BASE_URL
    if (envURL) {
      backendURL = envURL
    } else {
      // URL centralizada de producción (ej: https://api.farmasys.com/api/v1)
      const apiDomain = import.meta.env.VITE_API_DOMAIN || 'api.farmasys.com'
      backendURL = `${protocol}//${apiDomain}${apiPath}`
    }
  }

  // Log en desarrollo
  if (import.meta.env.DEV) {
    console.log('🔧 [Axios Config] Base URL construida:', {
      hostname,
      backendURL,
      note: 'Tenant detection via headers (X-Tenant-Id, X-Tenant-Subdomain)',
    })
  }

  return backendURL
}

// Configuración base
const baseConfig = {
  baseURL: buildDynamicBaseURL(),
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // Importante para cookies httpOnly (refresh token)
}

/**
 * Instancia principal de Axios
 */
export const axiosInstance: AxiosInstance = axios.create(baseConfig)

/**
 * Aplicar interceptors en orden correcto
 */

// 1. REQUEST: Tenant interceptor (debe ir primero)
axiosInstance.interceptors.request.use(
  tenantHttpInterceptor.onRequest,
  tenantHttpInterceptor.onRequestError,
)

// 2. REQUEST: Auth interceptor (segundo)
axiosInstance.interceptors.request.use(
  authHttpInterceptor.onRequest,
  authHttpInterceptor.onRequestError,
)

// 3. RESPONSE: Error interceptor
axiosInstance.interceptors.response.use(
  errorHttpInterceptor.onResponse,
  errorHttpInterceptor.onResponseError,
)

/**
 * Instancia sin interceptores (para llamadas especiales)
 */
export const axiosRawInstance: AxiosInstance = axios.create(baseConfig)

export default axiosInstance
