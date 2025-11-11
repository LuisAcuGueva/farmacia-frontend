# Módulo Auth (Autenticación)

## 📋 Descripción

El módulo **Auth** gestiona todo el sistema de autenticación y autorización de la aplicación. Implementa un sistema robusto de JWT con refresh tokens automáticos, roles, permisos y soporte para contextos multi-tenant y admin.

Este módulo es fundamental para la seguridad de la aplicación, manejando el ciclo completo de autenticación: login, logout, refresh de sesión, recuperación de contraseñas y verificación de permisos.

## 🏗️ Arquitectura

El módulo sigue **Clean Architecture** con las siguientes capas:

```
auth/
├── application/         # Casos de uso y servicios
│   ├── services/       # Servicios de aplicación
│   └── use-cases/      # Casos de uso específicos
├── domain/             # Entidades, interfaces y DTOs
│   ├── dtos/          # Data Transfer Objects
│   ├── entities/      # Entidades de dominio
│   └── interfaces/    # Contratos de repositorio y servicio
├── infrastructure/     # Implementaciones técnicas
│   ├── mappers/       # Transformadores de datos
│   └── repositories/  # Implementación de repositorios
└── presentation/       # UI, stores y composables
    ├── composables/   # Composables de Vue
    ├── pages/         # Páginas de autenticación
    ├── router/        # Rutas del módulo
    └── stores/        # Store de Pinia
```

## 📁 Estructura Detallada

### 1️⃣ Application Layer

#### **Services** (`application/services/`)

##### **`auth.service.ts`**

Servicio principal que orquesta los casos de uso de autenticación:

**Responsabilidades:**

- Orquestar casos de uso
- Mantener sesión actual
- Coordinar flujo de autenticación
- Gestionar estado de sesión

**Métodos:**

- `login(credentials)`: Ejecuta el caso de uso de login
- `logout()`: Ejecuta el caso de uso de logout
- `refreshSession()`: Ejecuta refresh token
- `hasActiveSession()`: Verifica si hay sesión activa
- `getCurrentSession()`: Obtiene sesión actual
- `requestPasswordReset(email)`: Solicita reset de contraseña
- `changePassword(token, newPassword)`: Cambia contraseña

**Casos de Uso Utilizados:**

- `LoginUseCase`
- `LogoutUseCase`
- `RefreshTokenUseCase`
- `VerifySessionUseCase`
- `RequestPasswordResetUseCase`

#### **Use Cases** (`application/use-cases/`)

##### **`login.use-case.ts`**

Caso de uso para el proceso de login:

**Flujo:**

1. Valida credenciales (email válido, contraseña >= 6 caracteres)
2. Llama al repositorio para autenticar
3. Mapea respuesta a entidad `SessionEntity`
4. Maneja respuesta de admin o tenant
5. Retorna sesión con usuario y tokens

**Validaciones:**

- Email y contraseña requeridos
- Formato de email válido
- Longitud mínima de contraseña

##### **`logout.use-case.ts`**

Caso de uso para cerrar sesión:

**Flujo:**

1. Llama al repositorio para logout en servidor
2. Limpia tokens locales (accessToken, sessionStorage)
3. Limpia datos de usuario (localStorage)
4. Invalida sesión actual

##### **`refresh-token.use-case.ts`**

Caso de uso para refrescar el access token:

**Flujo:**

1. Valida que existe refresh token
2. Llama al repositorio para obtener nuevo access token
3. Mapea respuesta a nueva sesión
4. Actualiza tokens en storage
5. Retorna sesión actualizada

**Características:**

- Automático en interceptor HTTP (401)
- Transparente para el usuario
- Previene re-login innecesarios

##### **`verify-session.use-case.ts`**

Caso de uso para verificar si la sesión es válida:

**Flujo:**

1. Verifica existencia de tokens localmente
2. Llama al repositorio para verificar en servidor
3. Retorna true/false

