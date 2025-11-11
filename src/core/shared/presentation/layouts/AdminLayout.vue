<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Admin Sidebar -->
    <AdminSidebar />

    <!-- Main Content -->
    <div class="ml-64">
      <!-- Top Navbar -->
      <TopNavbar :title="pageTitle">
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
import AdminSidebar from '../components/navigation/AdminSidebar.vue'
import TopNavbar from '../components/navigation/TopNavbar.vue'
import UserMenu from '../components/navigation/UserMenu.vue'

const route = useRoute()
const { user } = useAuth()

/**
 * Page title from route meta
 */
const pageTitle = computed(() => (route.meta.title as string) || 'Dashboard')

/**
 * Current user info for menu
 */
const currentUser = computed(() => ({
  name: user.value?.name || 'Admin',
  email: user.value?.email || 'admin@farmasys.com',
  roles: user.value?.roles || ['SUPER_ADMIN'],
  avatarColor: '#4F46E5',
}))
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
