import type { AuthRepository } from '../../domain/interfaces/auth.repository'

/**
 * Verify Session Use Case
 * Caso de uso para verificar si la sesión es válida
 */
export class VerifySessionUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<boolean> {
    try {
      return await this.authRepository.verifySession()
    } catch (error) {
      console.error('Verify session error:', error)
      return false
    }
  }
}
