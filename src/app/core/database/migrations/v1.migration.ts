/**
 * Migración v1 — Schema inicial de Calisto
 * Tablas: materials, products, recipe_items, production_lots, sales
 */
export const V1_MIGRATION = {
  version: 1,
  statements: [
    // ─── Materiales / Insumos ───────────────────────────────────────────────
    `CREATE TABLE IF NOT EXISTS materials (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL COLLATE NOCASE,
      description TEXT,
      unit        TEXT    NOT NULL,           -- kg, g, L, mL, unidad, docena
      unit_cost   REAL    NOT NULL CHECK(unit_cost >= 0),
      stock       REAL    NOT NULL DEFAULT 0 CHECK(stock >= 0),
      photo_path  TEXT,                       -- ruta relativa en filesystem local
      is_active   INTEGER NOT NULL DEFAULT 1,
      created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      updated_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    )`,

    `CREATE INDEX IF NOT EXISTS idx_materials_name ON materials(name)`,
    `CREATE INDEX IF NOT EXISTS idx_materials_active ON materials(is_active)`,

    // ─── Productos (lo que se vende) ────────────────────────────────────────
    `CREATE TABLE IF NOT EXISTS products (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      name            TEXT    NOT NULL COLLATE NOCASE,
      description     TEXT,
      category        TEXT    NOT NULL DEFAULT 'General',
      photo_path      TEXT,
      yield_units     INTEGER NOT NULL DEFAULT 1 CHECK(yield_units > 0),
      suggested_price REAL,
      is_active       INTEGER NOT NULL DEFAULT 1,
      created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      updated_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    )`,

    `CREATE INDEX IF NOT EXISTS idx_products_name     ON products(name)`,
    `CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`,

    // ─── Items de receta (relación N:M producto–material) ──────────────────
    `CREATE TABLE IF NOT EXISTS recipe_items (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id  INTEGER NOT NULL REFERENCES products(id)  ON DELETE CASCADE,
      material_id INTEGER NOT NULL REFERENCES materials(id) ON DELETE RESTRICT,
      quantity    REAL    NOT NULL CHECK(quantity > 0),
      UNIQUE(product_id, material_id)
    )`,

    `CREATE INDEX IF NOT EXISTS idx_recipe_product  ON recipe_items(product_id)`,
    `CREATE INDEX IF NOT EXISTS idx_recipe_material ON recipe_items(material_id)`,

    // ─── Lotes de producción ────────────────────────────────────────────────
    `CREATE TABLE IF NOT EXISTS production_lots (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id      INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
      quantity        INTEGER NOT NULL CHECK(quantity > 0),
      total_cost      REAL    NOT NULL CHECK(total_cost >= 0),
      cost_per_unit   REAL    NOT NULL CHECK(cost_per_unit >= 0),
      selling_price   REAL    NOT NULL CHECK(selling_price >= 0),
      profit_margin   REAL    NOT NULL,               -- porcentaje: 40 = 40%
      remaining_units INTEGER NOT NULL DEFAULT 0,     -- unidades sin vender
      notes           TEXT,
      produced_at     TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    )`,

    `CREATE INDEX IF NOT EXISTS idx_lots_product     ON production_lots(product_id)`,
    `CREATE INDEX IF NOT EXISTS idx_lots_produced_at ON production_lots(produced_at)`,

    // ─── Ventas ──────────────────────────────────────────────────────────────
    `CREATE TABLE IF NOT EXISTS sales (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      lot_id       INTEGER REFERENCES production_lots(id) ON DELETE SET NULL,
      product_id   INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
      quantity     INTEGER NOT NULL CHECK(quantity > 0),
      unit_price   REAL    NOT NULL CHECK(unit_price >= 0),
      total_amount REAL    NOT NULL CHECK(total_amount >= 0),
      notes        TEXT,
      sold_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      created_at   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    )`,

    `CREATE INDEX IF NOT EXISTS idx_sales_product ON sales(product_id)`,
    `CREATE INDEX IF NOT EXISTS idx_sales_lot     ON sales(lot_id)`,
    `CREATE INDEX IF NOT EXISTS idx_sales_sold_at ON sales(sold_at)`,

    // ─── Trigger: actualizar updated_at en materials ───────────────────────
    `CREATE TRIGGER IF NOT EXISTS trg_materials_updated
      AFTER UPDATE ON materials
      FOR EACH ROW
      BEGIN
        UPDATE materials SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
        WHERE id = OLD.id;
      END`,

    // ─── Trigger: actualizar updated_at en products ────────────────────────
    `CREATE TRIGGER IF NOT EXISTS trg_products_updated
      AFTER UPDATE ON products
      FOR EACH ROW
      BEGIN
        UPDATE products SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
        WHERE id = OLD.id;
      END`,

    // ─── Trigger: descontar stock de materiales al crear lote ─────────────
    `CREATE TRIGGER IF NOT EXISTS trg_deduct_stock_on_lot
      AFTER INSERT ON production_lots
      FOR EACH ROW
      BEGIN
        UPDATE materials
        SET stock = stock - (
          SELECT ri.quantity * NEW.quantity
          FROM recipe_items ri
          WHERE ri.product_id = NEW.product_id
            AND ri.material_id = materials.id
        )
        WHERE id IN (
          SELECT material_id FROM recipe_items WHERE product_id = NEW.product_id
        );
      END`,

    // ─── Trigger: descontar remaining_units al registrar venta ────────────
    `CREATE TRIGGER IF NOT EXISTS trg_deduct_lot_units_on_sale
      AFTER INSERT ON sales
      FOR EACH ROW
      WHEN NEW.lot_id IS NOT NULL
      BEGIN
        UPDATE production_lots
        SET remaining_units = remaining_units - NEW.quantity
        WHERE id = NEW.lot_id;
      END`,
  ],
};
