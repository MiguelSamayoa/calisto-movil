import { Injectable } from '@angular/core';
import { DatabaseService } from '@db/database.service';
import {
  Sale,
  CreateSaleDto,
  SaleWithProduct,
  DailyRevenue,
  MonthlySummary,
  TopProductStat,
  LowStockAlert,
  DashboardStats,
} from '@models/sale.model';

interface SaleRow {
  id: number;
  lot_id: number | null;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_amount: number;
  notes: string | null;
  sold_at: string;
  created_at: string;
}

interface SaleWithProductRow extends SaleRow {
  product_name: string;
  product_category: string;
  product_photo_path: string | null;
  cost_per_unit: number | null;
}

@Injectable({ providedIn: 'root' })
export class SaleRepository {
  constructor(private db: DatabaseService) {}

  private toModel(row: SaleRow): Sale {
    return {
      id: row.id,
      lotId: row.lot_id,
      productId: row.product_id,
      quantity: row.quantity,
      unitPrice: row.unit_price,
      totalAmount: row.total_amount,
      notes: row.notes,
      soldAt: row.sold_at,
      createdAt: row.created_at,
    };
  }

  private toModelWithProduct(row: SaleWithProductRow): SaleWithProduct {
    const cost = row.cost_per_unit != null ? row.cost_per_unit * row.quantity : null;
    return {
      ...this.toModel(row),
      productName: row.product_name,
      productCategory: row.product_category,
      productPhotoPath: row.product_photo_path,
      costPerUnit: row.cost_per_unit,
      profit: cost != null ? row.total_amount - cost : null,
    };
  }

  // ─── Queries ───────────────────────────────────────────────────────────────

  async findAll(limit = 50, offset = 0): Promise<SaleWithProduct[]> {
    const rows = await this.db.query<SaleWithProductRow>(
      `SELECT
         s.*,
         p.name       AS product_name,
         p.category   AS product_category,
         p.photo_path AS product_photo_path,
         pl.cost_per_unit
       FROM sales s
       JOIN products p   ON p.id  = s.product_id
       LEFT JOIN production_lots pl ON pl.id = s.lot_id
       ORDER BY s.sold_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows.map(r => this.toModelWithProduct(r));
  }

  async findByDateRange(from: string, to: string): Promise<SaleWithProduct[]> {
    const rows = await this.db.query<SaleWithProductRow>(
      `SELECT
         s.*,
         p.name       AS product_name,
         p.category   AS product_category,
         p.photo_path AS product_photo_path,
         pl.cost_per_unit
       FROM sales s
       JOIN products p ON p.id = s.product_id
       LEFT JOIN production_lots pl ON pl.id = s.lot_id
       WHERE s.sold_at BETWEEN ? AND ?
       ORDER BY s.sold_at DESC`,
      [from, to]
    );
    return rows.map(r => this.toModelWithProduct(r));
  }

  async findToday(): Promise<SaleWithProduct[]> {
    const today = new Date().toISOString().slice(0, 10);
    return this.findByDateRange(`${today}T00:00:00.000Z`, `${today}T23:59:59.999Z`);
  }

  // ─── Mutations ─────────────────────────────────────────────────────────────

  async create(dto: CreateSaleDto): Promise<Sale> {
    const totalAmount = dto.quantity * dto.unitPrice;
    const { lastId } = await this.db.execute(
      `INSERT INTO sales (lot_id, product_id, quantity, unit_price, total_amount, notes, sold_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        dto.lotId ?? null,
        dto.productId,
        dto.quantity,
        dto.unitPrice,
        totalAmount,
        dto.notes ?? null,
        dto.soldAt ?? new Date().toISOString(),
      ]
    );
    const rows = await this.db.query<SaleRow>(
      `SELECT * FROM sales WHERE id = ?`,
      [lastId]
    );
    return this.toModel(rows[0]);
  }

  async delete(id: number): Promise<void> {
    await this.db.execute(`DELETE FROM sales WHERE id = ?`, [id]);
  }

  // ─── Agregaciones para Dashboard ──────────────────────────────────────────

  async getDailyRevenue(days = 7): Promise<DailyRevenue[]> {
    const rows = await this.db.query<{
      date: string;
      total_sales: number;
      total_amount: number;
      total_cost: number;
    }>(
      `SELECT
         strftime('%Y-%m-%d', s.sold_at) AS date,
         COUNT(s.id)                     AS total_sales,
         SUM(s.total_amount)             AS total_amount,
         COALESCE(SUM(pl.cost_per_unit * s.quantity), 0) AS total_cost
       FROM sales s
       LEFT JOIN production_lots pl ON pl.id = s.lot_id
       WHERE s.sold_at >= datetime('now', '-' || ? || ' days')
       GROUP BY date
       ORDER BY date ASC`,
      [days]
    );
    return rows.map(r => ({
      date: r.date,
      totalSales: r.total_sales,
      totalAmount: r.total_amount,
      totalCost: r.total_cost,
      grossProfit: r.total_amount - r.total_cost,
    }));
  }

