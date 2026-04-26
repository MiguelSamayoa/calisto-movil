/**
 * Migración v4 — Ventas FIFO multi-lote dentro de la app móvil.
 * Agrega trazabilidad de asignaciones de lote, estado del lote y costo base de la venta.
 */
export const V4_MIGRATION = {
  version: 4,
  statements: [
    `ALTER TABLE production_lots ADD COLUMN status TEXT NOT NULL DEFAULT 'ABIERTO'`,
    `ALTER TABLE sales ADD COLUMN cost_basis_total REAL NOT NULL DEFAULT 0`,
    `ALTER TABLE sales ADD COLUMN unit_cost_applied REAL NOT NULL DEFAULT 0`,
    `ALTER TABLE sales ADD COLUMN price_policy TEXT NOT NULL DEFAULT 'FIFO_MAX'`,

    `UPDATE production_lots
     SET status = CASE WHEN remaining_units <= 0 THEN 'CERRADO' ELSE 'ABIERTO' END`,

    `UPDATE sales
     SET cost_basis_total = CASE
       WHEN lot_id IS NOT NULL AND cost_basis_total = 0
       THEN COALESCE((SELECT cost_per_unit * quantity FROM production_lots WHERE production_lots.id = sales.lot_id), 0)
       ELSE cost_basis_total
     END,
     price_policy = COALESCE(price_policy, 'FIFO_MAX')`,

    `UPDATE sales
     SET unit_cost_applied = CASE
       WHEN quantity > 0 THEN cost_basis_total / quantity
       ELSE 0
     END`,

    `CREATE TABLE IF NOT EXISTS sale_lot_allocations (
      id                   INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id              INTEGER NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
      lot_id               INTEGER NOT NULL REFERENCES production_lots(id) ON DELETE RESTRICT,
      quantity             INTEGER NOT NULL CHECK(quantity > 0),
      selling_price_snapshot REAL NOT NULL CHECK(selling_price_snapshot >= 0),
      cost_per_unit_snapshot REAL NOT NULL CHECK(cost_per_unit_snapshot >= 0),
      created_at           TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    )`,

    `CREATE INDEX IF NOT EXISTS idx_sale_allocations_sale ON sale_lot_allocations(sale_id)`,
    `CREATE INDEX IF NOT EXISTS idx_sale_allocations_lot ON sale_lot_allocations(lot_id)`,
    `CREATE INDEX IF NOT EXISTS idx_sale_allocations_created_at ON sale_lot_allocations(created_at)`,
  ],
};