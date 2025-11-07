import { computed } from 'vue'
import { useAuthStore } from '../stores/auth.store'
import type { LoginDTO } from '../../domain/dtos/login.dto'

/**
 * useAuth Composable
 * Composable para facilitar el uso de autenticación en componentes
 */
export function useAuth() {
  const authStore = useAuthStore()

  // State
  const user = computed(() => authStore.currentUser)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isLoading = computed(() => authStore.isLoading)
  const error = computed(() => authStore.error)
  const userRole = computed(() => authStore.userRole)
  const userPermissions = computed(() => authStore.userPermissions)

  // Actions
  async function login(credentials: LoginDTO) {
    return await authStore.login(credentials)
  }

  async function logout() {
    return await authStore.logout()
  }

  async function refreshSession() {
    return await authStore.refreshSession()
  }

  async function verifySession() {
    return await authStore.verifySession()
  }

  async function requestPasswordReset(email: string) {
    return await authStore.requestPasswordReset(email)
  }

  async function changePassword(token: string, newPassword: string) {
    return await authStore.changePassword(token, newPassword)
  }

  function hasPermission(permission: string): boolean {
    return authStore.hasPermission(permission)
  }

  function hasRole(role: string): boolean {
    return authStore.hasRole(role)
  }

  function initialize() {
    authStore.initializeFromStorage()
  }

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    userRole,
    userPermissions,
    // Actions
    login,
    logout,
    refreshSession,
    verifySession,
    requestPasswordReset,
    changePassword,
    hasPermission,
    hasRole,
    initialize,
  }
}
