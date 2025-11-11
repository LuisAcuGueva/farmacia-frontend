/**
 * Login DTO
 * Data Transfer Object para el proceso de login
 */
export interface LoginDTO {
  email: string
  password: string
  rememberMe?: boolean
}

/**
 * User Data en la respuesta de login
 */
export interface LoginUserData {
  id: number
  name: string
  email: string
  branchId?: number
  roles?: string[]
  permissions?: string[]
  role?: string // Para admin (SUPER_ADMIN, ADMIN, etc.)
}

/**
 * Login Response DTO
 * Estructura del backend para tenant login
 */
export interface LoginResponseDTO {
  accessToken: string
  refreshToken?: string
  tokenType: string
  expiresIn: number
  user?: LoginUserData // Para tenant
  admin?: LoginUserData // Para admin
}

/**
 * Register DTO
 */
export interface RegisterDTO {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  branchId?: string
}

/**
 * Refresh Token DTO
 */
export interface RefreshTokenDTO {
  refreshToken: string
}

/**
 * Reset Password DTO
 */
export interface ResetPasswordDTO {
  email: string
}

/**
 * Change Password DTO
 */
export interface ChangePasswordDTO {
  token: string
  newPassword: string
  confirmPassword: string
}