**Uso:**

- Al cargar la aplicación
- Antes de operaciones sensibles
- En guards de navegación

##### **`request-password-reset.use-case.ts`**

Caso de uso para solicitar reset de contraseña:

**Flujo:**

1. Valida email
2. Llama al repositorio para enviar email
3. Backend genera token y envía email
4. Usuario recibe link con token

### 2️⃣ Domain Layer

#### **Entities** (`domain/entities/`)

##### **`user.entity.ts`**

Entidad principal de usuario:

```typescript
interface UserEntity {
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
```

**Enums:**

```typescript
enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CASHIER = 'CASHIER',
  PHARMACIST = 'PHARMACIST',
  INVENTORY_MANAGER = 'INVENTORY_MANAGER',
}
```

**Tokens:**

```typescript
interface AuthTokenEntity {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}
```

**Sesión:**

```typescript
interface SessionEntity {
  user: UserEntity
  tokens: AuthTokenEntity
  expiresAt: Date
}
```

#### **DTOs** (`domain/dtos/`)

##### **`login.dto.ts`**

Data Transfer Objects para autenticación:

**LoginDTO:**

```typescript
interface LoginDTO {
  email: string
  password: string
}
```

**LoginResponseDTO:**

```typescript
interface LoginResponseDTO {
  user?: UserEntity // Para contexto tenant
  admin?: UserEntity // Para contexto admin
  accessToken: string
  refreshToken?: string
  expiresIn?: number
  tokenType?: string
}
```

**Otros DTOs:**

- `RefreshTokenDTO`: Para refresh
- `ResetPasswordDTO`: Para reset de password
- `ChangePasswordDTO`: Para cambio de password

#### **Interfaces** (`domain/interfaces/`)

##### **`auth.repository.ts`**

Contrato del repositorio de autenticación:

**Métodos:**

- `login(credentials)`: Autenticar usuario
- `logout()`: Cerrar sesión en servidor
- `refreshToken(data)`: Obtener nuevo access token
- `verifySession()`: Verificar validez de sesión
- `requestPasswordReset(data)`: Solicitar reset
- `changePassword(data)`: Cambiar contraseña

##### **`auth.service.ts`**

Contrato del servicio de autenticación:

**Métodos:**

- Mismos que el servicio de implementación
- Define la interfaz pública del módulo

### 3️⃣ Infrastructure Layer

#### **Mappers** (`infrastructure/mappers/`)

##### **`user.mapper.ts`**

Transforma datos entre API y dominio:

**Métodos:**

- `toDomain(apiData)`: API → UserEntity
- `toApi(user)`: UserEntity → API format

**Características:**

- Mapea snake_case a camelCase
- Maneja valores opcionales
- Convierte fechas
- Normaliza roles y permisos

#### **Repositories** (`infrastructure/repositories/`)

##### **`auth.repository.impl.ts`**

Implementación del repositorio usando Axios:

**Características Clave:**

1. **Detección de Contexto:**
   - Detecta si es admin o tenant
   - Usa endpoints diferentes:
     - Admin: `/admin/auth/*`
     - Tenant: `/auth/*`

2. **Gestión de Tokens:**
   - `accessToken` → sessionStorage (temporal)
   - `refreshToken` → httpOnly cookie (servidor)
   - Limpieza automática en logout/errores

3. **Endpoints:**
   - `POST /auth/login` o `/admin/auth/login`
   - `POST /auth/logout` o `/admin/auth/logout`
   - `POST /auth/refresh` o `/admin/auth/refresh`
   - `GET /auth/verify` o `/admin/auth/verify`
   - `POST /auth/reset-password`
   - `POST /auth/change-password`

4. **Manejo de Errores:**
   - Extrae mensajes del backend
   - Limpia datos en errores críticos
   - Propaga errores con contexto

5. **Interceptores:**
   - Usa `axiosInstance` central
   - Beneficia de interceptores globales
   - Headers de tenant automáticos (si aplica)

