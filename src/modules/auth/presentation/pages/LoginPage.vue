<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header con branding del tenant -->
      <div class="text-center">
        <!-- Logo del tenant (si existe) -->
        <div v-if="tenantBranding?.logo" class="flex justify-center mb-4">
          <img
            :src="tenantBranding.logo"
            :alt="`Logo de ${tenantBranding.companyName}`"
            class="h-16 w-auto"
          />
        </div>

        <!-- Nombre de la empresa del tenant -->
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          {{ tenantBranding?.companyName || 'Sistema de Farmacia' }}
        </h2>

        <!-- Tagline personalizado -->
        <p v-if="tenantBranding?.tagline" class="mt-2 text-center text-sm text-gray-600">
          {{ tenantBranding.tagline }}
        </p>
        <p v-else class="mt-2 text-center text-sm text-gray-600">Inicia sesión en tu cuenta</p>

        <!-- Badge del plan (solo en desarrollo) -->
        <div v-if="showTenantInfo && tenantPlan" class="mt-3 flex justify-center">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
            :class="getPlanBadgeClass(tenantPlan.name)"
          >
            Plan {{ tenantPlan.displayName }}
          </span>
        </div>
      </div>

      <!-- Login Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <!-- Email Input -->
          <div>
            <label for="email" class="sr-only">Correo electrónico</label>
            <input
              id="email"
              v-model="formData.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Correo electrónico"
              :disabled="isLoading"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input
              id="password"
              v-model="formData.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Contraseña"
              :disabled="isLoading"
            />
          </div>
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="formData.rememberMe"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900"> Recordarme </label>
          </div>

          <div class="text-sm">
            <router-link
              to="/auth/recover-password"
              class="font-medium hover:opacity-80"
              :style="{ color: tenantBranding?.primaryColor || '#4F46E5' }"
            >
              ¿Olvidaste tu contraseña?
            </router-link>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ error }}
              </h3>
            </div>
          </div>
        </div>

        <!-- Submit Button con color del tenant -->
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            :style="{
              backgroundColor: tenantBranding?.primaryColor || '#4F46E5',
            }"
          >
            <span v-if="!isLoading">Iniciar Sesión</span>
            <span v-else class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Iniciando sesión...
            </span>
          </button>
        </div>
      </form>

      <!-- Info del tenant (solo en desarrollo) -->
      <div v-if="showTenantInfo && tenantSubdomain" class="mt-4 text-center text-xs text-gray-500">
        <p>🏢 Tenant: {{ tenantSubdomain }}</p>
        <p v-if="tenantPlan">
          👥 Usuarios: {{ tenantPlan.maxUsers }} | 🏪 Sucursales: {{ tenantPlan.maxBranches }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useTenantStore } from '@/core/tenant/presentation/stores/tenant.store'
import type { LoginDTO } from '../../domain/dtos/login.dto'

const router = useRouter()
const { login, isLoading, error } = useAuth()
const tenantStore = useTenantStore()

// Información del tenant
const tenantBranding = computed(() => tenantStore.branding)
const tenantPlan = computed(() => tenantStore.plan)
const tenantSubdomain = computed(() => tenantStore.subdomain)

// Configuración
const showTenantInfo = import.meta.env.VITE_SHOW_TENANT_INFO === 'true'

const formData = ref<LoginDTO>({
  email: '',
  password: '',
  // rememberMe: false,
})

async function handleLogin() {
  try {
    await login(formData.value)

    // Determinar redirección según el contexto
    if (tenantStore.isAdmin) {
      // Redirigir al dashboard de admin
      router.push('/admin/dashboard')
    } else {
      // Redirigir al dashboard del tenant
      router.push('/dashboard')
    }
  } catch (err) {
    console.error('Login failed:', err)
  }
}

/**
 * Clase CSS según el plan
 */
function getPlanBadgeClass(planName: string): string {
  const classes: Record<string, string> = {
    free: 'bg-gray-100 text-gray-800',
    standard: 'bg-blue-100 text-blue-800',
    premium: 'bg-purple-100 text-purple-800',
    enterprise: 'bg-yellow-100 text-yellow-800',
  }
  return classes[planName.toLowerCase()] || 'bg-gray-100 text-gray-800'
}
</script>

<style scoped>
/* Clases dinámicas para ring y border usando el color del tenant */
input:focus {
  --tw-ring-color: var(--color-primary);
  border-color: var(--color-primary);
}

button:hover:not(:disabled) {
  filter: brightness(0.9);
}
</style>
