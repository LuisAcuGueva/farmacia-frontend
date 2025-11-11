<template>
  <div class="min-h-screen flex items-center justify-center bg-orange-50 px-4">
    <div class="max-w-md w-full text-center">
      <!-- Icono -->
      <div class="mb-8">
        <svg
          class="mx-auto h-24 w-24 text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <!-- Contenido -->
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Tenant inválido</h1>

      <p class="text-lg text-gray-600 mb-8">
        El tenant especificado no está activo o tiene un problema de configuración.
      </p>

      <!-- Información -->
      <div v-if="tenantInfo" class="bg-white border border-orange-200 rounded-lg p-4 mb-8">
        <p class="text-sm font-medium text-gray-700 mb-2">Estado del tenant:</p>
        <div class="text-xs text-gray-600 space-y-1">
          <p><strong>Subdomain:</strong> {{ tenantInfo.subdomain }}</p>
          <p><strong>Estado:</strong> {{ tenantInfo.status }}</p>
        </div>
      </div>

      <!-- Acciones -->
      <div class="space-y-3">
        <button
          @click="retry"
          class="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
        >
          Intentar nuevamente
        </button>

        <button
          @click="goToMainSite"
          class="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Ir al sitio principal
        </button>

        <a
          href="mailto:soporte@farmasys.com"
          class="block w-full text-gray-600 px-6 py-3 rounded-lg font-medium hover:text-gray-800 transition-colors"
        >
          Contactar soporte
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTenantStore } from '@/core/tenant/presentation/stores/tenant.store'

const isDev = import.meta.env.DEV
const tenantStore = useTenantStore()
const tenantInfo = ref<any>(null)

onMounted(() => {
  if (tenantStore.tenant) {
    tenantInfo.value = {
      subdomain: tenantStore.tenant.subdomain,
      status: tenantStore.tenant.status,
    }
  }
})

async function retry() {
  await tenantStore.revalidate()
  if (tenantStore.isActive) {
    window.location.href = '/'
  }
}

function goToMainSite() {
  if (isDev) {
    window.location.href = 'http://localhost:5173'
  } else {
    window.location.href = 'https://farmasys.com'
  }
}
</script>
