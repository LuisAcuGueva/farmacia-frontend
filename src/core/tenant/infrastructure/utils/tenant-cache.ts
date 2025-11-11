import type { TenantMetadata } from '../../domain/types/tenant.types'

interface CacheEntry {
  data: TenantMetadata
  timestamp: number
  expiresAt: number
}

/**
 * Sistema de caché para metadata de tenants
 */
export class TenantCache {
  private cache: Map<string, CacheEntry> = new Map()
  private readonly ttl: number
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(ttlInMs: number = 300000) {
    // 5 minutos default
    this.ttl = ttlInMs
    this.startCleanup()
  }

  /**
   * Guarda tenant en caché
   */
  set(subdomain: string, data: TenantMetadata): void {
    const now = Date.now()
    this.cache.set(subdomain, {
      data,
      timestamp: now,
      expiresAt: now + this.ttl,
    })
  }

  /**
   * Obtiene tenant del caché
   */
  get(subdomain: string): TenantMetadata | null {
    const entry = this.cache.get(subdomain)

    if (!entry) {
      return null
    }

    // Verificar si ha expirado
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(subdomain)
      return null
    }

    return entry.data
  }

  /**
   * Verifica si existe en caché y es válido
   */
  has(subdomain: string): boolean {
    return this.get(subdomain) !== null
  }

  /**
   * Elimina tenant del caché
   */
  remove(subdomain: string): void {
    this.cache.delete(subdomain)
  }

  /**
   * Limpia todo el caché
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Obtiene estadísticas del caché
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([subdomain, entry]) => ({
        subdomain,
        age: Date.now() - entry.timestamp,
        ttl: entry.expiresAt - Date.now(),
      })),
    }
  }

  /**
   * Inicia limpieza automática de entradas expiradas
   */
  private startCleanup(): void {
    // Limpiar cada minuto
    this.cleanupInterval = setInterval(() => {
      const now = Date.now()
      for (const [subdomain, entry] of this.cache.entries()) {
        if (now > entry.expiresAt) {
          this.cache.delete(subdomain)
        }
      }
    }, 60000)
  }

  /**
   * Detiene la limpieza automática
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }

  /**
   * Guarda en localStorage para persistencia
   */
  persist(subdomain: string): void {
    const entry = this.cache.get(subdomain)
    if (entry) {
      try {
        localStorage.setItem(`tenant_cache_${subdomain}`, JSON.stringify(entry))
      } catch (error) {
        console.warn('Failed to persist tenant cache:', error)
      }
    }
  }

  /**
   * Carga desde localStorage
   */
  restore(subdomain: string): TenantMetadata | null {
    try {
      const stored = localStorage.getItem(`tenant_cache_${subdomain}`)
      if (!stored) return null

      const entry: CacheEntry = JSON.parse(stored)

      // Verificar si ha expirado
      if (Date.now() > entry.expiresAt) {
        localStorage.removeItem(`tenant_cache_${subdomain}`)
        return null
      }

      // Restaurar en memoria
      this.cache.set(subdomain, entry)
      return entry.data
    } catch (error) {
      console.warn('Failed to restore tenant cache:', error)
      return null
    }
  }
}

// Instancia singleton
export const tenantCache = new TenantCache(
  parseInt(import.meta.env.VITE_TENANT_CACHE_TTL) || 300000,
)
