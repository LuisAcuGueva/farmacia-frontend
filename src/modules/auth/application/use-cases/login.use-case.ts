import type { LoginDTO } from '../../domain/dtos/login.dto'
import type { SessionEntity } from '../../domain/entities/user.entity'
import type { AuthRepository } from '../../domain/interfaces/auth.repository'
import { UserMapper } from '../../infrastructure/mappers/user.mapper'

/**
 * Login Use Case
 * Caso de uso para realizar el proceso de login
 */
export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(credentials: LoginDTO): Promise<SessionEntity> {
    try {
      // Validar credenciales
      this.validateCredentials(credentials)

      // Realizar login a través del repositorio
      const response = await this.authRepository.login(credentials)

      // Mapear respuesta a entidad de sesión
      const session: SessionEntity = {
        user: UserMapper.toDomain(response.user),
        tokens: {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken || '',
          expiresIn: 86400, // 24 horas por defecto
          tokenType: 'Bearer',
        },
        expiresAt: new Date(Date.now() + 86400 * 1000), // 24 horas
      }

      return session
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  private validateCredentials(credentials: LoginDTO): void {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email y contraseña son requeridos')
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(credentials.email)) {
      throw new Error('Formato de email inválido')
    }

    // Validar longitud de contraseña
    if (credentials.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres')
    }
  }
}
