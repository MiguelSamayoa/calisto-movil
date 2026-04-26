# Calisto — Documentación Técnica

> Sistema móvil de gestión operativa para producción artesanal. Diseñado para registrar lotes, controlar inventario de insumos, registrar ventas y generar métricas financieras básicas en tiempo real.

---

## Visión General

Calisto es una aplicación Android (Capacitor + Ionic) que opera completamente offline sobre una base de datos SQLite embebida en el dispositivo. No depende de ningún servidor externo. Toda la persistencia, lógica de negocio y cálculos financieros ocurren localmente.

El flujo operativo central es:

```
Insumos (materiales) → Receta del producto → Lote de producción → Venta
```

Cada lote consume insumos del inventario, genera unidades disponibles para vender y registra su costo por unidad. Las ventas descuentan unidades del lote siguiendo orden FIFO.

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| UI / Framework | Angular (standalone components) | 17 |
| Componentes móviles | Ionic | 8 (mode: `md`) |
| Bridge nativo | Capacitor | 6 |
| Base de datos | SQLite (`@capacitor-community/sqlite`) | — |
| Cámara / Filesystem | Capacitor Camera + Filesystem | — |
| Criptografía (audit log) | Web Crypto API (SHA-256, HMAC-SHA256) | — |
| Moneda | GTQ — Quetzal guatemalteco | — |

---

## Arquitectura del Sistema

### Capas de la aplicación

```
src/app/
├── core/
│   ├── database/          ← Conexión SQLite + migraciones versionadas
│   │   └── migrations/    ← v1.migration.ts … v9.migration.ts
│   ├── models/            ← Interfaces TypeScript + DTOs + custom Errors
│   ├── repositories/      ← Una clase por entidad; toda la SQL vive aquí
│   └── services/          ← Lógica de negocio cross-cutting
├── pages/                 ← Páginas de la app (tabs + detalle/formulario)
└── shared/
    ├── components/        ← PhotoPickerComponent
    └── pipes/             ← GtqCurrencyPipe (| gtq)
```

### Principio de dependencia

```
Page → Service → Repository → DatabaseService → SQLite
```

Las páginas no acceden directamente a SQL. Los repositorios no contienen lógica de negocio que involucre múltiples entidades (eso vive en los servicios).

### Base de datos — Esquema de tablas

| Tabla | Propósito |
|---|---|
| `materials` | Insumos/ingredientes con stock y costo unitario |
| `products` | Productos vendibles con rendimiento por receta (`yield_units`) |
| `recipe_items` | Ítems de receta: relación N:M producto–material con cantidad |
| `production_lots` | Lotes de producción (estado: ABIERTO / CERRADO / ANULADO) |
| `sales` | Registro inmutable de ventas |
| `sale_lot_allocations` | Detalle de asignación FIFO por lote para cada venta |
| `inventory_adjustments` | Ajustes de inventario con tratamiento contable (COGS/OPEX) |
| `inventory_adjustment_allocations` | Detalle por lote de cada ajuste |
| `adjustment_type_catalog` | Catálogo de tipos de ajuste y su tratamiento contable |
| `adjustment_audit_log` | Cadena de hashes SHA-256 + firma HMAC por cada ajuste |
| `lot_audit_log` | Log de eventos de lote (anulación, cambio de precio) |
| `operator_settings` | Configuración clave–valor por dispositivo (nombre de operador) |

### Triggers activos en SQLite

| Trigger | Evento | Efecto |
|---|---|---|
| `trg_deduct_stock_on_lot` | AFTER INSERT en `production_lots` | Descuenta stock de materiales según receta |
| `trg_deduct_lot_units_on_sale` | AFTER INSERT en `sales` | Decrementa `remaining_units` del lote |
| `trg_materials_updated` | AFTER UPDATE en `materials` | Actualiza `updated_at` automáticamente |
| `trg_products_updated` | AFTER UPDATE en `products` | Actualiza `updated_at` automáticamente |
| `trg_adjustment_audit_log_no_update` | BEFORE UPDATE en `adjustment_audit_log` | Bloquea modificación de registros de auditoría |
| `trg_adjustment_audit_log_no_delete` | BEFORE DELETE en `adjustment_audit_log` | Bloquea eliminación de registros de auditoría |

