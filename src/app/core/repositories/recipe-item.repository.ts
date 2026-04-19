import { Injectable } from '@angular/core';
import { DatabaseService } from '@db/database.service';
import {
  RecipeItem,
  CreateRecipeItemDto,
  UpdateRecipeItemDto,
} from '@models/recipe-item.model';

interface RecipeItemRow {
  id: number;
  product_id: number;
  material_id: number | null;
  sub_product_id: number | null;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class RecipeItemRepository {
  constructor(private db: DatabaseService) {}

  private toModel(row: RecipeItemRow): RecipeItem {
    return {
      id: row.id,
      productId: row.product_id,
      materialId: row.material_id,
      subProductId: row.sub_product_id,
      quantity: row.quantity,
    };
  }

  async findByProduct(productId: number): Promise<RecipeItem[]> {
    const rows = await this.db.query<RecipeItemRow>(
      `SELECT * FROM recipe_items WHERE product_id = ?`,
      [productId]
    );
    return rows.map(r => this.toModel(r));
  }

  /** Reemplaza toda la receta de un producto en una transacción */
  async replaceRecipe(
    productId: number,
    items: Omit<CreateRecipeItemDto, 'productId'>[]
  ): Promise<void> {
    await this.db.transaction(async () => {
      await this.db.execute(
        `DELETE FROM recipe_items WHERE product_id = ?`,
        [productId]
      );
      for (const item of items) {
        await this.db.execute(
          `INSERT INTO recipe_items (product_id, material_id, sub_product_id, quantity)
           VALUES (?, ?, ?, ?)`,
          [productId, item.materialId, item.subProductId, item.quantity]
        );
      }
    });
  }

  async update(id: number, dto: UpdateRecipeItemDto): Promise<void> {
    await this.db.execute(
      `UPDATE recipe_items SET quantity = ? WHERE id = ?`,
      [dto.quantity, id]
    );
  }

  async delete(id: number): Promise<void> {
    await this.db.execute(`DELETE FROM recipe_items WHERE id = ?`, [id]);
  }

  async deleteByProduct(productId: number): Promise<void> {
    await this.db.execute(
      `DELETE FROM recipe_items WHERE product_id = ?`,
      [productId]
    );
  }
}