### 4️⃣ Presentation Layer

#### **Stores** (`presentation/stores/`)

##### **`auth.store.ts`**

Store de Pinia para estado de autenticación:

**State:**

```typescript
{
  user: UserEntity | null
  accessToken: string | null
  isLoading: boolean
  error: string | null
}
```

**Getters:**

- `isAuthenticated`: Verifica si hay sesión activa
- `currentUser`: Usuario actual
- `userRole`: Rol principal del usuario
- `userPermissions`: Lista de permisos

**Actions:**

- `login(credentials)`: Autenticar usuario
- `logout()`: Cerrar sesión
- `refreshSession()`: Refrescar tokens
- `verifySession()`: Verificar sesión
- `requestPasswordReset(email)`: Solicitar reset
- `changePassword(token, newPassword)`: Cambiar contraseña
- `initializeFromStorage()`: Cargar sesión guardada
- `hasPermission(permission)`: Verificar permiso específico
- `hasRole(role)`: Verificar rol específico

**Persistencia:**

- `persistUserData()`: Guarda datos NO sensibles en localStorage
- `clearUserData()`: Limpia todos los datos
- Solo datos seguros en localStorage (sin tokens)

**Inicialización:**

```typescript
// En main.ts o App.vue
const authStore = useAuthStore()
authStore.initializeFromStorage()
```

#### **Composables** (`presentation/composables/`)

##### **`useAuth.ts`**

Composable para usar autenticación en componentes:

**Expone:**

```typescript
{
  // State
  ;(user,
    isAuthenticated,
    isLoading,
    error,
    // Getters
    currentUser,
    userRole,
    userPermissions,
    // Actions
    login,
    logout,
    refreshSession,
    hasPermission,
    hasRole)
}
```

**Uso:**

```vue
<script setup>
import { useAuth } from '@/modules/auth/presentation/composables/useAuth'

const { user, isAuthenticated, login, logout } = useAuth()
</script>
```

#### **Pages** (`presentation/pages/`)

##### **`LoginPage.vue`**

Página de inicio de sesión:

**Características:**

- Formulario con email y password
- Validación en tiempo real
- Manejo de errores
- Loading state
- Redirect después de login
- Link a recuperación de contraseña

**Flujo:**

1. Usuario ingresa credenciales
2. Validación del formulario
3. Llamada a `authStore.login()`
4. Loading state durante request
5. Si éxito: redirige a dashboard o ruta destino
6. Si error: muestra mensaje

##### **`RecoverPasswordPage.vue`**

Página de recuperación de contraseña:

**Flujo:**

1. Usuario ingresa email
2. Solicita reset
3. Backend envía email con link
4. Usuario recibe email con token
5. Click en link redirige a página de cambio
6. Ingresa nueva contraseña
7. Contraseña actualizada

#### **Router** (`presentation/router/`)

##### **`auth.routes.ts`**

Rutas del módulo de autenticación:

```typescript
;[
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    beforeEnter: guestGuard, // Solo para no autenticados
  },
  {
    path: '/recover-password',
    name: 'RecoverPassword',
    component: RecoverPasswordPage,
    beforeEnter: guestGuard,
  },
]
```

## 🔄 Flujos Completos

### Login Flow

```
1. Usuario accede a /login
2. guestGuard verifica que no esté autenticado
3. LoginPage se renderiza
4. Usuario ingresa email y password
5. Click en "Iniciar Sesión"
6. authStore.login(credentials)
   ├─ authService.login()
   ├─ loginUseCase.execute()
   ├─ authRepository.login()
   ├─ POST /auth/login (o /admin/auth/login)
   ├─ Backend valida credenciales
   ├─ Backend genera tokens
   ├─ Backend retorna user + tokens
   └─ Mapper transforma a SessionEntity
7. Store guarda user y accessToken
8. persistUserData() → localStorage
9. Redirect a /dashboard (o redirect param)
```

