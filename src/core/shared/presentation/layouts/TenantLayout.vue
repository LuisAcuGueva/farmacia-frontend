<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Tenant Sidebar -->
    <TenantSidebar :branding="tenantBranding" :plan="tenantPlan" />

    <!-- Main Content -->
    <div class="ml-64">
      <!-- Top Navbar -->
      <TopNavbar :title="pageTitle" :notification-count="notificationCount">
        <template #user-menu>
          <UserMenu :user="currentUser" />
        </template>
      </TopNavbar>

      <!-- Page Content -->
      <main class="p-6 mt-16">
        <router-view v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/modules/auth/presentation/composables/useAuth'
import { useTenantStore } from '@/core/tenant/presentation/stores/tenant.store'
import TenantSidebar from '../components/navigation/TenantSidebar.vue'
import TopNavbar from '../components/navigation/TopNavbar.vue'
import UserMenu from '../components/navigation/UserMenu.vue'

const route = useRoute()
const { user } = useAuth()
const tenantStore = useTenantStore()

/**
 * Page title from route meta
 */
const pageTitle = computed(() => (route.meta.title as string) || 'Dashboard')

/**
 * Tenant branding
 */
const tenantBranding = computed(() => tenantStore.branding)

/**
 * Tenant plan
 */
const tenantPlan = computed(() => tenantStore.plan)

/**
 * Current user info
 */
const currentUser = computed(() => ({
  name: user.value?.name || 'Usuario',
  email: user.value?.email || '',
  roles: user.value?.roles || [],
  avatarColor: tenantStore.branding?.primaryColor || '#6366F1',
}))

/**
 * Notification count (TODO: implementar)
 */
const notificationCount = computed(() => 0)
</script>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
