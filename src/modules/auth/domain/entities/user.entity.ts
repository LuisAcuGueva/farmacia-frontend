/**
 * User Entity
 * Representa la entidad de usuario en el dominio
 */
export interface UserEntity {
  id: number
  name: string
  email: string
  branchId?: number
  branchName?: string
  roles: string[]
  permissions: string[]
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

/**
 * User Role Enum
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CASHIER = 'CASHIER',
  PHARMACIST = 'PHARMACIST',
  INVENTORY_MANAGER = 'INVENTORY_MANAGER',
}

/**
 * Auth Token Entity
 */
export interface AuthTokenEntity {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}

/**
 * Session Entity
 */
export interface SessionEntity {
  user: UserEntity
  tokens: AuthTokenEntity
  expiresAt: Date
}
