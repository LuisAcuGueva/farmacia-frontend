import type { SessionEntity } from '../entities/user.entity'
import type { LoginDTO } from '../dtos/login.dto'

/**
 * Auth Service Interface
 * Define el contrato para el servicio de autenticación
 */
export interface AuthService {
  /**
   * Realizar login
   */
  login(credentials: LoginDTO): Promise<SessionEntity>

  /**
   * Realizar logout
   */
  logout(): Promise<void>

  /**
   * Refrescar sesión
   */
  refreshSession(): Promise<SessionEntity>

  /**
   * Verificar si hay sesión activa
   */
  hasActiveSession(): Promise<boolean>

  /**
   * Obtener sesión actual
   */
  getCurrentSession(): SessionEntity | null

  /**
   * Solicitar recuperación de contraseña
   */
  requestPasswordReset(email: string): Promise<void>

  /**
   * Cambiar contraseña
   */
  changePassword(token: string, newPassword: string): Promise<void>
}
