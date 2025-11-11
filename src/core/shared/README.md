# Módulo Shared (Compartido)

## 📋 Descripción

El módulo **Shared** contiene componentes, utilidades y configuraciones compartidas por toda la aplicación. Incluye guards de navegación, interceptores HTTP, clientes de API, layouts y páginas de error.

Este módulo es la base técnica que utilizan todos los demás módulos de la aplicación, proporcionando funcionalidad común y reutilizable.

## 🏗️ Arquitectura

```
shared/
├── application/         # Guards e interceptores
│   ├── guards/         # Guards de Vue Router
│   └── interceptors/   # Interceptores HTTP de Axios
├── infrastructure/      # Configuración e implementaciones técnicas
│   ├── config/         # Archivos de configuración
│   └── http/           # Clientes HTTP
└── presentation/        # Componentes UI, layouts y páginas
    ├── components/     # Componentes compartidos
    ├── layouts/        # Layouts de la aplicación
    └── pages/          # Páginas de error y especiales
```

## 📁 Estructura Detallada

### 1️⃣ Application Layer

#### **Guards** (`application/guards/`)

##### **`auth.guard.ts`**

Guards para protección de rutas basadas en autenticación:

- **`authGuard()`**: Protege rutas que requieren autenticación
  - Verifica si el usuario está autenticado
  - Redirige a login si no está autenticado
  - Guarda la ruta de destino en `redirect` query param

- **`guestGuard()`**: Protege rutas para usuarios NO autenticados (login, registro)
  - Verifica si el usuario está autenticado
  - Redirige a Dashboard si ya está autenticado
  - Previene acceso a login cuando ya hay sesión

**Uso:**

```typescript
{
  path: '/dashboard',
  component: Dashboard,
  beforeEnter: authGuard
}

{
  path: '/login',
  component: Login,
  beforeEnter: guestGuard
}
```

##### **`role.guard.ts`**

Guards para protección basada en roles y permisos:

- **`roleGuard(allowedRoles)`**: Verifica que el usuario tenga uno de los roles permitidos
  - Recibe array de roles permitidos
  - Verifica autenticación primero
  - Compara rol del usuario con roles permitidos
  - Redirige a Dashboard con error si no tiene permisos

- **`permissionGuard(requiredPermissions)`**: Verifica permisos específicos
  - Recibe array de permisos requeridos
  - Verifica autenticación primero
  - Comprueba que el usuario tenga TODOS los permisos requeridos
  - Redirige a Dashboard con error si falta algún permiso

**Uso:**

```typescript
{
  path: '/admin',
  component: Admin,
  beforeEnter: roleGuard(['ADMIN', 'SUPER_ADMIN'])
}

{
  path: '/reports',
  component: Reports,
  beforeEnter: permissionGuard(['view:reports', 'export:reports'])
}
```

##### **`tenant.guard.ts`**

Guard para validación de tenant en sistema multi-tenant:

- **`tenantGuard()`**: Valida que existe un tenant válido antes de acceder a la ruta
  - Permite acceso a rutas públicas sin tenant
  - Permite acceso a admin sin tenant
  - Inicializa tenant si no está cargado
  - Valida estado del tenant (activo, suspendido)
  - Redirige a páginas de error específicas según el caso

**Flujo:**

1. Verifica si es ruta pública → Permite acceso
2. Verifica si es admin → Permite acceso
3. Si no hay tenant cargado → Inicializa
4. Si inicialización falla → Redirige a `/tenant-not-found`
5. Si tenant suspendido → Redirige a `/suspended`
6. Si tenant no activo → Redirige a `/invalid-tenant`
7. Si todo OK → Permite acceso

#### **Interceptors** (`application/interceptors/`)

##### **`auth-http.interceptor.ts`**

Interceptor para gestión de tokens de autenticación:

- **`onRequest(config)`**: Agrega el access token a cada request
  - Lee `accessToken` desde sessionStorage
  - Agrega header `Authorization: Bearer {token}`
  - Logs en modo desarrollo (sin exponer token completo)

