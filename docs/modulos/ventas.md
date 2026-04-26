# Módulo: Ventas

## 1. Funcionalidad

### 1.1 Qué puede hacer el operador

| Acción | Descripción |
|---|---|
| **Previsualizar una venta** | Calcula en tiempo real cuánto costará la venta, de qué lotes se tomará el stock (FIFO) y a qué precio se cobrará, antes de confirmar |
| **Registrar una venta** | Descuenta unidades de los lotes en orden FIFO y crea un registro permanente en `sales` |
| **Ver historial de ventas** | Lista todas las ventas ordenadas por fecha descendente, con nombre de producto y ganancia por transacción |
| **Ver ventas del día** | Filtra el historial al día actual (hora local del dispositivo) |
| **Filtrar por rango de fechas** | Consulta ventas entre dos fechas arbitrarias |

> **Restricción:** La eliminación o modificación de ventas está deshabilitada por diseño. `SaleRepository.delete()` y `SaleService.deleteSale()` lanzan error inmediatamente. Toda venta es un registro permanente.

---

### 1.2 Reglas de negocio

#### Política de precio: FIFO_MAX

Cuando una venta consume unidades de más de un lote (porque el primer lote no tiene suficiente stock), el precio unitario cobrado es el **máximo** entre los precios de venta de todos los lotes involucrados:

```
unitPrice = MAX(selling_price de cada lote participante)
totalAmount = unitPrice × quantity
```

Esta política está codificada en `SaleRepository.previewFifoSale()` y el valor `'FIFO_MAX'` queda registrado en la columna `price_policy` de cada venta.

#### Orden FIFO

Los lotes se consumen en orden cronológico ascendente (`produced_at ASC, id ASC`). Solo los lotes con `status = 'ABIERTO'` y `remaining_units > 0` son elegibles.

#### Costo de la venta (cost basis)

El costo total imputado a la venta (`cost_basis_total`) se calcula con el costo por unidad de cada lote en el momento de la asignación:

```
costBasisTotal = Σ (quantity_from_lot_i × cost_per_unit_of_lot_i)
unitCostApplied = costBasisTotal / totalQuantity
profit = totalAmount - costBasisTotal
```

Este costo queda fijo en `sales.cost_basis_total` y no cambia si el costo del lote se modifica posteriormente.

#### Validación de stock

Si el stock disponible total (suma de `remaining_units` en lotes ABIERTOS) es menor a la cantidad solicitada, se lanza `SaleStockInsufficientError` antes de ejecutar cualquier escritura. La validación se repite **dentro de la transacción** al ejecutar el UPDATE optimista sobre cada lote (`WHERE remaining_units >= ? AND status = 'ABIERTO'`), protegiéndose contra condiciones de carrera (TOCTOU).

---

## 2. Flujo Técnico

### Diagrama de secuencia — Registro de venta

```
SaleFormPage
    │
    ├─ previewSale(productId, quantity)
    │       → SaleService.previewSale()
    │       → SaleRepository.previewFifoSale()
    │               → SELECT lotes ABIERTOS ORDER BY produced_at ASC
    │               → Simula asignación FIFO
    │               ← SalePreview { unitPrice, totalAmount, costBasisTotal, allocations[] }
    │
    └─ registerSale(dto: CreateSaleDto)
            → SaleService.registerSale()
            │       enriquece dto con createdBy = OperatorService.getName()
            └─ SaleRepository.create() → registerFifoSale()
                    ┌─ db.transaction()
                    │   ├─ previewFifoSale() [re-validación dentro de la TX]
                    │   ├─ INSERT INTO sales (...)
                    │   └─ FOR EACH allocation:
                    │       ├─ UPDATE production_lots SET remaining_units = remaining_units - ?
                    │       │   WHERE id = ? AND remaining_units >= ? AND status = 'ABIERTO'
                    │       │   (falla → SaleStockInsufficientError → ROLLBACK)
                    │       └─ INSERT INTO sale_lot_allocations (...)
                    └─ COMMIT → Sale
```

### Métodos del repositorio

