/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string

  // Tenant
  readonly VITE_TENANT_MODE: 'subdomain' | 'header' | 'path'
  readonly VITE_DEFAULT_TENANT: string
  readonly VITE_ADMIN_SUBDOMAIN: string
  readonly VITE_RESERVED_SUBDOMAINS: string

  // Features
  readonly VITE_ENABLE_TENANT_CACHE: string
  readonly VITE_TENANT_CACHE_TTL: string
  readonly VITE_ENABLE_OFFLINE_MODE: string

  // Development
  readonly VITE_DEV_MODE: string
  readonly VITE_SHOW_TENANT_INFO: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
