<template>
  <!-- Overlay for mobile drawer -->
  <Transition name="fade">
    <div
      v-if="mobileOpen"
      class="fixed inset-0 bg-black/50 z-30 md:hidden"
      @click="closeMobile"
      aria-hidden="true"
    />
  </Transition>

  <aside
    :class="[
      'fixed left-0 top-0 h-screen bg-gray-900 text-white shadow-lg transition-all duration-200 ease-in-out',
      // Desktop: z-40, collapses to w-20 or w-64
      'z-40',
      // Mobile: off-canvas drawer that slides in
      'md:translate-x-0',
      mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      collapsed && !mobileOpen ? 'md:w-20' : 'w-64',
    ]"
    role="navigation"
    aria-label="Admin sidebar"
  >
    <!-- Header / Brand (slotable) -->
    <div class="h-16 border-b border-gray-800 bg-gray-950">
      <div class="flex items-center justify-center h-full px-3" v-if="collapsed && !mobileOpen">
        <!-- Collapsed state: solo botón toggle centrado -->
        <button
          class="hidden md:block p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          :aria-pressed="collapsed"
          aria-label="Expandir sidebar"
          @click="toggleCollapsed"
        >
          <ChevronDoubleRightIcon class="w-6 h-6 text-indigo-400" aria-hidden="true" />
        </button>
      </div>

      <div class="flex items-center justify-between h-full px-3" v-else>
        <!-- Expanded state: logo + texto + botón -->
        <slot name="header">
          <div class="flex items-center space-x-2 flex-1 min-w-0">
            <BuildingOfficeIcon class="w-8 h-8 text-indigo-400 flex-shrink-0" aria-hidden="true" />
            <span class="text-xl font-bold truncate">Admin Panel</span>
          </div>
        </slot>

        <!-- Desktop collapse toggle -->
        <button
          class="hidden md:block p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors flex-shrink-0"
          :aria-pressed="collapsed"
          aria-label="Colapsar sidebar"
          @click="toggleCollapsed"
        >
          <ChevronDoubleLeftIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
        </button>

        <!-- Mobile close button -->
        <button
          class="md:hidden p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors flex-shrink-0"
          aria-label="Cerrar sidebar"
          @click="closeMobile"
        >
          <XMarkIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-2" role="menu" tabindex="0" @keydown="onNavKeydown">
      <div class="space-y-1">
        <template v-for="(item, idx) in menu" :key="(item.path || item.label) + '-' + idx">
          <!-- Group header -->
          <div
            v-if="item.group"
            class="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider"
          >
            <span v-if="!collapsed || mobileOpen">{{ item.group }}</span>
          </div>

          <!-- Menu item with tooltip for collapsed state -->
          <div class="relative">
            <component
              :is="item.external ? 'a' : 'router-link'"
              :to="!item.external ? item.path : undefined"
              :href="item.external ? item.path : undefined"
              target="_blank"
              role="menuitem"
              :aria-current="isActive(item.path) ? 'page' : null"
              :aria-label="item.label"
              class="flex items-center justify-center px-3 py-3 text-sm font-medium rounded-lg transition-colors group"
              :class="[
                isActive(item.path) ? activeClass : inactiveClass,
                collapsed && !mobileOpen ? 'md:justify-center' : '',
              ]"
              @click.prevent="() => handleItemClick(item.path, item.external)"
              data-sidebar-item
              tabindex="-1"
            >
              <component
                :is="getIconComponent(item.icon)"
                class="w-5 h-5 flex-shrink-0"
                :class="!collapsed || mobileOpen ? 'mr-3' : ''"
                aria-hidden="true"
              />
              <span v-if="!collapsed || mobileOpen" class="flex-1">{{ item.label }}</span>

              <!-- Tooltip flotante mejorado (solo visible en collapsed + desktop) -->
              <div
                v-if="collapsed && !mobileOpen"
                class="hidden md:group-hover:flex absolute left-full ml-6 px-3 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg shadow-xl whitespace-nowrap z-[60] pointer-events-none items-center"
              >
                {{ item.label }}
                <!-- Flecha del tooltip -->
                <svg
                  class="absolute right-full -mr-2 text-gray-800"
                  width="8"
                  height="16"
                  viewBox="0 0 8 16"
                  fill="currentColor"
                >
                  <path d="M0 0 L8 8 L0 16 Z" />
                </svg>
              </div>
            </component>
          </div>
        </template>
      </div>
    </nav>

    <!-- Footer (slotable) -->
    <div class="border-t border-gray-800 p-3">
      <slot name="footer">
        <div class="text-xs text-gray-400 text-center">
          <p v-if="!collapsed || mobileOpen">FarmaSys Admin</p>
          <p class="mt-1">v1.0.0</p>
        </div>
      </slot>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  BuildingOfficeIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  XMarkIcon,
  HomeIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  BookOpenIcon,
} from '@heroicons/vue/24/outline'

