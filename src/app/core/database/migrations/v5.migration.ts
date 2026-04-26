/**
 * Migracion v5 - Ajustes manuales de inventario por lote.
 * Permite descontar unidades por vencimiento, merma, dano u otros ajustes.
 */
export const V5_MIGRATION = {
  version: 5,
  statements: [
    `CREATE TABLE IF NOT EXISTS lot_inventory_adjustments (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      lot_id     INTEGER NOT NULL REFERENCES production_lots(id) ON DELETE CASCADE,
      quantity   INTEGER NOT NULL CHECK(quantity > 0),
      reason     TEXT    NOT NULL CHECK(reason IN ('VENCIMIENTO', 'MERMA', 'DANIO', 'AJUSTE_MANUAL')),
      notes      TEXT,
      created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    )`,

    `CREATE INDEX IF NOT EXISTS idx_lot_inventory_adjustments_lot ON lot_inventory_adjustments(lot_id)`,
    `CREATE INDEX IF NOT EXISTS idx_lot_inventory_adjustments_created_at ON lot_inventory_adjustments(created_at)`
  ],
};
