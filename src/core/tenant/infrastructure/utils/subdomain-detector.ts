import { TENANT_CONFIG } from '@/core/shared/infrastructure/config/tenant.config'

/**
 * Utilidad para detectar el tenant desde el subdomain
 */

interface SubdomainDetectionResult {
  subdomain: string | null
  isAdmin: boolean
  isReserved: boolean
  hostname: string
}

export class SubdomainDetector {
  private readonly reservedSubdomains: Set<string>
  private readonly adminSubdomain: string

  constructor(
    reservedSubdomains: string[] = TENANT_CONFIG.RESERVED_SUBDOMAINS,
    adminSubdomain: string = TENANT_CONFIG.ADMIN_SUBDOMAIN,
  ) {
    this.reservedSubdomains = new Set(reservedSubdomains)
    this.adminSubdomain = adminSubdomain
  }

  /**
   * Detecta el subdomain desde el hostname
   */
  detect(hostname: string = window.location.hostname): SubdomainDetectionResult {
    // Desarrollo local (localhost, 127.0.0.1, etc)
    if (this.isLocalhost(hostname)) {
      return this.handleLocalhost()
    }

    // Producción con subdominios
    const subdomain = this.extractSubdomain(hostname)

    return {
      subdomain,
      isAdmin: subdomain === this.adminSubdomain,
      isReserved: subdomain ? this.reservedSubdomains.has(subdomain) : false,
      hostname,
    }
  }

  /**
   * Verifica si es localhost
   */
  private isLocalhost(hostname: string): boolean {
    return (
      hostname === 'localhost' ||
      hostname === 'farmasys.local' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.farmasys.local') ||
      hostname.endsWith('.localhost') // Soporte para subdomain.localhost
    )
  }

  /**
   * Maneja el caso de localhost
   */
  private handleLocalhost(): SubdomainDetectionResult {
    const hostname = window.location.hostname

    // Si tiene formato subdomain.localhost o subdomain.farmasys.local (ej: farmacia1.localhost o farmacia1.farmasys.local)
    if (hostname.includes('.localhost') || hostname.includes('.farmasys.local')) {
      const parts = hostname.split('.')
      const subdomain = parts[0] || null

      // Validar que el subdomain sea válido
      if (subdomain && this.isValidSubdomain(subdomain)) {
        return {
          subdomain,
          isAdmin: subdomain === this.adminSubdomain,
          isReserved: this.reservedSubdomains.has(subdomain),
          hostname,
        }
      }
    }

    // En desarrollo puro (localhost sin subdomain), buscar en localStorage o usar default
    const devTenant = localStorage.getItem('dev_tenant') || import.meta.env.VITE_DEFAULT_TENANT

    return {
      subdomain: devTenant,
      isAdmin: devTenant === this.adminSubdomain,
      isReserved: false,
      hostname: 'localhost',
    }
  }

  /**
   * Extrae el subdomain del hostname
   * Ejemplo: farmacia1.farmasys.com -> farmacia1
   */
  private extractSubdomain(hostname: string): string | null {
    const parts = hostname.split('.')

    // Necesita al menos 3 partes: subdomain.domain.tld
    if (parts.length < 3) {
      return null
    }

    // El subdomain es la primera parte
    const subdomain = parts[0]

    // Verificar que existe
    if (!subdomain) {
      return null
    }

    // Validar formato
    if (!this.isValidSubdomain(subdomain)) {
      return null
    }

    return subdomain
  }

  /**
   * Valida que el subdomain tenga formato correcto
   */
  private isValidSubdomain(subdomain: string): boolean {
    // Regex: letras minúsculas, números y guiones
    // Debe empezar y terminar con letra o número
    const regex = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/
    return regex.test(subdomain)
  }

  /**
   * Cambia el tenant en desarrollo
   */
  setDevTenant(subdomain: string): void {
    if (this.isLocalhost(window.location.hostname)) {
      localStorage.setItem('dev_tenant', subdomain)
      window.location.reload()
    }
  }

  /**
   * Obtiene el tenant actual de desarrollo
   */
  getDevTenant(): string | null {
    if (this.isLocalhost(window.location.hostname)) {
      return localStorage.getItem('dev_tenant')
    }
    return null
  }
}

// Instancia singleton con configuración centralizada
export const subdomainDetector = new SubdomainDetector()
