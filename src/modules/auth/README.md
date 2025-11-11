# 🔐 Módulo de Autenticación

Módulo completo de autenticación para el Sistema de Farmacia, implementado siguiendo Clean Architecture.

## 📁 Estructura

```
modules/auth/
├── domain/                 # Capa de dominio
│   ├── entities/
│   │   └── user.entity.ts         # Entidad de usuario
│   ├── interfaces/
│   │   ├── auth.repository.ts     # Contrato del repositorio
│   │   └── auth.service.ts        # Contrato del servicio
│   └── dtos/
│       └── login.dto.ts           # DTOs para auth
│
├── application/            # Capa de aplicación
│   ├── use-cases/
│   │   ├── login.use-case.ts              # Caso de uso: Login
│   │   ├── logout.use-case.ts             # Caso de uso: Logout
│   │   ├── refresh-token.use-case.ts      # Caso de uso: Refresh token
│   │   ├── verify-session.use-case.ts     # Caso de uso: Verificar sesión
│   │   └── request-password-reset.use-case.ts  # Caso de uso: Recuperar contraseña
│   └── services/
│       └── auth.service.ts        # Servicio de autenticación
│
├── infrastructure/         # Capa de infraestructura
│   ├── repositories/
│   │   └── auth.repository.impl.ts   # Implementación del repositorio
│   └── mappers/
│       └── user.mapper.ts            # Mapper para transformar datos
│
└── presentation/          # Capa de presentación
    ├── pages/
    │   ├── LoginPage.vue                 # Página de login
    │   └── RecoverPasswordPage.vue       # Página de recuperación
    ├── composables/
    │   └── useAuth.ts                    # Composable de auth
    ├── stores/
    │   └── auth.store.ts                 # Store de Pinia
    └── router/
        └── auth.routes.ts                # Rutas del módulo
```

## ✨ Características Implementadas

### 1. Login/Logout

- ✅ Autenticación con email y password
- ✅ Opción "Recordarme"
- ✅ Manejo de errores
- ✅ Loading states
- ✅ Persistencia de sesión en localStorage

### 2. Gestión de Tokens (JWT)

- ✅ Almacenamiento seguro de access token
- ✅ Almacenamiento de refresh token
- ✅ Auto-refresh de tokens antes de expirar
- ✅ Interceptores HTTP para añadir token a requests

### 3. Refresh Token Automático

- ✅ Use case para refrescar tokens
- ✅ Manejo de tokens expirados
- ✅ Redirección automática a login si falla el refresh

### 4. Control de Sesiones

- ✅ Verificación de sesión válida
- ✅ Persistencia entre recargas
- ✅ Limpieza de sesión al logout
- ✅ Sincronización con el servidor

### 5. Recuperación de Contraseña

- ✅ Solicitud de recuperación por email
- ✅ Cambio de contraseña con token
- ✅ Validaciones de formulario

### 6. Guards de Navegación

- ✅ `authGuard`: Protege rutas que requieren autenticación
- ✅ `guestGuard`: Protege rutas solo para no autenticados
- ✅ `roleGuard`: Protege rutas por rol de usuario
- ✅ `permissionGuard`: Protege rutas por permisos específicos

## 🚀 Uso

### En Componentes Vue

```vue
<script setup lang="ts">
import { useAuth } from '@/modules/auth/presentation/composables/useAuth'

const { user, isAuthenticated, login, logout, isLoading, error } = useAuth()

// Login
async function handleLogin() {
  await login({
    email: 'user@example.com',
    password: 'password123',
    rememberMe: true,
  })
}

// Logout
async function handleLogout() {
  await logout()
}

// Verificar permiso
const canEdit = hasPermission('products.edit')

// Verificar rol
const isAdmin = hasRole('ADMIN')
</script>
```

### Proteger Rutas

```typescript
// En router
{
  path: '/products',
  component: ProductsPage,
  meta: {
    requiresAuth: true  // Requerirá autenticación
  }
}

// Por rol
{
  path: '/admin',
  component: AdminPage,
  beforeEnter: roleGuard(['ADMIN'])
}

// Por permiso
{
  path: '/inventory',
  component: InventoryPage,
  beforeEnter: permissionGuard(['inventory.view', 'inventory.edit'])
}
```

### Usar el Store Directamente