### Migraciones

El esquema se versionea con `PRAGMA user_version`. `DatabaseService.runMigrations()` aplica cada migración de forma secuencial e idempotente al arrancar la app.

| Versión | Cambio principal |
|---|---|
| v1 | Schema base: materials, products, recipe_items, production_lots, sales + triggers iniciales |
| v2 | Tabla `sale_lot_allocations`; campo `price_policy` en sales |
| v3 | Campos `cost_basis_total`, `unit_cost_applied` en sales |
| v4 | Tablas de ajuste: `inventory_adjustments`, `adjustment_type_catalog`, `inventory_adjustment_allocations` |
| v5 | `lot_inventory_adjustments` (tabla legacy de ajustes rápidos) |
| v6 | `adjustment_audit_log` con cadena de hashes y firma HMAC |
| v7 | Campos `status`, `closed_at`, `closed_reason`, `total_adjusted_units`, `total_adjusted_cost` en `production_lots` |
| v8 | Triggers de inmutabilidad en `adjustment_audit_log` |
| v9 | `created_by` en sales; tabla `operator_settings`; tabla `lot_audit_log` |

### Inicialización

`DatabaseService.initialize()` se ejecuta vía `APP_INITIALIZER` antes de que Angular levante la app. Secuencia:

1. `initializeWebLayer()` — solo en entorno web (jeep-sqlite)
2. `ensureConnection()` — abre o recupera la conexión SQLite
3. `configurePragmas()` — WAL journal, foreign keys ON, synchronous NORMAL, cache 10 000 páginas
4. `runMigrations()` — aplica migraciones pendientes

### Configuración de zona horaria

Guatemala opera en GTM-6 sin horario de verano (DST). Todas las fechas se almacenan en UTC (ISO 8601). Las consultas de rango diario y mensual usan los helpers `localDayRange()` / `localMonthRange()` que construyen los límites UTC a partir de la hora local del dispositivo con `new Date(y, m, d, h).toISOString()`. Los agrupamientos diarios en SQL usan `datetime(sold_at, '-6 hours')` para ajuste GTM-6.

---

## Mapa de Rutas

| Ruta | Componente | Descripción |
|---|---|---|
| `/tabs/dashboard` | `DashboardPage` | Métricas hoy + mes + top productos |
| `/tabs/materials` | `MaterialsPage` | Lista de insumos con stock |
| `/tabs/products` | `ProductsPage` | Lista de productos |
| `/tabs/lots` | `LotsPage` | Lista de lotes de producción |
| `/tabs/sales` | `SalesPage` | Historial de ventas |
| `/materials/new` | `MaterialFormPage` | Alta de insumo |
| `/materials/:id/edit` | `MaterialFormPage` | Edición de insumo |
| `/products/new` | `ProductFormPage` | Alta de producto |
| `/products/:id/edit` | `ProductFormPage` | Edición de producto |
| `/products/:id/recipe` | `RecipeEditorPage` | Editor de receta |
| `/lots/new` | `LotFormPage` | Creación de lote |
| `/lots/:id` | `LotDetailPage` | Detalle + ajuste de inventario |
| `/sales/new` | `SaleFormPage` | Registro de venta |

---

## Índice de Documentación de Módulos

| Módulo | Archivo | Contenido |
|---|---|---|
| Ventas | [modulos/ventas.md](modulos/ventas.md) | Registro FIFO, política FIFO_MAX, reglas de negocio, controles de auditoría |
| Lotes de Producción | [modulos/lotes.md](modulos/lotes.md) | Ciclo de vida del lote, cálculo de costos, ajustes, anulación |
| Inventario | [modulos/inventario.md](modulos/inventario.md) | Gestión de materiales, productos y recetas |
| Operadores | [modulos/usuarios.md](modulos/usuarios.md) | Identificación del operador, trazabilidad, limitaciones |