### Auto-Refresh Flow

```
1. Usuario hace request a API protegida
2. Backend retorna 401 Unauthorized
3. error-http.interceptor detecta 401
4. Verifica si ya se intentó refresh (_retry flag)
5. Si no, marca _retry = true
6. authStore.refreshSession()
   ├─ authService.refreshSession()
   ├─ refreshTokenUseCase.execute()
   ├─ authRepository.refreshToken()
   ├─ POST /auth/refresh
   ├─ Backend valida refreshToken (cookie)
   ├─ Backend genera nuevo accessToken
   └─ Retorna nuevo accessToken
7. Store actualiza accessToken
8. sessionStorage actualizado
9. Request original se reintenta con nuevo token
10. Si refresh falla:
    ├─ Logout automático
    ├─ Limpia todos los datos
    └─ Redirect a /login
```

### Logout Flow

```
1. Usuario click en "Cerrar Sesión"
2. authStore.logout()
   ├─ authService.logout()
   ├─ logoutUseCase.execute()
   ├─ authRepository.logout()
   ├─ POST /auth/logout
   ├─ Backend invalida refreshToken
   └─ Backend limpia cookie
3. Store limpia user y accessToken
4. clearUserData()
   ├─ localStorage.removeItem('user')
   └─ sessionStorage.removeItem('accessToken')
5. Redirect a /login
```

### Session Verification Flow

```
1. App se carga
2. authStore.initializeFromStorage()
3. Lee localStorage ('user')
4. Lee sessionStorage ('accessToken')
5. Si hay user pero NO accessToken:
   ├─ Intenta refreshSession()
   └─ Si falla, limpia todo
6. Si hay ambos:
   ├─ Restaura estado
   └─ App continúa con sesión
7. Opcionalmente verifySession() en servidor
```

### Password Reset Flow

```
1. Usuario en /recover-password
2. Ingresa email
3. authStore.requestPasswordReset(email)
   ├─ authService.requestPasswordReset()
   ├─ requestPasswordResetUseCase.execute()
   ├─ authRepository.requestPasswordReset()
   ├─ POST /auth/reset-password
   ├─ Backend genera token temporal
   └─ Backend envía email con link
4. Usuario recibe email
5. Click en link: /reset-password?token=xxx
6. Página de cambio de contraseña
7. Ingresa nueva contraseña
8. authStore.changePassword(token, newPassword)
   ├─ authService.changePassword()
   ├─ authRepository.changePassword()
   ├─ POST /auth/change-password
   ├─ Backend valida token
   └─ Backend actualiza contraseña
9. Éxito, redirect a /login
```

## 🔐 Seguridad

### Almacenamiento de Tokens

#### Access Token

- **Ubicación**: `sessionStorage`
- **Duración**: Hasta cerrar navegador
- **Ventajas**:
  - No persiste entre sesiones
  - Se limpia automáticamente
  - Menos riesgo si se compromete

#### Refresh Token

- **Ubicación**: httpOnly cookie (backend)
- **Duración**: 7-30 días
- **Ventajas**:
  - No accesible por JavaScript
  - Protegido contra XSS
  - Enviado automáticamente en requests

### Datos de Usuario

- **Ubicación**: `localStorage`
- **Contenido**: Solo datos NO sensibles
  - id, email, name, roles, permissions
  - NO incluye tokens ni contraseñas
- **Propósito**: Restaurar UI sin re-fetch

### Validaciones

#### En Frontend

- Formato de email
- Longitud mínima de contraseña (6 caracteres)
- Campos requeridos
- Formateo de datos

#### En Backend (esperado)

- Hash de contraseñas (bcrypt)
- Validación robusta de credenciales
- Rate limiting en login
- Token expiration
- Blacklist de refresh tokens al logout

### Protección contra Ataques

#### XSS (Cross-Site Scripting)

