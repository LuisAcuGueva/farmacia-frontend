import { apiClient } from '@/core/shared/infrastructure/http/api-client'
import { API_ENDPOINTS } from '@/core/shared/infrastructure/config/api.config'
import axios from 'axios'
import type { TenantRepository } from '../../domain/interfaces/tenant.repository'
import type { TenantMetadata } from '../../domain/types/tenant.types'
import { TenantMapper } from '../mappers/tenant.mapper'

/**
 * Implementación del repositorio de tenants
 */
export class TenantRepositoryImpl implements TenantRepository {
  /**
   * Obtiene la metadata de un tenant por subdomain
   * Llama a: GET /api/v1/tenants/:subdomain
   */
  async getTenantBySubdomain(subdomain: string): Promise<TenantMetadata> {
    try {
      // Hacemos la consulta contra el backend central (localhost:PORT)
      // No podemos usar la instancia con interceptores porque aún no hay tenant cargado
      const apiPort = import.meta.env.VITE_API_PORT || '3000'
      const apiPath = import.meta.env.VITE_API_PATH || '/api/v1'
      const baseURL = `${window.location.protocol}//localhost:${apiPort}${apiPath}`

      const client = axios.create({
        baseURL,
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })

      const response = await client.get(`/tenants/${subdomain}`)

      return TenantMapper.toDomain(response.data)
    } catch (error: unknown) {
      const err = error as { response?: { status: number }; message: string }
      if (err.response?.status === 404) {
        throw new Error(`Tenant "${subdomain}" no encontrado`)
      }
      throw new Error(`Error al obtener tenant: ${err.message}`)
    }
  }

  /**
   * Valida que un tenant existe y está activo
   */
  async validateTenant(subdomain: string): Promise<boolean> {
    try {
      const response = await apiClient.get<{ isValid: boolean }>(
        API_ENDPOINTS.TENANTS.VALIDATE(subdomain),
      )
      return response.isValid === true
    } catch (error: unknown) {
      const err = error as { response?: { status: number }; message: string }
      console.error(`Error al validar tenant "${subdomain}": ${err.message}`)
      return false
    }
  }

  /**
   * Obtiene la lista de tenants (solo para admin)
   */
  async listTenants(
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    data: TenantMetadata[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    const response = await apiClient.getPaginated<TenantMetadata>(API_ENDPOINTS.TENANTS.BASE, {
      page,
      limit,
    })

    return {
      data: response.data.map(TenantMapper.toDomain),
      pagination: response.pagination,
    }
  }

  /**
   * Crea un nuevo tenant (solo para admin)
   */
  async createTenant(data: {
    name: string
    subdomain: string
    planId: number
    ownerEmail: string
    ownerName: string
    ownerPassword: string
  }): Promise<TenantMetadata> {
    const response = await apiClient.post(API_ENDPOINTS.TENANTS.BASE, data)
    return TenantMapper.toDomain(response)
  }

  /**
   * Actualiza un tenant (solo admin)
   */
  async updateTenant(
    id: number,
    data: Partial<{
      name: string
      status: string
      planId: number
    }>,
  ): Promise<TenantMetadata> {
    const response = await apiClient.patch(`${API_ENDPOINTS.TENANTS.BASE}/${id}`, data)
    return TenantMapper.toDomain(response)
  }

  /**
   * Suspende un tenant (solo admin)
   */
  async suspendTenant(id: number, reason: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.TENANTS.SUSPEND(id), { reason })
  }

  /**
   * Activa un tenant suspendido (solo admin)
   */
  async activateTenant(id: number): Promise<void> {
    await apiClient.post(API_ENDPOINTS.TENANTS.ACTIVATE(id), {})
  }
}

// Instancia singleton
export const tenantRepository = new TenantRepositoryImpl()
