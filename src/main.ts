import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/styles/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Inicializar auth store después de que Pinia esté instalado
import { useAuthStore } from './modules/auth/presentation/stores/auth.store'
const authStore = useAuthStore()
authStore.initializeFromStorage()

app.mount('#app')
