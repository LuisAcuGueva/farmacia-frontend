<template>
  <div class="tenant-logo">
    <img
      v-if="logoUrl"
      :src="logoUrl"
      :alt="companyName"
      :class="['logo-image', sizeClass]"
      @error="handleImageError"
    />
    <span v-else :class="['logo-text', sizeClass]">
      {{ companyInitials }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTenant } from '../composables/useTenant'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showText: false,
})

const { branding } = useTenant()

const imageError = ref(false)

const logoUrl = computed(() => {
  if (imageError.value) return null
  return branding.value?.logo
})

const companyName = computed(() => branding.value?.companyName || 'Farmacia')

const companyInitials = computed(() => {
  const name = companyName.value
  const words = name.split(' ')
  if (words.length >= 2) {
    return words[0][0] + words[1][0]
  }
  return name.substring(0, 2)
})

const sizeClass = computed(() => `size-${props.size}`)

function handleImageError() {
  imageError.value = true
}
</script>

<style scoped>
.tenant-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.logo-image {
  object-fit: contain;
}

.logo-text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  background: var(--color-primary, #3b82f6);
  color: white;
  border-radius: 0.5rem;
  text-transform: uppercase;
}

/* Sizes */
.size-sm.logo-image {
  height: 1.5rem;
  width: auto;
}

.size-sm.logo-text {
  height: 1.5rem;
  width: 1.5rem;
  font-size: 0.75rem;
}

.size-md.logo-image {
  height: 2rem;
  width: auto;
}

.size-md.logo-text {
  height: 2rem;
  width: 2rem;
  font-size: 0.875rem;
}

.size-lg.logo-image {
  height: 3rem;
  width: auto;
}

.size-lg.logo-text {
  height: 3rem;
  width: 3rem;
  font-size: 1.125rem;
}

.size-xl.logo-image {
  height: 4rem;
  width: auto;
}

.size-xl.logo-text {
  height: 4rem;
  width: 4rem;
  font-size: 1.5rem;
}
</style>
