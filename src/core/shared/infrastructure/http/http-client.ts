import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { axiosInstance } from '@/core/config/axios.config'

/**
 * Wrapper sobre Axios para facilitar llamadas HTTP
 *
 * Proporciona métodos tipo-seguros para:
 * - GET, POST, PUT, PATCH, DELETE
 * - Manejo de respuestas con tipado
 * - Configuración simplificada
 */
export class HttpClient {
  private readonly client: AxiosInstance

  constructor(client: AxiosInstance = axiosInstance) {
    this.client = client
  }

  /**
   * GET request
   */
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config)
    return response.data
  }

  /**
   * POST request
   */
  async post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config)
    return response.data
  }

  /**
   * PUT request
   */
  async put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config)
    return response.data
  }

  /**
   * PATCH request
   */
  async patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config)
    return response.data
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config)
    return response.data
  }

  /**
   * GET request con respuesta completa (headers, status, etc.)
   */
  async getFullResponse<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return await this.client.get<T>(url, config)
  }

  /**
   * POST request con respuesta completa
   */
  async postFullResponse<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return await this.client.post<T>(url, data, config)
  }
}

// Instancia por defecto
export const httpClient = new HttpClient()
