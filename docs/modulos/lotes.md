# Módulo: Lotes de Producción

## 1. Funcionalidad

### 1.1 Qué puede hacer el operador

| Acción | Descripción |
|---|---|
| **Calcular costo de un lote** | Calcula costos de materiales, precio sugerido y advierte sobre faltantes de stock antes de confirmar |
| **Crear un lote** | Descuenta materiales del inventario y registra el lote con su costo por unidad y precio de venta |
| **Ver listado de lotes** | Lista todos los lotes ordenados por fecha de producción descendente |
| **Ver detalle de un lote** | Muestra costos, unidades disponibles, margen y el historial de ajustes |
| **Registrar ajuste de inventario** | Reduce las unidades disponibles del lote con motivo y tratamiento contable |
| **Anular un lote** | Cancela un lote ABIERTO, restaura el stock proporcional a las unidades no vendidas |

---

### 1.2 Ciclo de vida del lote

```
                   ┌─────────────────────────────────────────────────┐
                   ↓                                                 │
[CREACIÓN] → status: ABIERTO → (ventas/ajustes decrecen remaining_units)
                                  │
                    ┌─────────────┴──────────────────────────┐
                    ↓                                        ↓
           remaining_units = 0                    confirmVoid()
           status → CERRADO                       status → ANULADO
           (automático en UPDATE)                 (stock restaurado)
```

| Estado | Descripción |
|---|---|
| `ABIERTO` | Lote activo; acepta ventas y ajustes de inventario |
| `CERRADO` | Sin unidades disponibles; resultado natural de ventas o ajustes que agotan el stock |
| `ANULADO` | Cancelado manualmente; el stock de materiales de las unidades no vendidas fue restaurado |

---

### 1.3 Reglas de negocio

#### Explosión BOM (Bill of Materials)

El cálculo de materiales sigue la receta del producto con soporte para subproductos anidados:

```
explodeBomToMaterials(productId, requiredUnits, chain[])
    └─ Por cada recipe_item:
        ├─ Si material_id → acumula cantidad proporcional
        └─ Si sub_product_id → llama recursivamente (detección de ciclos)
```

La cantidad de cada material se escala por `batches = requiredUnits / yield_units`. Si la receta tiene referencias circulares, se lanza un error con el camino del ciclo.

#### Rendimiento por lote (`yield_units`)

Un producto tiene `yield_units` unidades por receta base. Al producir `quantity` unidades:

```
batchMultiplier = ceil(quantity / yield_units)
totalUnits      = batchMultiplier × yield_units
totalCost       = Σ (quantityNeeded_material × unit_cost_material)
costPerUnit     = totalCost / totalUnits
```

#### Precio sugerido

Con margen sobre precio de venta (no markup sobre costo):

```
suggestedPrice = costPerUnit / (1 − marginPct / 100)
```

Si `marginPct >= 100`, se usa `costPerUnit × 2` como fallback.

#### Restricción FIFO en ajustes

Solo se puede ajustar el lote que es el primero activo en la cola FIFO del producto. Intentar ajustar un lote más reciente estando hay uno anterior con stock disponible retorna error. Esto mantiene la coherencia con el orden en que las ventas consumirían las unidades.

#### Tratamiento contable de ajustes

| Motivo | Clasificación | Descripción |
|---|---|---|
| `VENCIMIENTO` | COGS | Merma por vencimiento |
| `MERMA` | COGS | Merma general |
| `ERROR_PRODUCCION` | COGS | Error de producción |
| `DESPERDICIO` | COGS | Desperdicio operativo |
| `CORTESIA` | OPEX | Regalo / Cortesía |
| `CONSUMO_INTERNO` | OPEX | Consumo interno |
| `AJUSTE_MANUAL` | OPEX | Ajuste manual |

Los ajustes COGS se deducen como costo de producto vendido; los OPEX como gasto operativo. Ambos se reflejan en `getDashboardStats()` desglosados.

#### Anulación de lote

