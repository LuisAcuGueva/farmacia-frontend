import type { SessionEntity } from '../../domain/entities/user.entity'
import type { AuthRepository } from '../../domain/interfaces/auth.repository'
import { UserMapper } from '../../infrastructure/mappers/user.mapper'

/**
 * Refresh Token Use Case
 * Caso de uso para refrescar el token de acceso
 */
export class RefreshTokenUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(refreshToken: string): Promise<SessionEntity> {
    try {
      if (!refreshToken) {
        throw new Error('Refresh token es requerido')
      }

      // Refrescar token a través del repositorio
      const response = await this.authRepository.refreshToken({ refreshToken })

      // Mapear respuesta a entidad de sesión
      const session: SessionEntity = {
        user: UserMapper.toDomain(response.user),
        tokens: {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken || refreshToken,
          expiresIn: 86400, // 24 horas por defecto
          tokenType: 'Bearer',
        },
        expiresAt: new Date(Date.now() + 86400 * 1000), // 24 horas
      }

      return session
    } catch (error) {
      console.error('Refresh token error:', error)
      throw error
    }
  }
}