- **`setAccessToken(token)`**: Guarda token en sessionStorage
- **`clearAccessToken()`**: Elimina token de sessionStorage
- **`getAccessToken()`**: Obtiene token actual

**Características:**

- Token en sessionStorage (se limpia al cerrar navegador)
- Refresh token en httpOnly cookie (gestionado por backend)
- No expone tokens completos en logs

##### **`error-http.interceptor.ts`**

Interceptor centralizado para manejo de errores HTTP:

**Errores Manejados:**

- **401 Unauthorized**:
  - Intenta refresh token automático
  - Si falla, redirige a login
  - Evita loops infinitos con flag `_retry`
  - Encola requests durante el refresh

- **403 Forbidden**:
  - Muestra mensaje "Sin permisos"
  - Redirige a página Forbidden

- **404 Not Found**:
  - Extrae mensaje de error del backend
  - Retorna error con mensaje descriptivo

- **422 Validation Error**:
  - Formatea errores de validación
  - Retorna objeto con errores por campo

- **5xx Server Error**:
  - Muestra mensaje amigable
  - Registra error para debugging

- **460 Tenant Not Found** (custom):
  - Redirige a `/tenant-not-found`

- **461 Tenant Suspended** (custom):
  - Redirige a `/suspended`

- **Network Error**:
  - Detecta pérdida de conexión
  - Muestra mensaje "Sin conexión"

**Características:**

- Refresh token automático y transparente
- Prevención de loops infinitos
- Formateo de errores de validación
- Logout automático en errores irrecuperables
- Imports dinámicos para evitar dependencias circulares

##### **`tenant-http.interceptor.ts`**

Interceptor para agregar información del tenant en requests:

- **`onRequest(config)`**: Agrega headers del tenant actual
  - `X-Tenant-Subdomain`: Subdomain del tenant
  - `X-Tenant-Id`: ID del tenant (REQUERIDO por backend)
  - `X-Tenant-Schema`: Nombre del schema de BD (opcional)

- Solo agrega headers si hay tenant activo (no admin)
- Logs en desarrollo para debugging
- Import dinámico del store para evitar circularidad

**Uso por el Backend:**

- Identifica el schema de BD correcto
- Aplica filtros de tenant en queries
- Valida permisos específicos del tenant

### 2️⃣ Infrastructure Layer

#### **Config** (`infrastructure/config/`)

##### **`api.config.ts`**

Configuración centralizada de endpoints de la API:

**Endpoints Definidos:**

- `AUTH`: Login, logout, refresh, verify, password reset
- `TENANTS`: CRUD de tenants, validación, stats
- `USERS`: Gestión de usuarios
- `BRANCHES`: Gestión de sucursales
- `PRODUCTS`: Catálogo de productos, búsqueda
- `SALES`: Ventas, estadísticas
- `INVENTORY`: Movimientos, ajustes
- `REPORTS`: Reportes y exportación
- `HEALTH`: Health check

**Configuración de Timeouts:**

- DEFAULT: 30 segundos
- UPLOAD: 2 minutos
- REPORT: 1 minuto
- EXPORT: 3 minutos

**Configuración de Reintentos:**

- MAX_RETRIES: 3 intentos
- RETRY_DELAY: 1 segundo
- Códigos reintentables: 408, 429, 500, 502, 503, 504

**Helper:**

- `buildUrl(endpoint, params)`: Construye URL con query params

##### **`tenant.config.ts`**

Configuración del sistema multi-tenant:

**Modos de Detección:**

- `SUBDOMAIN`: tenant.example.com (Recomendado)
- `HEADER`: X-Tenant-Subdomain header
- `PATH`: /tenant/nombre-tenant/...

**Configuración Principal:**

- `MODE`: Modo de detección activo
- `DEFAULT_TENANT`: Tenant por defecto en dev
- `ADMIN_SUBDOMAIN`: Subdomain del panel admin
- `RESERVED_SUBDOMAINS`: Subdomains reservados
- `ENABLE_CACHE`: Activar caché de tenant
- `CACHE_TTL`: Tiempo de vida del caché
- `DEV_MODE`: Modo desarrollo
- `SHOW_TENANT_INFO`: Mostrar debug info