`CostCalculatorService.voidLot()`:
1. Verifica que el lote esté `ABIERTO`.
2. Re-explota el BOM para las `remaining_units` y restaura el stock de cada material.
3. Actualiza el lote a `status = 'ANULADO'`, `closed_reason = 'ANULADO_MANUAL'`.
4. Inserta un registro en `lot_audit_log` con las unidades devueltas y las ya vendidas.

> **Limitación conocida:** La restauración de stock usa la receta **actual** del producto, no la receta vigente en el momento de creación del lote. Si la receta fue modificada entre la creación y la anulación, las cantidades restauradas pueden ser incorrectas.

---

## 2. Flujo Técnico

### Diagrama — Creación de lote

```
LotFormPage
    │
    ├─ calculateLotCost(productId, quantity, marginPct)
    │       → CostCalculatorService.calculateLotCost()
    │               → getProductSnapshot()         [SELECT products]
    │               → explodeBomToMaterials()       [SELECT recipe_items recursivo]
    │               → getMaterialSnapshots()        [SELECT materials]
    │               ← LotCostCalculation { breakdown[], stockWarnings[], suggestedPrice }
    │
    └─ confirmLot(dto, calculation)
            → CostCalculatorService.confirmLot()
                    ┌─ db.transaction()
                    │   ├─ calculateLotCost() [re-validación dentro de TX]
                    │   ├─ IF stockWarnings.length > 0 → throw InventoryValidationError
                    │   ├─ FOR EACH material:
                    │   │   UPDATE materials SET stock = stock - ?
                    │   │   WHERE id = ? AND stock >= ?
                    │   │   (si changes=0 → throw InventoryValidationError → ROLLBACK)
                    │   └─ ProductionLotRepository.create(dto, totalCost, costPerUnit)
                    │           → INSERT INTO production_lots (status='ABIERTO', remaining_units=quantity)
                    └─ COMMIT → ProductionLot
```

### Diagrama — Ajuste de inventario

```
LotDetailPage.registerAdjustment()
    │
    └─ ProductionLotRepository.registerInventoryAdjustment(lotId, dto)
            ┌─ db.transaction()
            │   ├─ SELECT lot (status, remaining_units, cost_per_unit)
            │   ├─ Validar: status = 'ABIERTO'
            │   ├─ Validar: lote es el primero FIFO activo del producto
            │   ├─ Validar: remaining_units >= dto.quantity
            │   ├─ UPDATE production_lots SET remaining_units -= ?, status=... WHERE id=? AND remaining_units >= ?
            │   ├─ INSERT INTO inventory_adjustments (adjustment_code, POSTED)
            │   ├─ INSERT INTO inventory_adjustment_allocations
            │   ├─ SELECT previous_hash FROM adjustment_audit_log ORDER BY id DESC LIMIT 1
            │   ├─ SHA-256(previousHash | payload_json) → event_hash
            │   ├─ HMAC-SHA256(payload_json, deviceKey) → signature
            │   └─ INSERT INTO adjustment_audit_log (event_hash, signature, ...)
            └─ COMMIT
```

### Métodos clave

| Clase | Método | Descripción |
|---|---|---|
| `CostCalculatorService` | `calculateLotCost(productId, qty, marginPct)` | Cálculo de costo previo, sin escritura |
| `CostCalculatorService` | `confirmLot(dto, calculation)` | Crea el lote dentro de una transacción |
| `CostCalculatorService` | `voidLot(lotId, actorId)` | Anula el lote y restaura stock |
| `ProductionLotRepository` | `findAll(limit, offset)` | Lista paginada con datos del producto |
| `ProductionLotRepository` | `findById(id)` | Detalle de un lote |
| `ProductionLotRepository` | `findWithStock(productId?)` | Lotes ABIERTOS con unidades disponibles |
| `ProductionLotRepository` | `registerInventoryAdjustment(lotId, dto)` | Ajuste con audit log criptográfico |
| `ProductionLotRepository` | `updateSellingPrice(id, price, actorId)` | Actualiza precio y registra en `lot_audit_log` |
| `ProductionLotRepository` | `listInventoryAdjustments(lotId)` | Historial de ajustes (unifica tabla nueva + legacy) |
| `ProductionLotRepository` | `delete(_id)` | Lanza error; usar `voidLot()` en su lugar |

