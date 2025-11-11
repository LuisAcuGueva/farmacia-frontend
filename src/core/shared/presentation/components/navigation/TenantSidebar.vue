<template>
  <aside
    class="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-40 border-r"
    :style="{ borderColor: branding?.primaryColor || '#E5E7EB' }"
  >
    <!-- Logo & Brand -->
    <div
      class="flex items-center justify-center h-16 border-b"
      :style="{ backgroundColor: lightenColor(branding?.primaryColor || '#6366F1', 95) }"
    >
      <div class="flex items-center space-x-3 px-4">
        <!-- Logo del tenant -->
        <img
          v-if="branding?.logo"
          :src="branding.logo"
          :alt="branding.companyName"
          class="h-10 w-auto"
        />
        <!-- Fallback icon -->
        <svg
          v-else
          class="w-8 h-8"
          :style="{ color: branding?.primaryColor || '#6366F1' }"
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
        <span class="text-lg font-bold text-gray-900">
          {{ branding?.companyName || 'FarmaSys' }}
        </span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-3">
      <div class="space-y-1">
        <!-- Dashboard -->
        <router-link
          to="/app/dashboard"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="isActive('/app/dashboard') ? getActiveClass() : inactiveClass"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Dashboard
        </router-link>

        <!-- Sales -->
        <router-link
          to="/app/sales"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="isActive('/app/sales') ? getActiveClass() : inactiveClass"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Ventas
        </router-link>

        <!-- Products -->
        <router-link
          to="/app/products"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="isActive('/app/products') ? getActiveClass() : inactiveClass"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          Productos
        </router-link>

        <!-- Inventory -->
        <router-link
          to="/app/inventory"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="isActive('/app/inventory') ? getActiveClass() : inactiveClass"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          Inventario
        </router-link>

        <!-- Reports -->
        <router-link
          to="/app/reports"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="isActive('/app/reports') ? getActiveClass() : inactiveClass"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Reportes
        </router-link>
      </div>

      <!-- Divider -->
      <div class="my-4 border-t border-gray-200"></div>

      <!-- Settings Section -->
      <div class="space-y-1">
        <div class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Configuración
        </div>

        <!-- Users -->
        <router-link
          to="/app/users"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="isActive('/app/users') ? getActiveClass() : inactiveClass"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          Usuarios
        </router-link>

        <!-- Branches -->
        <router-link
          to="/app/branches"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="isActive('/app/branches') ? getActiveClass() : inactiveClass"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          Sucursales
        </router-link>

        <!-- Settings -->
        <router-link
          to="/app/settings"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="isActive('/app/settings') ? getActiveClass() : inactiveClass"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          Configuración
        </router-link>
      </div>
    </nav>

    <!-- Plan Info -->
    <div v-if="plan" class="border-t border-gray-200 p-4 bg-gray-50">
      <div class="text-xs text-gray-600">
        <div class="flex items-center justify-between mb-2">
          <span class="font-semibold">Plan {{ plan.displayName }}</span>
          <span
            class="px-2 py-1 rounded-full text-xs font-medium"
            :class="getPlanBadgeClass(plan.name)"
          >
            {{ plan.name }}
          </span>
        </div>
        <div class="space-y-1 text-gray-500">
          <p>👥 Usuarios: {{ plan.maxUsers }}</p>
          <p>🏪 Sucursales: {{ plan.maxBranches }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { TenantBranding, TenantPlan } from '@/core/tenant/domain/types/tenant.types'

interface Props {
  branding?: TenantBranding
  plan?: TenantPlan
}

defineProps<Props>()
const route = useRoute()

const inactiveClass = 'text-gray-700 hover:bg-gray-100'

/**
 * Get active class with tenant primary color
 */
function getActiveClass(): string {
  return `text-white`
}

/**
 * Check if route is active
 */
function isActive(path: string): boolean {
  return route.path.startsWith(path)
}

/**
 * Lighten a hex color based on props
 */
function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = ((num >> 8) & 0x00ff) + amt
  const B = (num & 0x0000ff) + amt
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`
}

/**
 * Get plan badge class
 */
function getPlanBadgeClass(planName: string): string {
  const classes: Record<string, string> = {
    free: 'bg-gray-200 text-gray-800',
    standard: 'bg-blue-100 text-blue-800',
    premium: 'bg-purple-100 text-purple-800',
    enterprise: 'bg-yellow-100 text-yellow-800',
  }
  return classes[planName.toLowerCase()] || 'bg-gray-200 text-gray-800'
}
</script>

<style scoped>
/* Active link with dynamic color */
.router-link-active {
  background-color: v-bind('branding?.primaryColor || "#6366F1"');
}
</style>
