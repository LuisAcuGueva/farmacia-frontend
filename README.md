# 🏥 Sistema de Farmacia - Frontend

Sistema frontend para gestión de farmacia multisucursal construido con **Vue 3**, **TypeScript**, **Pinia** y **Clean Architecture**.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Multi-Tenant](#-multi-tenant)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Desarrollo](#-desarrollo)
- [Testing](#-testing)
- [Build y Deployment](#-build-y-deployment)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Roadmap de Desarrollo](#-roadmap-de-desarrollo)
- [Contribución](#-contribución)

## ✨ Características

- ✅ **Multisucursal**: Gestión de múltiples sucursales con inventario independiente
- ✅ **Punto de Venta (POS)**: Sistema completo de ventas y facturación
- ✅ **Gestión de Inventario**: Control de stock, vencimientos y transferencias
- ✅ **Productos Controlados**: Gestión especial para medicamentos controlados
- ✅ **Usuarios y Roles**: Sistema completo de permisos y autorización
- ✅ **Reportes**: Analytics y reportes de ventas, inventario y finanzas
- ✅ **Proveedores**: Gestión de proveedores y órdenes de compra
- ✅ **Clientes**: Base de datos de clientes con historial de compras
- ✅ **Alertas**: Sistema de notificaciones para stock bajo y vencimientos

## 🛠️ Stack Tecnológico

### Core

- **Vue 3** - Framework progresivo con Composition API
- **TypeScript** - Tipado estático para mayor seguridad
- **Vite** - Build tool ultrarrápido
- **Pinia** - State management
- **Vue Router 4** - Enrutamiento

### UI & Styling

- **Tailwind CSS** - Framework CSS utility-first
- **Headless UI** - Componentes accesibles (recomendado)

### HTTP & API

- **Axios** - Cliente HTTP con interceptores

### Testing

- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **Vue Test Utils** - Testing de componentes Vue

### Code Quality

- **ESLint** - Linter
- **Prettier** - Formateador de código
- **TypeScript** - Type checking

## 🏗️ Arquitectura

Este proyecto sigue los principios de **Clean Architecture** con una organización **Feature-based**:

```
┌─────────────────────────────────────┐
│     Presentation Layer              │
│  (Components, Pages, Stores)        │
├─────────────────────────────────────┤
│     Application Layer               │
│     (Use Cases, Services)           │
├─────────────────────────────────────┤
│     Domain Layer                    │
│  (Entities, Interfaces)             │
├─────────────────────────────────────┤
│     Infrastructure Layer            │
│  (HTTP, Storage, APIs)              │
└─────────────────────────────────────┘
```

### Principios Aplicados

- **Separation of Concerns**: Cada capa tiene responsabilidades claras
- **Dependency Inversion**: Las capas superiores no dependen de implementaciones
- **Single Responsibility**: Un módulo, una razón para cambiar
- **Feature-First**: Código organizado por funcionalidad de negocio
- **Composition over Inheritance**: Uso de composables de Vue 3

## 🏢 Multi-Tenant

Este proyecto implementa una arquitectura **multi-tenant** que permite a múltiples farmacias usar el mismo sistema con datos aislados.

### 🎯 Características Multi-Tenant

- **Subdomain-based**: Cada farmacia tiene su propio subdominio
  - `http://farmacia-central.farmasys.local:5173` → Farmacia Central
  - `http://admin.farmasys.local:5173` → Panel de Administración
  - `http://demo.farmasys.local:5173` → Tenant de Demostración

- **API Dinámica**: El frontend detecta automáticamente el tenant y hace peticiones al backend correcto
  - Frontend: `farmacia-central.farmasys.local` → Backend: `farmacia-central.localhost:3000`

- **Personalización por Tenant**: Cada farmacia puede tener:
  - Logo personalizado
  - Colores de marca
  - Nombre de empresa
  - Plan de suscripción (Free, Standard, Premium, Enterprise)

### 📚 Documentación Completa

Ver **[INDICE_DOCUMENTACION_MULTITENANT.md](./INDICE_DOCUMENTACION_MULTITENANT.md)** para:

- 🚀 Guía de configuración rápida
- 🏗️ Arquitectura técnica detallada
- 🧪 Guías de testing
- 🔧 Configuración del backend
- 📊 Diagramas visuales

### ⚡ Quick Start Multi-Tenant

```bash
# 1. Verificar configuración
./scripts/verify-multitenant.sh

# 2. Iniciar desarrollo
npm run dev

# 3. Acceder a diferentes tenants
# http://farmacia-central.farmasys.local:5173/auth/login
# http://admin.farmasys.local:5173/auth/login
# http://demo.farmasys.local:5173/auth/login
```

## 📋 Requisitos Previos

- **Node.js**: `^20.19.0` o `>=22.12.0`
- **npm**: `>=9.0.0`
- **Git**: Para control de versiones

## 🚀 Instalación

1. **Clonar el repositorio**

```sh
git clone https://github.com/LuisAcuGueva/farmacia-frontend.git
cd farmacia-frontend
```

2. **Instalar dependencias**

```sh
npm install
```

3. **Configurar variables de entorno**

```sh
# Crear archivo .env.local en la raíz del proyecto
cp .env.example .env.local

# Editar .env.local con tus configuraciones
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Farmacia App
```

## 💻 Desarrollo

### Iniciar servidor de desarrollo

```sh
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Type checking

```sh
npm run type-check
```

### Linting y formateo

```sh
# Ejecutar linter
npm run lint

# Formatear código
npm run format
```

## 🧪 Testing

### Unit Tests con Vitest

```sh
# Ejecutar tests en modo watch
npm run test:unit

# Ejecutar tests una vez
npm run test:unit -- --run

# Ejecutar con coverage
npm run test:unit -- --coverage
```

### E2E Tests con Playwright

```sh
# Instalar navegadores (primera vez)
npx playwright install

# Ejecutar tests E2E
npm run test:e2e

# Ejecutar en un navegador específico
npm run test:e2e -- --project=chromium

# Ejecutar en modo debug
npm run test:e2e -- --debug
```

## 📦 Build y Deployment

### Build para producción

```sh
# Type-check, compilar y minificar
npm run build
```

### Preview del build

```sh
npm run preview
```

### Archivos de salida

Los archivos de producción se generan en la carpeta `dist/`

## 📁 Estructura del Proyecto

```
farmacia-frontend/
├── public/                 # Archivos estáticos
├── src/
│   ├── assets/            # Recursos (imágenes, estilos, etc.)
│   ├── core/              # Funcionalidad compartida
│   │   ├── config/        # Configuración global
│   │   ├── infrastructure/# HTTP, Storage, etc.
│   │   ├── domain/        # Entidades base
│   │   └── presentation/  # Componentes UI compartidos
│   ├── modules/           # Módulos de negocio
│   │   ├── auth/          # Autenticación
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── products/      # Productos/Medicamentos
│   │   ├── inventory/     # Inventario
│   │   ├── sales/         # Ventas y POS
│   │   ├── customers/     # Clientes
│   │   ├── suppliers/     # Proveedores
│   │   ├── branches/      # Sucursales
│   │   ├── users/         # Usuarios y roles
│   │   └── reports/       # Reportes
│   ├── router/            # Configuración de rutas
│   ├── stores/            # Stores globales
│   ├── types/             # Tipos TypeScript globales
│   ├── utils/             # Utilidades
│   ├── App.vue            # Componente raíz
│   └── main.ts            # Punto de entrada
├── .env.example           # Variables de entorno ejemplo
├── FRONTEND.md            # Roadmap detallado
├── package.json           # Dependencias
├── tsconfig.json          # Configuración TypeScript
├── vite.config.ts         # Configuración Vite
└── README.md              # Este archivo
```

### Estructura de un Módulo

Cada módulo sigue Clean Architecture:

```
modules/[module-name]/
├── domain/                # Lógica de negocio
│   ├── entities/         # Entidades del dominio
│   ├── interfaces/       # Contratos
│   └── dtos/             # Data Transfer Objects
├── application/          # Casos de uso
│   ├── use-cases/        # Casos de uso específicos
│   └── services/         # Servicios de aplicación
├── infrastructure/       # Implementaciones
│   ├── repositories/     # Implementación de repos
│   └── mappers/          # Mapeo de datos
└── presentation/         # Capa de presentación
    ├── pages/            # Páginas/Vistas
    ├── components/       # Componentes Vue
    ├── composables/      # Composables
    ├── stores/           # Stores de Pinia
    └── router/           # Rutas del módulo
```

## 🗺️ Roadmap de Desarrollo

El proyecto está dividido en **10 fases** a completar en **13 semanas**:

### Módulos Principales (por prioridad)

1. **⭐⭐⭐⭐⭐ CRÍTICO**
   - Auth (Autenticación)
   - Dashboard
   - Products (Productos)
   - Inventory (Inventario)
   - Sales (Ventas y POS)
   - Branches (Sucursales)

2. **⭐⭐⭐⭐ ALTA**
   - Customers (Clientes)
   - Suppliers (Proveedores)
   - Users (Usuarios y Roles)

3. **⭐⭐⭐ MEDIA**
   - Reports (Reportes)

Para ver el roadmap completo y detallado, consulta **[FRONTEND.md](./FRONTEND.md)**

## 🎨 Convenciones de Código

### Nomenclatura

- **Componentes**: `PascalCase.vue` (`ProductForm.vue`)
- **Composables**: `use + PascalCase.ts` (`useProduct.ts`)
- **Stores**: `camelCase.store.ts` (`product.store.ts`)
- **Types**: `PascalCase` (`ProductEntity`)
- **Variables**: `camelCase`
- **Constantes**: `UPPER_SNAKE_CASE`

### Git Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(products): add product search functionality
fix(sales): correct total calculation in POS
docs(readme): update installation instructions
refactor(inventory): improve stock validation logic
test(auth): add unit tests for login use case
```

## 🔧 Configuración del IDE

### Visual Studio Code (Recomendado)

Extensiones recomendadas:

- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

### Configuración de Navegador

- **Chrome/Edge/Brave**: [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- **Firefox**: [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feat/amazing-feature`)
3. Commit tus cambios (`git commit -m 'feat: add amazing feature'`)
4. Push a la rama (`git push origin feat/amazing-feature`)
5. Abre un Pull Request

### Checklist antes de PR

- [ ] El código compila sin errores (`npm run build`)
- [ ] Todos los tests pasan (`npm run test:unit`)
- [ ] El código está formateado (`npm run format`)
- [ ] No hay errores de linting (`npm run lint`)
- [ ] Se agregaron tests para nuevas funcionalidades
- [ ] La documentación fue actualizada si es necesario

## 📚 Recursos

### Documentación Oficial

- [Vue 3](https://vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vite.dev/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)

### Librerías Recomendadas

- [VueUse](https://vueuse.org/) - Colección de composables
- [Headless UI](https://headlessui.com/) - Componentes accesibles
- [date-fns](https://date-fns.org/) - Manejo de fechas
- [Zod](https://zod.dev/) - Validación de schemas

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Equipo

- **Desarrollador Principal**: Luis Acu Gueva

## 📞 Contacto

Para preguntas o soporte, contactar al equipo de desarrollo.

---

**Última actualización**: Noviembre 2025
**Versión**: 0.0.0
