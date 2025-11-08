import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/styles/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Inicializar auth store ANTES de instalar el router
import { useAuthStore } from './modules/auth/presentation/stores/auth.store'
const authStore = useAuthStore()
authStore.initializeFromStorage()

app.use(router)
app.mount('#app')
