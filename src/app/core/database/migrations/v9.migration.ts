/**
 * Migración v9 — Trazabilidad de actores y auditoría de ciclo de vida de lotes.
 * - created_by en ventas para identificar al operador que registró cada venta.
 * - operator_settings: store key-value para nombre de operador y configuraciones locales.
 * - lot_audit_log: bitácora de eventos de lote (anulaciones, cambios de precio).
 */
export const V9_MIGRATION = {
  version: 9,
  statements: [
    `ALTER TABLE sales ADD COLUMN created_by TEXT NOT NULL DEFAULT 'app'`,

    `CREATE TABLE IF NOT EXISTS operator_settings (
      key        TEXT PRIMARY KEY,
      value      TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    )`,

    `CREATE TABLE IF NOT EXISTS lot_audit_log (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      lot_id     INTEGER NOT NULL REFERENCES production_lots(id) ON DELETE CASCADE,
      event_type TEXT    NOT NULL,
      old_value  TEXT,
      new_value  TEXT,
      actor_id   TEXT    NOT NULL,
      notes      TEXT,
      created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    )`,

    `CREATE INDEX IF NOT EXISTS idx_lot_audit_log_lot  ON lot_audit_log(lot_id)`,
    `CREATE INDEX IF NOT EXISTS idx_lot_audit_log_type ON lot_audit_log(event_type)`,
  ],
};
