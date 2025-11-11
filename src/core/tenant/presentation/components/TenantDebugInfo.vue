<template>
  <div v-if="showDebug" class="tenant-debug">
    <div class="debug-toggle" @click="isExpanded = !isExpanded">
      <span>🏢 Tenant Debug</span>
      <span>{{ isExpanded ? '▼' : '▶' }}</span>
    </div>

    <div v-if="isExpanded" class="debug-content">
      <div class="debug-section">
        <h4>Información del Tenant</h4>
        <dl>
          <dt>Subdomain:</dt>
          <dd>{{ tenant?.subdomain || 'N/A' }}</dd>

          <dt>Nombre:</dt>
          <dd>{{ tenant?.name || 'N/A' }}</dd>

          <dt>Estado:</dt>
          <dd>
            <span :class="`status-badge status-${tenant?.status}`">
              {{ tenant?.status || 'N/A' }}
            </span>
          </dd>

          <dt>Plan:</dt>
          <dd>{{ tenant?.plan.displayName || 'N/A' }}</dd>

          <dt>Schema:</dt>
          <dd>
            <code>{{ tenant?.schemaName || 'N/A' }}</code>
          </dd>
        </dl>
      </div>

      <div class="debug-section">
        <h4>Features</h4>
        <ul class="feature-list">
          <li v-for="(value, key) in features" :key="key">
            <span :class="value ? 'text-green-600' : 'text-gray-400'">
              {{ value ? '✓' : '✗' }}
            </span>
            {{ key }}
          </li>
        </ul>
      </div>

      <div class="debug-section">
        <h4>Límites</h4>
        <dl>
          <dt>Max Users:</dt>
          <dd>{{ limits?.maxUsers || 'N/A' }}</dd>

          <dt>Max Branches:</dt>
          <dd>{{ limits?.maxBranches || 'N/A' }}</dd>

          <dt>Max Products:</dt>
          <dd>{{ limits?.maxProducts || 'N/A' }}</dd>
        </dl>
      </div>

      <div class="debug-actions">
        <button @click="reloadTenant" class="debug-button">🔄 Recargar</button>
        <button @click="clearCache" class="debug-button">🗑️ Limpiar Caché</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTenant } from '../composables/useTenant'
import { tenantCache } from '../../infrastructure/utils/tenant-cache'

const { tenant, features, limits, revalidate } = useTenant()

const showDebug = computed(() => import.meta.env.VITE_SHOW_TENANT_INFO === 'true')

const isExpanded = ref(false)

async function reloadTenant() {
  await revalidate()
  alert('Tenant recargado')
}

function clearCache() {
  tenantCache.clear()
  alert('Caché limpiada')
}
</script>

<style scoped>
.tenant-debug {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  font-size: 0.875rem;
  max-width: 400px;
  z-index: 9999;
}

.debug-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  user-select: none;
  font-weight: 600;
}

.debug-toggle:hover {
  background: #f9fafb;
}

.debug-content {
  border-top: 1px solid #e5e7eb;
  padding: 1rem;
  max-height: 600px;
  overflow-y: auto;
}

.debug-section {
  margin-bottom: 1rem;
}

.debug-section h4 {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
}

.debug-section dl {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 0.5rem;
  font-size: 0.8125rem;
}

.debug-section dt {
  font-weight: 500;
  color: #6b7280;
}

.debug-section dd {
  color: #111827;
}

.status-badge {
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-active {
  background: #d1fae5;
  color: #065f46;
}

.status-trial {
  background: #fef3c7;
  color: #92400e;
}

.status-suspended {
  background: #fee2e2;
  color: #991b1b;
}

.feature-list {
  list-style: none;
  padding: 0;
  font-size: 0.8125rem;
}

.feature-list li {
  padding: 0.25rem 0;
}

.debug-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.debug-button {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  font-size: 0.8125rem;
  transition: all 0.15s;
}

.debug-button:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

code {
  background: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
}
</style>
