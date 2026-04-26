# Módulo: Operadores (Usuarios)

## 1. Funcionalidad

Calisto no implementa un sistema de autenticación multiusuario. En cambio, usa el concepto de **operador**: un nombre de texto libre que identifica a la persona que opera el dispositivo. Este nombre se registra en las acciones críticas (ventas, ajustes de inventario, anulaciones) para proporcionar trazabilidad básica.

### 1.1 Qué puede hacer el operador

| Acción | Estado | Descripción |
|---|---|---|
| **Consultar nombre de operador** | Implementado | `OperatorService.getName()` lee de `operator_settings` |
| **Configurar nombre de operador** | Implementado (sin UI) | `OperatorService.setName()` escribe en `operator_settings` |
| **Ver nombre en registros** | Implementado | `created_by` en `sales`; `actor_id` en `lot_audit_log` y `adjustment_audit_log` |

> **Estado actual:** `setName()` existe en el servicio pero **no hay ninguna pantalla de configuración** que lo invoque. El nombre del operador siempre será `'operador'` (valor por defecto) hasta que se implemente una UI de configuración (pantalla de ajustes, modal de bienvenida en primera ejecución, o similar).

---

### 1.2 Reglas de negocio

- El nombre del operador se almacena en la tabla `operator_settings` como clave–valor con `key = 'operator_name'`.
- Si no existe ningún registro en `operator_settings`, el valor por defecto retornado es `'operador'`.
- No existe validación de formato ni longitud del nombre.
- El nombre se cachea en memoria en `OperatorService` para evitar consultas repetidas a SQLite.
- No existe concepto de roles, permisos diferenciados ni contraseña.

---

## 2. Flujo Técnico

### Diagrama de flujo del operador

```
Arranque de app
    └─ APP_INITIALIZER: DatabaseService.initialize()
            └─ [v9 migration] CREATE TABLE IF NOT EXISTS operator_settings

Cualquier acción crítica (venta, ajuste, anulación)
    └─ OperatorService.getName()
            ├─ Si this.cachedName → retorna inmediatamente (memoria)
            └─ Si no:
                └─ SELECT value FROM operator_settings WHERE key = 'operator_name'
                        ├─ Si existe → cachea y retorna
                        └─ Si no existe → retorna 'operador' (default)
```

### Métodos de `OperatorService`

| Método | Firma | Descripción |
|---|---|---|
| `getName` | `() → Promise<string>` | Lee nombre de SQLite o retorna `'operador'` |
| `setName` | `(name: string) → Promise<void>` | UPSERT en `operator_settings`; invalida caché |

### Implementación de `setName()`

```typescript
async setName(name: string): Promise<void> {
  const trimmed = name.trim();
  if (!trimmed) return;
  await this.db.execute(
    `INSERT INTO operator_settings (key, value, updated_at)
     VALUES ('operator_name', ?, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
     ON CONFLICT(key) DO UPDATE SET
       value      = excluded.value,
       updated_at = excluded.updated_at`,
    [trimmed]
  );
  this.cachedName = trimmed;
}
```

### Tabla `operator_settings`

```sql
CREATE TABLE IF NOT EXISTS operator_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
)
```

Diseñada como almacén clave–valor genérico para cualquier configuración futura del dispositivo.

### Uso del operador en otras capas

| Capa | Uso |
|---|---|
| `SaleService.registerSale()` | `createdBy: dto.createdBy ?? await operatorService.getName()` |
| `LotDetailPage.registerAdjustment()` | `const actor = await operatorService.getName()` |
| `LotDetailPage.executeVoid()` | `const actor = await operatorService.getName()` |
| `ProductionLotRepository.registerInventoryAdjustment()` | Recibe `createdBy` desde la página; lo almacena en `inventory_adjustments.created_by` y `adjustment_audit_log.actor_id` |
| `CostCalculatorService.voidLot()` | Recibe `actorId`; lo almacena en `lot_audit_log.actor_id` |

---

## 3. Controles de Seguridad y Auditoría

### 3.1 Trazabilidad del operador en registros

Cada acción crítica registra el nombre del operador en la base de datos:

| Tabla | Campo | Acción trazada |
|---|---|---|
| `sales` | `created_by` | Registro de cada venta |
| `inventory_adjustments` | `created_by` | Ajuste de inventario |
| `adjustment_audit_log` | `actor_id` | Entrada del audit log criptográfico |
| `lot_audit_log` | `actor_id` | Anulación de lote o cambio de precio |

### 3.2 Limitaciones de seguridad

| Limitación | Descripción | Riesgo |
|---|---|---|
| **Sin autenticación** | No hay contraseña ni PIN. Quien tenga el dispositivo tiene acceso total. | Cualquier persona puede registrar operaciones |
| **Sin roles ni permisos** | Todas las operaciones están disponibles a cualquier operador | No hay segregación de funciones |
| **Nombre no verificado** | El campo `created_by` es texto libre, no se valida contra un catálogo | Un operador puede imputar acciones a otro nombre |
| **Sin UI para configurar nombre** | El default `'operador'` no identifica al individuo | El audit trail es semántico pero no forense |
| **Sesión no limitada** | No hay timeout de sesión ni bloqueo automático | Dispositivo desbloqueado = acceso total |

### 3.3 Recomendaciones de mejora (estado pendiente)

Para alcanzar un nivel de auditoría formal, se recomienda:

1. **Implementar UI de configuración de operador** — modal en primera ejecución o pantalla de ajustes que llame a `OperatorService.setName()`.
2. **Migrar la clave HMAC** de `localStorage` al Android Keystore (via Capacitor Secure Storage) para resistir extracción por ADB.
3. **Agregar PIN de acceso** básico como primera barrera ante uso no autorizado del dispositivo.
4. **Implementar catálogo de operadores** con selección al iniciar sesión, en lugar de texto libre, para garantizar que `created_by` sea verificable.