- Tokens en httpOnly cookies
- Sanitización de inputs
- Content Security Policy

#### CSRF (Cross-Site Request Forgery)

- SameSite cookies
- CORS configurado correctamente
- Verificación de origen

#### Brute Force

- Rate limiting en backend
- Captcha después de X intentos
- Bloqueo temporal de cuenta

## 🎯 Roles y Permisos

### Roles Predefinidos

**SUPER_ADMIN**

- Acceso total al sistema
- Gestión de tenants
- Configuración global

**ADMIN**

- Administrador de tenant
- Gestión de usuarios del tenant
- Configuración del tenant

**MANAGER**

- Gestión de sucursal
- Reportes
- Supervisión de operaciones

**CASHIER**

- Punto de venta
- Ventas básicas
- Consulta de productos

**PHARMACIST**

- Gestión de inventario
- Dispensación de medicamentos
- Control de recetas

**INVENTORY_MANAGER**

- Gestión completa de inventario
- Compras
- Ajustes de stock

### Sistema de Permisos

Los permisos siguen el patrón `recurso:acción`:

**Ejemplos:**

- `users:create` - Crear usuarios
- `users:read` - Ver usuarios
- `users:update` - Editar usuarios
- `users:delete` - Eliminar usuarios
- `sales:create` - Registrar ventas
- `inventory:manage` - Gestionar inventario
- `reports:view` - Ver reportes
- `reports:export` - Exportar reportes

### Verificación en Componentes

```vue
<template>
  <button v-if="hasPermission('users:create')">Crear Usuario</button>
</template>

<script setup>
const { hasPermission } = useAuth()
</script>
```

### Verificación en Guards

```typescript
{
  path: '/users/create',
  beforeEnter: permissionGuard(['users:create'])
}
```

## 🧪 Testing

### Unit Tests

```typescript
// auth.store.spec.ts
describe('AuthStore', () => {
  it('should login successfully', async () => {
    const store = useAuthStore()
    await store.login({ email: 'test@test.com', password: '123456' })
    expect(store.isAuthenticated).toBe(true)
  })
})
```

### Integration Tests

```typescript
// login.spec.ts
describe('Login Flow', () => {
  it('should redirect to dashboard after login', async () => {
    // ... test implementation
  })
})
```

## 📝 Variables de Entorno

```env
# No hay variables específicas del módulo auth
# Usa variables globales de API y tenant
```

## 🔗 Dependencias

- **Axios**: Cliente HTTP
- **Pinia**: Estado global
- **Vue Router**: Navegación
- **Módulo Tenant**: Detección de contexto (admin/tenant)

## 📚 Mejores Prácticas

1. **Nunca** guardar tokens en localStorage (usar sessionStorage + httpOnly cookies)
2. **Siempre** limpiar datos en logout
3. **Verificar** sesión al cargar app
4. **Implementar** refresh automático de tokens
5. **Usar** guards apropiados en rutas protegidas
6. **Validar** permisos tanto en frontend como backend
7. **Manejar** errores de autenticación gracefully
8. **Registrar** intentos de acceso no autorizado

## 🚀 Próximos Pasos

- [ ] Implementar 2FA (Two-Factor Authentication)
- [ ] Social login (Google, Facebook)
- [ ] Biometría (Face ID, Touch ID)
- [ ] Sesiones múltiples (gestión de dispositivos)
- [ ] Auditoría de sesiones
- [ ] Login passwordless (magic links)

## 💡 Notas Importantes

1. **Contexto Dual**: El sistema maneja dos contextos de autenticación:
   - **Admin**: Para super administradores (sin tenant)
   - **Tenant**: Para usuarios de farmacias específicas

2. **Refresh Automático**: El sistema refresca tokens automáticamente en 401, el usuario no nota interrupciones

3. **Seguridad First**: Los tokens nunca se exponen completos en logs o consola

4. **Clean Architecture**: La separación de capas facilita testing y mantenimiento
