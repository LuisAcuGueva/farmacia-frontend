# 🏥 Sistema de Farmacia Frontend - Roadmap de Desarrollo

## 📋 Índice

1. [Visión General](#visión-general)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Estructura de Directorios](#estructura-de-directorios)
4. [Módulos del Sistema](#módulos-del-sistema)
5. [Roadmap de Implementación](#roadmap-de-implementación)
6. [Guía de Desarrollo](#guía-de-desarrollo)
7. [Estándares y Convenciones](#estándares-y-convenciones)

---

## 🎯 Visión General

Sistema frontend para gestión de farmacia multisucursal construido con **Vue 3**, **TypeScript**, **Pinia** y **Clean Architecture**.

### Stack Tecnológico

- **Framework**: Vue 3 (Composition API + `<script setup>`)
- **Lenguaje**: TypeScript
- **Estado Global**: Pinia
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **UI Framework**: Tailwind CSS
- **Testing**: Vitest + Playwright
- **Build Tool**: Vite

### Características Principales

- ✅ Multisucursal
- ✅ Gestión de inventario
- ✅ Ventas y facturación
- ✅ Control de usuarios y roles
- ✅ Reportes y analytics
- ✅ Gestión de proveedores
- ✅ Control de medicamentos controlados
- ✅ Sistema de alertas (vencimientos, stock bajo)

---

## 🏗️ Arquitectura del Proyecto

### Clean Architecture + Feature-based Structure

```
┌─────────────────────────────────────────────────┐
│              Presentation Layer                 │
│  (Components, Pages, Composables, Stores)       │
├─────────────────────────────────────────────────┤
│              Application Layer                  │
│     (Use Cases, Services, DTOs)                 │
├─────────────────────────────────────────────────┤
│              Domain Layer                       │
│  (Entities, Interfaces, Business Logic)         │
├─────────────────────────────────────────────────┤
│            Infrastructure Layer                 │
│  (HTTP, Storage, External Services)             │
└─────────────────────────────────────────────────┘
```

### Principios Aplicados

1. **Separation of Concerns**: Cada capa tiene responsabilidades claras
2. **Dependency Inversion**: Las capas superiores no dependen de las inferiores
3. **Single Responsibility**: Un módulo, una razón para cambiar
4. **Feature-First**: Organización por funcionalidad de negocio
5. **Composition over Inheritance**: Usar composables de Vue 3

---

## 📁 Estructura de Directorios

```
src/
├── assets/                      # Recursos estáticos
│   ├── images/
│   ├── icons/
│   └── styles/
│       ├── main.css            # Estilos globales + Tailwind
│       └── variables.css       # Variables CSS
│
├── core/                       # Núcleo de la aplicación (Shared)
│   ├── config/                 # Configuración global
│   │   ├── api.config.ts
│   │   ├── app.config.ts
│   │   └── constants.ts
│   │
│   ├── infrastructure/         # Capa de infraestructura compartida
│   │   ├── http/
│   │   │   ├── http-client.ts
│   │   │   ├── interceptors.ts
│   │   │   └── api-error.ts
│   │   ├── storage/
│   │   │   ├── local-storage.service.ts
│   │   │   └── session-storage.service.ts
│   │   └── websocket/
│   │       └── websocket.service.ts
│   │
│   ├── domain/                 # Modelos de dominio compartidos
│   │   ├── entities/
│   │   │   └── base.entity.ts
│   │   ├── value-objects/
│   │   └── interfaces/
│   │       ├── repository.interface.ts
│   │       └── use-case.interface.ts
│   │
│   ├── application/            # Servicios compartidos
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── role.guard.ts
│   │   └── validators/
│   │       └── form.validators.ts
│   │
│   └── presentation/           # Componentes compartidos
│       ├── components/
│       │   ├── ui/             # Componentes UI reutilizables
│       │   │   ├── buttons/
│       │   │   ├── forms/
│       │   │   ├── modals/
│       │   │   ├── tables/
│       │   │   ├── cards/
│       │   │   ├── alerts/
│       │   │   └── loaders/
│       │   └── layout/         # Componentes de layout
│       │       ├── AppHeader.vue
│       │       ├── AppSidebar.vue
│       │       ├── AppFooter.vue
│       │       └── AppLayout.vue
│       ├── composables/        # Composables compartidos
│       │   ├── useNotification.ts
│       │   ├── useModal.ts
│       │   ├── useLoading.ts
│       │   ├── usePermission.ts
│       │   └── usePagination.ts
│       └── directives/         # Directivas personalizadas
│           ├── v-permission.ts
│           └── v-loading.ts
│
├── modules/                    # Módulos de negocio (Feature Modules)
│   │
│   ├── auth/                   # Módulo de Autenticación
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   ├── interfaces/
│   │   │   │   ├── auth.repository.ts
│   │   │   │   └── auth.service.ts
│   │   │   └── dtos/
│   │   │       ├── login.dto.ts
│   │   │       └── user-response.dto.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── login.use-case.ts
│   │   │   │   ├── logout.use-case.ts
│   │   │   │   ├── refresh-token.use-case.ts
│   │   │   │   └── verify-session.use-case.ts
│   │   │   └── services/
│   │   │       └── auth.service.ts
│   │   ├── infrastructure/
│   │   │   ├── repositories/
│   │   │   │   └── auth.repository.impl.ts
│   │   │   └── mappers/
│   │   │       └── user.mapper.ts
│   │   └── presentation/
│   │       ├── pages/
│   │       │   ├── LoginPage.vue
│   │       │   ├── RegisterPage.vue
│   │       │   └── RecoverPasswordPage.vue
│   │       ├── components/
│   │       │   ├── LoginForm.vue
│   │       │   └── PasswordStrength.vue
│   │       ├── composables/
│   │       │   └── useAuth.ts
│   │       ├── stores/
│   │       │   └── auth.store.ts
│   │       └── router/
│   │           └── auth.routes.ts
│   │
│   ├── dashboard/              # Módulo Dashboard
│   │   ├── domain/
│   │   │   └── interfaces/
│   │   │       └── dashboard.service.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── get-sales-metrics.use-case.ts
│   │   │   │   └── get-inventory-alerts.use-case.ts
│   │   │   └── services/
│   │   │       └── dashboard.service.ts
│   │   ├── infrastructure/
│   │   │   └── repositories/
│   │   │       └── dashboard.repository.impl.ts
│   │   └── presentation/
│   │       ├── pages/
│   │       │   └── DashboardPage.vue
│   │       ├── components/
│   │       │   ├── SalesChart.vue
│   │       │   ├── InventoryAlerts.vue
│   │       │   ├── QuickStats.vue
│   │       │   └── RecentSales.vue
│   │       ├── composables/
│   │       │   └── useDashboard.ts
│   │       ├── stores/
│   │       │   └── dashboard.store.ts
│   │       └── router/
│   │           └── dashboard.routes.ts
│   │
│   ├── products/               # Módulo Productos/Medicamentos
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── product.entity.ts
│   │   │   │   ├── category.entity.ts
│   │   │   │   └── laboratory.entity.ts
│   │   │   ├── interfaces/
│   │   │   │   └── product.repository.ts
│   │   │   └── enums/
│   │   │       ├── product-type.enum.ts
│   │   │       └── prescription-type.enum.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── create-product.use-case.ts
│   │   │   │   ├── update-product.use-case.ts
│   │   │   │   ├── delete-product.use-case.ts
│   │   │   │   ├── get-product-list.use-case.ts
│   │   │   │   ├── search-products.use-case.ts
│   │   │   │   └── check-stock.use-case.ts
│   │   │   └── services/
│   │   │       └── product.service.ts
│   │   ├── infrastructure/
│   │   │   ├── repositories/
│   │   │   │   └── product.repository.impl.ts
│   │   │   └── mappers/
│   │   │       └── product.mapper.ts
│   │   └── presentation/
│   │       ├── pages/
│   │       │   ├── ProductListPage.vue
│   │       │   ├── ProductDetailPage.vue
│   │       │   ├── ProductCreatePage.vue
│   │       │   └── ProductEditPage.vue
│   │       ├── components/
│   │       │   ├── ProductTable.vue
│   │       │   ├── ProductForm.vue
│   │       │   ├── ProductCard.vue
│   │       │   ├── ProductFilters.vue
│   │       │   ├── ProductSearch.vue
│   │       │   └── StockBadge.vue
│   │       ├── composables/
│   │       │   ├── useProduct.ts
│   │       │   └── useProductFilters.ts
│   │       ├── stores/
│   │       │   └── product.store.ts
│   │       └── router/
│   │           └── product.routes.ts
│   │
│   ├── inventory/              # Módulo Inventario
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── stock.entity.ts
│   │   │   │   ├── batch.entity.ts
│   │   │   │   └── stock-movement.entity.ts
│   │   │   ├── interfaces/
│   │   │   │   └── inventory.repository.ts
│   │   │   └── enums/
│   │   │       └── movement-type.enum.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── adjust-stock.use-case.ts
│   │   │   │   ├── transfer-stock.use-case.ts
│   │   │   │   ├── register-entry.use-case.ts
│   │   │   │   ├── register-output.use-case.ts
│   │   │   │   ├── get-expiring-products.use-case.ts
│   │   │   │   └── get-low-stock-products.use-case.ts
│   │   │   └── services/
│   │   │       └── inventory.service.ts
│   │   ├── infrastructure/
│   │   │   └── repositories/
│   │   │       └── inventory.repository.impl.ts
│   │   └── presentation/
│   │       ├── pages/
│   │       │   ├── InventoryPage.vue
│   │       │   ├── StockMovementsPage.vue
│   │       │   ├── StockAdjustmentPage.vue
│   │       │   ├── StockTransferPage.vue
│   │       │   └── ExpirationControlPage.vue
│   │       ├── components/
│   │       │   ├── StockTable.vue
│   │       │   ├── MovementHistory.vue
│   │       │   ├── ExpirationAlert.vue
│   │       │   ├── StockTransferForm.vue
│   │       │   └── BatchInfo.vue
│   │       ├── composables/
│   │       │   └── useInventory.ts
│   │       ├── stores/
│   │       │   └── inventory.store.ts
│   │       └── router/
│   │           └── inventory.routes.ts
│   │
│   ├── sales/                  # Módulo Ventas
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── sale.entity.ts
│   │   │   │   ├── sale-item.entity.ts
│   │   │   │   ├── payment.entity.ts
│   │   │   │   └── invoice.entity.ts
│   │   │   ├── interfaces/
│   │   │   │   └── sales.repository.ts
│   │   │   └── enums/
│   │   │       ├── payment-method.enum.ts
│   │   │       └── sale-status.enum.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── create-sale.use-case.ts
│   │   │   │   ├── cancel-sale.use-case.ts
│   │   │   │   ├── process-payment.use-case.ts
│   │   │   │   ├── generate-invoice.use-case.ts
│   │   │   │   └── get-sales-history.use-case.ts
│   │   │   └── services/
│   │   │       └── sales.service.ts
│   │   ├── infrastructure/
│   │   │   └── repositories/
│   │   │       └── sales.repository.impl.ts
│   │   └── presentation/
│   │       ├── pages/
│   │       │   ├── POSPage.vue              # Punto de Venta
│   │       │   ├── SalesHistoryPage.vue
│   │       │   └── SaleDetailPage.vue
│   │       ├── components/
│   │       │   ├── POSCart.vue
│   │       │   ├── POSProductSearch.vue
│   │       │   ├── POSPaymentModal.vue
│   │       │   ├── SalesTable.vue
│   │       │   ├── InvoicePreview.vue
│   │       │   └── CustomerSearch.vue
│   │       ├── composables/
│   │       │   ├── usePOS.ts
│   │       │   └── useSales.ts
│   │       ├── stores/
│   │       │   ├── pos.store.ts
│   │       │   └── sales.store.ts
│   │       └── router/
│   │           └── sales.routes.ts
│   │
│   ├── customers/              # Módulo Clientes
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── customer.entity.ts
│   │   │   └── interfaces/
│   │   │       └── customer.repository.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── create-customer.use-case.ts
│   │   │   │   ├── update-customer.use-case.ts
│   │   │   │   ├── get-customer-history.use-case.ts
│   │   │   │   └── search-customers.use-case.ts
│   │   │   └── services/
│   │   │       └── customer.service.ts
│   │   ├── infrastructure/
│   │   │   └── repositories/
│   │   │       └── customer.repository.impl.ts
│   │   └── presentation/
│   │       ├── pages/
│   │       │   ├── CustomerListPage.vue
│   │       │   ├── CustomerDetailPage.vue
│   │       │   └── CustomerFormPage.vue
│   │       ├── components/
│   │       │   ├── CustomerTable.vue
│   │       │   ├── CustomerForm.vue
│   │       │   └── CustomerPurchaseHistory.vue
│   │       ├── composables/
│   │       │   └── useCustomer.ts
│   │       ├── stores/
│   │       │   └── customer.store.ts
│   │       └── router/
│   │           └── customer.routes.ts
│   │
│   ├── suppliers/              # Módulo Proveedores
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── supplier.entity.ts
│   │   │   │   └── purchase-order.entity.ts
│   │   │   └── interfaces/
│   │   │       └── supplier.repository.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── create-supplier.use-case.ts
│   │   │   │   ├── create-purchase-order.use-case.ts
│   │   │   │   └── receive-purchase-order.use-case.ts
│   │   │   └── services/
│   │   │       └── supplier.service.ts
│   │   ├── infrastructure/
│   │   │   └── repositories/
│   │   │       └── supplier.repository.impl.ts
│   │   └── presentation/
│   │       ├── pages/
│   │       │   ├── SupplierListPage.vue
│   │       │   ├── SupplierDetailPage.vue
│   │       │   ├── PurchaseOrderPage.vue
│   │       │   └── ReceivePurchasePage.vue
│   │       ├── components/
│   │       │   ├── SupplierTable.vue
│   │       │   ├── SupplierForm.vue
│   │       │   ├── PurchaseOrderForm.vue
│   │       │   └── PurchaseOrderList.vue
│   │       ├── composables/
│   │       │   └── useSupplier.ts
│   │       ├── stores/
│   │       │   └── supplier.store.ts
│   │       └── router/
│   │           └── supplier.routes.ts
│   │
│   ├── branches/               # Módulo Sucursales
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── branch.entity.ts
│   │   │   └── interfaces/
│   │   │       └── branch.repository.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── create-branch.use-case.ts
│   │   │   │   ├── update-branch.use-case.ts
│   │   │   │   ├── get-branch-stats.use-case.ts
│   │   │   │   └── switch-branch.use-case.ts
│   │   │   └── services/
│   │   │       └── branch.service.ts
│   │   ├── infrastructure/
│   │   │   └── repositories/
│   │   │       └── branch.repository.impl.ts
│   │   └── presentation/
│   │       ├── pages/
│   │       │   ├── BranchListPage.vue
│   │       │   ├── BranchDetailPage.vue
│   │       │   └── BranchFormPage.vue
│   │       ├── components/
│   │       │   ├── BranchSelector.vue
│   │       │   ├── BranchCard.vue
│   │       │   ├── BranchForm.vue
│   │       │   └── BranchStats.vue
│   │       ├── composables/
│   │       │   └── useBranch.ts
│   │       ├── stores/
│   │       │   └── branch.store.ts
│   │       └── router/
│   │           └── branch.routes.ts
│   │
│   ├── users/                  # Módulo Usuarios y Roles
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── user.entity.ts
│   │   │   │   ├── role.entity.ts
│   │   │   │   └── permission.entity.ts
│   │   │   └── interfaces/
│   │   │       └── user.repository.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── create-user.use-case.ts
│   │   │   │   ├── update-user.use-case.ts
│   │   │   │   ├── assign-role.use-case.ts
│   │   │   │   └── manage-permissions.use-case.ts
│   │   │   └── services/
│   │   │       └── user.service.ts
│   │   ├── infrastructure/
│   │   │   └── repositories/
│   │   │       └── user.repository.impl.ts
│   │   └── presentation/
│   │       ├── pages/
│   │       │   ├── UserListPage.vue
│   │       │   ├── UserFormPage.vue
│   │       │   ├── RoleListPage.vue
│   │       │   └── RoleFormPage.vue
│   │       ├── components/
│   │       │   ├── UserTable.vue
│   │       │   ├── UserForm.vue
│   │       │   ├── RoleForm.vue
│   │       │   └── PermissionMatrix.vue
│   │       ├── composables/
│   │       │   └── useUser.ts
│   │       ├── stores/
│   │       │   └── user.store.ts
│   │       └── router/
│   │           └── user.routes.ts
│   │
│   └── reports/                # Módulo Reportes
│       ├── domain/
│       │   ├── entities/
│       │   │   └── report.entity.ts
│       │   └── interfaces/
│       │       └── report.repository.ts
│       ├── application/
│       │   ├── use-cases/
│       │   │   ├── generate-sales-report.use-case.ts
│       │   │   ├── generate-inventory-report.use-case.ts
│       │   │   ├── generate-financial-report.use-case.ts
│       │   │   └── export-report.use-case.ts
│       │   └── services/
│       │       └── report.service.ts
│       ├── infrastructure/
│       │   └── repositories/
│       │       └── report.repository.impl.ts
│       └── presentation/
│           ├── pages/
│           │   ├── ReportsPage.vue
│           │   ├── SalesReportPage.vue
│           │   ├── InventoryReportPage.vue
│           │   └── FinancialReportPage.vue
│           ├── components/
│           │   ├── ReportFilters.vue
│           │   ├── ReportChart.vue
│           │   ├── ReportTable.vue
│           │   └── ExportButtons.vue
│           ├── composables/
│           │   └── useReport.ts
│           ├── stores/
│           │   └── report.store.ts
│           └── router/
│               └── report.routes.ts
│
├── router/                     # Router principal
│   ├── index.ts               # Configuración principal
│   ├── guards.ts              # Guards globales
│   └── routes.ts              # Registro de rutas
│
├── stores/                     # Stores globales de Pinia
│   └── app.store.ts           # Estado global de la app
│
├── types/                      # Tipos TypeScript globales
│   ├── api.types.ts
│   ├── common.types.ts
│   └── env.d.ts
│
├── utils/                      # Utilidades compartidas
│   ├── formatters/
│   │   ├── date.formatter.ts
│   │   ├── currency.formatter.ts
│   │   └── number.formatter.ts
│   ├── validators/
│   │   └── validation.utils.ts
│   └── helpers/
│       ├── array.helper.ts
│       ├── object.helper.ts
│       └── string.helper.ts
│
├── App.vue                     # Componente raíz
└── main.ts                     # Punto de entrada
```

---

## 📦 Módulos del Sistema

### 1. **Auth** (Autenticación y Autorización)

**Prioridad**: ⭐⭐⭐⭐⭐ CRÍTICO

- Login/Logout
- Gestión de tokens (JWT)
- Refresh token automático
- Control de sesiones
- Recuperación de contraseña

### 2. **Dashboard** (Panel Principal)

**Prioridad**: ⭐⭐⭐⭐⭐ CRÍTICO

- Métricas de ventas
- Alertas de inventario
- Gráficos de rendimiento
- Accesos rápidos
- Resumen de actividades

### 3. **Products** (Productos/Medicamentos)

**Prioridad**: ⭐⭐⭐⭐⭐ CRÍTICO

- CRUD de productos
- Categorización
- Búsqueda avanzada
- Control de precios
- Productos controlados

### 4. **Inventory** (Inventario)

**Prioridad**: ⭐⭐⭐⭐⭐ CRÍTICO

- Control de stock por sucursal
- Movimientos de inventario
- Transferencias entre sucursales
- Alertas de vencimiento
- Alertas de stock bajo
- Gestión de lotes

### 5. **Sales** (Ventas)

**Prioridad**: ⭐⭐⭐⭐⭐ CRÍTICO

- Punto de Venta (POS)
- Procesamiento de ventas
- Facturación
- Métodos de pago
- Historial de ventas
- Devoluciones

### 6. **Customers** (Clientes)

**Prioridad**: ⭐⭐⭐⭐ ALTA

- Registro de clientes
- Historial de compras
- Búsqueda de clientes
- Perfiles de cliente

### 7. **Suppliers** (Proveedores)

**Prioridad**: ⭐⭐⭐⭐ ALTA

- Gestión de proveedores
- Órdenes de compra
- Recepción de mercancía
- Historial de compras

### 8. **Branches** (Sucursales)

**Prioridad**: ⭐⭐⭐⭐⭐ CRÍTICO

- Gestión de sucursales
- Selector de sucursal activa
- Configuración por sucursal
- Estadísticas por sucursal

### 9. **Users** (Usuarios y Roles)

**Prioridad**: ⭐⭐⭐⭐ ALTA

- Gestión de usuarios
- Roles y permisos
- Asignación de sucursales
- Control de accesos

### 10. **Reports** (Reportes)

**Prioridad**: ⭐⭐⭐ MEDIA

- Reportes de ventas
- Reportes de inventario
- Reportes financieros
- Exportación (PDF, Excel)

---

## 🗓️ Roadmap de Implementación

### **FASE 1: Fundamentos y Core** (Semanas 1-2)

#### Sprint 1.1: Setup y Configuración Inicial

- [ ] Configurar estructura de directorios
- [ ] Setup de Tailwind CSS
- [ ] Configurar aliases de TypeScript
- [ ] Setup de variables de entorno
- [ ] Configurar HTTP client (Axios)
- [ ] Implementar interceptores HTTP
- [ ] Manejo de errores global
- [ ] Setup de testing (Vitest + Playwright)

#### Sprint 1.2: Componentes Core UI

- [ ] Sistema de diseño base (colores, tipografía, espaciado)
- [ ] Componentes de botones
- [ ] Componentes de formularios (inputs, selects, checkboxes, etc.)
- [ ] Componentes de tablas
- [ ] Componentes de modales
- [ ] Componentes de alertas/notificaciones
- [ ] Componentes de loading/spinners
- [ ] Componentes de cards

#### Sprint 1.3: Layout y Navegación

- [ ] Layout principal (AppLayout)
- [ ] Header con navegación
- [ ] Sidebar con menú
- [ ] Footer
- [ ] Breadcrumbs
- [ ] Sistema de permisos en UI
- [ ] Responsive design base

### **FASE 2: Autenticación y Autorización** (Semana 3)

#### Sprint 2.1: Auth Module

- [ ] Crear estructura del módulo auth
- [ ] Implementar entities y DTOs
- [ ] Crear repository de auth
- [ ] Implementar use cases (login, logout, refresh)
- [ ] Crear store de auth (Pinia)
- [ ] Composable useAuth
- [ ] Guards de autenticación
- [ ] Middleware de autorización

#### Sprint 2.2: Auth UI

- [ ] Página de login
- [ ] Formulario de login
- [ ] Validaciones de formulario
- [ ] Manejo de errores de login
- [ ] Recuperación de contraseña
- [ ] Integración con backend
- [ ] Testing de auth

### **FASE 3: Dashboard y Sucursales** (Semana 4)

#### Sprint 3.1: Branches Module

- [ ] Crear estructura del módulo branches
- [ ] Implementar entities y repositories
- [ ] Crear use cases de sucursales
- [ ] Store de sucursales
- [ ] Composable useBranch
- [ ] Selector de sucursal en header
- [ ] Persistencia de sucursal activa
- [ ] Integración con backend

#### Sprint 3.2: Dashboard Module

- [ ] Crear estructura del módulo dashboard
- [ ] Implementar use cases de métricas
- [ ] Store de dashboard
- [ ] Página principal de dashboard
- [ ] Componente de estadísticas rápidas
- [ ] Gráficos de ventas (Chart.js o similar)
- [ ] Alertas de inventario
- [ ] Últimas ventas
- [ ] Integración con backend

### **FASE 4: Productos e Inventario** (Semanas 5-6)

#### Sprint 4.1: Products Module - Core

- [ ] Crear estructura del módulo products
- [ ] Implementar entities (Product, Category, Laboratory)
- [ ] Crear repositories e interfaces
- [ ] Implementar use cases CRUD
- [ ] Store de productos
- [ ] Composable useProduct
- [ ] Mappers de datos

#### Sprint 4.2: Products Module - UI

- [ ] Página de listado de productos
- [ ] Tabla de productos con filtros
- [ ] Búsqueda de productos
- [ ] Formulario de creación de producto
- [ ] Formulario de edición de producto
- [ ] Página de detalle de producto
- [ ] Validaciones de formulario
- [ ] Testing

#### Sprint 4.3: Inventory Module - Core

- [ ] Crear estructura del módulo inventory
- [ ] Implementar entities (Stock, Batch, Movement)
- [ ] Crear repositories
- [ ] Implementar use cases de movimientos
- [ ] Store de inventario
- [ ] Composable useInventory

#### Sprint 4.4: Inventory Module - UI

- [ ] Página de control de inventario
- [ ] Tabla de stock por producto
- [ ] Formulario de ajuste de stock
- [ ] Formulario de transferencia entre sucursales
- [ ] Página de control de vencimientos
- [ ] Alertas de stock bajo
- [ ] Historial de movimientos
- [ ] Testing

### **FASE 5: Punto de Venta y Ventas** (Semanas 7-8)

#### Sprint 5.1: Sales Module - Core

- [ ] Crear estructura del módulo sales
- [ ] Implementar entities (Sale, SaleItem, Payment, Invoice)
- [ ] Crear repositories
- [ ] Implementar use cases de ventas
- [ ] Store de ventas
- [ ] Store de POS (carrito)
- [ ] Composables useSales y usePOS

#### Sprint 5.2: POS (Punto de Venta)

- [ ] Diseño de interfaz POS
- [ ] Búsqueda rápida de productos
- [ ] Carrito de compra
- [ ] Cálculo de totales
- [ ] Modal de pago
- [ ] Métodos de pago múltiples
- [ ] Generación de factura
- [ ] Impresión de ticket
- [ ] Testing POS

#### Sprint 5.3: Sales Management UI

- [ ] Página de historial de ventas
- [ ] Tabla de ventas con filtros
- [ ] Página de detalle de venta
- [ ] Preview de factura
- [ ] Reimpresión de facturas
- [ ] Gestión de devoluciones
- [ ] Testing

### **FASE 6: Clientes y Proveedores** (Semana 9)

#### Sprint 6.1: Customers Module

- [ ] Crear estructura del módulo customers
- [ ] Implementar entities y repositories
- [ ] Crear use cases
- [ ] Store de clientes
- [ ] Composable useCustomer
- [ ] Página de listado de clientes
- [ ] Formulario de cliente
- [ ] Búsqueda de clientes
- [ ] Historial de compras del cliente
- [ ] Integración con ventas

#### Sprint 6.2: Suppliers Module

- [ ] Crear estructura del módulo suppliers
- [ ] Implementar entities (Supplier, PurchaseOrder)
- [ ] Crear repositories y use cases
- [ ] Store de proveedores
- [ ] Composable useSupplier
- [ ] Página de gestión de proveedores
- [ ] Formulario de orden de compra
- [ ] Recepción de mercancía
- [ ] Integración con inventario

### **FASE 7: Usuarios y Roles** (Semana 10)

#### Sprint 7.1: Users Module

- [ ] Crear estructura del módulo users
- [ ] Implementar entities (User, Role, Permission)
- [ ] Crear repositories y use cases
- [ ] Store de usuarios
- [ ] Composable useUser
- [ ] Página de gestión de usuarios
- [ ] Formulario de usuario
- [ ] Asignación de roles
- [ ] Asignación de sucursales

#### Sprint 7.2: Roles y Permisos

- [ ] Página de gestión de roles
- [ ] Formulario de roles
- [ ] Matriz de permisos
- [ ] Directiva v-permission
- [ ] Guards basados en roles
- [ ] Testing de autorización

### **FASE 8: Reportes y Analytics** (Semana 11)

#### Sprint 8.1: Reports Module

- [ ] Crear estructura del módulo reports
- [ ] Implementar use cases de reportes
- [ ] Store de reportes
- [ ] Composable useReport
- [ ] Página principal de reportes
- [ ] Filtros de reportes

#### Sprint 8.2: Report Types

- [ ] Reporte de ventas por período
- [ ] Reporte de inventario
- [ ] Reporte financiero
- [ ] Reporte por sucursal
- [ ] Reporte por producto
- [ ] Exportación a PDF
- [ ] Exportación a Excel
- [ ] Gráficos y visualizaciones

### **FASE 9: Optimización y Testing** (Semana 12)

#### Sprint 9.1: Performance

- [ ] Lazy loading de módulos
- [ ] Code splitting
- [ ] Optimización de imágenes
- [ ] Caching de datos
- [ ] Optimización de queries
- [ ] Performance profiling

#### Sprint 9.2: Testing Completo

- [ ] Unit tests de use cases
- [ ] Unit tests de stores
- [ ] Unit tests de composables
- [ ] Integration tests
- [ ] E2E tests críticos (POS, Login, Ventas)
- [ ] Coverage report

#### Sprint 9.3: Documentation

- [ ] Documentar componentes (Storybook opcional)
- [ ] Documentar API usage
- [ ] Guía de desarrollo
- [ ] README actualizado
- [ ] Changelog

### **FASE 10: Deployment y Producción** (Semana 13)

#### Sprint 10.1: Preparación

- [ ] Configuración de producción
- [ ] Variables de entorno para producción
- [ ] Build optimization
- [ ] Error tracking (Sentry)
- [ ] Analytics (opcional)

#### Sprint 10.2: Deployment

- [ ] Setup de CI/CD
- [ ] Deploy a staging
- [ ] Testing en staging
- [ ] Deploy a producción
- [ ] Monitoring y logs
- [ ] Documentación de deployment

---

## 📝 Guía de Desarrollo

### Workflow de Desarrollo

#### 1. **Crear un Nuevo Módulo**

```bash
# Estructura básica
modules/
└── [module-name]/
    ├── domain/           # Lógica de negocio
    ├── application/      # Use cases y servicios
    ├── infrastructure/   # Implementaciones
    └── presentation/     # UI Components
```

**Pasos**:

1. Definir entities en `domain/entities/`
2. Definir interfaces en `domain/interfaces/`
3. Crear use cases en `application/use-cases/`
4. Implementar repositories en `infrastructure/repositories/`
5. Crear store en `presentation/stores/`
6. Crear composable en `presentation/composables/`
7. Crear componentes UI en `presentation/components/`
8. Crear páginas en `presentation/pages/`
9. Definir rutas en `presentation/router/`
10. Registrar rutas en el router principal

#### 2. **Crear una Entity**

```typescript
// modules/products/domain/entities/product.entity.ts
export interface ProductEntity {
  id: string
  code: string
  name: string
  description: string
  category: CategoryEntity
  laboratory: LaboratoryEntity
  price: number
  requiresPrescription: boolean
  isControlled: boolean
  createdAt: Date
  updatedAt: Date
}
```

#### 3. **Crear un Use Case**

```typescript
// modules/products/application/use-cases/create-product.use-case.ts
import type { ProductEntity } from '@/modules/products/domain/entities/product.entity'
import type { ProductRepository } from '@/modules/products/domain/interfaces/product.repository'
import type { CreateProductDTO } from '@/modules/products/domain/dtos/create-product.dto'

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(dto: CreateProductDTO): Promise<ProductEntity> {
    // Validaciones de negocio
    if (dto.price <= 0) {
      throw new Error('El precio debe ser mayor a 0')
    }

    // Llamar al repository
    return await this.productRepository.create(dto)
  }
}
```

#### 4. **Crear un Repository**

```typescript
// modules/products/infrastructure/repositories/product.repository.impl.ts
import type { ProductRepository } from '@/modules/products/domain/interfaces/product.repository'
import type { ProductEntity } from '@/modules/products/domain/entities/product.entity'
import { httpClient } from '@/core/infrastructure/http/http-client'

export class ProductRepositoryImpl implements ProductRepository {
  private readonly baseUrl = '/api/products'

  async create(data: CreateProductDTO): Promise<ProductEntity> {
    const response = await httpClient.post<ProductEntity>(this.baseUrl, data)
    return response.data
  }

  async findAll(): Promise<ProductEntity[]> {
    const response = await httpClient.get<ProductEntity[]>(this.baseUrl)
    return response.data
  }

  // ... más métodos
}
```

#### 5. **Crear un Store con Pinia**

```typescript
// modules/products/presentation/stores/product.store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ProductEntity } from '@/modules/products/domain/entities/product.entity'
import { ProductRepositoryImpl } from '@/modules/products/infrastructure/repositories/product.repository.impl'
import { GetProductListUseCase } from '@/modules/products/application/use-cases/get-product-list.use-case'

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref<ProductEntity[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const activeProducts = computed(() => products.value.filter((p) => p.isActive))

  // Actions
  const repository = new ProductRepositoryImpl()
  const getProductListUseCase = new GetProductListUseCase(repository)

  async function fetchProducts() {
    loading.value = true
    error.value = null
    try {
      products.value = await getProductListUseCase.execute()
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    products,
    loading,
    error,
    // Getters
    activeProducts,
    // Actions
    fetchProducts,
  }
})
```

#### 6. **Crear un Composable**

```typescript
// modules/products/presentation/composables/useProduct.ts
import { ref } from 'vue'
import { useProductStore } from '../stores/product.store'
import { useNotification } from '@/core/presentation/composables/useNotification'

export function useProduct() {
  const store = useProductStore()
  const { showSuccess, showError } = useNotification()
  const isSubmitting = ref(false)

  const loadProducts = async () => {
    try {
      await store.fetchProducts()
    } catch (error) {
      showError('Error al cargar productos')
    }
  }

  const createProduct = async (data: CreateProductDTO) => {
    isSubmitting.value = true
    try {
      await store.createProduct(data)
      showSuccess('Producto creado exitosamente')
    } catch (error) {
      showError('Error al crear producto')
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    products: computed(() => store.products),
    loading: computed(() => store.loading),
    isSubmitting,
    loadProducts,
    createProduct,
  }
}
```

#### 7. **Crear un Componente**

```vue
<!-- modules/products/presentation/components/ProductForm.vue -->
<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { CreateProductDTO } from '@/modules/products/domain/dtos/create-product.dto'

const emit = defineEmits<{
  submit: [data: CreateProductDTO]
  cancel: []
}>()

const formData = reactive<CreateProductDTO>({
  code: '',
  name: '',
  description: '',
  categoryId: '',
  laboratoryId: '',
  price: 0,
  requiresPrescription: false,
  isControlled: false,
})

const handleSubmit = () => {
  emit('submit', { ...formData })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="code" class="block text-sm font-medium text-gray-700"> Código </label>
      <input
        id="code"
        v-model="formData.code"
        type="text"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
      />
    </div>

    <!-- Más campos... -->

    <div class="flex justify-end gap-2">
      <button
        type="button"
        @click="emit('cancel')"
        class="px-4 py-2 border border-gray-300 rounded-md"
      >
        Cancelar
      </button>
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md">Guardar</button>
    </div>
  </form>
</template>
```

#### 8. **Crear una Página**

```vue
<!-- modules/products/presentation/pages/ProductListPage.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useProduct } from '../composables/useProduct'
import ProductTable from '../components/ProductTable.vue'
import ProductFilters from '../components/ProductFilters.vue'

const { products, loading, loadProducts } = useProduct()

onMounted(() => {
  loadProducts()
})
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Productos</h1>
      <router-link to="/products/create" class="px-4 py-2 bg-blue-600 text-white rounded-md">
        Nuevo Producto
      </router-link>
    </div>

    <ProductFilters class="mb-4" />

    <ProductTable :products="products" :loading="loading" />
  </div>
</template>
```

#### 9. **Definir Rutas**

```typescript
// modules/products/presentation/router/product.routes.ts
import type { RouteRecordRaw } from 'vue-router'

export const productRoutes: RouteRecordRaw[] = [
  {
    path: '/products',
    name: 'products',
    component: () => import('../pages/ProductListPage.vue'),
    meta: {
      requiresAuth: true,
      permission: 'products.view',
    },
  },
  {
    path: '/products/create',
    name: 'products-create',
    component: () => import('../pages/ProductCreatePage.vue'),
    meta: {
      requiresAuth: true,
      permission: 'products.create',
    },
  },
  {
    path: '/products/:id',
    name: 'products-detail',
    component: () => import('../pages/ProductDetailPage.vue'),
    meta: {
      requiresAuth: true,
      permission: 'products.view',
    },
  },
  {
    path: '/products/:id/edit',
    name: 'products-edit',
    component: () => import('../pages/ProductEditPage.vue'),
    meta: {
      requiresAuth: true,
      permission: 'products.update',
    },
  },
]
```

#### 10. **Registrar Rutas en el Router Principal**

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { authRoutes } from '@/modules/auth/presentation/router/auth.routes'
import { productRoutes } from '@/modules/products/presentation/router/product.routes'
import { dashboardRoutes } from '@/modules/dashboard/presentation/router/dashboard.routes'
// ... más imports

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...authRoutes,
    {
      path: '/',
      component: () => import('@/core/presentation/components/layout/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        ...dashboardRoutes,
        ...productRoutes,
        // ... más rutas
      ],
    },
  ],
})

export default router
```

---

## 🎨 Estándares y Convenciones

### Nomenclatura

#### Archivos

- **Componentes**: `PascalCase.vue` (ej: `ProductForm.vue`)
- **Pages**: `PascalCasePage.vue` (ej: `ProductListPage.vue`)
- **Composables**: `camelCase.ts` con prefijo `use` (ej: `useProduct.ts`)
- **Stores**: `camelCase.store.ts` (ej: `product.store.ts`)
- **Use Cases**: `kebab-case.use-case.ts` (ej: `create-product.use-case.ts`)
- **Entities**: `kebab-case.entity.ts` (ej: `product.entity.ts`)
- **DTOs**: `kebab-case.dto.ts` (ej: `create-product.dto.ts`)
- **Services**: `kebab-case.service.ts` (ej: `product.service.ts`)

#### Variables y Funciones

- **Variables**: `camelCase` (ej: `productList`)
- **Constantes**: `UPPER_SNAKE_CASE` (ej: `API_BASE_URL`)
- **Funciones**: `camelCase` (ej: `getProductById`)
- **Interfaces/Types**: `PascalCase` (ej: `ProductEntity`)
- **Enums**: `PascalCase` (ej: `PaymentMethod`)

### Estructura de Componentes Vue

```vue
<script setup lang="ts">
// 1. Imports
import { ref, computed, onMounted } from 'vue'
import type { ProductEntity } from '@/modules/products/domain/entities/product.entity'

// 2. Props
interface Props {
  product?: ProductEntity
  readonly?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  readonly: false,
})

// 3. Emits
const emit = defineEmits<{
  save: [product: ProductEntity]
  cancel: []
}>()

// 4. Composables
const { showSuccess, showError } = useNotification()

// 5. State
const loading = ref(false)
const formData = reactive({ ...props.product })

// 6. Computed
const isValid = computed(() => {
  return formData.name && formData.price > 0
})

// 7. Methods
const handleSave = async () => {
  // ...
}

// 8. Lifecycle
onMounted(() => {
  // ...
})
</script>

<template>
  <!-- Template -->
</template>

<style scoped>
/* Styles (si son necesarios) */
</style>
```

### TypeScript Best Practices

```typescript
// ✅ BIEN: Usar interfaces para objetos
interface Product {
  id: string
  name: string
}

// ✅ BIEN: Usar types para uniones y alias
type Status = 'active' | 'inactive'
type ID = string | number

// ✅ BIEN: Tipar explícitamente
const getProduct = async (id: string): Promise<Product> => {
  // ...
}

// ✅ BIEN: Usar tipos genéricos
function createRepository<T>(endpoint: string): Repository<T> {
  // ...
}

// ❌ MAL: Usar any
const data: any = await api.get()

// ✅ BIEN: Usar unknown y type guards
const data: unknown = await api.get()
if (isProduct(data)) {
  // data es Product aquí
}
```

### Testing

```typescript
// test/modules/products/product.store.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductStore } from '@/modules/products/presentation/stores/product.store'

describe('Product Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should fetch products successfully', async () => {
    const store = useProductStore()
    await store.fetchProducts()

    expect(store.products).toBeDefined()
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should handle errors when fetching products', async () => {
    const store = useProductStore()
    // Mock error scenario

    await expect(store.fetchProducts()).rejects.toThrow()
    expect(store.error).not.toBeNull()
  })
})
```

### Git Commit Conventions

```bash
# Formato
<type>(<scope>): <subject>

