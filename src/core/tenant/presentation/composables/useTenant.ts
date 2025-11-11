import { storeToRefs } from 'pinia'
import { useTenantStore } from '../stores/tenant.store'

/**
 * Composable para usar el tenant en componentes
 */
export function useTenant() {
  const store = useTenantStore()

  // Refs reactivos del store
  const {
    tenant,
    isLoading,
    isValidating,
    error,
    isAdmin,
    tenantEntity,
    isActive,
    isInTrial,
    isSuspended,
    subdomain,
    branding,
    features,
    limits,
    plan,
    context,
  } = storeToRefs(store)

  // Acciones
  const {
    initialize,
    revalidate,
    hasFeature,
    hasReachedLimit,
    reset,
    updateTenant,
    switchDevTenant,
  } = store

  return {
    // State
    tenant,
    isLoading,
    isValidating,
    error,
    isAdmin,

    // Computed
    tenantEntity,
    isActive,
    isInTrial,
    isSuspended,
    subdomain,
    branding,
    features,
    limits,
    plan,
    context,

    // Actions
    initialize,
    revalidate,
    hasFeature,
    hasReachedLimit,
    reset,
    updateTenant,
    switchDevTenant,
  }
}
