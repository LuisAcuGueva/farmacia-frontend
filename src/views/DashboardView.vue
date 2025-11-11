<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Navigation -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo y Tenant Info -->
          <div class="flex items-center space-x-4">
            <div v-if="tenantBranding?.logo" class="flex-shrink-0">
              <img
                :src="tenantBranding.logo"
                :alt="tenantBranding.companyName"
                class="h-8 w-auto"
              />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">
                {{ tenantBranding?.companyName || 'Sistema de Farmacia' }}
              </h1>
              <p v-if="tenantPlan" class="text-xs text-gray-500">
                Plan {{ tenantPlan.displayName }}
              </p>
            </div>
          </div>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-medium text-gray-900">{{ user?.name }}</p>
              <p class="text-xs text-gray-500">{{ user?.email }}</p>
            </div>
            <button
              @click="handleLogout"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90 transition-opacity"
              :style="{ backgroundColor: tenantBranding?.primaryColor || '#EF4444' }"
            >
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Salir
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900">¡Bienvenido, {{ user?.name }}!</h2>
        <p class="mt-1 text-sm text-gray-600">
          Aquí tienes un resumen de tu farmacia {{ tenantSubdomain }}
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <!-- Stat Card 1: Ventas del día -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div
                  class="rounded-md p-3"
                  :style="{ backgroundColor: tenantBranding?.primaryColor + '20' || '#EF444420' }"
                >
                  <svg
                    class="h-6 w-6"
                    :style="{ color: tenantBranding?.primaryColor || '#EF4444' }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Ventas del Día</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">$0.00</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <a
                href="#"
                class="font-medium hover:text-gray-900"
                :style="{ color: tenantBranding?.primaryColor || '#EF4444' }"
              >
                Ver detalle →
              </a>
            </div>
          </div>
        </div>

        <!-- Stat Card 2: Productos -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="rounded-md p-3 bg-green-100">
                  <svg
                    class="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Productos</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">0</div>
                    <span class="ml-2 text-sm text-gray-500"
                      >/ {{ tenantPlan?.maxProducts || 100 }}</span
                    >
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <a href="#" class="font-medium text-green-600 hover:text-green-900">
                Ver inventario →
              </a>
            </div>
          </div>
        </div>

        <!-- Stat Card 3: Usuarios -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="rounded-md p-3 bg-blue-100">
                  <svg
                    class="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Usuarios</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">1</div>
                    <span class="ml-2 text-sm text-gray-500"
                      >/ {{ tenantPlan?.maxUsers || 5 }}</span
                    >
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <a href="#" class="font-medium text-blue-600 hover:text-blue-900"> Gestionar → </a>
            </div>
          </div>
        </div>

        <!-- Stat Card 4: Sucursales -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="rounded-md p-3 bg-purple-100">
                  <svg
                    class="h-6 w-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Sucursales</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">1</div>
                    <span class="ml-2 text-sm text-gray-500"
                      >/ {{ tenantPlan?.maxBranches || 1 }}</span
                    >
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <a href="#" class="font-medium text-purple-600 hover:text-purple-900">
                Ver todas →
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Quick Actions -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-5 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
          </div>
          <div class="px-6 py-4">
            <div class="grid grid-cols-2 gap-4">
              <button
                class="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all"
              >
                <svg
                  class="h-8 w-8 text-gray-600 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span class="text-sm font-medium text-gray-900">Nueva Venta</span>
              </button>

              <button
                class="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all"
              >
                <svg
                  class="h-8 w-8 text-gray-600 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <span class="text-sm font-medium text-gray-900">Agregar Producto</span>
              </button>

              <button
                class="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all"
              >
                <svg
                  class="h-8 w-8 text-gray-600 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span class="text-sm font-medium text-gray-900">Clientes</span>
              </button>

              <button
                class="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all"
              >
                <svg
                  class="h-8 w-8 text-gray-600 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span class="text-sm font-medium text-gray-900">Reportes</span>
              </button>
            </div>
          </div>
        </div>

        <!-- User & Tenant Info -->
        <div class="space-y-4">
          <!-- User Info Card -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-5 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Tu Información</h3>
            </div>
            <div class="px-6 py-4">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-3">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ user?.email }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Roles</dt>
                  <dd class="mt-1">
                    <span
                      v-for="role in user?.roles"
                      :key="role"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2"
                    >
                      {{ role }}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Sucursal</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ user?.branchName || user?.branchId || 'No asignada' }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Permisos</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ user?.permissions.length || 0 }} permisos
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Plan Info Card -->
          <div v-if="tenantPlan" class="bg-white shadow rounded-lg">
            <div class="px-6 py-5 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Plan Actual</h3>
            </div>
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-4">
                <span class="text-2xl font-bold text-gray-900">{{ tenantPlan.displayName }}</span>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="getPlanBadgeClass(tenantPlan.name)"
                >
                  {{ tenantPlan.name.toUpperCase() }}
                </span>
              </div>
              <dl class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <dt class="text-gray-500">Usuarios</dt>
                  <dd class="font-medium text-gray-900">{{ tenantPlan.maxUsers }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-500">Sucursales</dt>
                  <dd class="font-medium text-gray-900">{{ tenantPlan.maxBranches }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-500">Productos</dt>
                  <dd class="font-medium text-gray-900">{{ tenantPlan.maxProducts }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Debug Info (solo en desarrollo) -->
      <div v-if="showDebugInfo" class="mt-8 bg-yellow-50 rounded-lg p-4">
        <h3 class="text-sm font-medium text-yellow-900 mb-2">🔧 Información de Debug</h3>
        <pre class="text-xs text-yellow-800 overflow-auto">{{ debugInfo }}</pre>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../modules/auth/presentation/composables/useAuth'
import { useTenantStore } from '@/core/tenant/presentation/stores/tenant.store'

const router = useRouter()
const { user, logout } = useAuth()
const tenantStore = useTenantStore()

// Información del tenant
const tenantBranding = computed(() => tenantStore.branding)
const tenantPlan = computed(() => tenantStore.plan)
const tenantSubdomain = computed(() => tenantStore.subdomain)

// Configuración
const showDebugInfo = import.meta.env.DEV

const debugInfo = computed(() => ({
  user: {
    id: user.value?.id,
    name: user.value?.name,
    email: user.value?.email,
    roles: user.value?.roles,
    branchId: user.value?.branchId,
  },
  tenant: {
    subdomain: tenantSubdomain.value,
    plan: tenantPlan.value,
    branding: tenantBranding.value,
  },
}))

async function handleLogout() {
  await logout()
  router.push('/auth/login')
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
