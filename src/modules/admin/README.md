# Módulo Admin

## 📋 Descripción

El módulo **Admin** proporciona el panel de administración del sistema multi-tenant. Permite a los super administradores gestionar todos los tenants, ver estadísticas globales, configurar el sistema y monitorear la plataforma.

Este módulo opera en el contexto especial **admin** (accesible desde `admin.farmasys.com`) y tiene acceso a funcionalidades que trascienden los tenants individuales.

## 🏗️ Arquitectura

```
admin/
└── presentation/        # Capa de presentación
    └── pages/          # Páginas del panel admin
```

**Nota**: Este módulo actualmente solo contiene la capa de presentación. Las capas de dominio, aplicación e infraestructura están siendo desarrolladas y se agregarán en futuras iteraciones.

## 📁 Estructura Detallada

### Presentation Layer

#### **Pages** (`presentation/pages/`)

##### **`DashboardPage.vue`**

Página principal del dashboard de administración.

**Componentes Visuales:**

1. **Header**
   - Título: "Dashboard"
   - Saludo personalizado con nombre del admin
   - Información del usuario actual

2. **Stats Cards** (4 tarjetas de estadísticas)
   - **Total Tenants**:
     - Icono: Edificios
     - Color: Indigo
     - Muestra el número total de tenants en el sistema

   - **Tenants Activos**:
     - Icono: Check en círculo
     - Color: Verde
     - Muestra tenants con estado "active"

   - **En Trial**:
     - Icono: Reloj
     - Color: Amarillo
     - Muestra tenants en periodo de prueba

   - **Suspendidos**:
     - Icono: Advertencia
     - Color: Rojo
     - Muestra tenants suspendidos

3. **Quick Actions** (Acciones Rápidas)
   Grid de 6 acciones principales:
   - **Ver Tenants**
     - Ruta: `/admin/tenants`
     - Acción: Listar y gestionar todos los tenants
     - Icono: Edificios

   - **Nuevo Tenant**
     - Acción: Crear nuevo tenant
     - Modal/Página de creación
     - Icono: Plus

   - **Analytics**
     - Ruta: `/admin/analytics`
     - Acción: Ver reportes y métricas del sistema
     - Icono: Gráficos

   - **Configuración**
     - Ruta: `/admin/settings`
     - Acción: Ajustes globales del sistema
     - Icono: Engranaje

   - **Logs**
     - Ruta: `/admin/logs`
     - Acción: Ver actividad y logs del sistema
     - Icono: Documento

   - **Documentación**
     - Link: `/docs` (target blank)
     - Acción: Guías y recursos
     - Icono: Libro

4. **System Info** (Información del Sistema)
   Grid de información clave:
   - **Versión**: 1.0.0
   - **Ambiente**: Producción/Desarrollo
   - **Usuario Actual**: Email del admin
   - **Rol**: Badge con el rol (SUPER_ADMIN)

**State Management:**

```typescript
const stats = ref({
  totalTenants: 0,
  activeTenants: 0,
  trialTenants: 0,
  suspendedTenants: 0,
})
```

**Métodos:**

- `createTenant()`: Redirige a página de creación de tenant

**Composables Utilizados:**

- `useAuth()`: Para obtener información del usuario admin

**Características:**

- Diseño responsivo (grid adaptable)
- Cards interactivas con hover effects
- Iconos SVG inline
- Integración con router
- Estado computado para ambiente

## 🎯 Funcionalidades Previstas

Aunque no están implementadas en el código actual, estas son las funcionalidades que se planean desarrollar:

### Gestión de Tenants

- **Lista de Tenants**: Ver todos los tenants con filtros y búsqueda
- **Detalle de Tenant**: Información completa de un tenant específico
- **Crear Tenant**: Formulario para nuevo tenant (owner, plan, subdomain)
- **Editar Tenant**: Modificar información del tenant
- **Suspender/Activar**: Cambiar estado de tenants
- **Estadísticas por Tenant**: Métricas de uso individual

### Analytics y Reportes

- **Dashboard de Métricas**: KPIs del sistema
- **Gráficos de Crecimiento**: Evolución de tenants
- **Uso de Recursos**: Consumo por tenant
- **Reportes de Facturación**: Ingresos y planes
- **Métricas de Performance**: Tiempos de respuesta, errores

