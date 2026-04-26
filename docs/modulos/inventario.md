# Módulo: Inventario

Engloba la gestión de **materiales/insumos** (materia prima con stock), **productos** (lo que se fabrica y vende) y **recetas** (relación producto–materiales con cantidades).

---

## 1. Funcionalidad

### 1.1 Materiales (Insumos)

| Acción | Descripción |
|---|---|
| **Crear material** | Registra un nuevo insumo con nombre, unidad, costo unitario y stock inicial |
| **Editar material** | Actualiza cualquier campo; el trigger `trg_materials_updated` actualiza `updated_at` automáticamente |
| **Desactivar material** | Soft-delete: establece `is_active = 0`; el material desaparece de las listas pero su historial se conserva |
| **Ver listado** | Lista todos los materiales activos con su stock actual y costo unitario |
| **Alertas de stock bajo** | El dashboard muestra materiales con `stock <= 1` (umbral configurable en `getLowStockAlerts()`) |

> **Restricción:** No existe hard-delete de materiales. La columna `is_active` es el único mecanismo de baja. Los materiales con `stock > 0` o usados en recetas activas no deberían desactivarse sin verificar el impacto en lotes futuros (validación pendiente de implementar).

**Campos del material:**

| Campo | Tipo | Restricción |
|---|---|---|
| `name` | TEXT COLLATE NOCASE | Obligatorio |
| `unit` | TEXT | Obligatorio (kg, g, L, mL, unidad, docena, etc.) |
| `unit_cost` | REAL | `>= 0` |
| `stock` | REAL | `>= 0` (se decrementa automáticamente al crear lotes) |
| `photo_path` | TEXT | Ruta relativa en `Capacitor.Data/calisto_photos/` |
| `is_active` | INTEGER | 1 = activo, 0 = inactivo (soft-delete) |

---

### 1.2 Productos

| Acción | Descripción |
|---|---|
| **Crear producto** | Define el producto vendible con nombre, categoría, rendimiento y precio sugerido inicial |
| **Editar producto** | Actualiza campos básicos; `trg_products_updated` actualiza `updated_at` |
| **Desactivar producto** | Soft-delete: `is_active = 0` |
| **Ver listado** | Lista productos activos con categoría y foto |
| **Editar receta** | Agrega, modifica o elimina ingredientes (materiales o subproductos) de la receta |

**Campo crítico: `yield_units`**

Indica cuántas unidades del producto resultan de ejecutar la receta una vez. Es el divisor base para todos los cálculos de costo por unidad y la cantidad de materiales necesarios por lote.

```
costPerUnit = totalMaterialsCost / (batchMultiplier × yield_units)
```

---

### 1.3 Recetas

La receta de un producto es la lista de materiales (o subproductos) con sus cantidades por receta base. Se gestiona en `RecipeEditorPage` (`/products/:id/recipe`).

**Reglas:**

- Un ítem de receta puede referenciar un `material_id` **o** un `sub_product_id`, nunca ambos.
- La combinación `(product_id, material_id)` es única (constraint UNIQUE en `recipe_items`).
- Los subproductos se resuelven recursivamente en `CostCalculatorService.explodeBomToMaterials()`, con detección de ciclos. Un ciclo lanza error inmediatamente con el camino completo.
- Si se elimina un producto, sus recipe_items se eliminan en cascada (`ON DELETE CASCADE`).
- Si se intenta eliminar un material que forma parte de alguna receta activa, SQLite lanza error por `ON DELETE RESTRICT`.

---

## 2. Flujo Técnico

### Gestión de materiales

```
MaterialsPage → MaterialRepository
    ├─ findAll(onlyActive=true)       → SELECT WHERE is_active = 1 ORDER BY name
    ├─ create(dto)                    → INSERT INTO materials
    ├─ update(id, dto)                → UPDATE materials SET ... WHERE id = ?
    └─ deactivate(id)                 → UPDATE materials SET is_active = 0 WHERE id = ?
```

