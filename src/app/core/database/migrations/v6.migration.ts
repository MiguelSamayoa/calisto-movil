/**
 * Migracion v6 - Valorizacion contable de ajustes de inventario y trazabilidad GRC.
 * - Extiende lotes con acumulados de ajustes.
 * - Define ajustes con cabecera/detalle valorizado por costo de lote.
 * - Agrega bitacora inmutable encadenada por hash.
 */
export const V6_MIGRATION = {
  version: 6,
  statements: [
    `ALTER TABLE production_lots ADD COLUMN closed_at TEXT`,
    `ALTER TABLE production_lots ADD COLUMN closed_reason TEXT`,
    `ALTER TABLE production_lots ADD COLUMN total_adjusted_units INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE production_lots ADD COLUMN total_adjusted_cost REAL NOT NULL DEFAULT 0`,

    `CREATE TABLE IF NOT EXISTS adjustment_type_catalog (
      code TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      accounting_treatment TEXT NOT NULL CHECK(accounting_treatment IN ('COGS', 'OPEX')),
      is_active INTEGER NOT NULL DEFAULT 1
    )`,

    `INSERT OR IGNORE INTO adjustment_type_catalog(code, label, accounting_treatment) VALUES
      ('VENCIMIENTO', 'Merma por vencimiento', 'COGS'),
      ('MERMA', 'Merma general', 'COGS'),
      ('ERROR_PRODUCCION', 'Error de produccion', 'COGS'),
      ('DESPERDICIO', 'Desperdicio operativo', 'COGS'),
      ('CORTESIA', 'Regalo/Cortesia', 'OPEX'),
      ('CONSUMO_INTERNO', 'Consumo interno', 'OPEX'),
      ('AJUSTE_MANUAL', 'Ajuste manual', 'OPEX')`,

    `CREATE TABLE IF NOT EXISTS inventory_adjustments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      adjustment_code TEXT NOT NULL UNIQUE,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
      lot_id INTEGER REFERENCES production_lots(id) ON DELETE RESTRICT,
      quantity_total INTEGER NOT NULL CHECK(quantity_total > 0),
      adjustment_type TEXT NOT NULL REFERENCES adjustment_type_catalog(code),
      accounting_treatment TEXT NOT NULL CHECK(accounting_treatment IN ('COGS', 'OPEX')),
      reason_detail TEXT,
      total_cost_snapshot REAL NOT NULL CHECK(total_cost_snapshot >= 0),
      status TEXT NOT NULL DEFAULT 'POSTED' CHECK(status IN ('PENDING', 'APPROVED', 'POSTED', 'REVERSED')),
      created_by TEXT NOT NULL,
      approved_by TEXT,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      approved_at TEXT,
      posted_at TEXT,
      reversal_of_adjustment_id INTEGER REFERENCES inventory_adjustments(id) ON DELETE RESTRICT,
      previous_hash TEXT,
      row_hash TEXT
    )`,

    `CREATE INDEX IF NOT EXISTS idx_inventory_adjustments_product ON inventory_adjustments(product_id)`,
    `CREATE INDEX IF NOT EXISTS idx_inventory_adjustments_lot ON inventory_adjustments(lot_id)`,
    `CREATE INDEX IF NOT EXISTS idx_inventory_adjustments_created_at ON inventory_adjustments(created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_inventory_adjustments_type ON inventory_adjustments(adjustment_type)`,

    `CREATE TABLE IF NOT EXISTS inventory_adjustment_allocations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      adjustment_id INTEGER NOT NULL REFERENCES inventory_adjustments(id) ON DELETE CASCADE,
      lot_id INTEGER NOT NULL REFERENCES production_lots(id) ON DELETE RESTRICT,
      quantity INTEGER NOT NULL CHECK(quantity > 0),
      unit_cost_snapshot REAL NOT NULL CHECK(unit_cost_snapshot >= 0),
      total_cost_snapshot REAL NOT NULL CHECK(total_cost_snapshot >= 0),
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    )`,

    `CREATE INDEX IF NOT EXISTS idx_inventory_adjustment_alloc_adj ON inventory_adjustment_allocations(adjustment_id)`,
    `CREATE INDEX IF NOT EXISTS idx_inventory_adjustment_alloc_lot ON inventory_adjustment_allocations(lot_id)`,

    `CREATE TABLE IF NOT EXISTS adjustment_audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      adjustment_id INTEGER NOT NULL REFERENCES inventory_adjustments(id) ON DELETE CASCADE,
      event_type TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      event_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      previous_hash TEXT,
      event_hash TEXT NOT NULL,
      signature TEXT,
      immutable INTEGER NOT NULL DEFAULT 1 CHECK(immutable = 1)
    )`,

    `CREATE INDEX IF NOT EXISTS idx_adjustment_audit_adjustment ON adjustment_audit_log(adjustment_id)`,
    `CREATE INDEX IF NOT EXISTS idx_adjustment_audit_event_at ON adjustment_audit_log(event_at)`,

    `CREATE TRIGGER IF NOT EXISTS trg_adjustment_audit_log_no_update
      BEFORE UPDATE ON adjustment_audit_log
      BEGIN
        SELECT RAISE(ABORT, 'adjustment_audit_log es inmutable');
      END`,

    `CREATE TRIGGER IF NOT EXISTS trg_adjustment_audit_log_no_delete
      BEFORE DELETE ON adjustment_audit_log
      BEGIN
        SELECT RAISE(ABORT, 'adjustment_audit_log es inmutable');
      END`
  ],
};