| Método | Firma | Descripción |
|---|---|---|
| `previewFifoSale` | `(productId, quantity) → SalePreview` | Simula la asignación FIFO sin escribir nada |
| `registerFifoSale` | `(dto: CreateSaleDto) → Sale` | Ejecuta la venta dentro de una transacción |
| `findAll` | `(limit, offset) → SaleWithProduct[]` | Lista paginada de todas las ventas |
| `findByDateRange` | `(from, to) → SaleWithProduct[]` | Ventas en rango ISO UTC |
| `findToday` | `() → SaleWithProduct[]` | Usa `localDayRange()` para rango en hora local |
| `getDashboardStats` | `() → DashboardStats` | Estadísticas hoy + mes + últimos 7 días |
| `getDailyRevenue` | `(days) → DailyRevenue[]` | Ingresos agrupados por día (ajuste GTM-6) |
| `getMonthlySummary` | `(year, month) → MonthlySummary` | Resumen mensual con margen |
| `getTopProducts` | `(limit, days) → TopProductStat[]` | Ranking por unidades vendidas |
| `getLowStockAlerts` | `(threshold) → LowStockAlert[]` | Materiales bajo umbral de stock |
| `delete` | `(id) → never` | Lanza error; ventas son inmutables |

### Tablas escritas en una venta

| Tabla | Operación | Columnas clave |
|---|---|---|
| `sales` | INSERT | `lot_id`, `product_id`, `quantity`, `unit_price`, `total_amount`, `cost_basis_total`, `unit_cost_applied`, `price_policy`, `sold_at`, `created_by` |
| `sale_lot_allocations` | INSERT por cada lote | `sale_id`, `lot_id`, `quantity`, `selling_price_snapshot`, `cost_per_unit_snapshot` |
| `production_lots` | UPDATE | `remaining_units -= quantity`; `status → 'CERRADO'` si llega a 0 |

---

## 3. Controles de Seguridad y Auditoría

### 3.1 Inmutabilidad de ventas

`SaleRepository.delete()` lanza `Error('La eliminacion de ventas no esta permitida.')` incondicionalmente. No existe ruta de código que permita modificar una venta registrada.

### 3.2 Trazabilidad del operador

Cada venta registra el nombre del operador en `sales.created_by`. El valor proviene de `OperatorService.getName()`, que lee la tabla `operator_settings` en SQLite. Si no se ha configurado un nombre, el valor por defecto es `'operador'`.

> **Limitación actual:** No existe autenticación. Cualquier persona con acceso al dispositivo puede registrar ventas. El campo `created_by` es declarativo, no verificado.

### 3.3 Protección contra corrupción de stock (TOCTOU)

La validación de stock se realiza dos veces:

1. **Antes de la transacción:** `previewFifoSale()` valida disponibilidad.
2. **Dentro de la transacción:** Cada `UPDATE production_lots` incluye `WHERE remaining_units >= ?` como lock optimista. Si otra operación concurrente agotó el stock entre el preview y el UPDATE, `changes = 0` activa el rollback.

### 3.4 Logs generados por acción

| Acción | Tabla de log | Campos registrados |
|---|---|---|
| Registro de venta | `sales` | `created_by`, `sold_at`, `price_policy`, `cost_basis_total` |
| Asignación por lote | `sale_lot_allocations` | Snapshot de precio y costo en el momento de la venta |

> No existe un log de auditoría criptográfico para ventas (a diferencia de ajustes de inventario). Las ventas son inmutables por restricción de código, no por trigger de base de datos.

### 3.5 Métricas del dashboard

`getDashboardStats()` calcula simultáneamente (en paralelo con `Promise.all`):

- **Utilidad bruta hoy:** `revenue - cost_basis_total`
- **Utilidad operativa hoy:** `revenue - cost_basis_total - adjustments_cost`
- **Utilidad bruta mensual:** `revenue - cost_basis_total`
- **Utilidad operativa mensual:** `revenue - cost_basis_total - adjustments_total`
- **Margen operativo mensual:** `(utilidad_operativa / revenue) × 100`

Los ajustes de inventario con `status != 'REVERSED'` se deducen separadamente por tipo contable (COGS vs OPEX) para dar transparencia al P&L.
