<template>
  <header class="bg-white border-b border-gray-200 h-16 fixed top-0 right-0 left-64 z-30">
    <div class="flex items-center justify-between h-full px-6">
      <!-- Left: Title -->
      <div class="flex items-center space-x-4">
        <h1 class="text-xl font-semibold text-gray-900">
          {{ title }}
        </h1>
      </div>

      <!-- Right: Actions & User Menu -->
      <div class="flex items-center space-x-4">
        <!-- Notifications -->
        <button
          type="button"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative"
          @click="toggleNotifications"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <!-- Badge -->
          <span v-if="notificationCount > 0" class="absolute top-1 right-1 flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </button>

        <!-- Search (optional) -->
        <button
          v-if="showSearch"
          type="button"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          @click="toggleSearch"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        <!-- Divider -->
        <div class="h-6 w-px bg-gray-300"></div>

        <!-- User Menu Slot -->
        <slot name="user-menu">
          <!-- Default user menu si no se pasa slot -->
          <div class="flex items-center space-x-3">
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">Usuario</p>
              <p class="text-xs text-gray-500">Admin</p>
            </div>
            <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span class="text-gray-600 font-medium">U</span>
            </div>
          </div>
        </slot>
      </div>
    </div>

    <!-- Notifications Panel (slide-in) -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="showNotifications"
        class="absolute right-6 top-16 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
      >
        <div class="px-4 py-2 border-b border-gray-200">
          <h3 class="text-sm font-semibold text-gray-900">Notificaciones</h3>
        </div>
        <div class="max-h-96 overflow-y-auto">
          <div v-if="notificationCount === 0" class="px-4 py-8 text-center text-gray-500 text-sm">
            No hay notificaciones nuevas
          </div>
          <!-- Aquí irían las notificaciones reales -->
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title?: string
  showSearch?: boolean
  notificationCount?: number
}

withDefaults(defineProps<Props>(), {
  title: 'Dashboard',
  showSearch: true,
  notificationCount: 0,
})

const showNotifications = ref(false)

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
}

function toggleSearch() {
  // TODO: Implementar búsqueda global
  console.log('Search clicked')
}
</script>