### Gestión de productos y recetas

```
ProductsPage → ProductRepository
    ├─ findAll()                      → SELECT WHERE is_active = 1
    └─ findById(id)                   → SELECT + LEFT JOIN recipe_items

RecipeEditorPage → RecipeItemRepository
    ├─ findByProduct(productId)       → SELECT recipe_items WHERE product_id = ?
    ├─ upsert(productId, materialId, quantity)   → INSERT OR REPLACE
    └─ remove(productId, materialId)  → DELETE WHERE product_id = ? AND material_id = ?
```

### Tablas del módulo

| Tabla | Clave primaria | Claves foráneas |
|---|---|---|
| `materials` | `id` | — |
| `products` | `id` | — |
| `recipe_items` | `id` | `product_id → products(id) CASCADE`, `material_id → materials(id) RESTRICT` |

### Índices de rendimiento

```sql
idx_materials_name      ON materials(name)
idx_materials_active    ON materials(is_active)
idx_products_name       ON products(name)
idx_products_category   ON products(category)
idx_recipe_product      ON recipe_items(product_id)
idx_recipe_material     ON recipe_items(material_id)
```

### Gestión de fotos

`PhotoService` gestiona imágenes en `Capacitor.Data/calisto_photos/`:

1. Captura vía `Capacitor.Camera` (calidad 75, JPEG, Base64).
2. Guarda el archivo en filesystem con nombre único.
3. Almacena solo la **ruta relativa** en SQLite (`photo_path`).
4. Para mostrar: carga el archivo y convierte a `data:image/jpeg;base64,...`.

`PhotoPickerComponent` (`app-photo-picker`) encapsula toda esta lógica en formularios.

---

## 3. Controles de Seguridad y Auditoría

### 3.1 Integridad de stock (constraint SQLite)

```sql
stock REAL NOT NULL DEFAULT 0 CHECK(stock >= 0)
```

El stock no puede volverse negativo a nivel de base de datos. Sin embargo, el trigger `trg_deduct_stock_on_lot` ejecuta la deducción sin verificar esta restricción internamente; `CostCalculatorService.confirmLot()` añade una segunda capa que valida disponibilidad antes y dentro de la transacción.

### 3.2 Protección de materiales referenciados en recetas

```sql
material_id REFERENCES materials(id) ON DELETE RESTRICT
```

Eliminar un material que esté en alguna receta lanza un error SQLite de foreign key violation. Esto preserva la integridad de las recetas históricas.

### 3.3 Soft-delete como registro histórico

Los materiales y productos desactivados (`is_active = 0`) mantienen todo su historial en la base de datos. Los lotes, ventas y ajustes que los referencian siguen siendo accesibles para reportes retrospectivos. Esto permite auditar operaciones históricas incluso si el insumo ya no se usa.

### 3.4 Timestamps automáticos

Los triggers `trg_materials_updated` y `trg_products_updated` actualizan `updated_at` automáticamente en cada modificación. Esto proporciona trazabilidad de cuándo fue modificado cada registro sin depender de la lógica de la aplicación.

### 3.5 Logs generados por acción

| Acción | Registro creado | Datos |
|---|---|---|
| Crear material | Fila en `materials` | Todos los campos + `created_at` automático |
| Editar material | `updated_at` actualizado por trigger | Timestamp de última modificación |
| Desactivar material | `is_active = 0` en `materials` | Registro conservado; no hay log de quién desactivó |
| Crear producto | Fila en `products` | Todos los campos + `created_at` |
| Modificar receta | INSERT/UPDATE/DELETE en `recipe_items` | No hay log de auditoría específico para cambios de receta |

> **Limitación de auditoría:** No existe un log de quién creó, modificó o desactivó materiales y productos. Las operaciones de auditoría en este módulo se limitan a los timestamps automáticos (`created_at`, `updated_at`). Para cumplimiento GRC estricto se requeriría un log adicional similar al `lot_audit_log`.
