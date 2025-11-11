import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/styles/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// ==================== INICIALIZACIÓN MULTITENANT ====================
// IMPORTANTE: El orden es crítico para el funcionamiento correcto

// 1️⃣ PRIMERO: Inicializar tenant store (debe ser antes de router)
import { useTenantStore } from './core/tenant/presentation/stores/tenant.store'
const tenantStore = useTenantStore()

// 2️⃣ SEGUNDO: Inicializar auth store (después de tenant)
import { useAuthStore } from './modules/auth/presentation/stores/auth.store'
const authStore = useAuthStore()
authStore.initializeFromStorage()

// 3️⃣ TERCERO: Detectar tenant antes de montar la app
;(async () => {
  try {
    // Intentar detectar y cargar tenant
    const tenantInitialized = await tenantStore.initialize()

    if (!tenantInitialized && !tenantStore.isAdmin) {
      console.warn('⚠️ No se pudo detectar un tenant válido')
      // La validación completa se hace en el tenantGuard del router
    }

    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log('🏢 Tenant detectado:', {
        subdomain: tenantStore.subdomain,
        isAdmin: tenantStore.isAdmin,
        isActive: tenantStore.isActive,
      })
    }
  } catch (error) {
    console.error('❌ Error al inicializar tenant:', error)
  } finally {
    // Montar la app (aunque falle tenant, el guard manejará la redirección)
    app.use(router)
    app.mount('#app')
  }
})()
