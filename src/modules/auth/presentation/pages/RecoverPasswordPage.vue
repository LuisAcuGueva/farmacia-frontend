<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-3xl font-extrabold text-gray-900 text-center">Recuperar Contraseña</h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
      </p>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="rounded-md bg-green-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-green-800">
            {{ successMessage }}
          </p>
        </div>
      </div>
    </div>

    <!-- Form -->
    <form v-if="!successMessage" class="space-y-6" @submit.prevent="handleSubmit">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">
          Correo electrónico
        </label>
        <input
          id="email"
          v-model="email"
          name="email"
          type="email"
          autocomplete="email"
          required
          class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="correo@ejemplo.com"
          :disabled="isLoading"
        />
      </div>

      <!-- Error Message -->
      <div v-if="error" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">
              {{ error }}
            </p>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div>
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="!isLoading">Enviar enlace de recuperación</span>
          <span v-else class="flex items-center">
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Enviando...
          </span>
        </button>
      </div>

      <!-- Back to Login -->
      <div class="text-center">
        <router-link
          to="/auth/login"
          class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          ← Volver al inicio de sesión
        </router-link>
      </div>
    </form>

    <!-- Back to Login (after success) -->
    <div v-else class="text-center space-y-4">
      <p class="text-sm text-gray-600">Revisa tu bandeja de entrada y sigue las instrucciones.</p>
      <router-link
        to="/auth/login"
        class="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
      >
        ← Volver al inicio de sesión
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const { requestPasswordReset, isLoading, error } = useAuth()

const email = ref('')
const successMessage = ref('')

async function handleSubmit() {
  try {
    successMessage.value = ''
    await requestPasswordReset(email.value)
    successMessage.value = 'Se ha enviado un enlace de recuperación a tu correo electrónico'
    email.value = ''
  } catch (err) {
    console.error('Password reset request failed:', err)
  }
}
</script>