---

## 3. Controles de Seguridad y Auditoría

### 3.1 Protección contra concurrencia (TOCTOU)

Todas las validaciones de `registerInventoryAdjustment()` ocurren **dentro** de la transacción SQLite:

1. Lectura del lote (status, remaining_units)
2. Validación de estado
3. Validación de orden FIFO
4. Validación de unidades disponibles
5. UPDATE con condición `WHERE remaining_units >= ? AND status != 'ANULADO'` (optimistic lock)

Si el UPDATE afecta 0 filas, se lanza error y la transacción hace ROLLBACK completo.

### 3.2 Cadena de auditoría criptográfica (`adjustment_audit_log`)

Cada ajuste de inventario genera una entrada en `adjustment_audit_log` con:

| Campo | Valor |
|---|---|
| `payload_json` | JSON con todos los datos del ajuste (lotId, qty, tipo, actor, timestamp) |
| `previous_hash` | SHA-256 del registro anterior (o NULL si es el primero) |
| `event_hash` | SHA-256(`previousHash + payload_json`) — forma una cadena hash |
| `signature` | `hmac-sha256:<hex>` — HMAC-SHA256 del payload con la clave del dispositivo |
| `actor_id` | Nombre del operador al momento del ajuste |

La **clave HMAC** se genera una sola vez por dispositivo usando `crypto.getRandomValues(32 bytes)` y se almacena en `localStorage` bajo la clave `calisto_audit_hmac_key`.

> **Limitación:** La clave HMAC reside en `localStorage`, accesible vía DevTools o `adb`. Para mayor seguridad debería migrarse al Android Keystore.

**Inmutabilidad por trigger:**

```sql
-- BEFORE UPDATE ON adjustment_audit_log → lanza error
-- BEFORE DELETE ON adjustment_audit_log → lanza error
```

Cualquier intento de modificar o eliminar un registro de `adjustment_audit_log` directamente en SQLite es bloqueado por triggers.

### 3.3 Log de eventos de lote (`lot_audit_log`)

Los eventos de anulación (`LOT_VOID`) y cambio de precio (`PRICE_UPDATE`) se registran en `lot_audit_log` con:

- `lot_id`, `event_type`, `old_value`, `new_value`
- `actor_id` (nombre del operador)
- `notes` (unidades devueltas vs vendidas en anulaciones)
- `created_at` (timestamp UTC automático)

> **Limitación conocida:** `lot_audit_log` no tiene triggers de inmutabilidad (a diferencia de `adjustment_audit_log`). Los registros pueden ser modificados directamente en SQLite. Pendiente: agregar triggers `BEFORE UPDATE/DELETE` en una migración v10.

### 3.4 Logs generados por acción

| Acción | Tabla de log | Datos registrados |
|---|---|---|
| Crear lote | `production_lots` | Costo total, costo/unidad, precio de venta, margen |
| Ajuste de inventario | `inventory_adjustments` | Código único, tipo, tratamiento contable, costo snapshot |
| Ajuste de inventario | `inventory_adjustment_allocations` | Detalle por lote con costo unitario snapshot |
| Ajuste de inventario | `adjustment_audit_log` | Hash SHA-256 encadenado + firma HMAC del operador |
| Anular lote | `lot_audit_log` | Actor, unidades devueltas, unidades ya vendidas |
| Cambiar precio | `lot_audit_log` | Precio anterior, precio nuevo, actor |

### 3.5 Eliminación directa bloqueada

`ProductionLotRepository.delete()` lanza error inmediatamente:

```
La eliminación directa de lotes no está permitida.
Usa CostCalculatorService.voidLot() para anular un lote con trazabilidad completa y restauración de inventario.
```

No existe ninguna ruta de código que permita eliminar un lote sin pasar por `voidLot()`.