  async getMonthlySummary(year: number, month: number): Promise<MonthlySummary> {
    const ym = `${year}-${String(month).padStart(2, '0')}`;
    const rows = await this.db.query<{
      total_revenue: number;
      total_cost: number;
      total_units: number;
    }>(
      `SELECT
         SUM(s.total_amount) AS total_revenue,
         COALESCE(SUM(pl.cost_per_unit * s.quantity), 0) AS total_cost,
         SUM(s.quantity) AS total_units
       FROM sales s
       LEFT JOIN production_lots pl ON pl.id = s.lot_id
       WHERE strftime('%Y-%m', s.sold_at) = ?`,
      [ym]
    );

    const topRows = await this.db.query<{ product_name: string; total: number }>(
      `SELECT p.name AS product_name, SUM(s.quantity) AS total
       FROM sales s JOIN products p ON p.id = s.product_id
       WHERE strftime('%Y-%m', s.sold_at) = ?
       GROUP BY s.product_id ORDER BY total DESC LIMIT 1`,
      [ym]
    );

    const r = rows[0] ?? { total_revenue: 0, total_cost: 0, total_units: 0 };
    const revenue = r.total_revenue ?? 0;
    const cost = r.total_cost ?? 0;
    const profit = revenue - cost;

    return {
      year,
      month,
      totalRevenue: revenue,
      totalCost: cost,
      grossProfit: profit,
      profitMargin: revenue > 0 ? (profit / revenue) * 100 : 0,
      totalUnitsSold: r.total_units ?? 0,
      topProduct: topRows[0]?.product_name ?? null,
    };
  }

  async getTopProducts(limit = 5, days = 30): Promise<TopProductStat[]> {
    const rows = await this.db.query<{
      product_id: number;
      product_name: string;
      total_sold: number;
      total_revenue: number;
    }>(
      `SELECT
         s.product_id,
         p.name  AS product_name,
         SUM(s.quantity)     AS total_sold,
         SUM(s.total_amount) AS total_revenue
       FROM sales s
       JOIN products p ON p.id = s.product_id
       WHERE s.sold_at >= datetime('now', '-' || ? || ' days')
       GROUP BY s.product_id
       ORDER BY total_sold DESC
       LIMIT ?`,
      [days, limit]
    );
    return rows.map(r => ({
      productId: r.product_id,
      productName: r.product_name,
      totalSold: r.total_sold,
      totalRevenue: r.total_revenue,
    }));
  }

  async getLowStockAlerts(threshold = 1): Promise<LowStockAlert[]> {
    const rows = await this.db.query<{
      id: number;
      name: string;
      unit: string;
      stock: number;
    }>(
      `SELECT id, name, unit, stock
       FROM materials
       WHERE stock <= ? AND is_active = 1
       ORDER BY stock ASC`,
      [threshold]
    );
    return rows.map(r => ({
      materialId: r.id,
      materialName: r.name,
      unit: r.unit,
      currentStock: r.stock,
    }));
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const [todayRows, monthRows, last7Days, topProducts, lowStock] =
      await Promise.all([
        this.db.query<{
          cnt: number; revenue: number; cost: number;
        }>(
          `SELECT
             COUNT(*) AS cnt,
             COALESCE(SUM(s.total_amount), 0) AS revenue,
             COALESCE(SUM(pl.cost_per_unit * s.quantity), 0) AS cost
           FROM sales s
           LEFT JOIN production_lots pl ON pl.id = s.lot_id
           WHERE date(s.sold_at) = ?`,
          [today]
        ),
        this.db.query<{
          revenue: number; cost: number;
        }>(
          `SELECT
             COALESCE(SUM(s.total_amount), 0) AS revenue,
             COALESCE(SUM(pl.cost_per_unit * s.quantity), 0) AS cost
           FROM sales s
           LEFT JOIN production_lots pl ON pl.id = s.lot_id
           WHERE strftime('%Y-%m', s.sold_at) = ?`,
          [`${year}-${String(month).padStart(2, '0')}`]
        ),
        this.getDailyRevenue(7),
        this.getTopProducts(5, 30),
        this.getLowStockAlerts(1),
      ]);

    const t = todayRows[0] ?? { cnt: 0, revenue: 0, cost: 0 };
    const m = monthRows[0] ?? { revenue: 0, cost: 0 };
    const mProfit = m.revenue - m.cost;

    return {
      todaySales: t.cnt,
      todayRevenue: t.revenue,
      todayCost: t.cost,
      todayProfit: t.revenue - t.cost,
      monthRevenue: m.revenue,
      monthCost: m.cost,
      monthProfit: mProfit,
      monthProfitMargin: m.revenue > 0 ? (mProfit / m.revenue) * 100 : 0,
      last7Days,
      topProducts,
      lowStockMaterials: lowStock,
    };
  }
}