### Gestión de Planes

- **Planes Disponibles**: Lista de planes (Free, Standard, Premium, Enterprise)
- **Configurar Planes**: Límites, features, precios
- **Asignar Planes**: Cambiar plan de un tenant
- **Upgrades/Downgrades**: Historial de cambios

### Administración de Usuarios

- **Super Admins**: Gestión de administradores del sistema
- **Permisos**: Asignación de permisos granulares
- **Auditoría**: Registro de acciones de admins

### Configuración del Sistema

- **Variables Globales**: Configuración general
- **Integraciones**: APIs externas, webhooks
- **Notificaciones**: Emails, alertas
- **Seguridad**: Políticas, 2FA, IPs permitidas

### Logs y Monitoreo

- **Logs de Sistema**: Actividad general
- **Logs por Tenant**: Actividad específica
- **Errores**: Tracking de errores
- **Performance**: Métricas de rendimiento
- **Auditoría**: Registro de cambios críticos

### Facturación (futuro)

- **Invoices**: Facturas generadas
- **Pagos**: Historial de transacciones
- **Suscripciones**: Estado de suscripciones
- **Trial Extensions**: Extensiones de prueba

## 🔒 Seguridad y Acceso

### Contexto Admin

- Acceso solo desde subdomain `admin`
- Requiere autenticación especial
- Rol `SUPER_ADMIN` o `ADMIN` requerido
- No tiene tenant asociado (`isAdmin = true`)

### Guards de Protección

```typescript
// En router
{
  path: '/admin',
  beforeEnter: [
    tenantGuard,  // Valida contexto admin
    authGuard,    // Requiere autenticación
    roleGuard(['SUPER_ADMIN', 'ADMIN'])  // Requiere rol admin
  ]
}
```

### Permisos Requeridos

- `admin:view`: Ver panel admin
- `tenants:manage`: Gestionar tenants
- `system:configure`: Configurar sistema
- `users:manage`: Gestionar super admins
- `analytics:view`: Ver analytics

## 🎨 Diseño y UI

### Sistema de Diseño

- **Framework**: Tailwind CSS
- **Componentes**: Custom components
- **Iconos**: Heroicons (SVG inline)
- **Responsividad**: Mobile-first

### Paleta de Colores

- **Indigo**: Acciones principales, brand
- **Green**: Estados positivos (activo)
- **Yellow**: Estados de atención (trial)
- **Red**: Estados negativos (suspendido)
- **Purple**: Roles y permisos
- **Blue**: Información y logs
- **Gray**: Neutro, configuración

### Grid System

- **Stats Cards**: 1 col mobile, 2 cols tablet, 4 cols desktop
- **Quick Actions**: 1 col mobile, 2 cols tablet, 3 cols desktop
- **System Info**: 1 col mobile, 2 cols desktop

## 🔄 Flujo de Trabajo

### Acceso al Panel Admin

```
1. Usuario navega a admin.farmasys.com
2. tenantGuard detecta contexto admin
3. authGuard verifica autenticación
4. roleGuard verifica rol ADMIN/SUPER_ADMIN
5. Dashboard se carga
6. Stats se cargan desde API (futuro)
7. Se muestra información del sistema
```

### Creación de Tenant

```
1. Admin hace clic en "Nuevo Tenant"
2. Redirige a /admin/tenants/create
3. Formulario de creación:
   - Nombre del tenant
   - Subdomain (validación en tiempo real)
   - Plan seleccionado
   - Información del owner:
     * Email
     * Nombre
     * Contraseña temporal
4. Validación del formulario
5. Submit a API: POST /tenants
6. Creación de:
   - Tenant en BD central
   - Schema de BD específico
   - Usuario owner
   - Configuración inicial
7. Confirmación y redirección
```

### Gestión de Tenant Existente

```
1. Admin navega a /admin/tenants
2. Lista con filtros (estado, plan, búsqueda)
3. Click en tenant específico
4. Vista de detalle con tabs:
   - Información general
   - Usuarios del tenant
   - Estadísticas de uso
   - Configuración
   - Logs de actividad
5. Acciones disponibles:
   - Editar información
   - Cambiar plan
   - Suspender/Activar
   - Eliminar (con confirmación)
```

