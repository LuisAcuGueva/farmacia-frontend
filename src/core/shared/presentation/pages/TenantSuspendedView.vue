<template>
  <div class="min-h-screen flex items-center justify-center bg-red-50 px-4">
    <div class="max-w-md w-full text-center">
      <!-- Icono -->
      <div class="mb-8">
        <svg
          class="mx-auto h-24 w-24 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <!-- Contenido -->
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Cuenta suspendida</h1>

      <p class="text-lg text-gray-700 mb-2">Tu cuenta ha sido suspendida temporalmente.</p>

      <p class="text-sm text-gray-600 mb-8">
        Por favor, contacta con nuestro equipo de soporte para resolver esta situación.
      </p>

      <!-- Detalles del tenant -->
      <div v-if="tenantInfo" class="bg-white border border-red-200 rounded-lg p-4 mb-8">
        <p class="text-sm font-medium text-gray-700 mb-2">Detalles de la cuenta:</p>
        <div class="text-xs text-gray-600 space-y-1">
          <p><strong>Nombre:</strong> {{ tenantInfo.name }}</p>
          <p><strong>Subdomain:</strong> {{ tenantInfo.subdomain }}</p>
          <p v-if="tenantInfo.suspendedAt">
            <strong>Fecha de suspensión:</strong> {{ formatDate(tenantInfo.suspendedAt) }}
          </p>
        </div>
      </div>

      <!-- Razones comunes -->
      <div class="bg-white border border-gray-200 rounded-lg p-4 mb-8 text-left">
        <p class="text-sm font-medium text-gray-700 mb-3">Razones comunes de suspensión:</p>
        <ul class="text-xs text-gray-600 space-y-2">
          <li class="flex items-start">
            <span class="text-red-500 mr-2">•</span>
            <span>Pagos pendientes o facturación vencida</span>
          </li>
          <li class="flex items-start">
            <span class="text-red-500 mr-2">•</span>
            <span>Violación de los términos de servicio</span>
          </li>
          <li class="flex items-start">
            <span class="text-red-500 mr-2">•</span>
            <span>Actividad sospechosa detectada</span>
          </li>
          <li class="flex items-start">
            <span class="text-red-500 mr-2">•</span>
            <span>Solicitud del titular de la cuenta</span>
          </li>
        </ul>
      </div>

      <!-- Acciones -->
      <div class="space-y-3">
        <a
          href="mailto:soporte@farmasys.com?subject=Cuenta Suspendida"
          class="block w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Contactar a soporte
        </a>

        <button
          @click="goToMainSite"
          class="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Ir al sitio principal
        </button>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-xs text-gray-500">
        <p>
          Si crees que esto es un error, por favor
          <a href="tel:+123456789" class="text-red-600 hover:text-red-700 font-medium">
            llámanos al (123) 456-7890
          </a>
        </p>
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
  // Obtener info del tenant suspendido (si está disponible)
  if (tenantStore.tenant) {
    tenantInfo.value = {
      name: tenantStore.tenant.name,
      subdomain: tenantStore.tenant.subdomain,
      suspendedAt: new Date(), // Esto debería venir del backend
    }
  }
})

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

function goToMainSite() {
  if (isDev) {
    window.location.href = 'http://localhost:5173'
  } else {
    window.location.href = 'https://farmasys.com'
  }
}
</script>
