import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { TenantMetadata, TenantContext } from '../../domain/types/tenant.types'
import { TenantEntity } from '../../domain/entities/tenant.entity'
import { detectTenantUseCase } from '../../application/use-cases/detect-tenant.use-case'
import { tenantCache } from '../../infrastructure/utils/tenant-cache'

export const useTenantStore = defineStore('tenant', () => {
  // ==================== STATE ====================
  const tenant = ref<TenantMetadata | null>(null)
  const isLoading = ref(false)
  const isValidating = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)
  const isAdmin = ref(false)

  // ==================== GETTERS ====================

  const tenantEntity = computed(() => {
    return tenant.value ? TenantEntity.fromMetadata(tenant.value) : null
  })

  const isActive = computed(() => {
    return tenantEntity.value?.isActive ?? false
  })

  const isInTrial = computed(() => {
    return tenantEntity.value?.isInTrial ?? false
  })

  const isSuspended = computed(() => {
    return tenantEntity.value?.isSuspended ?? false
  })

  const subdomain = computed(() => {
    return tenant.value?.subdomain ?? null
  })

  const tenantId = computed(() => {
    return tenant.value?.id ?? null
  })

  const branding = computed(() => {
    return tenant.value?.branding ?? null
  })

  const features = computed(() => {
    return tenant.value?.features ?? null
  })

  const limits = computed(() => {
    return tenant.value?.limits ?? null
  })

  const plan = computed(() => {
    return tenant.value?.plan ?? null
  })

  const context = computed<TenantContext>(() => ({
    tenant: tenant.value,
    isLoading: isLoading.value,
    isValidating: isValidating.value,
    error: error.value,
    lastUpdated: lastUpdated.value,
  }))

  // ==================== ACTIONS ====================

  /**
   * Inicializa y detecta el tenant
   */
  async function initialize(): Promise<boolean> {
    if (isLoading.value) {
      return false
    }

    isLoading.value = true
    error.value = null

    try {
      const result = await detectTenantUseCase.execute()

      if (result.success) {
        tenant.value = result.tenant
        isAdmin.value = result.isAdmin
        lastUpdated.value = new Date()
        return true
      } else {
        error.value = result.error || 'Error desconocido'
        return false
      }
    } catch (err: any) {
      error.value = err.message || 'Error al inicializar tenant'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Revalida el tenant actual
   */
  async function revalidate(): Promise<boolean> {
    if (!subdomain.value || isValidating.value) {
      return false
    }

    isValidating.value = true

    try {
      const result = await detectTenantUseCase.execute()

      if (result.success && result.tenant) {
        tenant.value = result.tenant
        lastUpdated.value = new Date()
        return true
      }

      return false
    } catch (err) {
      return false
    } finally {
      isValidating.value = false
    }
  }

  /**
   * Verifica si tiene una feature específica
   */
  function hasFeature(feature: string): boolean {
    if (!features.value) return false
    return (features.value as any)[feature] === true
  }

  /**
   * Verifica si ha alcanzado un límite
   */
  function hasReachedLimit(limit: keyof typeof limits.value, current: number): boolean {
    if (!limits.value) return false
    return current >= (limits.value[limit] || 0)
  }

  /**
   * Limpia el estado del tenant
   */
  function reset(): void {
    tenant.value = null
    isLoading.value = false
    isValidating.value = false
    error.value = null
    lastUpdated.value = null
    isAdmin.value = false
  }

  /**
   * Actualiza el tenant (después de cambios desde admin)
   */
  function updateTenant(updatedTenant: TenantMetadata): void {
    tenant.value = updatedTenant
    lastUpdated.value = new Date()

    // Actualizar caché
    if (subdomain.value) {
      tenantCache.set(subdomain.value, updatedTenant)
      tenantCache.persist(subdomain.value)
    }
  }

  /**
   * Cambia tenant en modo desarrollo
   */
  function switchDevTenant(newSubdomain: string): void {
    if (import.meta.env.VITE_DEV_MODE === 'true') {
      tenantCache.clear()
      reset()
      // El detector manejará el cambio
      window.location.reload()
    }
  }

  // ==================== WATCHERS ====================

  // Aplicar branding cuando cambia el tenant
  watch(branding, (newBranding) => {
    if (newBranding) {
      applyBranding(newBranding)
    }
  })

  // Función auxiliar para aplicar branding
  function applyBranding(brandingData: any) {
    // Aplicar colores CSS
    document.documentElement.style.setProperty('--color-primary', brandingData.primaryColor)
    document.documentElement.style.setProperty('--color-secondary', brandingData.secondaryColor)

    // Cambiar favicon
    if (brandingData.favicon) {
      const link: HTMLLinkElement =
        document.querySelector("link[rel*='icon']") || document.createElement('link')
      link.type = 'image/x-icon'
      link.rel = 'shortcut icon'
      link.href = brandingData.favicon
      document.getElementsByTagName('head')[0].appendChild(link)
    }

    // Cambiar título
    document.title = brandingData.companyName || 'Farmasys'
  }

  return {
    // State
    tenant,
    isLoading,
    isValidating,
    error,
    lastUpdated,
    isAdmin,

    // Getters
    tenantEntity,
    isActive,
    isInTrial,
    isSuspended,
    subdomain,
    tenantId,
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
})
