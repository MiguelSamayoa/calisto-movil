import { Injectable } from '@angular/core';
import { DatabaseService } from '@db/database.service';
import {
  ProductionLot,
  CreateProductionLotDto,
  ProductionLotWithProduct,
} from '@models/production-lot.model';

interface LotRow {
  id: number;
  product_id: number;
  quantity: number;
  total_cost: number;
  cost_per_unit: number;
  selling_price: number;
  profit_margin: number;
  remaining_units: number;
  notes: string | null;
  produced_at: string;
  created_at: string;
}

interface LotWithProductRow extends LotRow {
  product_name: string;
  product_category: string;
  product_photo_path: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProductionLotRepository {
  constructor(private db: DatabaseService) {}

  private toModel(row: LotRow): ProductionLot {
    return {
      id: row.id,
      productId: row.product_id,
      quantity: row.quantity,
      totalCost: row.total_cost,
      costPerUnit: row.cost_per_unit,
      sellingPrice: row.selling_price,
      profitMargin: row.profit_margin,
      remainingUnits: row.remaining_units,
      notes: row.notes,
      producedAt: row.produced_at,
      createdAt: row.created_at,
    };
  }

  private toModelWithProduct(row: LotWithProductRow): ProductionLotWithProduct {
    return {
      ...this.toModel(row),
      productName: row.product_name,
      productCategory: row.product_category,
      productPhotoPath: row.product_photo_path,
    };
  }

  // ─── Queries ───────────────────────────────────────────────────────────────

  async findAll(limit = 50, offset = 0): Promise<ProductionLotWithProduct[]> {
    const rows = await this.db.query<LotWithProductRow>(
      `SELECT
         pl.*,
         p.name       AS product_name,
         p.category   AS product_category,
         p.photo_path AS product_photo_path
       FROM production_lots pl
       JOIN products p ON p.id = pl.product_id
       ORDER BY pl.produced_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows.map(r => this.toModelWithProduct(r));
  }

  async findById(id: number): Promise<ProductionLotWithProduct | null> {
    const rows = await this.db.query<LotWithProductRow>(
      `SELECT
         pl.*,
         p.name       AS product_name,
         p.category   AS product_category,
         p.photo_path AS product_photo_path
       FROM production_lots pl
       JOIN products p ON p.id = pl.product_id
       WHERE pl.id = ?`,
      [id]
    );
    return rows[0] ? this.toModelWithProduct(rows[0]) : null;
  }

  async findByProduct(productId: number, limit = 20): Promise<ProductionLot[]> {
    const rows = await this.db.query<LotRow>(
      `SELECT * FROM production_lots WHERE product_id = ?
       ORDER BY produced_at DESC LIMIT ?`,
      [productId, limit]
    );
    return rows.map(r => this.toModel(r));
  }

  async findWithStock(productId?: number): Promise<ProductionLotWithProduct[]> {
    const base = `
      SELECT
        pl.*,
        p.name       AS product_name,
        p.category   AS product_category,
        p.photo_path AS product_photo_path
      FROM production_lots pl
      JOIN products p ON p.id = pl.product_id
      WHERE pl.remaining_units > 0`;

    const rows = productId
      ? await this.db.query<LotWithProductRow>(
          `${base} AND pl.product_id = ? ORDER BY pl.produced_at ASC`,
          [productId]
        )
      : await this.db.query<LotWithProductRow>(
          `${base} ORDER BY p.name, pl.produced_at ASC`
        );

    return rows.map(r => this.toModelWithProduct(r));
  }

  async findByDateRange(from: string, to: string): Promise<ProductionLotWithProduct[]> {
    const rows = await this.db.query<LotWithProductRow>(
      `SELECT
         pl.*,
         p.name       AS product_name,
         p.category   AS product_category,
         p.photo_path AS product_photo_path
       FROM production_lots pl
       JOIN products p ON p.id = pl.product_id
       WHERE pl.produced_at BETWEEN ? AND ?
       ORDER BY pl.produced_at DESC`,
      [from, to]
    );
    return rows.map(r => this.toModelWithProduct(r));
  }

  // ─── Mutations ─────────────────────────────────────────────────────────────

  async create(
    dto: CreateProductionLotDto,
    totalCost: number,
    costPerUnit: number
  ): Promise<ProductionLot> {
    const { lastId } = await this.db.execute(
      `INSERT INTO production_lots
         (product_id, quantity, total_cost, cost_per_unit, selling_price,
          profit_margin, remaining_units, notes, produced_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dto.productId,
        dto.quantity,
        totalCost,
        costPerUnit,
        dto.sellingPrice,
        dto.profitMargin,
        dto.quantity,   // inicialmente todos sin vender
        dto.notes ?? null,
        dto.producedAt ?? new Date().toISOString(),
      ]
    );
    const row = await this.db.query<LotRow>(
      `SELECT * FROM production_lots WHERE id = ?`,
      [lastId]
    );
    return this.toModel(row[0]);
  }

  async updateSellingPrice(id: number, sellingPrice: number): Promise<void> {
    await this.db.execute(
      `UPDATE production_lots SET selling_price = ? WHERE id = ?`,
      [sellingPrice, id]
    );
  }

  async delete(id: number): Promise<void> {
    await this.db.execute(`DELETE FROM production_lots WHERE id = ?`, [id]);
  }
}
