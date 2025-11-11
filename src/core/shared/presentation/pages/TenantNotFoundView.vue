<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full text-center">
      <!-- Icono -->
      <div class="mb-8">
        <svg
          class="mx-auto h-24 w-24 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <!-- Contenido -->
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Tenant no encontrado</h1>

      <p class="text-lg text-gray-600 mb-8">
        No pudimos encontrar una cuenta asociada a este dominio.
      </p>

      <!-- Detalles en desarrollo -->
      <div v-if="isDev" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <p class="text-sm font-medium text-yellow-800 mb-2">🔧 Información de desarrollo:</p>
        <p class="text-xs text-yellow-700">
          Subdomain detectado: <strong>{{ detectedSubdomain || 'ninguno' }}</strong>
        </p>
        <p class="text-xs text-yellow-700">Hostname: {{ hostname }}</p>
      </div>

      <!-- Acciones -->
      <div class="space-y-3">
        <button
          v-if="isDev"
          @click="goToDevTenant"
          class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Usar tenant de desarrollo (demo)
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

      <!-- Información adicional -->
      <div class="mt-8 text-sm text-gray-500">
        <p>¿Eres un nuevo cliente?</p>
        <a href="/registro" class="text-blue-600 hover:text-blue-700 font-medium">
          Solicita una cuenta aquí
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { subdomainDetector } from '@/core/tenant/infrastructure/utils/subdomain-detector'

const router = useRouter()

const isDev = import.meta.env.DEV
const detectedSubdomain = ref<string | null>(null)
const hostname = ref<string>('')

onMounted(() => {
  const detection = subdomainDetector.detect()
  detectedSubdomain.value = detection.subdomain
  hostname.value = window.location.hostname
})

function goToDevTenant() {
  // Cambiar al tenant de desarrollo por defecto
  localStorage.setItem('dev_tenant', 'demo')
  window.location.reload()
}

function goToMainSite() {
  // Redirigir al dominio principal
  if (isDev) {
    window.location.href = 'http://localhost:5173'
  } else {
    window.location.href = 'https://farmasys.com'
  }
}
</script>
