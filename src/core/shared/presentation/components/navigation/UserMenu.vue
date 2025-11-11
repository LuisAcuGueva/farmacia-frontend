<template>
  <div class="relative">
    <!-- User Button -->
    <button
      type="button"
      class="flex items-center space-x-3 focus:outline-none"
      @click="toggleMenu"
    >
      <div class="text-right hidden md:block">
        <p class="text-sm font-medium text-gray-900">{{ user?.name || 'Usuario' }}</p>
        <p class="text-xs text-gray-500">{{ getRoleDisplay(user?.roles) }}</p>
      </div>

      <!-- Avatar -->
      <div
        class="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium"
        :style="{ backgroundColor: user?.avatarColor || '#6366F1' }"
      >
        {{ getInitials(user?.name) }}
      </div>

      <!-- Chevron -->
      <svg
        class="w-4 h-4 text-gray-500 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        v-click-outside="closeMenu"
        class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
      >
        <!-- User Info -->
        <div class="px-4 py-3 border-b border-gray-200">
          <p class="text-sm font-medium text-gray-900">{{ user?.name }}</p>
          <p class="text-xs text-gray-500">{{ user?.email }}</p>
        </div>

        <!-- Menu Items -->
        <div class="py-1">
          <router-link
            to="/app/profile"
            class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            @click="closeMenu"
          >
            <svg
              class="w-4 h-4 mr-3 text-gray-400"
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
            Mi Perfil
          </router-link>

          <router-link
            to="/app/settings"
            class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            @click="closeMenu"
          >
            <svg
              class="w-4 h-4 mr-3 text-gray-400"
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
            Configuración
          </router-link>

          <button
            type="button"
            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            @click="toggleTheme"
          >
            <svg
              class="w-4 h-4 mr-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
            Tema: {{ isDark ? 'Oscuro' : 'Claro' }}
          </button>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200"></div>

        <!-- Logout -->
        <div class="py-1">
          <button
            type="button"
            class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            @click="handleLogout"
          >
            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/modules/auth/presentation/composables/useAuth'

interface User {
  name?: string
  email?: string
  roles?: string[]
  avatarColor?: string
}

interface Props {
  user?: User
}

defineProps<Props>()
const router = useRouter()
const { logout } = useAuth()

const isOpen = ref(false)
const isDark = ref(false)

/**
 * Toggle menu
 */
function toggleMenu() {
  isOpen.value = !isOpen.value
}

/**
 * Close menu
 */
function closeMenu() {
  isOpen.value = false
}

/**
 * Get user initials
 */
function getInitials(name?: string): string {
  if (!name) return 'U'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

/**
 * Get role display name
 */
function getRoleDisplay(roles?: string[]): string {
  if (!roles || roles.length === 0) return 'Usuario'

  const roleMap: Record<string, string> = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Administrador',
    MANAGER: 'Gerente',
    CASHIER: 'Cajero',
    PHARMACIST: 'Farmacéutico',
  }

  return roleMap[roles[0]] || roles[0]
}

/**
 * Toggle theme
 */
function toggleTheme() {
  isDark.value = !isDark.value
  // TODO: Implementar cambio de tema
  console.log('Theme toggled:', isDark.value ? 'dark' : 'light')
}

/**
 * Handle logout
 */
async function handleLogout() {
  closeMenu()
  await logout()
  router.push('/auth/login')
}

// Click outside directive
interface ClickOutsideElement extends HTMLElement {
  clickOutsideEvent?: (event: Event) => void
}

interface ClickOutsideBinding {
  value: () => void
}

const vClickOutside = {
  mounted(el: ClickOutsideElement, binding: ClickOutsideBinding) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: ClickOutsideElement) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent)
    }
  },
}
</script>