**Validación de Subdomain:**

- Regex: `/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/`
- Longitud: 3-63 caracteres
- Caracteres permitidos: a-z, 0-9, guión

**Estrategias de Fallback:**

- `REDIRECT_TO_MAIN`: Redirigir a www
- `SHOW_ERROR_PAGE`: Mostrar error
- `USE_DEFAULT`: Usar tenant default (dev)

**Features por Plan:**
Definición de características y límites según plan (free, standard, premium, enterprise)

**Helpers:**

- `isValidSubdomain(subdomain)`: Valida formato
- `isReservedSubdomain(subdomain)`: Verifica reserva
- `isAdminSubdomain(subdomain)`: Verifica si es admin
- `TENANT_URLS.getTenantUrl(subdomain)`: Construye URL

#### **HTTP** (`infrastructure/http/`)

##### **`http-client.ts`**

Wrapper tipo-seguro sobre Axios:

**Métodos:**

- `get<T>(url, config)`: GET request
- `post<T, D>(url, data, config)`: POST request
- `put<T, D>(url, data, config)`: PUT request
- `patch<T, D>(url, data, config)`: PATCH request
- `delete<T>(url, config)`: DELETE request
- `getFullResponse<T>(url, config)`: GET con respuesta completa
- `postFullResponse<T, D>(url, data, config)`: POST con respuesta completa

**Características:**

- Tipado completo con TypeScript
- Simplifica llamadas HTTP
- Retorna solo `data` por defecto
- Opción de obtener respuesta completa (headers, status)

##### **`api-client.ts`**

Cliente HTTP específico con operaciones CRUD convenientes:

**Métodos CRUD:**

- `getPaginated<T>(url, params)`: GET con paginación
- `getById<T>(resource, id)`: GET por ID
- `create<T, D>(resource, data)`: POST crear
- `update<T, D>(resource, id, data)`: PUT actualizar
- `updatePartial<T, D>(resource, id, data)`: PATCH parcial
- `remove<T>(resource, id)`: DELETE

**Operaciones Avanzadas:**

- `search<T>(resource, query, filters)`: Búsqueda con filtros
- `bulkCreate<T>(resource, data[])`: Creación masiva
- `bulkUpdate<T>(resource, data[])`: Actualización masiva
- `bulkDelete(resource, ids[])`: Eliminación masiva

**Archivos:**

- `uploadFile<T>(resource, file, data)`: Subir archivo
- `downloadFile(url, filename)`: Descargar archivo

**Salud:**

- `healthCheck()`: Verificar estado de la API

**Interface:**

```typescript
interface PaginatedResponse<T> {
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
```

### 3️⃣ Presentation Layer

#### **Components** (`presentation/components/`)

Componentes UI compartidos:

- `navigation/`: Componentes de navegación
- `ui/`: Componentes de interfaz reutilizables

#### **Layouts** (`presentation/layouts/`)

##### **`AdminLayout.vue`**

Layout para panel de administración:

- Sidebar con navegación admin
- Header con usuario y logout
- Área de contenido principal
- Footer

##### **`AuthLayout.vue`**

Layout para páginas de autenticación:

- Diseño centrado
- Sin navegación
- Branding del sistema
- Ideal para login, registro, reset password

##### **`PublicLayout.vue`**

Layout para páginas públicas:

- Header público
- Sin autenticación requerida
- Footer con links
- Landing pages, info

##### **`TenantLayout.vue`**

Layout para área de tenant:

- Sidebar con navegación contextual
- Header con info del tenant
- Branding personalizado del tenant
- Área de contenido principal

#### **Pages** (`presentation/pages/`)

##### **`NotFoundView.vue`**

Página 404 - Ruta no encontrada:

- Diseño amigable
- Mensaje claro
- Botón para volver al inicio

##### **`TenantNotFoundView.vue`**

Página cuando el tenant no existe:

