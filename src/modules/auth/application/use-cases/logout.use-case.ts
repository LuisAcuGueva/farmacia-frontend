import type { AuthRepository } from '../../domain/interfaces/auth.repository'

/**
 * Logout Use Case
 * Caso de uso para realizar el proceso de logout
 */
export class LogoutUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    try {
      // Realizar logout a través del repositorio
      await this.authRepository.logout()
    } catch (error) {
      console.error('Logout error:', error)
      // No lanzar error para permitir logout local incluso si falla el servidor
    }
  }
}
