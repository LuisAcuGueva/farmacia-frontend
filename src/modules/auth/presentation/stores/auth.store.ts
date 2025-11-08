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
  const refreshToken = ref<string | null>(null)
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

      // Actualizar state
      user.value = session.user
      accessToken.value = session.tokens.accessToken
      refreshToken.value = session.tokens.refreshToken

      // Persistir en localStorage
      persistSession(session)

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
      // Limpiar state
      user.value = null
      accessToken.value = null
      refreshToken.value = null
      error.value = null
      isLoading.value = false

      // Limpiar localStorage
      clearSession()
    }
  }

  async function refreshSession() {
    try {
      if (!refreshToken.value) {
        throw new Error('No refresh token available')
      }

      const session: SessionEntity = await authService.refreshSession()

      // Actualizar state
      user.value = session.user
      accessToken.value = session.tokens.accessToken
      refreshToken.value = session.tokens.refreshToken

      // Persistir en localStorage
      persistSession(session)

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
      const storedAccessToken = localStorage.getItem('accessToken')
      const storedRefreshToken = localStorage.getItem('refreshToken')

      if (storedUser && storedAccessToken) {
        user.value = JSON.parse(storedUser)
        accessToken.value = storedAccessToken
        refreshToken.value = storedRefreshToken
      }
    } catch (err) {
      console.error('Error initializing from storage:', err)
      clearSession()
    }
  }

  function hasPermission(permission: string): boolean {
    return userPermissions.value.includes(permission)
  }

  function hasRole(role: string): boolean {
    return user.value?.roles.includes(role) || false
  }

  // Helper functions
  function persistSession(session: SessionEntity) {
    localStorage.setItem('user', JSON.stringify(session.user))
    localStorage.setItem('accessToken', session.tokens.accessToken)
    localStorage.setItem('refreshToken', session.tokens.refreshToken)
  }

  function clearSession() {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  return {
    // State
    user,
    accessToken,
    refreshToken,
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
