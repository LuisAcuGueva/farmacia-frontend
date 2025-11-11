<template>
  <div class="space-y-6">
    <!-- Header with Tenant Info -->
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500">
          Bienvenido, {{ user?.name || 'Usuario' }} • {{ tenant?.name || 'Cargando...' }}
        </p>
      </div>
      <div class="flex items-center space-x-3">
        <!-- Plan Badge -->
        <div class="text-right">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
            :class="getPlanColorClass(plan?.name)"
          >
            {{ plan?.displayName || 'Plan Free' }}
          </span>
          <p class="mt-1 text-xs text-gray-500">
            {{ limits?.maxUsers || 0 }} usuarios • {{ limits?.maxBranches || 0 }} sucursales
          </p>
        </div>
        <button
          @click="refreshData"
          class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          :disabled="isLoading"
        >
          <svg
            class="h-4 w-4"
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
        </button>
      </div>
    </div>

    <!-- Alert: Trial Period -->
    <div
      v-if="isInTrial && trialDaysLeft"
      class="rounded-md bg-yellow-50 border border-yellow-200 p-4"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3 flex-1">
          <h3 class="text-sm font-medium text-yellow-800">Periodo de Prueba Activo</h3>
          <p class="mt-1 text-sm text-yellow-700">
            Te quedan {{ trialDaysLeft }} días de prueba.
            <router-link to="/app/subscription" class="font-medium underline hover:text-yellow-600">
              Actualiza tu plan
            </router-link>
            para mantener el acceso.
          </p>
        </div>
      </div>
    </div>

    <!-- Main Stats - Business Metrics -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Today Sales -->
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Ventas Hoy</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    ${{ formatNumber(stats.salesToday) }}
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <svg class="h-3 w-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    {{ stats.salesTodayGrowth }}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm text-gray-600">{{ stats.salesCountToday }} transacciones</div>
        </div>
      </div>

      <!-- Month Sales -->
      <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="rounded-md bg-blue-500 p-3">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Ventas del Mes</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    ${{ formatNumber(stats.salesMonth) }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <router-link to="/app/sales" class="font-medium text-blue-600 hover:text-blue-500">
              Ver todas →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Low Stock Products -->
      <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="rounded-md bg-orange-500 p-3">
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Stock Bajo</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ stats.lowStockProducts }}
                  </div>
                  <div class="ml-2 text-sm text-gray-500">productos</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <router-link
              to="/app/inventory?filter=low-stock"
              class="font-medium text-orange-600 hover:text-orange-500"
            >
              Ver inventario →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Total Products -->
      <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="rounded-md bg-purple-500 p-3">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Productos</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ stats.totalProducts }}</div>
                  <div class="ml-2 text-sm text-gray-500">/ {{ limits?.maxProducts || '∞' }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-600">
              {{ getUsagePercentage(stats.totalProducts, limits?.maxProducts) }}% usado
            </div>
            <div class="w-16 bg-gray-200 rounded-full h-2">
              <div
                class="h-2 rounded-full"
                :class="getUsageColorClass(stats.totalProducts, limits?.maxProducts)"
                :style="{
                  width: getUsagePercentage(stats.totalProducts, limits?.maxProducts) + '%',
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts and Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Sales Chart -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Ventas Últimos 7 Días</h3>
          <select
            v-model="salesPeriod"
            class="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 3 meses</option>
          </select>
        </div>
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
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
            <p class="mt-2 text-sm">Gráfico de ventas (próximamente)</p>
          </div>
        </div>
      </div>

      <!-- Recent Sales -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Ventas Recientes</h3>
        <div class="flow-root">
          <ul class="-my-5 divide-y divide-gray-200">
            <li v-for="sale in recentSales" :key="sale.id" class="py-4">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <div
                    class="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold"
                  >
                    {{ sale.invoice }}
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ sale.customerName }}</p>
                  <p class="text-sm text-gray-500 truncate">
                    {{ sale.items }} productos • {{ sale.time }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold text-gray-900">${{ formatNumber(sale.total) }}</p>
                  <p class="text-xs text-gray-500">{{ sale.paymentMethod }}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="mt-6">
          <router-link
            to="/app/sales"
            class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Ver todas las ventas
          </router-link>
        </div>
      </div>
    </div>

    <!-- Inventory Alerts -->
    <div v-if="inventoryAlerts.length > 0" class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <svg class="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          Alertas de Inventario
        </h3>
        <div class="overflow-hidden">
          <ul class="divide-y divide-gray-200">
            <li
              v-for="alert in inventoryAlerts"
              :key="alert.id"
              class="py-3 flex justify-between items-center"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="flex-shrink-0 w-2 h-2 rounded-full"
                  :class="alert.severity === 'critical' ? 'bg-red-500' : 'bg-orange-500'"
                />
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ alert.productName }}</p>
                  <p class="text-sm text-gray-500">
                    Stock actual: {{ alert.currentStock }} unidades
                  </p>
                </div>
              </div>
              <router-link
                :to="`/app/inventory/${alert.id}`"
                class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Ver producto →
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">Acciones Rápidas</h3>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <router-link
            to="/app/sales/new"
            class="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div
              class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2 group-hover:bg-green-200"
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
            <span class="text-xs font-medium text-gray-700 text-center">Nueva Venta</span>
          </router-link>

          <router-link
            to="/app/products"
            class="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
          >
            <div
              class="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-2 group-hover:bg-purple-200"
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <span class="text-xs font-medium text-gray-700 text-center">Productos</span>
          </router-link>

          <router-link
            to="/app/inventory"
            class="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all group"
          >
            <div
              class="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-2 group-hover:bg-orange-200"
            >
              <svg
                class="h-6 w-6 text-orange-600"
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
            <span class="text-xs font-medium text-gray-700 text-center">Inventario</span>
          </router-link>

          <router-link
            to="/app/customers"
            class="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div
              class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2 group-hover:bg-blue-200"
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <span class="text-xs font-medium text-gray-700 text-center">Clientes</span>
          </router-link>

          <router-link
            v-if="hasFeature('reports')"
            to="/app/reports"
            class="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
          >
            <div
              class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2 group-hover:bg-indigo-200"
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
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span class="text-xs font-medium text-gray-700 text-center">Reportes</span>
          </router-link>

          <router-link
            to="/app/settings"
            class="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-all group"
          >
            <div
              class="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-2 group-hover:bg-gray-200"
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
            <span class="text-xs font-medium text-gray-700 text-center">Configuración</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/modules/auth/presentation/composables/useAuth'
