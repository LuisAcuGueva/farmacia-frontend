import type { InternalAxiosRequestConfig, AxiosError } from 'axios'

/**
 * Interceptor para agregar el token de autenticación en los headers
 *
 * Este interceptor:
 * 1. Lee el accessToken desde sessionStorage
 * 2. Lo agrega al header Authorization
 * 3. El refreshToken se maneja automáticamente vía cookies httpOnly
 */
class AuthHttpInterceptor {
  /**
   * Interceptor de request
   */
  onRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    try {
      // Obtener accessToken desde sessionStorage
      const accessToken = sessionStorage.getItem('accessToken')

      if (accessToken) {
        // Agregar Bearer token
        config.headers.set('Authorization', `Bearer ${accessToken}`)

        // Log en desarrollo (SIN mostrar el token completo por seguridad)
        if (import.meta.env.DEV) {
          console.log('🔐 [Auth Interceptor]', {
            url: config.url,
            hasToken: true,
            tokenPreview: accessToken.substring(0, 20) + '...',
          })
        }
      } else {
        // Si no hay token, verificar si la ruta requiere auth
        if (import.meta.env.DEV) {
          console.log('⚠️ [Auth Interceptor] No token found for:', config.url)
        }
      }
    } catch (error) {
      console.warn('[Auth Interceptor] Error al obtener token:', error)
    }

    return config
  }

  /**
   * Manejador de error en request
   */
  onRequestError(error: AxiosError): Promise<never> {
    console.error('[Auth Interceptor] Error en request:', error)
    return Promise.reject(error)
  }

  /**
   * Actualiza el accessToken en sessionStorage
   * (llamar después de refresh token)
   */
  setAccessToken(token: string): void {
    sessionStorage.setItem('accessToken', token)
  }

  /**
   * Limpia el accessToken
   * (llamar en logout)
   */
  clearAccessToken(): void {
    sessionStorage.removeItem('accessToken')
  }

  /**
   * Obtiene el accessToken actual
   */
  getAccessToken(): string | null {
    return sessionStorage.getItem('accessToken')
  }
}

// Singleton
export const authHttpInterceptor = new AuthHttpInterceptor()