## 📊 Integraciones

### Con Módulo Tenant

- Usa `tenantAdminService` para operaciones CRUD
- Puede ver/editar cualquier tenant
- No está limitado por contexto de tenant

### Con Módulo Auth

- Autenticación contra endpoint `/admin/auth/login`
- Sesión independiente de tenants
- Permisos específicos de admin

### Con Backend

- **Endpoints Específicos**: `/admin/*`
- **Headers**: Sin `X-Tenant-Id` (contexto global)
- **Autorización**: Verifica rol admin en backend

## 🧪 Testing y Desarrollo

### Acceso en Desarrollo

```
URL: http://admin.localhost:5173
O configurar en .env:
VITE_ADMIN_SUBDOMAIN=admin
```

### Credenciales de Prueba

```typescript
{
  email: 'admin@farmasys.com',
  password: 'admin123',
  role: 'SUPER_ADMIN'
}
```

### Datos Mock

Para desarrollo, usar stats mockeados:

```typescript
const stats = ref({
  totalTenants: 42,
  activeTenants: 38,
  trialTenants: 3,
  suspendedTenants: 1,
})
```

## 📝 Variables de Entorno

```env
# Admin
VITE_ADMIN_SUBDOMAIN=admin

# API
VITE_API_BASE_URL=http://localhost:3000/api/v1

# Feature Flags (futuro)
VITE_ENABLE_BILLING=false
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_LOGS_VIEWER=true
```

## 🚀 Roadmap

### v1.1 - Gestión Básica

- [ ] Lista de tenants con paginación
- [ ] Detalle de tenant
- [ ] Crear tenant
- [ ] Editar tenant
- [ ] Suspender/Activar tenant

### v1.2 - Analytics

- [ ] Dashboard de métricas
- [ ] Gráficos de crecimiento
- [ ] Reportes exportables
- [ ] Estadísticas por tenant

### v1.3 - Configuración

- [ ] Gestión de planes
- [ ] Configuración global
- [ ] Gestión de super admins
- [ ] Permisos granulares

### v1.4 - Monitoreo

- [ ] Visor de logs
- [ ] Tracking de errores
- [ ] Métricas de performance
- [ ] Alertas y notificaciones

### v2.0 - Facturación

- [ ] Sistema de billing
- [ ] Invoices y pagos
- [ ] Gestión de suscripciones
- [ ] Integraciones de pago

## 📚 Referencias

- [Design System - Tailwind CSS](https://tailwindcss.com)
- [Heroicons](https://heroicons.com)
- [Admin Dashboard Best Practices](https://www.nngroup.com/articles/dashboard-design/)

## 🔗 Dependencias

- **Vue 3**: Framework de UI
- **Vue Router**: Navegación
- **Pinia**: Estado global
- **Tailwind CSS**: Estilos
- **@heroicons/vue**: Iconos
- **Módulo Auth**: Autenticación
- **Módulo Tenant**: Gestión de tenants (via services)

## 💡 Notas de Implementación

1. **Estado Temporal**: Actualmente las stats son estáticas (TODO: cargar desde API)
2. **Rutas Pendientes**: Muchas rutas (`/admin/tenants`, `/admin/analytics`, etc.) aún no están implementadas
3. **Servicios**: El `TenantAdminService` existe pero necesita integrarse
4. **Componentes**: Se pueden crear componentes reutilizables (StatCard, QuickActionCard, etc.)
5. **Tests**: Agregar tests unitarios y E2E para funcionalidades críticas

## 🎯 Mejores Prácticas

1. **Separación de Contextos**: Admin y Tenant son contextos independientes
2. **Validaciones**: Validar subdomain antes de crear tenant
3. **Confirmaciones**: Pedir confirmación en acciones destructivas (suspender, eliminar)
4. **Auditoría**: Registrar todas las acciones de admin
5. **Performance**: Paginar listas largas, lazy load de datos
6. **UX**: Feedback visual inmediato, loading states, error handling
