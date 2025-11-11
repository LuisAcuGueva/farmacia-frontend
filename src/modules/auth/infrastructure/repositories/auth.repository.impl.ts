import type { AuthRepository } from '../../domain/interfaces/auth.repository'
import type {
  LoginDTO,
  LoginResponseDTO,
  RefreshTokenDTO,
  ResetPasswordDTO,
  ChangePasswordDTO,
} from '../../domain/dtos/login.dto'
import { axiosInstance } from '@/core/config/axios.config'
import axios, { type AxiosInstance } from 'axios'

/**
 * Auth Repository Implementation
 * Implementación del repositorio de autenticación usando Axios
 */
export class AuthRepositoryImpl implements AuthRepository {
  private readonly apiClient: AxiosInstance

  constructor() {
    // Usar la instancia central para que los interceptors globales (tenant, auth, error)
    // sean aplicados también a las peticiones de autenticación (login, refresh, etc.)
    this.apiClient = axiosInstance
  }

  /**
   * Método centralizado para limpiar datos de autenticación
   */
  private clearAuthData(): void {
    sessionStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  }

  /**
   * Detecta si estamos en contexto de admin
   */
  private async isAdminContext(): Promise<boolean> {
    try {
      const { useTenantStore } = await import('@/core/tenant/presentation/stores/tenant.store')
      const tenantStore = useTenantStore()
      return tenantStore.isAdmin
    } catch (error) {
      console.warn('[Auth Repository] Error al detectar contexto admin:', error)
      return false
    }
  }

  async login(credentials: LoginDTO): Promise<LoginResponseDTO> {
    try {
      // Detectar si es admin para usar el endpoint correcto
      const isAdmin = await this.isAdminContext()
      const endpoint = isAdmin ? '/admin/auth/login' : '/auth/login'

      if (import.meta.env.DEV) {
        console.log('🔐 [Auth Repository] Login:', {
          isAdmin,
          endpoint,
          email: credentials.email,
        })
      }

      const response = await this.apiClient.post<LoginResponseDTO>(endpoint, credentials)

      if (response.data.accessToken) {
        sessionStorage.setItem('accessToken', response.data.accessToken)
      }
      return response.data
    } catch (error: unknown) {
      console.error('Login error:', error)
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Error al iniciar sesión'
      throw new Error(errorMessage)
    }
  }

  async logout(): Promise<void> {
    try {
      const isAdmin = await this.isAdminContext()
      const endpoint = isAdmin ? '/admin/auth/logout' : '/auth/logout'

      await this.apiClient.post(endpoint)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearAuthData()
    }
  }

  async refreshToken(_data?: RefreshTokenDTO): Promise<LoginResponseDTO> {
    try {
      const isAdmin = await this.isAdminContext()
      const endpoint = isAdmin ? '/admin/auth/refresh' : '/auth/refresh'

      const response = await this.apiClient.post<LoginResponseDTO>(endpoint)
      if (response.data.accessToken) {
        sessionStorage.setItem('accessToken', response.data.accessToken)
      }
      return response.data
    } catch (error: unknown) {
      console.error('Refresh token error:', error)
      this.clearAuthData()
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Error al refrescar sesión'
      throw new Error(errorMessage)
    }
  }

  async verifySession(): Promise<boolean> {
    try {
      const isAdmin = await this.isAdminContext()
      const endpoint = isAdmin ? '/admin/auth/verify' : '/auth/verify'

      const response = await this.apiClient.get(endpoint)
      return response.status === 200
    } catch {
      return false
    }
  }

  async requestPasswordReset(data: ResetPasswordDTO): Promise<void> {
    try {
      await this.apiClient.post('/auth/reset-password', data)
    } catch (error: unknown) {
      console.error('Request password reset error:', error)
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Error al solicitar recuperación de contraseña'
      throw new Error(errorMessage)
    }
  }

  async changePassword(data: ChangePasswordDTO): Promise<void> {
    try {
      await this.apiClient.post('/auth/change-password', data)
    } catch (error: unknown) {
      console.error('Change password error:', error)
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Error al cambiar contraseña'
      throw new Error(errorMessage)
    }
  }
}
