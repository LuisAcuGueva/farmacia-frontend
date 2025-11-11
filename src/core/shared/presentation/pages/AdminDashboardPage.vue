<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Panel de Administración</h1>
        <p class="mt-1 text-sm text-gray-500">
          Bienvenido, {{ user?.name || 'Super Admin' }} • {{ currentDate }}
        </p>
      </div>
      <button
        @click="refreshData"
        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        :disabled="isLoading"
      >
        <svg
          class="h-4 w-4 mr-2"
          :class="{ 'animate-spin': isLoading }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Actualizar
      </button>
    </div>

    <!-- Main Stats Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Tenants -->
      <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="rounded-md bg-indigo-500 p-3">
                <svg
                  class="h-6 w-6 text-white"
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
                <dt class="text-sm font-medium text-gray-500 truncate">Total Tenants</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ stats.totalTenants }}</div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <svg class="h-3 w-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    {{ stats.growthRate }}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <router-link
              to="/admin/tenants"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Ver todos →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Active Tenants -->
      <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="rounded-md bg-green-500 p-3">
                <svg
                  class="h-6 w-6 text-white"
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
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Activos</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ stats.activeTenants }}</div>
                  <div class="ml-2 text-sm text-gray-500">
                    {{ getPercentage(stats.activeTenants, stats.totalTenants) }}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm text-gray-600">{{ stats.activeToday }} activos hoy</div>
        </div>
      </div>

      <!-- Trial Tenants -->
      <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="rounded-md bg-yellow-500 p-3">
                <svg
                  class="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">En Trial</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ stats.trialTenants }}</div>
                  <div class="ml-2 text-sm text-gray-500">
                    {{ stats.trialExpiringThisWeek }} expiran pronto
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <a href="#" class="font-medium text-yellow-600 hover:text-yellow-500">
              Ver trials próximos a vencer →
            </a>
          </div>
        </div>
      </div>

      <!-- Suspended Tenants -->
      <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="rounded-md bg-red-500 p-3">
                <svg
                  class="h-6 w-6 text-white"
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
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Suspendidos</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ stats.suspendedTenants }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm text-gray-600">{{ stats.suspendedThisMonth }} este mes</div>
        </div>
      </div>
    </div>

    <!-- Charts and Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Tenant Growth Chart -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Crecimiento de Tenants</h3>
        <div class="h-64 flex items-center justify-center text-gray-400">
          <!-- TODO: Integrar gráfico con Chart.js o similar -->
          <div class="text-center">
            <svg
              class="h-16 w-16 mx-auto text-gray-300"
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
            <p class="mt-2">Gráfico de crecimiento (próximamente)</p>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h3>
        <div class="flow-root">
          <ul class="-mb-8">
            <li v-for="(activity, idx) in recentActivity" :key="idx">
              <div class="relative pb-8">
                <span
                  v-if="idx !== recentActivity.length - 1"
                  class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
                <div class="relative flex space-x-3">
                  <div>
                    <span
                      class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                      :class="getActivityColorClass(activity.type)"
                    >
                      <component :is="getActivityIcon(activity.type)" class="h-4 w-4 text-white" />
                    </span>
                  </div>
                  <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p class="text-sm text-gray-500">
                        {{ activity.description }}
                        <span class="font-medium text-gray-900">{{ activity.tenant }}</span>
                      </p>
                    </div>
                    <div class="whitespace-nowrap text-right text-sm text-gray-500">
                      {{ activity.time }}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Plans Distribution -->
    <div class="bg-white shadow rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Distribución por Plan</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="plan in planDistribution"
          :key="plan.name"
          class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">{{ plan.displayName }}</p>
              <p class="mt-1 text-2xl font-semibold text-gray-900">{{ plan.count }}</p>
            </div>
            <div class="text-3xl" :style="{ color: plan.color }">{{ plan.percentage }}%</div>
          </div>
          <div class="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              class="h-2 rounded-full"
              :style="{ width: plan.percentage + '%', backgroundColor: plan.color }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">Acciones Rápidas</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <router-link
            to="/admin/tenants"
            class="relative rounded-lg border-2 border-gray-200 bg-white px-6 py-4 hover:border-indigo-500 hover:shadow-md transition-all group"
          >
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div
                  class="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors"
                >
                  <svg
                    class="h-6 w-6 text-indigo-600"
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
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">Gestionar Tenants</p>
                <p class="text-xs text-gray-500">Ver y administrar todos</p>
              </div>
            </div>
          </router-link>

          <button
            @click="openCreateTenantModal"
            class="relative rounded-lg border-2 border-gray-200 bg-white px-6 py-4 hover:border-green-500 hover:shadow-md transition-all group text-left"
          >
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div
                  class="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors"
                >
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">Nuevo Tenant</p>
                <p class="text-xs text-gray-500">Crear organización</p>
              </div>
            </div>
          </button>

          <router-link
            to="/admin/analytics"
            class="relative rounded-lg border-2 border-gray-200 bg-white px-6 py-4 hover:border-purple-500 hover:shadow-md transition-all group"
          >
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div
                  class="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors"
                >
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">Analytics</p>
                <p class="text-xs text-gray-500">Reportes y métricas</p>
              </div>
            </div>
          </router-link>

          <router-link
            to="/admin/settings"
            class="relative rounded-lg border-2 border-gray-200 bg-white px-6 py-4 hover:border-gray-500 hover:shadow-md transition-all group"
          >
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div
                  class="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors"
                >
                  <svg
                    class="h-6 w-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">Configuración</p>
                <p class="text-xs text-gray-500">Sistema global</p>
              </div>
            </div>
          </router-link>

          <router-link
            to="/admin/logs"
            class="relative rounded-lg border-2 border-gray-200 bg-white px-6 py-4 hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div
                  class="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors"
                >
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">Logs del Sistema</p>
                <p class="text-xs text-gray-500">Auditoría y eventos</p>
              </div>
            </div>
          </router-link>

          <a
            href="/docs"
            target="_blank"
            class="relative rounded-lg border-2 border-gray-200 bg-white px-6 py-4 hover:border-indigo-500 hover:shadow-md transition-all group"
          >
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div
                  class="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors"
                >
                  <svg
                    class="h-6 w-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">Documentación</p>
                <p class="text-xs text-gray-500">Guías técnicas</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- System Info -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">Información del Sistema</h3>
        <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
          <div>
            <dt class="text-sm font-medium text-gray-500">Versión</dt>
            <dd class="mt-1 text-sm text-gray-900 font-mono">v1.0.0</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Ambiente</dt>
            <dd class="mt-1">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="
                  environment === 'Producción'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                "
              >
                {{ environment }}
              </span>
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Rol Actual</dt>
            <dd class="mt-1">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                {{ user?.roles?.[0] || 'SUPER_ADMIN' }}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/modules/auth/presentation/composables/useAuth'

