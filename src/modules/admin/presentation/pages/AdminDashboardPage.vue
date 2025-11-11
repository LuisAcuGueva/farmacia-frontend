<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p class="mt-1 text-sm text-gray-500">Bienvenido, {{ user?.name }}</p>
        </div>
        <button
          @click="handleLogout"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Stats Cards -->
      <div class="px-4 py-6 sm:px-0">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Total Tenants -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 text-gray-400"
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
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Tenants</dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">0</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Tenants -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Tenants Activos</dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">0</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Suspended Tenants -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Tenants Suspendidos</dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">0</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="mt-8">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h2>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <router-link
              to="/admin/tenants"
              class="relative block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all"
            >
              <div class="flex items-center space-x-3">
                <svg
                  class="h-8 w-8 text-indigo-600"
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
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Gestionar Tenants</h3>
                  <p class="mt-1 text-sm text-gray-500">Ver y administrar todos los tenants</p>
                </div>
              </div>
            </router-link>

            <!-- Placeholder para futuras acciones -->
            <div
              class="relative block p-6 bg-gray-50 rounded-lg border border-gray-200 opacity-50 cursor-not-allowed"
            >
              <div class="flex items-center space-x-3">
                <svg
                  class="h-8 w-8 text-gray-400"
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
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Gestionar Usuarios</h3>
                  <p class="mt-1 text-sm text-gray-500">Próximamente</p>
                </div>
              </div>
            </div>

            <div
              class="relative block p-6 bg-gray-50 rounded-lg border border-gray-200 opacity-50 cursor-not-allowed"
            >
              <div class="flex items-center space-x-3">
                <svg
                  class="h-8 w-8 text-gray-400"
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
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Reportes</h3>
                  <p class="mt-1 text-sm text-gray-500">Próximamente</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User Info (desarrollo) -->
        <div v-if="showDebugInfo" class="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 class="text-sm font-medium text-blue-900 mb-2">🔧 Información de Debug</h3>
          <pre class="text-xs text-blue-800 overflow-auto">{{ debugInfo }}</pre>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/modules/auth/presentation/composables/useAuth'
import { useTenantStore } from '@/core/tenant/presentation/stores/tenant.store'

const router = useRouter()
const { user, logout } = useAuth()
const tenantStore = useTenantStore()

const showDebugInfo = import.meta.env.DEV

const debugInfo = computed(() => ({
  user: {
    id: user.value?.id,
    name: user.value?.name,
    email: user.value?.email,
    roles: user.value?.roles,
  },
  context: {
    isAdmin: tenantStore.isAdmin,
    subdomain: tenantStore.subdomain,
  },
}))

async function handleLogout() {
  try {
    await logout()
    router.push('/auth/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}
</script>