# Types
feat:     Nueva funcionalidad
fix:      Corrección de bug
docs:     Documentación
style:    Formato, sin cambios de código
refactor: Refactorización
test:     Tests
chore:    Mantenimiento

# Ejemplos
feat(products): add product search functionality
fix(sales): correct total calculation in POS
docs(readme): update installation instructions
refactor(inventory): improve stock validation logic
test(auth): add unit tests for login use case
```

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Testing
npm run test:unit
npm run test:e2e

# Linting
npm run lint
npm run format

# Type checking
npm run type-check
```

---

## 📚 Recursos Adicionales

### Documentación

- [Vue 3 Docs](https://vuejs.org/)
- [Pinia Docs](https://pinia.vuejs.org/)
- [Vue Router Docs](https://router.vuejs.org/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Vitest Docs](https://vitest.dev/)

### Librerías Recomendadas

#### UI Components

- **Headless UI**: Componentes accesibles sin estilos
- **VueUse**: Colección de composables útiles
- **Chart.js / Apache ECharts**: Gráficos
- **date-fns**: Manejo de fechas

#### Validación

- **Vee-Validate**: Validación de formularios
- **Zod**: Validación de schemas

#### Utilidades

- **lodash-es**: Funciones de utilidad
- **uuid**: Generación de IDs únicos

---

## 🎯 Checklist de Calidad por Feature

Antes de considerar un feature como "completo", verificar:

- [ ] **Funcionalidad**
  - [ ] Cumple con los requisitos
  - [ ] Maneja casos edge
  - [ ] Validaciones implementadas

- [ ] **Arquitectura**
  - [ ] Sigue clean architecture
  - [ ] Separation of concerns
  - [ ] Código reutilizable

- [ ] **TypeScript**
  - [ ] Tipado completo
  - [ ] Sin `any`
  - [ ] Interfaces definidas

- [ ] **Testing**
  - [ ] Unit tests (use cases, stores)
  - [ ] Integration tests
  - [ ] E2E tests (flujos críticos)

- [ ] **UI/UX**
  - [ ] Responsive
  - [ ] Accesible
  - [ ] Loading states
  - [ ] Error states
  - [ ] Mensajes de éxito

- [ ] **Performance**
  - [ ] Lazy loading
  - [ ] Optimización de renders
  - [ ] No memory leaks

- [ ] **Documentación**
  - [ ] Código comentado (cuando sea necesario)
  - [ ] README actualizado
  - [ ] Types documentados

---

## 📈 Métricas de Éxito

### Técnicas

- **Code Coverage**: >80%
- **Type Coverage**: 100%
- **Build Time**: <2 minutos
- **Lighthouse Score**: >90

### Negocio

- **Time to Market**: 3 meses (MVP)
- **User Satisfaction**: >85%
- **Bug Rate**: <5% post-release
- **Performance**: <2s load time

---

## 🚀 Próximos Pasos

1. **Semana 1**: Comenzar con FASE 1 - Setup y Core
2. **Revisar roadmap semanalmente** y ajustar según necesidades
3. **Documentar decisiones técnicas** importantes
4. **Mantener comunicación** con el equipo backend
5. **Realizar demos** al final de cada sprint

---

**¡Buena suerte con el desarrollo!** 🎉

Para cualquier duda o ajuste al roadmap, actualizar este documento.

**Última actualización**: Noviembre 2025
**Versión**: 1.0.0