import { useTenant } from '@/core/tenant'

const { user } = useAuth()
const { tenant, isInTrial, features, limits, plan, hasFeature } = useTenant()

const isLoading = ref(false)
const salesPeriod = ref('7')

/**
 * Business stats (TODO: cargar desde API)
 */
const stats = ref({
  salesToday: 0,
  salesTodayGrowth: 0,
  salesCountToday: 0,
  salesMonth: 0,
  lowStockProducts: 0,
  totalProducts: 0,
})

/**
 * Recent sales (TODO: cargar desde API)
 */
const recentSales = ref([
  {
    id: 1,
    invoice: '#001',
    customerName: 'Juan Pérez',
    items: 3,
    total: 45.5,
    paymentMethod: 'Efectivo',
    time: 'Hace 5 min',
  },
  {
    id: 2,
    invoice: '#002',
    customerName: 'María García',
    items: 5,
    total: 89.0,
    paymentMethod: 'Tarjeta',
    time: 'Hace 15 min',
  },
  {
    id: 3,
    invoice: '#003',
    customerName: 'Carlos López',
    items: 2,
    total: 28.75,
    paymentMethod: 'Efectivo',
    time: 'Hace 30 min',
  },
  {
    id: 4,
    invoice: '#004',
    customerName: 'Ana Martínez',
    items: 7,
    total: 156.2,
    paymentMethod: 'Tarjeta',
    time: 'Hace 1 hora',
  },
])

/**
 * Inventory alerts (TODO: cargar desde API)
 */
const inventoryAlerts = ref([
  { id: 1, productName: 'Paracetamol 500mg', currentStock: 5, minStock: 50, severity: 'critical' },
  { id: 2, productName: 'Ibuprofeno 400mg', currentStock: 15, minStock: 30, severity: 'warning' },
  { id: 3, productName: 'Amoxicilina 500mg', currentStock: 8, minStock: 25, severity: 'critical' },
])

/**
 * Trial days left
 */
const trialDaysLeft = computed(() => {
  if (!tenant.value?.trialEndsAt) return null
  const now = new Date()
  const trialEnd = new Date(tenant.value.trialEndsAt)
  const diff = trialEnd.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

/**
 * Format number with commas
 */
function formatNumber(value: number): string {
  return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Get plan color class
 */
function getPlanColorClass(planName: string | undefined): string {
  const colors: Record<string, string> = {
    free: 'bg-gray-100 text-gray-800',
    standard: 'bg-blue-100 text-blue-800',
    premium: 'bg-purple-100 text-purple-800',
    enterprise: 'bg-orange-100 text-orange-800',
  }
  return colors[planName || 'free'] || colors.free
}

/**
 * Get usage percentage
 */
function getUsagePercentage(current: number, max: number | undefined): number {
  if (!max || max === -1) return 0
  return Math.min(Math.round((current / max) * 100), 100)
}

/**
 * Get usage color class
 */
function getUsageColorClass(current: number, max: number | undefined): string {
  const percentage = getUsagePercentage(current, max)
  if (percentage >= 90) return 'bg-red-500'
  if (percentage >= 75) return 'bg-orange-500'
  if (percentage >= 50) return 'bg-yellow-500'
  return 'bg-green-500'
}

/**
 * Refresh data
 */
async function refreshData() {
  isLoading.value = true
  try {
    // TODO: Implementar llamadas a API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Data refreshed')
  } finally {
    isLoading.value = false
  }
}

/**
 * Load initial data
 */
onMounted(() => {
  refreshData()
})
</script>
