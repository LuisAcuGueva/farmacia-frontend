import type { UserEntity } from '../../domain/entities/user.entity'

/**
 * API User Response Type
 */
interface APIUserResponse {
  id: number
  name: string
  email: string
  branchId?: number
  branch_id?: number
  branchName?: string
  branch_name?: string
  roles?: string[]
  permissions?: string[]
  isActive?: boolean
  is_active?: boolean
  createdAt?: string
  updatedAt?: string
}

/**
 * User Mapper
 * Mapea datos entre la capa de infraestructura y dominio
 */
export class UserMapper {
  /**
   * Mapea datos del API al dominio
   */
  static toDomain(data: APIUserResponse): UserEntity {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      branchId: data.branchId || data.branch_id,
      branchName: data.branchName || data.branch_name,
      roles: data.roles || [],
      permissions: data.permissions || [],
      isActive: data.isActive ?? data.is_active ?? true,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    }
  }

  /**
   * Mapea datos del dominio al API
   */
  static toAPI(user: UserEntity): APIUserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      branch_id: user.branchId,
      branch_name: user.branchName,
      roles: user.roles,
      permissions: user.permissions,
      is_active: user.isActive,
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
    }
  }
}
