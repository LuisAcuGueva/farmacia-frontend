# Módulo Tenant (Multi-Tenancy)

## 📋 Descripción

El módulo **Tenant** es el núcleo del sistema multi-tenant de Farmasys. Gestiona la identificación, carga y administración de tenants (organizaciones individuales) que comparten la misma aplicación pero mantienen sus datos aislados.

Este módulo implementa el patrón de **subdominios** donde cada tenant tiene su propio subdominio (ej: `farmacia1.farmasys.com`) y sus propios esquemas de base de datos.

## 🏗️ Arquitectura

El módulo sigue **Clean Architecture** con las siguientes capas:

```
tenant/
├── application/          # Casos de uso y servicios de aplicación
├── domain/              # Entidades, interfaces y tipos del dominio
├── infrastructure/      # Implementaciones técnicas (repos, mappers, utils)
└── presentation/        # Componentes Vue, stores y composables
```

## 📁 Estructura Detallada

### 1️⃣ Application Layer

#### **Services**

- **`tenant-admin.service.ts`**: Servicio para operaciones administrativas de tenants
  - `listTenants()`: Lista todos los tenants con paginación
  - `getTenant(id)`: Obtiene un tenant por ID
  - `createTenant(data)`: Crea un nuevo tenant
  - `updateTenant(id, data)`: Actualiza información de un tenant
  - `suspendTenant(id, reason)`: Suspende un tenant
  - `activateTenant(id)`: Reactiva un tenant suspendido
  - `getStats()`: Obtiene estadísticas globales de tenants

#### **Use Cases**

- **`detect-tenant.use-case.ts`**: Caso de uso principal para detectar y cargar el tenant actual
  - Detecta el subdomain desde la URL
  - Valida si es contexto admin o tenant
  - Maneja subdomains reservados
  - Carga tenant desde caché o API
  - Valida el estado del tenant (activo, suspendido, cancelado)
  - Retorna información estructurada del resultado

### 2️⃣ Domain Layer

#### **Entities**

- **`tenant.entity.ts`**: Entidad de dominio principal
  - Propiedades: id, name, subdomain, schema, status, plan, features, branding, limits
  - Métodos de negocio:
    - `isActive`: Verifica si el tenant está activo
    - `isInTrial`: Verifica si está en periodo de prueba
    - `isTrialExpired`: Verifica si el trial expiró
    - `isSuspended`: Verifica si está suspendido
    - `hasFeature(feature)`: Verifica si tiene una característica específica
    - `getUrl(baseUrl)`: Construye la URL completa del tenant

#### **Interfaces**

- **`tenant.repository.ts`**: Contrato del repositorio de tenants
  - Define métodos para obtener, validar, listar, crear, actualizar tenants
  - Operaciones de suspensión y activación

- **`tenant.service.ts`**: Contrato del servicio de tenant
  - Define operaciones de negocio relacionadas con tenants
  - Verificación de features y límites
  - Obtención de estadísticas

#### **Types**

- **`tenant.types.ts`**: Definiciones de tipos TypeScript
  - `TenantStatus`: Enum de estados (active, suspended, trial, expired, cancelled)
  - `TenantPlan`: Enum de planes (free, standard, premium, enterprise)
  - `TenantFeatures`: Interface de características disponibles
  - `TenantBranding`: Interface de personalización visual
  - `TenantLimits`: Interface de límites por plan
  - `TenantMetadata`: Interface completa de metadata del tenant
  - `TenantContext`: Interface para contexto en el store
  - `TenantDetectionConfig`: Interface de configuración de detección

### 3️⃣ Infrastructure Layer

#### **Mappers**

- **`tenant.mapper.ts`**: Transforma datos entre API y dominio
  - `toDomain(apiData)`: Convierte respuesta de API a TenantMetadata
  - `toApi(tenant)`: Convierte TenantMetadata a formato de API
  - `mapFeatures(data)`: Mapea características del plan
  - `mapBranding(data)`: Mapea configuración de branding

#### **Repositories**

- **`tenant.repository.impl.ts`**: Implementación del repositorio
  - Realiza llamadas HTTP al backend
  - Maneja errores específicos (404, 460, 461)
  - Utiliza TenantMapper para transformaciones
  - Soporta operaciones CRUD completas

#### **Utils**

- **`subdomain-detector.ts`**: Utilidad para detectar el tenant desde el subdomain
  - Detecta subdomain en producción y desarrollo
  - Soporta `subdomain.localhost` para desarrollo local
  - Maneja subdomains reservados (admin, www, api, etc.)
  - Validación de formato de subdomain
  - Métodos para cambiar tenant en desarrollo

- **`tenant-cache.ts`**: Sistema de caché para metadata de tenants
  - Caché en memoria con TTL configurable (5 min default)
  - Persistencia en localStorage
  - Limpieza automática de entradas expiradas
  - Métodos: `set()`, `get()`, `has()`, `remove()`, `clear()`
  - Restauración desde localStorage
  - Estadísticas del caché

### 4️⃣ Presentation Layer

#### **Components**

- **`TenantDebugInfo.vue`**: Componente de debug para desarrollo
  - Muestra información del tenant actual
  - Visualiza features, límites y estado
  - Botones para recargar tenant y limpiar caché
  - Solo visible en modo desarrollo

- **`TenantLogo.vue`**: Componente para mostrar logo del tenant
  - Soporta imagen o iniciales como fallback
  - Tamaños configurables (sm, md, lg, xl)
  - Manejo de errores de carga de imagen
  - Usa branding del tenant actual

#### **Composables**

- **`useTenant.ts`**: Composable para acceder al tenant en componentes
  - Expone state reactivo del store
  - Proporciona acciones del store
  - Simplifica acceso a propiedades computadas
  - Uso: `const { tenant, isActive, features } = useTenant()`