const router = useRouter()
const { user } = useAuth()

const isLoading = ref(false)

/**
 * Stats data (TODO: cargar desde API)
 */
const stats = ref({
  totalTenants: 0,
  activeTenants: 0,
  trialTenants: 0,
  suspendedTenants: 0,
  growthRate: 0,
  activeToday: 0,
  trialExpiringThisWeek: 0,
  suspendedThisMonth: 0,
})

/**
 * Plan distribution
 */
const planDistribution = ref([
  { name: 'free', displayName: 'Free', count: 0, percentage: 0, color: '#6B7280' },
  { name: 'standard', displayName: 'Standard', count: 0, percentage: 0, color: '#3B82F6' },
  { name: 'premium', displayName: 'Premium', count: 0, percentage: 0, color: '#8B5CF6' },
  { name: 'enterprise', displayName: 'Enterprise', count: 0, percentage: 0, color: '#F59E0B' },
])

/**
 * Recent activity
 */
const recentActivity = ref([
  {
    type: 'created',
    description: 'Nuevo tenant creado:',
    tenant: 'Farmacia Norte',
    time: 'Hace 2 horas',
  },
  {
    type: 'upgraded',
    description: 'Plan actualizado:',
    tenant: 'Farmacia Central',
    time: 'Hace 4 horas',
  },
  {
    type: 'suspended',
    description: 'Tenant suspendido:',
    tenant: 'Farmacia Sur',
    time: 'Hace 6 horas',
  },
  {
    type: 'activated',
    description: 'Tenant reactivado:',
    tenant: 'Farmacia Este',
    time: 'Hace 1 día',
  },
])

/**
 * Environment
 */
const environment = computed(() => {
  const mode = import.meta.env.MODE
  return mode === 'production' ? 'Producción' : 'Desarrollo'
})

/**
 * Current date formatted
 */
const currentDate = computed(() => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date().toLocaleDateString('es-ES', options)
})

/**
 * Calculate percentage
 */
function getPercentage(value: number, total: number): string {
  if (total === 0) return '0'
  return ((value / total) * 100).toFixed(1)
}

/**
 * Get activity icon component
 */
function getActivityIcon(type: string) {
  const icons: Record<string, any> = {
    created: () =>
      h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M12 4v16m8-8H4',
        }),
      ]),
    upgraded: () =>
      h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M5 10l7-7m0 0l7 7m-7-7v18',
        }),
      ]),
    suspended: () =>
      h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
        }),
      ]),
    activated: () =>
      h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        }),
      ]),
  }
  return icons[type] || icons.created
}

/**
 * Get activity color class
 */
function getActivityColorClass(type: string): string {
  const colors: Record<string, string> = {
    created: 'bg-green-500',
    upgraded: 'bg-blue-500',
    suspended: 'bg-red-500',
    activated: 'bg-indigo-500',
  }
  return colors[type] || 'bg-gray-500'
}

/**
 * Refresh data
 */
async function refreshData() {
  isLoading.value = true
  try {
    // TODO: Implementar llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Data refreshed')
  } finally {
    isLoading.value = false
  }
}

/**
 * Open create tenant modal
 */
function openCreateTenantModal() {
  router.push('/admin/tenants/create')
}

/**
 * Load initial data
 */
onMounted(() => {
  refreshData()
})
</script>
