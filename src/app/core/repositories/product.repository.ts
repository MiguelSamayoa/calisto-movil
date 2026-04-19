import { Injectable } from '@angular/core';
import { DatabaseService } from '@db/database.service';
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductWithRecipe,
  RecipeItemDetail,
} from '@models/product.model';

interface ProductRow {
  id: number;
  name: string;
  description: string | null;
  category: string;
  photo_path: string | null;
  yield_units: number;
  suggested_price: number | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface RecipeItemDetailRow {
  recipe_item_id: number;
  item_type: 'material' | 'subproduct';
  material_id: number | null;
  sub_product_id: number | null;
  material_name: string;
  material_unit: string;
  quantity: number;
  unit_cost: number;
}

@Injectable({ providedIn: 'root' })
export class ProductRepository {
  constructor(private db: DatabaseService) {}

  // ─── Mappers ───────────────────────────────────────────────────────────────

  private toModel(row: ProductRow): Product {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category,
      photoPath: row.photo_path,
      yieldUnits: row.yield_units,
      suggestedPrice: row.suggested_price,
      isActive: row.is_active === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private toRecipeDetail(row: RecipeItemDetailRow): RecipeItemDetail {
    const subtotal = row.quantity * row.unit_cost;
    return {
      recipeItemId: row.recipe_item_id,
      type: row.item_type,
      materialId: row.material_id,
      subProductId: row.sub_product_id,
      materialName: row.material_name,
      materialUnit: row.material_unit,
      quantity: row.quantity,
      unitCost: row.unit_cost,
      subtotalCost: subtotal,
    };
  }

  // ─── Queries ───────────────────────────────────────────────────────────────

  async findAll(includeInactive = false): Promise<Product[]> {
    const sql = includeInactive
      ? `SELECT * FROM products ORDER BY category, name COLLATE NOCASE`
      : `SELECT * FROM products WHERE is_active = 1 ORDER BY category, name COLLATE NOCASE`;
    const rows = await this.db.query<ProductRow>(sql);
    return rows.map(r => this.toModel(r));
  }

  async findById(id: number): Promise<Product | null> {
    const rows = await this.db.query<ProductRow>(
      `SELECT * FROM products WHERE id = ?`,
      [id]
    );
    return rows[0] ? this.toModel(rows[0]) : null;
  }

  async findByCategory(category: string): Promise<Product[]> {
    const rows = await this.db.query<ProductRow>(
      `SELECT * FROM products WHERE category = ? AND is_active = 1 ORDER BY name`,
      [category]
    );
    return rows.map(r => this.toModel(r));
  }

  async findCategories(): Promise<string[]> {
    const rows = await this.db.query<{ category: string }>(
      `SELECT DISTINCT category FROM products WHERE is_active = 1 ORDER BY category`
    );
    return rows.map(r => r.category);
  }

  /** Devuelve el producto con su receta completa y costos calculados */
  async findWithRecipe(id: number): Promise<ProductWithRecipe | null> {
    const product = await this.findById(id);
    if (!product) return null;

    const recipeRows = await this.db.query<RecipeItemDetailRow>(
      `SELECT
         ri.id        AS recipe_item_id,
         'material'   AS item_type,
         ri.material_id,
         NULL         AS sub_product_id,
         m.name       AS material_name,
         m.unit       AS material_unit,
         ri.quantity,
         m.unit_cost
       FROM recipe_items ri
       JOIN materials m ON m.id = ri.material_id
       WHERE ri.product_id = ? AND ri.material_id IS NOT NULL

       UNION ALL

       SELECT
         ri.id          AS recipe_item_id,
         'subproduct'   AS item_type,
         NULL           AS material_id,
         ri.sub_product_id,
         p.name         AS material_name,
         'unidad'       AS material_unit,
         ri.quantity,
         CASE
           WHEN p.yield_units > 0
           THEN COALESCE(
             (SELECT SUM(ri2.quantity * m2.unit_cost)
              FROM recipe_items ri2
              JOIN materials m2 ON m2.id = ri2.material_id
              WHERE ri2.product_id = ri.sub_product_id
                AND ri2.material_id IS NOT NULL),
             0
           ) / p.yield_units
           ELSE 0
         END AS unit_cost
       FROM recipe_items ri
       JOIN products p ON p.id = ri.sub_product_id
       WHERE ri.product_id = ? AND ri.sub_product_id IS NOT NULL

       ORDER BY material_name`,
      [id, id]
    );

    const recipe = recipeRows.map(r => this.toRecipeDetail(r));
    const recipeCostPerBatch = recipe.reduce((sum, r) => sum + r.subtotalCost, 0);
    const recipeCostPerUnit =
      product.yieldUnits > 0 ? recipeCostPerBatch / product.yieldUnits : 0;

    return { ...product, recipe, recipeCostPerBatch, recipeCostPerUnit };
  }

  // ─── Mutations ─────────────────────────────────────────────────────────────

  async create(dto: CreateProductDto): Promise<Product> {
    const { lastId } = await this.db.execute(
      `INSERT INTO products (name, description, category, photo_path, yield_units, suggested_price)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        dto.name,
        dto.description ?? null,
        dto.category ?? 'General',
        dto.photoPath ?? null,
        dto.yieldUnits,
        dto.suggestedPrice ?? null,
      ]
    );
    return (await this.findById(lastId))!;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const current = await this.findById(id);
    if (!current) throw new Error(`Producto #${id} no encontrado`);

    await this.db.execute(
      `UPDATE products
       SET name = ?, description = ?, category = ?, photo_path = ?,
           yield_units = ?, suggested_price = ?
       WHERE id = ?`,
      [
        dto.name ?? current.name,
        dto.description !== undefined ? dto.description : current.description,
        dto.category ?? current.category,
        dto.photoPath !== undefined ? dto.photoPath : current.photoPath,
        dto.yieldUnits ?? current.yieldUnits,
        dto.suggestedPrice !== undefined ? dto.suggestedPrice : current.suggestedPrice,
        id,
      ]
    );
    return (await this.findById(id))!;
  }

  async softDelete(id: number): Promise<void> {
    await this.db.execute(`UPDATE products SET is_active = 0 WHERE id = ?`, [id]);
  }
}
