<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
  >
    <div class="w-full max-w-md px-4">
      <!-- Branding del tenant (si existe y no es admin) -->
      <div v-if="showBranding" class="text-center mb-8">
        <!-- Logo -->
        <div v-if="tenantBranding?.logo" class="flex justify-center mb-4">
          <img :src="tenantBranding.logo" :alt="tenantBranding.companyName" class="h-16 w-auto" />
        </div>

        <!-- Company Name -->
        <h1 class="text-3xl font-bold text-gray-900">
          {{ tenantBranding?.companyName || 'FarmaSys' }}
        </h1>

        <!-- Tagline -->
        <p v-if="tenantBranding?.tagline" class="mt-2 text-sm text-gray-600">
          {{ tenantBranding.tagline }}
        </p>
      </div>

      <!-- Auth Content Card -->
      <div class="bg-white shadow-xl rounded-lg p-8">
        <router-view v-slot="{ Component }">
          <Transition name="slide-fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </div>

      <!-- Footer -->
      <div class="mt-6 text-center">
        <slot name="footer">
          <p class="text-sm text-gray-600">
            © {{ currentYear }} {{ tenantBranding?.companyName || 'FarmaSys' }}. Todos los derechos
            reservados.
          </p>
        </slot>
      </div>

      <!-- Debug Info (solo desarrollo) -->
      <div
        v-if="showDebugInfo"
        class="mt-4 p-3 bg-gray-800 text-white rounded-lg text-xs font-mono"
      >
        <p>🏢 Tenant: {{ tenantStore.subdomain || 'admin' }}</p>
        <p>📍 Contexto: {{ tenantStore.isAdmin ? 'Admin' : 'Tenant' }}</p>
        <p v-if="tenantPlan">📦 Plan: {{ tenantPlan.displayName }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTenantStore } from '@/core/tenant/presentation/stores/tenant.store'

const tenantStore = useTenantStore()

/**
 * Current year for footer
 */
const currentYear = new Date().getFullYear()

/**
 * Show tenant branding (no mostrar si es admin)
 */
const showBranding = computed(() => !tenantStore.isAdmin)

/**
 * Tenant branding
 */
const tenantBranding = computed(() => tenantStore.branding)

/**
 * Tenant plan
 */
const tenantPlan = computed(() => tenantStore.plan)

/**
 * Show debug info
 */
const showDebugInfo = computed(() => import.meta.env.VITE_SHOW_TENANT_INFO === 'true')
</script>

<style scoped>
/* Slide fade transition */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
