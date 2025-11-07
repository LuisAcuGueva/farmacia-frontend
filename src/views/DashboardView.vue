<template>
  <div class="min-h-screen bg-gray-100">
    <div class="py-10">
      <header>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 class="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>
      <main>
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div class="px-4 py-8 sm:px-0">
            <div class="border-4 border-dashed border-gray-200 rounded-lg p-8">
              <h2 class="text-xl font-semibold mb-4">Bienvenido, {{ user?.name }}!</h2>
              <p class="text-gray-600 mb-4">
                Has iniciado sesión correctamente en el Sistema de Farmacia.
              </p>
              <div class="bg-white p-4 rounded-md shadow">
                <h3 class="font-medium mb-2">Información del Usuario:</h3>
                <ul class="space-y-1 text-sm">
                  <li><strong>Email:</strong> {{ user?.email }}</li>
                  <li><strong>Roles:</strong> {{ user?.roles.join(', ') }}</li>
                  <li><strong>Sucursal ID:</strong> {{ user?.branchId || 'No asignada' }}</li>
                  <li><strong>Permisos:</strong> {{ user?.permissions.length }} permisos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '../modules/auth/presentation/composables/useAuth'

const router = useRouter()
const { user, logout } = useAuth()

async function handleLogout() {
  await logout()
  router.push('/auth/login')
}
</script>
