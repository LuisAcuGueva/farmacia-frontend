import type { AuthService } from '../../domain/interfaces/auth.service'
import type { AuthRepository } from '../../domain/interfaces/auth.repository'
import type { SessionEntity } from '../../domain/entities/user.entity'
import type { LoginDTO } from '../../domain/dtos/login.dto'
import { LoginUseCase } from '../use-cases/login.use-case'
import { LogoutUseCase } from '../use-cases/logout.use-case'
import { RefreshTokenUseCase } from '../use-cases/refresh-token.use-case'
import { VerifySessionUseCase } from '../use-cases/verify-session.use-case'
import { RequestPasswordResetUseCase } from '../use-cases/request-password-reset.use-case'

/**
 * Auth Service Implementation
 * Servicio de autenticación que orquesta los casos de uso
 */
export class AuthServiceImpl implements AuthService {
  private currentSession: SessionEntity | null = null

  private readonly loginUseCase: LoginUseCase
  private readonly logoutUseCase: LogoutUseCase
  private readonly refreshTokenUseCase: RefreshTokenUseCase
  private readonly verifySessionUseCase: VerifySessionUseCase
  private readonly requestPasswordResetUseCase: RequestPasswordResetUseCase

  constructor(private readonly authRepository: AuthRepository) {
    this.loginUseCase = new LoginUseCase(authRepository)
    this.logoutUseCase = new LogoutUseCase(authRepository)
    this.refreshTokenUseCase = new RefreshTokenUseCase(authRepository)
    this.verifySessionUseCase = new VerifySessionUseCase(authRepository)
    this.requestPasswordResetUseCase = new RequestPasswordResetUseCase(authRepository)
  }

  async login(credentials: LoginDTO): Promise<SessionEntity> {
    const session = await this.loginUseCase.execute(credentials)
    this.currentSession = session
    return session
  }

  async logout(): Promise<void> {
    await this.logoutUseCase.execute()
    this.currentSession = null
  }

  async refreshSession(): Promise<SessionEntity> {
    if (!this.currentSession?.tokens.refreshToken) {
      throw new Error('No hay sesión activa para refrescar')
    }

    const session = await this.refreshTokenUseCase.execute(this.currentSession.tokens.refreshToken)
    this.currentSession = session
    return session
  }

  async hasActiveSession(): Promise<boolean> {
    if (!this.currentSession) {
      return false
    }

    // Verificar si la sesión ha expirado
    if (this.currentSession.expiresAt < new Date()) {
      return false
    }

    // Verificar con el servidor
    return await this.verifySessionUseCase.execute()
  }

  getCurrentSession(): SessionEntity | null {
    return this.currentSession
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.requestPasswordResetUseCase.execute(email)
  }

  async changePassword(token: string, newPassword: string): Promise<void> {
    if (!token || !newPassword) {
      throw new Error('Token y nueva contraseña son requeridos')
    }

    if (newPassword.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres')
    }

    await this.authRepository.changePassword({
      token,
      newPassword,
      confirmPassword: newPassword,
    })
  }
}
