<template>
  <button
    class="md:hidden fixed top-4 left-4 z-50 p-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
    aria-label="Abrir menú de navegación"
    @click="$emit('click')"
  >
    <Bars3Icon class="w-6 h-6" aria-hidden="true" />
  </button>
</template>

<script setup lang="ts">
import { Bars3Icon } from '@heroicons/vue/24/outline'

defineEmits<{
  click: []
}>()
</script>
