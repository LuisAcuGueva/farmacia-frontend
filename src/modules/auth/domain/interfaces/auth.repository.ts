import type {
  LoginDTO,
  LoginResponseDTO,
  RefreshTokenDTO,
  ResetPasswordDTO,
  ChangePasswordDTO,
} from '../dtos/login.dto'

/**
 * Auth Repository Interface
 * Define el contrato para las operaciones de autenticación
 */
export interface AuthRepository {
  /**
   * Realizar login
   */
  login(credentials: LoginDTO): Promise<LoginResponseDTO>

  /**
   * Realizar logout
   */
  logout(): Promise<void>

  /**
   * Refrescar token de acceso
   */
  refreshToken(data: RefreshTokenDTO): Promise<LoginResponseDTO>

  /**
   * Verificar si la sesión es válida
   */
  verifySession(): Promise<boolean>

  /**
   * Solicitar recuperación de contraseña
   */
  requestPasswordReset(data: ResetPasswordDTO): Promise<void>

  /**
   * Cambiar contraseña
   */
  changePassword(data: ChangePasswordDTO): Promise<void>
}
