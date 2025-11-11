<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <router-link to="/" class="flex items-center space-x-2">
            <svg
              class="w-8 h-8 text-indigo-600"
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
            <span class="text-2xl font-bold text-gray-900">FarmaSys</span>
          </router-link>

          <!-- Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <router-link to="/" class="text-gray-600 hover:text-gray-900 transition-colors">
              Inicio
            </router-link>
            <router-link to="/features" class="text-gray-600 hover:text-gray-900 transition-colors">
              Características
            </router-link>
            <router-link to="/pricing" class="text-gray-600 hover:text-gray-900 transition-colors">
              Precios
            </router-link>
            <router-link to="/contact" class="text-gray-600 hover:text-gray-900 transition-colors">
              Contacto
            </router-link>
          </div>

          <!-- CTA Buttons -->
          <div class="flex items-center space-x-4">
            <router-link
              to="/auth/login"
              class="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Iniciar Sesión
            </router-link>
            <router-link
              to="/auth/register"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
            >
              Registrarse Gratis
            </router-link>
          </div>

          <!-- Mobile menu button -->
          <button
            type="button"
            class="md:hidden p-2 text-gray-600 hover:text-gray-900"
            @click="toggleMobileMenu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Mobile Menu -->
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div v-if="mobileMenuOpen" class="md:hidden py-4 space-y-2">
            <router-link
              to="/"
              class="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              @click="closeMobileMenu"
            >
              Inicio
            </router-link>
            <router-link
              to="/features"
              class="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              @click="closeMobileMenu"
            >
              Características
            </router-link>
            <router-link
              to="/pricing"
              class="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              @click="closeMobileMenu"
            >
              Precios
            </router-link>
            <router-link
              to="/contact"
              class="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              @click="closeMobileMenu"
            >
              Contacto
            </router-link>
            <div class="border-t border-gray-200 pt-2">
              <router-link
                to="/auth/login"
                class="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                @click="closeMobileMenu"
              >
                Iniciar Sesión
              </router-link>
              <router-link
                to="/auth/register"
                class="block px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                @click="closeMobileMenu"
              >
                Registrarse Gratis
              </router-link>
            </div>
          </div>
        </Transition>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Column 1: Logo & Description -->
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center space-x-2 mb-4">
              <svg
                class="w-8 h-8 text-indigo-400"
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
              <span class="text-xl font-bold">FarmaSys</span>
            </div>
            <p class="text-gray-400 text-sm">
              Solución integral de gestión para farmacias. Controla inventario, ventas, usuarios y
              más desde una plataforma segura y fácil de usar.
            </p>
          </div>

          <!-- Column 2: Product -->
          <div>
            <h3 class="text-sm font-semibold mb-4">Producto</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li>
                <router-link to="/features" class="hover:text-white transition-colors"
                  >Características</router-link
                >
              </li>
              <li>
                <router-link to="/pricing" class="hover:text-white transition-colors"
                  >Precios</router-link
                >
              </li>
              <li>
                <router-link to="/docs" class="hover:text-white transition-colors"
                  >Documentación</router-link
                >
              </li>
            </ul>
          </div>

          <!-- Column 3: Company -->
          <div>
            <h3 class="text-sm font-semibold mb-4">Empresa</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li>
                <router-link to="/about" class="hover:text-white transition-colors"
                  >Nosotros</router-link
                >
              </li>
              <li>
                <router-link to="/contact" class="hover:text-white transition-colors"
                  >Contacto</router-link
                >
              </li>
              <li>
                <router-link to="/privacy" class="hover:text-white transition-colors"
                  >Privacidad</router-link
                >
              </li>
              <li>
                <router-link to="/terms" class="hover:text-white transition-colors"
                  >Términos</router-link
                >
              </li>
            </ul>
          </div>
        </div>

        <!-- Copyright -->
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {{ currentYear }} FarmaSys. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mobileMenuOpen = ref(false)
const currentYear = new Date().getFullYear()

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
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