#### **Pages**

- **`TenantListPage.vue`**: Página de administración de tenants
  - Lista todos los tenants con paginación
  - Filtros y búsqueda
  - Acciones CRUD sobre tenants

#### **Stores**

- **`tenant.store.ts`**: Store de Pinia para estado global del tenant
  - **State**:
    - `tenant`: Metadata del tenant actual
    - `isLoading`: Indica carga inicial
    - `isValidating`: Indica revalidación
    - `error`: Mensaje de error si existe
    - `lastUpdated`: Timestamp de última actualización
    - `isAdmin`: Indica si es contexto admin

  - **Getters**:
    - `tenantEntity`: Entidad de dominio del tenant
    - `isActive`, `isInTrial`, `isSuspended`: Estados del tenant
    - `subdomain`, `tenantId`: Identificadores
    - `branding`, `features`, `limits`, `plan`: Propiedades específicas
    - `context`: Contexto completo del tenant

  - **Actions**:
    - `initialize()`: Detecta e inicializa el tenant
    - `revalidate()`: Revalida el tenant actual
    - `hasFeature(feature)`: Verifica feature específica
    - `hasReachedLimit(limit, current)`: Verifica límites
    - `reset()`: Limpia el estado
    - `updateTenant(tenant)`: Actualiza el tenant
    - `switchDevTenant(subdomain)`: Cambia tenant en desarrollo

  - **Watchers**:
    - Aplica branding automáticamente cuando cambia el tenant
    - Actualiza CSS variables y favicon

## 🔄 Flujo de Trabajo

### Inicialización del Tenant

```
1. App inicia
2. Router guard (tenantGuard) ejecuta
3. tenantStore.initialize() se llama
4. detectTenantUseCase.execute() se ejecuta:
   ├─ subdomainDetector.detect() → Extrae subdomain de URL
   ├─ Verifica si es admin → Permite acceso sin tenant
   ├─ Valida subdomain (formato, reservados)
   ├─ Busca en tenantCache.get()
   ├─ Si no existe en caché:
   │  ├─ Intenta restaurar desde localStorage
   │  └─ Si no, llama a API: tenantRepository.getTenantBySubdomain()
   ├─ Valida estado del tenant (suspended, cancelled)
   └─ Retorna resultado
5. Store actualiza estado
6. Branding se aplica automáticamente
7. Navegación continúa
```

### Detección de Subdomain

**En Producción:**

- URL: `farmacia1.farmasys.com`
- Extrae: `farmacia1`

**En Desarrollo:**

- URL: `farmacia1.localhost:5173`
- Extrae: `farmacia1`
- Alternativa: localStorage `dev_tenant`

## 🔐 Validaciones y Seguridad

### Validación de Subdomain

- Formato: `/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/`
- Longitud: 3-63 caracteres
- Solo letras minúsculas, números y guiones
- No puede empezar/terminar con guión

### Subdomains Reservados

- `admin`: Panel de administración
- `www`, `api`, `app`: Servicios del sistema
- `static`, `cdn`: Recursos estáticos

### Estados del Tenant

- **active**: Operativo normal
- **trial**: Periodo de prueba activo
- **suspended**: Suspendido temporalmente (acceso bloqueado)
- **expired**: Trial expirado
- **cancelled**: Cuenta cancelada permanentemente

## 🎨 Branding Personalizado

Cada tenant puede personalizar:

- **Colores primario y secundario**: Se aplican como CSS variables
- **Logo**: Imagen personalizada
- **Favicon**: Icono del navegador
- **Nombre de compañía**: Título del sitio
- **Tagline**: Eslogan

## 📊 Features por Plan

### Free

- 2 usuarios, 1 sucursal, 100 productos
- Sin reportes, sin API

### Standard

- 10 usuarios, 3 sucursales, 1000 productos
- Reportes básicos, múltiples ubicaciones

### Premium

- 50 usuarios, 10 sucursales, 10000 productos
- API access, branding personalizado

### Enterprise

- Ilimitado
- Soporte prioritario

## 🛠️ Uso

### En Router Guard

```typescript
import { tenantGuard } from '@/core/shared/application/guards/tenant.guard'

{
  path: '/dashboard',
  component: Dashboard,
  beforeEnter: tenantGuard
}
```

### En Componentes

```typescript
import { useTenant } from '@tenant/presentation/composables/useTenant'

const { tenant, isActive, features, branding, hasFeature } = useTenant()

// Verificar feature
if (hasFeature('reports')) {
  // Mostrar reportes
}
```

### En HTTP Interceptor

```typescript
// Automático: tenant-http.interceptor.ts
// Agrega headers:
// - X-Tenant-Subdomain
// - X-Tenant-Id
// - X-Tenant-Schema
```

## 🧪 Testing

### Cambiar Tenant en Desarrollo

```typescript
const { switchDevTenant } = useTenant()
switchDevTenant('farmacia2')
```

### Limpiar Caché

```typescript
import { tenantCache } from '@tenant/infrastructure/utils/tenant-cache'
tenantCache.clear()
```

## 📝 Variables de Entorno

```env
VITE_TENANT_MODE=subdomain
VITE_DEFAULT_TENANT=demo
VITE_ADMIN_SUBDOMAIN=admin
VITE_RESERVED_SUBDOMAINS=admin,www,api,app
VITE_ENABLE_TENANT_CACHE=true
VITE_TENANT_CACHE_TTL=300000
VITE_SHOW_TENANT_INFO=true
```

## 🔗 Dependencias

- **Pinia**: Estado global
- **Vue Router**: Guards de navegación
- **Axios**: Comunicación con API
- **LocalStorage**: Persistencia de caché

## 📚 Referencias

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Multi-Tenancy Patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/multi-tenancy)