interface MenuItem {
  label?: string
  path?: string
  icon?: string
  external?: boolean
  group?: string
}

const props = withDefaults(
  defineProps<{
    menu?: MenuItem[]
    modelValue?: boolean // For v-model support of mobile drawer
  }>(),
  {
    menu: undefined,
    modelValue: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// Icon mapping: string key -> Heroicon component
const iconMap: Record<string, Component> = {
  dashboard: HomeIcon,
  tenants: BuildingOffice2Icon,
  analytics: ChartBarIcon,
  settings: Cog6ToothIcon,
  logs: DocumentTextIcon,
  docs: BookOpenIcon,
}

function getIconComponent(iconKey?: string): Component {
  return iconKey && iconMap[iconKey] ? iconMap[iconKey] : HomeIcon
}

const defaultMenu: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: 'dashboard',
  },
  {
    label: 'Gestión de Tenants',
    path: '/admin/tenants',
    icon: 'tenants',
  },
  {
    label: 'Analytics',
    path: '/admin/analytics',
    icon: 'analytics',
  },
  {
    label: 'Configuración',
    path: '/admin/settings',
    icon: 'settings',
  },
  // Secondary group
  {
    group: 'Sistema',
    label: 'Logs del Sistema',
    path: '/admin/logs',
    icon: 'logs',
  },
  {
    label: 'Documentación',
    path: '/docs',
    external: true,
    icon: 'docs',
  },
]

const menu = computed(() => (props.menu && props.menu.length ? props.menu : defaultMenu))

const route = useRoute()
const router = useRouter()

const activeClass = 'bg-indigo-600 text-white'
const inactiveClass = 'text-gray-300 hover:bg-gray-800 hover:text-white'

// Desktop collapsed state (persistent)
const collapsed = ref(localStorage.getItem('admin.sidebar.collapsed') === 'true')
watch(collapsed, (v) => localStorage.setItem('admin.sidebar.collapsed', String(v)))

// Mobile drawer state (controlled via v-model or internal)
const mobileOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

function toggleCollapsed() {
  collapsed.value = !collapsed.value
}

function closeMobile() {
  mobileOpen.value = false
}

function isActive(path?: string): boolean {
  try {
    if (!path) return false
    return route.path.startsWith(path)
  } catch {
    return false
  }
}

function handleItemClick(path?: string, external?: boolean) {
  if (!path) return

  if (external) {
    window.open(path, '_blank')
  } else {
    router.push(path)
  }

  // Close mobile drawer after navigation
  closeMobile()
}

function onNavKeydown(e: KeyboardEvent) {
  const items = Array.from(document.querySelectorAll('[data-sidebar-item]')) as HTMLElement[]
  if (!items.length) return
  const current = document.activeElement as HTMLElement
  let idx = items.indexOf(current)

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    idx = (idx + 1) % items.length
    items[idx]?.focus()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    idx = (idx - 1 + items.length) % items.length
    items[idx]?.focus()
  } else if (e.key === 'Home') {
    e.preventDefault()
    items[0]?.focus()
  } else if (e.key === 'End') {
    e.preventDefault()
    items[items.length - 1]?.focus()
  } else if (e.key === 'Enter' && current?.dataset?.sidebarItem) {
    e.preventDefault()
    current.click()
  }
}

// Expose methods for parent components
defineExpose({
  openMobile: () => (mobileOpen.value = true),
  closeMobile,
  toggleCollapsed,
})
</script>

<style scoped>
/* Fade transition for mobile overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Tooltip appear animation */
.group:hover > div {
  animation: tooltipSlide 0.2s ease-out;
}

@keyframes tooltipSlide {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
