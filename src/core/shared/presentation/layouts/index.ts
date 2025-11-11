/**
 * Layout Components
 *
 * Layouts principales de la aplicación:
 * - AdminLayout: Layout para el Super Administrador del sistema
 * - TenantLayout: Layout para usuarios de tenant (con branding personalizado)
 * - AuthLayout: Layout para páginas de autenticación (login, registro, etc.)
 * - PublicLayout: Layout para páginas públicas (landing, marketing, etc.)
 */

export { default as AdminLayout } from './AdminLayout.vue'
export { default as TenantLayout } from './TenantLayout.vue'
export { default as AuthLayout } from './AuthLayout.vue'
export { default as PublicLayout } from './PublicLayout.vue'
