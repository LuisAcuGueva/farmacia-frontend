import type { AuthRepository } from '../../domain/interfaces/auth.repository'

/**
 * Request Password Reset Use Case
 * Caso de uso para solicitar recuperación de contraseña
 */
export class RequestPasswordResetUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(email: string): Promise<void> {
    try {
      // Validar email
      if (!email) {
        throw new Error('Email es requerido')
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('Formato de email inválido')
      }

      // Solicitar recuperación de contraseña
      await this.authRepository.requestPasswordReset({ email })
    } catch (error) {
      console.error('Request password reset error:', error)
      throw error
    }
  }
}