```typescript
import { useAuthStore } from '@/modules/auth/presentation/stores/auth.store'

const authStore = useAuthStore()

// State
console.log(authStore.user)
console.log(authStore.isAuthenticated)

// Actions
await authStore.login(credentials)
await authStore.logout()
await authStore.refreshSession()
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local`:

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

### API Endpoints Esperados

El módulo espera los siguientes endpoints en el backend:

- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/verify` - Verificar sesión
- `POST /api/auth/reset-password` - Solicitar recuperación
- `POST /api/auth/change-password` - Cambiar contraseña

### Formato de Respuestas del API

**Login/Refresh Response:**

```json
{
  "user": {
    "id": "uuid",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CASHIER",
    "branchId": "branch-uuid",
    "branchName": "Sucursal Centro",
    "permissions": ["sales.create", "sales.view"],
    "isActive": true
  },
  "tokens": {
    "accessToken": "jwt-token",
    "refreshToken": "jwt-refresh-token",
    "expiresIn": 3600,
    "tokenType": "Bearer"
  }
}
```

## 🔐 Roles de Usuario

```typescript
enum UserRole {
  ADMIN = 'ADMIN', // Administrador del sistema
  MANAGER = 'MANAGER', // Gerente de sucursal
  CASHIER = 'CASHIER', // Cajero
  PHARMACIST = 'PHARMACIST', // Farmacéutico
  INVENTORY_MANAGER = 'INVENTORY_MANAGER', // Encargado de inventario
}
```

## 🛡️ Seguridad

### Buenas Prácticas Implementadas

1. **Tokens en localStorage**: Los tokens se almacenan en localStorage (considera usar httpOnly cookies en producción)
2. **Validaciones**: Todas las entradas son validadas
3. **Error Handling**: Manejo robusto de errores en toda la cadena
4. **Auto-logout**: Logout automático en caso de token inválido
5. **Guards**: Protección de rutas sensibles

### Recomendaciones de Producción

- [ ] Implementar HTTPS
- [ ] Usar httpOnly cookies para tokens
- [ ] Implementar rate limiting
- [ ] Añadir 2FA (autenticación de dos factores)
- [ ] Implementar CSRF protection
- [ ] Logging de intentos de login fallidos
- [ ] Bloqueo de cuenta después de X intentos fallidos

## 🧪 Testing

### Unit Tests Recomendados

```typescript
// Use cases
describe('LoginUseCase', () => {
  it('should login successfully with valid credentials')
  it('should throw error with invalid credentials')
  it('should validate email format')
})

// Store
describe('AuthStore', () => {
  it('should set user after login')
  it('should clear user after logout')
  it('should persist session to localStorage')
})

// Components
describe('LoginPage', () => {
  it('should render login form')
  it('should validate required fields')
  it('should submit form with valid data')
})
```

## 📚 Dependencias

- Vue 3
- Pinia
- Vue Router 4
- Axios
- TypeScript

## 🔄 Flujo de Autenticación

```
1. Usuario ingresa credenciales en LoginPage
2. LoginPage llama a useAuth.login()
3. useAuth llama a authStore.login()
4. authStore llama a authService.login()
5. authService ejecuta LoginUseCase
6. LoginUseCase llama a authRepository.login()
7. authRepository hace request HTTP al backend
8. Backend valida y retorna tokens + usuario
9. authRepository retorna datos
10. LoginUseCase mapea a SessionEntity
11. authStore actualiza state y localStorage
12. Router redirige a dashboard
```

## 🐛 Troubleshooting

### El login no funciona

- Verifica que `VITE_API_BASE_URL` esté configurado correctamente
- Revisa la consola del navegador para errores
- Verifica que el backend esté corriendo

### La sesión no persiste al recargar

- Verifica que `initializeFromStorage()` se llame en `main.ts`
- Revisa que localStorage tenga los tokens guardados

### Los guards no funcionan

- Verifica que los guards estén registrados en el router
- Asegúrate de que `meta.requiresAuth` esté configurado

## 📝 Próximos Pasos

- [ ] Implementar página de Register
- [ ] Añadir tests unitarios
- [ ] Implementar 2FA
- [ ] Añadir rate limiting en el cliente
- [ ] Implementar cambio de contraseña desde perfil
- [ ] Añadir logs de actividad de usuario
- [ ] Implementar refresh automático en background

## 👥 Autor

Sistema de Farmacia - Luis Acu Gueva

---

**Última actualización**: Noviembre 2025
