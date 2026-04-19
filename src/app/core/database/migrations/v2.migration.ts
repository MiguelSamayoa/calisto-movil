/**
 * Migración v2 — Soporte de subproductos en recetas
 * Cambia: recipe_items ahora acepta sub_product_id (nullable) además de material_id (nullable)
 */
export const V2_MIGRATION = {
  version: 2,
  statements: [
    // Renombrar tabla existente para preservar datos
    `ALTER TABLE recipe_items RENAME TO recipe_items_v1`,

    // Nueva tabla con soporte para material_id O sub_product_id
    `CREATE TABLE recipe_items (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id     INTEGER NOT NULL REFERENCES products(id)  ON DELETE CASCADE,
      material_id    INTEGER          REFERENCES materials(id) ON DELETE RESTRICT,
      sub_product_id INTEGER          REFERENCES products(id)  ON DELETE RESTRICT,
      quantity       REAL    NOT NULL CHECK(quantity > 0),
      CHECK(
        (material_id IS NOT NULL AND sub_product_id IS NULL) OR
        (material_id IS NULL     AND sub_product_id IS NOT NULL)
      )
    )`,

    // Copiar datos existentes (todos tenían material_id)
    `INSERT INTO recipe_items (id, product_id, material_id, sub_product_id, quantity)
     SELECT id, product_id, material_id, NULL, quantity FROM recipe_items_v1`,

    `DROP TABLE recipe_items_v1`,

    // Índices únicos parciales (SQLite soporta WHERE en índices)
    `CREATE UNIQUE INDEX IF NOT EXISTS uq_recipe_material
       ON recipe_items(product_id, material_id)    WHERE material_id    IS NOT NULL`,

    `CREATE UNIQUE INDEX IF NOT EXISTS uq_recipe_subproduct
       ON recipe_items(product_id, sub_product_id) WHERE sub_product_id IS NOT NULL`,

    `CREATE INDEX IF NOT EXISTS idx_recipe_product    ON recipe_items(product_id)`,
    `CREATE INDEX IF NOT EXISTS idx_recipe_material   ON recipe_items(material_id)   WHERE material_id    IS NOT NULL`,
    `CREATE INDEX IF NOT EXISTS idx_recipe_subproduct ON recipe_items(sub_product_id) WHERE sub_product_id IS NOT NULL`,

    // Actualizar trigger para ser explícito con NULLs
    `DROP TRIGGER IF EXISTS trg_deduct_stock_on_lot`,

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
          SELECT material_id FROM recipe_items
          WHERE product_id = NEW.product_id
            AND material_id IS NOT NULL
        );
      END`,
  ],
};
