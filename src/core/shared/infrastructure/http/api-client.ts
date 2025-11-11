import { HttpClient } from './http-client'
import { axiosInstance } from '@/core/config/axios.config'

/**
 * Cliente HTTP específico para tu API
 *
 * Proporciona métodos convenientes para endpoints comunes:
 * - CRUD operations
 * - Paginación
 * - Filtros y búsqueda
 *
 * Usa este cliente en tus repositorios en lugar de axios directamente
 */
export class ApiClient extends HttpClient {
  constructor() {
    super(axiosInstance)
  }

  /**
   * GET con paginación
   */
  async getPaginated<T>(
    url: string,
    params?: {
      page?: number
      limit?: number
      sort?: string
      order?: 'asc' | 'desc'
      [key: string]: any
    },
  ): Promise<PaginatedResponse<T>> {
    return await this.get<PaginatedResponse<T>>(url, { params })
  }

  /**
   * GET by ID
   */
  async getById<T>(resource: string, id: number | string): Promise<T> {
    return await this.get<T>(`${resource}/${id}`)
  }

  /**
   * POST create
   */
  async create<T, D = Partial<T>>(resource: string, data: D): Promise<T> {
    return await this.post<T, D>(resource, data)
  }

  /**
   * PUT update
   */
  async update<T, D = Partial<T>>(resource: string, id: number | string, data: D): Promise<T> {
    return await this.put<T, D>(`${resource}/${id}`, data)
  }

  /**
   * PATCH update parcial
   */
  async updatePartial<T, D = Partial<T>>(
    resource: string,
    id: number | string,
    data: D,
  ): Promise<T> {
    return await this.patch<T, D>(`${resource}/${id}`, data)
  }

  /**
   * DELETE
   */
  async remove<T = void>(resource: string, id: number | string): Promise<T> {
    return await this.delete<T>(`${resource}/${id}`)
  }

  /**
   * Búsqueda con filtros
   */
  async search<T>(resource: string, query: string, filters?: Record<string, any>): Promise<T[]> {
    return await this.get<T[]>(`${resource}/search`, {
      params: { q: query, ...filters },
    })
  }

  /**
   * Bulk operations
   */
  async bulkCreate<T, D = Partial<T>>(resource: string, data: D[]): Promise<T[]> {
    return await this.post<T[], D[]>(`${resource}/bulk`, data)
  }

  async bulkUpdate<T, D = Partial<T>>(
    resource: string,
    data: Array<{ id: number | string } & D>,
  ): Promise<T[]> {
    return await this.put<T[], Array<{ id: number | string } & D>>(`${resource}/bulk`, data)
  }

  async bulkDelete(resource: string, ids: Array<number | string>): Promise<void> {
    return await this.delete<void>(`${resource}/bulk`, {
      data: { ids },
    })
  }

  /**
   * Upload de archivos
   */
  async uploadFile<T = { url: string; filename: string }>(
    resource: string,
    file: File,
    additionalData?: Record<string, any>,
  ): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    return await this.post<T, FormData>(resource, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  /**
   * Download de archivos
   */
  async downloadFile(url: string, filename?: string): Promise<void> {
    const response = await this.getFullResponse<Blob>(url, {
      responseType: 'blob',
    })

    // Crear link de descarga
    const blob = response.data
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl

    // Obtener filename del header o usar el proporcionado
    const contentDisposition = response.headers['content-disposition']
    const filenameFromHeader = contentDisposition?.split('filename=')[1]?.replace(/"/g, '')

    link.download = filename || filenameFromHeader || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Limpiar
    window.URL.revokeObjectURL(downloadUrl)
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return await this.get<{ status: string; timestamp: string }>('/health')
  }
}

/**
 * Tipo para respuestas paginadas
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

// Instancia singleton
export const apiClient = new ApiClient()
