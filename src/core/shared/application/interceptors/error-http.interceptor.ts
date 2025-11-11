import type { AxiosResponse, AxiosError } from 'axios'
// NOTE: avoid static import of axiosInstance here to prevent circular dependency
// We'll dynamically import the axios instance at runtime when needed.
// Avoid static imports of stores here to prevent circular dependencies with axios config
import router from '@/router'

/**
 * Interceptor para manejo centralizado de errores HTTP
 *
 * Maneja:
 * - 401 Unauthorized -> Refresh token automático
 * - 403 Forbidden -> Redirigir a "sin permisos"
 * - 404 Not Found -> Manejo específico
 * - 422 Validation Error -> Formatear errores
 * - 500 Server Error -> Mostrar mensaje amigable
 * - Network Error -> Detectar sin conexión
 */
class ErrorHttpInterceptor {
  private isRefreshing = false
  private refreshSubscribers: Array<(token: string) => void> = []

  /**
   * Response exitoso (no hace nada, solo pasa)
   */
  onResponse(response: AxiosResponse): AxiosResponse {
    return response
  }

  /**
   * Manejo de errores en response
   */
  onResponseError = async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as any

    // Error de red (sin conexión)
    if (!error.response) {
      return this.handleNetworkError(error)
    }

    const status = error.response.status

