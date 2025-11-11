<template>
  <div class="space-y-6">
    <div class="text-center">
      <div v-if="tenantBranding?.logo" class="flex justify-center mb-4">
        <img
          :src="tenantBranding.logo"
          :alt="`Logo de ${tenantBranding.companyName}`"
          class="h-16 w-auto"
        />
      </div>
      <h2 class="text-3xl font-extrabold text-gray-900">
        {{ tenantBranding?.companyName || 'Sistema de Farmacia' }}
      </h2>
      <p v-if="tenantBranding?.tagline" class="mt-2 text-sm text-gray-600">
        {{ tenantBranding.tagline }}
      </p>
      <p v-else class="mt-2 text-sm text-gray-600">Inicia sesión en tu cuenta</p>
      <div v-if="showTenantInfo && tenantPlan" class="mt-3">
        <span
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
          :class="getPlanBadgeClass(tenantPlan.name)"
        >
          Plan {{ tenantPlan.displayName }}
        </span>
      </div>
    </div>
    <form class="space-y-5" @submit.prevent="handleLogin">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">
          Correo electrónico
        </label>
        <input
          id="email"
          v-model="formData.email"
          name="email"
          type="email"
          autocomplete="email"
          required
          class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="correo@ejemplo.com"
          :disabled="isLoading"
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
        <input
          id="password"
          v-model="formData.password"
          name="password"
          type="password"
          autocomplete="current-password"
          required
          class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="••••••••"
          :disabled="isLoading"
        />
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember-me"
            v-model="formData.rememberMe"
            name="remember-me"
            type="checkbox"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-900">Recordarme</label>
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
      <div v-if="error" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">{{ error }}</p>
          </div>
        </div>
      </div>
      <div>
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          :style="{ backgroundColor: tenantBranding?.primaryColor || '#4F46E5' }"
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
    <div
      v-if="showTenantInfo && tenantSubdomain"
      class="text-center text-xs text-gray-500 pt-4 border-t"
    >
      <p>
        🏢 Tenant: <span class="font-mono">{{ tenantSubdomain }}</span>
      </p>
      <p>
        📍 Contexto:
        <span class="font-semibold">{{ tenantStore.isAdmin ? 'Admin' : 'Tenant' }}</span>
      </p>
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

const tenantBranding = computed(() => tenantStore.branding)
const tenantPlan = computed(() => tenantStore.plan)
const tenantSubdomain = computed(() => tenantStore.subdomain)

const showTenantInfo = import.meta.env.VITE_SHOW_TENANT_INFO === 'true'

const formData = ref<LoginDTO>({
  email: '',
  password: '',
})

async function handleLogin() {
  try {
    await login(formData.value)
    if (tenantStore.isAdmin) {
      router.push('/admin/dashboard')
    } else {
      router.push('/app/dashboard')
    }
  } catch (err) {
    console.error('Login failed:', err)
  }
}

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
input:focus {
  --tw-ring-color: var(--color-primary);
  border-color: var(--color-primary);
}
button:hover:not(:disabled) {
  filter: brightness(0.9);
}
</style>
