import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserEntity, SessionEntity } from '../../domain/entities/user.entity'
import type { LoginDTO } from '../../domain/dtos/login.dto'
import { AuthServiceImpl } from '../../application/services/auth.service'
import { AuthRepositoryImpl } from '../../infrastructure/repositories/auth.repository.impl'

/**
 * Auth Store
 * Store de Pinia para gestionar el estado de autenticación
 */
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<UserEntity | null>(null)
  const accessToken = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Inicializar servicio
  const authRepository = new AuthRepositoryImpl()
  const authService = new AuthServiceImpl(authRepository)

  // Computed
  const isAuthenticated = computed(() => !!user.value && !!accessToken.value)
  const currentUser = computed(() => user.value)
  const userRole = computed(() => user.value?.roles[0] || null)
  const userPermissions = computed(() => user.value?.permissions || [])

  // Actions
  async function login(credentials: LoginDTO) {
    try {
      isLoading.value = true
      error.value = null
      const session: SessionEntity = await authService.login(credentials)
      user.value = session.user
      accessToken.value = session.tokens.accessToken
      persistUserData(session.user)
      return session
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      isLoading.value = true
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      user.value = null
      accessToken.value = null
      error.value = null
      isLoading.value = false
      clearUserData()
    }
  }

  async function refreshSession() {
    try {
      const session: SessionEntity = await authService.refreshSession()
      user.value = session.user
      accessToken.value = session.tokens.accessToken
      persistUserData(session.user)
      return session
    } catch (err) {
      console.error('Refresh session error:', err)
      await logout()
      throw err
    }
  }

  async function verifySession(): Promise<boolean> {
    try {
      return await authService.hasActiveSession()
    } catch (err) {
      console.error('Verify session error:', err)
      return false
    }
  }

  async function requestPasswordReset(email: string) {
    try {
      isLoading.value = true
      error.value = null
      await authService.requestPasswordReset(email)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al solicitar recuperación'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function changePassword(token: string, newPassword: string) {
    try {
      isLoading.value = true
      error.value = null
      await authService.changePassword(token, newPassword)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar contraseña'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function initializeFromStorage() {
    try {
      const storedUser = localStorage.getItem('user')
      const storedAccessToken = sessionStorage.getItem('accessToken')
      if (storedUser) {
        user.value = JSON.parse(storedUser)
        // Si hay accessToken en sessionStorage, usarlo
        if (storedAccessToken) {
          accessToken.value = storedAccessToken
        } else {
          // Si no hay accessToken, intentar refrescar sesión
          refreshSession().catch(() => {
            // Si falla el refresh, limpiar todo
            clearUserData()
          })
        }
      }
    } catch (err) {
      console.error('Error initializing from storage:', err)
      clearUserData()
    }
  }

  function hasPermission(permission: string): boolean {
    return userPermissions.value.includes(permission)
  }

  function hasRole(role: string): boolean {
    return user.value?.roles.includes(role) || false
  }

  // Helper functions
  /**
   * Persiste solo datos NO sensibles del usuario en localStorage
   * Los tokens se manejan de forma segura:
   * - accessToken: sessionStorage (se limpia al cerrar navegador)
   * - refreshToken: httpOnly cookie (manejado por backend)
   */
  function persistUserData(userData: UserEntity) {
    const safeUserData = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      roles: userData.roles,
      permissions: userData.permissions,
      isActive: userData.isActive,
      branchId: userData.branchId,
      branchName: userData.branchName,
    }
    localStorage.setItem('user', JSON.stringify(safeUserData))
  }

  /**
   * Limpia solo los datos del usuario
   * Los tokens se limpian automáticamente:
   * - sessionStorage al cerrar navegador
   * - cookie httpOnly por el backend en logout
   */
  function clearUserData() {
    localStorage.removeItem('user')
    sessionStorage.removeItem('accessToken')
  }

  return {
    // State
    user,
    accessToken,
    isLoading,
    error,
    // Computed
    isAuthenticated,
    currentUser,
    userRole,
    userPermissions,
    // Actions
    login,
    logout,
    refreshSession,
    verifySession,
    requestPasswordReset,
    changePassword,
    initializeFromStorage,
    hasPermission,
    hasRole,
  }
})