- Mensaje específico de tenant no encontrado
- Sugerencias (verificar URL, contactar admin)
- Link al sitio principal

##### **`InvalidTenantView.vue`**

Página cuando el tenant no es válido:

- Tenant existe pero no está activo
- Mensaje de cuenta inactiva
- Contacto a soporte

##### **`TenantSuspendedView.vue`**

Página cuando el tenant está suspendido:

- Mensaje de suspensión
- Razón de suspensión (si disponible)
- Información de contacto
- Sin acceso a funcionalidades

## 🔄 Flujo de Interceptores

### Request Flow

```
1. Cliente hace request
2. tenant-http.interceptor → Agrega headers de tenant
3. auth-http.interceptor → Agrega token de autenticación
4. Request se envía al servidor
```

### Response Flow

```
1. Servidor responde
2. error-http.interceptor procesa la respuesta
3. Si es error:
   ├─ 401 → Intenta refresh token → Reintenta
   ├─ 403 → Redirige a Forbidden
   ├─ 422 → Formatea errores
   ├─ 5xx → Mensaje amigable
   └─ Network → Mensaje sin conexión
4. Retorna respuesta al cliente
```

## 🛡️ Seguridad

### Tokens

- **Access Token**: sessionStorage (temporal)
- **Refresh Token**: httpOnly cookie (seguro)
- Nunca exponer tokens completos en logs
- Refresh automático en 401

### Headers del Tenant

- Backend debe validar `X-Tenant-Id`
- Prevenir acceso a datos de otros tenants
- Usar schema correcto de BD

### Guards de Navegación

- Protección de rutas sensibles
- Verificación de roles y permisos
- Validación de tenant activo
- Redirecciones apropiadas

## 🧪 Testing

### Simular Errores HTTP

```typescript
// En desarrollo, forzar errores
axios.get('/endpoint-inexistente') // → 404
axios.get('/protected') // sin token → 401
```

### Probar Guards

```typescript
// En router
beforeEnter: [tenantGuard, authGuard, roleGuard(['ADMIN'])]
```

## 📝 Variables de Entorno

```env
# API
VITE_API_PORT=3000
VITE_API_PATH=/api/v1

# Tenant
VITE_TENANT_MODE=subdomain
VITE_DEFAULT_TENANT=demo
VITE_ADMIN_SUBDOMAIN=admin
VITE_RESERVED_SUBDOMAINS=admin,www,api,app

# Cache
VITE_ENABLE_TENANT_CACHE=true
VITE_TENANT_CACHE_TTL=300000

# Debug
VITE_SHOW_TENANT_INFO=true
VITE_DEV_MODE=true
```

## 🔗 Dependencias

- **Axios**: Cliente HTTP
- **Vue Router**: Navegación y guards
- **Pinia**: Estado (indirectamente via auth/tenant stores)

## 📚 Mejores Prácticas

1. **Usar Guards Apropiados**: Combinar guards según necesidad
2. **Manejo de Errores**: Dejar que interceptores manejen errores comunes
3. **Tipos TypeScript**: Usar tipos del api-client para responses
4. **No Duplicar Lógica**: Usar clientes y helpers compartidos
5. **Logs en Desarrollo**: Aprovechar logs de interceptores
6. **Evitar Dependencias Circulares**: Usar imports dinámicos cuando sea necesario

## 🎯 Uso Recomendado

### En Repositorios

```typescript
import { apiClient } from '@/core/shared/infrastructure/http/api-client'

async getTenants() {
  return await apiClient.getPaginated('/tenants', {
    page: 1,
    limit: 20
  })
}
```

### En Router

```typescript
import { authGuard } from '@/core/shared/application/guards/auth.guard'
import { tenantGuard } from '@/core/shared/application/guards/tenant.guard'

{
  path: '/dashboard',
  component: Dashboard,
  beforeEnter: [tenantGuard, authGuard]
}
```

### En Layouts

```typescript
import TenantLayout from '@/core/shared/presentation/layouts/TenantLayout.vue'

{
  path: '/app',
  component: TenantLayout,
  children: [...]
}
```
