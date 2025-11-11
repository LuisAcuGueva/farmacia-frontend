/**
 * Shared Error Pages
 *
 * Páginas de error y estados especiales compartidas en toda la aplicación:
 * - NotFoundView: Error 404 - Página no encontrada
 * - TenantNotFoundView: Tenant no encontrado en el sistema
 * - TenantSuspendedView: Cuenta de tenant suspendida
 * - InvalidTenantView: Tenant inválido o no válido
 * - AdminDashboardPage: Dashboard específico para Super Admin
 * - TenantDashboardPage: Dashboard específico para usuarios de Tenant
 */

export { default as NotFoundView } from './NotFoundView.vue'
export { default as TenantNotFoundView } from './TenantNotFoundView.vue'
export { default as TenantSuspendedView } from './TenantSuspendedView.vue'
export { default as InvalidTenantView } from './InvalidTenantView.vue'
export { default as AdminDashboardPage } from './AdminDashboardPage.vue'
export { default as TenantDashboardPage } from './TenantDashboardPage.vue'