    // Manejo según código de error
    switch (status) {
      case 401:
        return this.handle401Unauthorized(error, originalRequest)

      case 403:
        return this.handle403Forbidden(error)

      case 404:
        return this.handle404NotFound(error)

      case 422:
        return this.handle422ValidationError(error)

      case 500:
      case 502:
      case 503:
      case 504:
        return this.handle5xxServerError(error)

      // Errores específicos de tenant
      case 460: // Tenant no encontrado (custom code)
        return this.handleTenantNotFound(error)

      case 461: // Tenant suspendido (custom code)
        return this.handleTenantSuspended(error)

      default:
        return this.handleGenericError(error)
    }
  }

  /**
   * 401 Unauthorized: Intentar refresh token
   */
  private async handle401Unauthorized(error: AxiosError, originalRequest: any): Promise<any> {
    // Si ya intentamos hacer refresh en esta request, rechazar
    if (originalRequest._retry) {
      console.error('🔴 [Error Interceptor] Refresh token falló, redirigiendo a login')
      await this.logout()
      return Promise.reject(error)
    }

    // Si es la ruta de login o refresh, no reintentar
    if (
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error)
    }

    // Marcar que ya intentamos
    originalRequest._retry = true

    // Si ya estamos refreshing, esperar
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.refreshSubscribers.push((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          // Importar la instancia en tiempo de ejecución para evitar dependencias circulares
          import('@/core/config/axios.config').then(({ axiosInstance }) => {
            resolve(axiosInstance(originalRequest))
          })
        })
      })
    }

    // Intentar refresh
    this.isRefreshing = true

    try {
      // Import stores dynamically to avoid initialization order / circular deps
      const { useAuthStore } = await import('@/modules/auth/presentation/stores/auth.store')
      const authStore = useAuthStore()
      const session = await authStore.refreshSession()

      const newToken = session.tokens.accessToken
      sessionStorage.setItem('accessToken', newToken)

      // Notificar a requests en espera
      this.refreshSubscribers.forEach((callback) => callback(newToken))
      this.refreshSubscribers = []

      // Reintentar request original con nuevo token
      originalRequest.headers.Authorization = `Bearer ${newToken}`
      // Reintentar usando la instancia central (import dinámico para evitar circularidad)
      const { axiosInstance } = await import('@/core/config/axios.config')
      return axiosInstance(originalRequest)
    } catch (refreshError) {
      console.error('🔴 [Error Interceptor] Refresh token falló:', refreshError)
      await this.logout()
      return Promise.reject(refreshError)
    } finally {
      this.isRefreshing = false
    }
  }

  /**
   * 403 Forbidden: Sin permisos
   */
  private handle403Forbidden(error: AxiosError): Promise<never> {
    console.warn('⚠️ [Error Interceptor] 403 - Sin permisos:', error.config?.url)

    // Mostrar notificación o redirigir
    router.push({
      name: 'Forbidden',
      query: { from: router.currentRoute.value.fullPath },
    })

    return Promise.reject({
      ...error,
      message: 'No tienes permisos para realizar esta acción',
    })
  }

  /**
   * 404 Not Found
   */
  private handle404NotFound(error: AxiosError): Promise<never> {
    const response = error.response?.data as any

    console.warn('⚠️ [Error Interceptor] 404 - Recurso no encontrado:', {
      url: error.config?.url,
      message: response?.message,
    })

    return Promise.reject({
      ...error,
      message: response?.message || 'Recurso no encontrado',
    })
  }

  /**
   * 422 Validation Error
   */
  private handle422ValidationError(error: AxiosError): Promise<never> {
    const response = error.response?.data as any

    console.warn('⚠️ [Error Interceptor] 422 - Error de validación:', response?.errors)

    // Formatear errores de validación
    const formattedErrors = this.formatValidationErrors(response?.errors || {})

    return Promise.reject({
      ...error,
      message: 'Datos inválidos',
      validationErrors: formattedErrors,
    })
  }

  /**
   * 5xx Server Error
   */
  private handle5xxServerError(error: AxiosError): Promise<never> {
    console.error('🔴 [Error Interceptor] Error del servidor:', {
      status: error.response?.status,
      url: error.config?.url,
    })

    return Promise.reject({
      ...error,
      message: 'Error del servidor. Por favor, intenta más tarde.',
    })
  }

  /**
   * Tenant no encontrado (custom 460)
   */
  private handleTenantNotFound(error: AxiosError): Promise<never> {
    console.error('🔴 [Error Interceptor] Tenant no encontrado')

    router.push('/tenant-not-found')

    return Promise.reject({
      ...error,
      message: 'Tenant no encontrado',
    })
  }

  /**
   * Tenant suspendido (custom 461)
   */
  private handleTenantSuspended(error: AxiosError): Promise<never> {
    console.error('🔴 [Error Interceptor] Tenant suspendido')

    router.push('/suspended')

    return Promise.reject({
      ...error,
      message: 'Cuenta suspendida',
    })
  }

  /**
   * Error de red (sin conexión)
   */
  private handleNetworkError(error: AxiosError): Promise<never> {
    console.error('🔴 [Error Interceptor] Error de red - Sin conexión')

    return Promise.reject({
      ...error,
      message: 'Sin conexión a internet. Verifica tu conexión.',
    })
  }

  /**
   * Error genérico
   */
  private handleGenericError(error: AxiosError): Promise<never> {
    const response = error.response?.data as any

    console.error('🔴 [Error Interceptor] Error:', {
      status: error.response?.status,
      message: response?.message,
    })

    return Promise.reject({
      ...error,
      message: response?.message || 'Error al procesar la solicitud',
    })
  }

  /**
   * Logout completo
   */
  private async logout(): Promise<void> {
    // Import stores dynamically to avoid initialization order / circular deps
    const { useAuthStore } = await import('@/modules/auth/presentation/stores/auth.store')
    const { useTenantStore } = await import('@/core/tenant/presentation/stores/tenant.store')

    const authStore = useAuthStore()
    const tenantStore = useTenantStore()

    await authStore.logout()
    tenantStore.reset()

    router.push({
      name: 'Login',
      query: { redirect: router.currentRoute.value.fullPath },
    })
  }

  /**
   * Formatea errores de validación
   */
  private formatValidationErrors(errors: Record<string, string[]>): Record<string, string> {
    const formatted: Record<string, string> = {}

    for (const [field, messages] of Object.entries(errors)) {
      formatted[field] = messages[0] // Tomar solo el primer error
    }

    return formatted
  }
}

// Singleton
export const errorHttpInterceptor = new ErrorHttpInterceptor()
