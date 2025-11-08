import type { AuthRepository } from '../../domain/interfaces/auth.repository'
import type {
  LoginDTO,
  LoginResponseDTO,
  RefreshTokenDTO,
  ResetPasswordDTO,
  ChangePasswordDTO,
} from '../../domain/dtos/login.dto'
import axios, { type AxiosInstance } from 'axios'

/**
 * Auth Repository Implementation
 * Implementación del repositorio de autenticación usando Axios
 */
export class AuthRepositoryImpl implements AuthRepository {
  private readonly apiClient: AxiosInstance
  private readonly baseURL: string

  constructor(baseURL?: string) {
    this.baseURL = baseURL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

    this.apiClient = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor para añadir token
    this.apiClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // Response interceptor para manejo de errores
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      },
    )
  }

  async login(credentials: LoginDTO): Promise<LoginResponseDTO> {
    try {
      const response = await this.apiClient.post<LoginResponseDTO>('/auth/login', credentials)

      // Guardar tokens en localStorage
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken)
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken)
        }
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
      await this.apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Limpiar tokens locales
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  }

  async refreshToken(data: RefreshTokenDTO): Promise<LoginResponseDTO> {
    try {
      const response = await this.apiClient.post<LoginResponseDTO>('/auth/refresh', data)

      // Actualizar tokens
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken)
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken)
        }
      }

      return response.data
    } catch (error: unknown) {
      console.error('Refresh token error:', error)
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Error al refrescar sesión'
      throw new Error(errorMessage)
    }
  }

  async verifySession(): Promise<boolean> {
    try {
      const response = await this.apiClient.get('/auth/verify')
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
