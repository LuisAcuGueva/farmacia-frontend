<template>
  <div class="tenant-list-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Gestión de Tenants</h1>
        <p class="page-subtitle">Administra todas las farmacias del sistema</p>
      </div>
      <button @click="showCreateModal = true" class="btn-primary">
        <span>➕</span>
        Crear Tenant
      </button>
    </div>

    <!-- Stats -->
    <div v-if="stats" class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total</div>
        <div class="stat-value">{{ stats.total }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Activos</div>
        <div class="stat-value text-green-600">{{ stats.active }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">En Prueba</div>
        <div class="stat-value text-yellow-600">{{ stats.trial }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Suspendidos</div>
        <div class="stat-value text-red-600">{{ stats.suspended }}</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por nombre o subdomain..."
        class="search-input"
      />
      <select v-model="statusFilter" class="filter-select">
        <option value="">Todos los estados</option>
        <option value="active">Activos</option>
        <option value="trial">En Prueba</option>
        <option value="suspended">Suspendidos</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Cargando tenants...</p>
    </div>

    <!-- Table -->
    <div v-else-if="filteredTenants.length > 0" class="tenants-table">
      <table>
        <thead>
          <tr>
            <th>Tenant</th>
            <th>Subdomain</th>
            <th>Plan</th>
            <th>Estado</th>
            <th>Creado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tenant in filteredTenants" :key="tenant.id">
            <td>
              <div class="tenant-info">
                <div class="tenant-name">{{ tenant.name }}</div>
                <div class="tenant-email">{{ tenant.subdomain }}.farmasys.com</div>
              </div>
            </td>
            <td>
              <code>{{ tenant.subdomain }}</code>
            </td>
            <td>
              <span class="plan-badge">{{ tenant.plan.displayName }}</span>
            </td>
            <td>
              <span :class="`status-badge status-${tenant.status}`">
                {{ tenant.status }}
              </span>
            </td>
            <td>{{ formatDate(tenant.createdAt) }}</td>
            <td>
              <div class="action-buttons">
                <button @click="viewTenant(tenant)" class="btn-icon" title="Ver detalles">
                  👁️
                </button>
                <button
                  v-if="tenant.status === 'active'"
                  @click="suspendTenant(tenant)"
                  class="btn-icon"
                  title="Suspender"
                >
                  ⏸️
                </button>
                <button
                  v-if="tenant.status === 'suspended'"
                  @click="activateTenant(tenant)"
                  class="btn-icon"
                  title="Reactivar"
                >
                  ▶️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <p>No se encontraron tenants</p>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.totalPages > 1" class="pagination">
      <button
        @click="goToPage(pagination.page - 1)"
        :disabled="pagination.page === 1"
        class="pagination-btn"
      >
        ← Anterior
      </button>
      <span class="pagination-info">
        Página {{ pagination.page }} de {{ pagination.totalPages }}
      </span>
      <button
        @click="goToPage(pagination.page + 1)"
        :disabled="pagination.page === pagination.totalPages"
        class="pagination-btn"
      >
        Siguiente →
      </button>
    </div>

    <!-- Create Modal (placeholder) -->
    <div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
      <div class="modal-content" @click.stop>
        <h2>Crear Nuevo Tenant</h2>
        <p>Formulario de creación aquí...</p>
        <button @click="showCreateModal = false">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { tenantAdminService } from '@admin/application/services/tenant-admin.service'
import type { TenantMetadata } from '@tenant/domain/types/tenant.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const tenants = ref<TenantMetadata[]>([])
const stats = ref<any>(null)
const pagination = ref<any>(null)
const isLoading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const showCreateModal = ref(false)

const filteredTenants = computed(() => {
  let result = tenants.value

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (t) => t.name.toLowerCase().includes(query) || t.subdomain.toLowerCase().includes(query),
    )
  }

  // Filtrar por estado
  if (statusFilter.value) {
    result = result.filter((t) => t.status === statusFilter.value)
  }

  return result
})

onMounted(async () => {
  await loadTenants()
  await loadStats()
})

async function loadTenants(page: number = 1) {
  isLoading.value = true
  try {
    const response = await tenantAdminService.listTenants(page, 20)
    tenants.value = response.data
    pagination.value = response.pagination
  } catch (error) {
    console.error('Error al cargar tenants:', error)
  } finally {
    isLoading.value = false
  }
}

async function loadStats() {
  try {
    stats.value = await tenantAdminService.getStats()
  } catch (error) {
    console.error('Error al cargar estadísticas:', error)
  }
}

function goToPage(page: number) {
  loadTenants(page)
}

function viewTenant(tenant: TenantMetadata) {
  alert(`Ver detalles de ${tenant.name}`)
}

async function suspendTenant(tenant: TenantMetadata) {
  if (confirm(`¿Suspender el tenant "${tenant.name}"?`)) {
    try {
      await tenantAdminService.suspendTenant(tenant.id, 'Suspendido desde admin')
      await loadTenants()
      await loadStats()
    } catch (error) {
      alert('Error al suspender tenant')
    }
  }
}

async function activateTenant(tenant: TenantMetadata) {
  if (confirm(`¿Reactivar el tenant "${tenant.name}"?`)) {
    try {
      await tenantAdminService.activateTenant(tenant.id)
      await loadTenants()
      await loadStats()
    } catch (error) {
      alert('Error al reactivar tenant')
    }
  }
}

function formatDate(date: Date): string {
  return format(new Date(date), 'dd MMM yyyy', { locale: es })
}
</script>

<style scoped>
.tenant-list-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
}

.page-subtitle {
  color: #6b7280;
  margin-top: 0.25rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: var(--color-primary, #3b82f6);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-input,
.filter-select {
  padding: 0.625rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.search-input {
  flex: 1;
}

.tenants-table {
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f9fafb;
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
}

.tenant-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tenant-name {
  font-weight: 600;
  color: #111827;
}

.tenant-email {
  font-size: 0.8125rem;
  color: #6b7280;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
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

.plan-badge {
  padding: 0.25rem 0.75rem;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  padding: 0.375rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.15s;
}

.btn-icon:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: var(--color-primary, #3b82f6);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
