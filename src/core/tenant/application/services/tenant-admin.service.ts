import { axiosInstance } from '@/core/config/axios.config'
import type { TenantMetadata } from '@tenant/domain/types/tenant.types'
import { TenantMapper } from '@tenant/infrastructure/mappers/tenant.mapper'

export interface CreateTenantDto {
  name: string
  subdomain: string
  planId: number
  ownerEmail: string
  ownerName: string
  ownerPassword: string
}

export interface TenantListResponse {
  data: TenantMetadata[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * Servicio para administración de tenants
 */
export class TenantAdminService {
  /**
   * Lista todos los tenants
   */
  async listTenants(page: number = 1, limit: number = 20): Promise<TenantListResponse> {
    const response = await axiosInstance.get('/tenants', {
      params: { page, limit },
    })

    return {
      data: response.data.data.map(TenantMapper.toDomain),
      pagination: response.data.pagination,
    }
  }

  /**
   * Obtiene un tenant por ID
   */
  async getTenant(id: number): Promise<TenantMetadata> {
    const response = await axiosInstance.get(`/tenants/${id}`)
    return TenantMapper.toDomain(response.data)
  }

  /**
   * Crea un nuevo tenant
   */
  async createTenant(data: CreateTenantDto): Promise<TenantMetadata> {
    const response = await axiosInstance.post('/tenants', data)
    return TenantMapper.toDomain(response.data)
  }

  /**
   * Actualiza un tenant
   */
  async updateTenant(
    id: number,
    data: Partial<{
      name: string
      status: string
      planId: number
    }>,
  ): Promise<TenantMetadata> {
    const response = await axiosInstance.patch(`/tenants/${id}`, data)
    return TenantMapper.toDomain(response.data)
  }

  /**
   * Suspende un tenant
   */
  async suspendTenant(id: number, reason: string): Promise<void> {
    await axiosInstance.post(`/tenants/${id}/suspend`, { reason })
  }

  /**
   * Reactiva un tenant
   */
  async activateTenant(id: number): Promise<void> {
    await axiosInstance.post(`/tenants/${id}/activate`)
  }

  /**
   * Obtiene estadísticas de tenants
   */
  async getStats(): Promise<{
    total: number
    active: number
    trial: number
    suspended: number
  }> {
    const response = await axiosInstance.get('/tenants/stats')
    return response.data
  }
}

export const tenantAdminService = new TenantAdminService()
