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
 * Login Response DTO
 * Estructura real del backend
 */
export interface LoginResponseDTO {
  accessToken: string
  refreshToken?: string
  user: {
    id: number
    name: string
    email: string
    branchId?: number
    roles: string[]
    permissions: string[]
  }
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
