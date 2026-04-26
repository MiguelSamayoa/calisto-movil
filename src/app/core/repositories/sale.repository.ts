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
  SalePreview,
  SaleStockInsufficientError,
  SalePricePolicy,
} from '@models/sale.model';

interface SaleRow {
  id: number;
  lot_id: number | null;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_amount: number;
  cost_basis_total: number;
  unit_cost_applied: number;
  price_policy: SalePricePolicy;
  notes: string | null;
  sold_at: string;
  created_at: string;
  created_by: string;
}

interface SaleWithProductRow extends SaleRow {
  product_name: string;
  product_category: string;
  product_photo_path: string | null;
}

interface AvailableLotRow {
  id: number;
  produced_at: string;
  remaining_units: number;
  selling_price: number;
  cost_per_unit: number;
}

interface SaleAllocationRow {
  lot_id: number;
  quantity: number;
  remaining_before: number;
  remaining_after: number;
  selling_price: number;
  cost_per_unit: number;
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
      costBasisTotal: row.cost_basis_total,
      unitCostApplied: row.unit_cost_applied,
      pricePolicy: row.price_policy,
      notes: row.notes,
      soldAt: row.sold_at,
      createdAt: row.created_at,
      createdBy: row.created_by,
    };
  }

  // ─── Helpers de rango de fechas en hora local ──────────────────────────────

  /**
   * Devuelve el inicio y fin del día actual en ISO UTC considerando la hora local
   * del dispositivo. new Date(y, m, d, h) usa hora local y toISOString() convierte
   * a UTC, garantizando que las consultas coincidan con el día del operador, no UTC.
   */
  private localDayRange(): { start: string; end: string } {
    const now = new Date();
    const s = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const e = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return { start: s.toISOString(), end: e.toISOString() };
  }

  /** Devuelve el inicio y fin del mes indicado en hora local del dispositivo. */
  private localMonthRange(year: number, month: number): { start: string; end: string } {
    // month es 1-indexed; day 0 del siguiente mes = último día del mes actual
    const s = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const e = new Date(year, month, 0, 23, 59, 59, 999);
    return { start: s.toISOString(), end: e.toISOString() };
  }

  private toModelWithProduct(row: SaleWithProductRow): SaleWithProduct {
    const cost = row.cost_basis_total;
    return {
      ...this.toModel(row),
      productName: row.product_name,
      productCategory: row.product_category,
      productPhotoPath: row.product_photo_path,
      costPerUnit: row.quantity > 0 ? cost / row.quantity : null,
      profit: row.total_amount - cost,
    };
  }

  private async getProductName(productId: number): Promise<string> {
    const rows = await this.db.query<{ name: string }>(
      `SELECT name FROM products WHERE id = ?`,
      [productId]
    );
    const product = rows[0];
    if (!product) {
      throw new Error(`Producto #${productId} no encontrado.`);
    }
    return product.name;
  }

  async previewFifoSale(productId: number, quantity: number): Promise<SalePreview> {
    if (quantity <= 0) {
      throw new Error('La cantidad debe ser mayor a 0.');
    }

    const productName = await this.getProductName(productId);
    const lots = await this.db.query<AvailableLotRow>(
      `SELECT id, produced_at, remaining_units, selling_price, cost_per_unit
       FROM production_lots
       WHERE product_id = ? AND status = 'ABIERTO' AND remaining_units > 0
       ORDER BY produced_at ASC, id ASC`,
      [productId]
    );

    const availableQuantity = lots.reduce((sum, lot) => sum + lot.remaining_units, 0);
    if (availableQuantity < quantity) {
      throw new SaleStockInsufficientError(productId, quantity, availableQuantity);
    }

    const allocations: SaleAllocationRow[] = [];
    let remaining = quantity;
    let unitPrice = 0;
    let costBasisTotal = 0;

    for (const lot of lots) {
      if (remaining <= 0) break;

      const consume = Math.min(remaining, lot.remaining_units);
      const remainingAfter = lot.remaining_units - consume;

      allocations.push({
        lot_id: lot.id,
        quantity: consume,
        remaining_before: lot.remaining_units,
        remaining_after: remainingAfter,
        selling_price: lot.selling_price,
        cost_per_unit: lot.cost_per_unit,
      });

      unitPrice = Math.max(unitPrice, lot.selling_price);
      costBasisTotal += consume * lot.cost_per_unit;
      remaining -= consume;
    }

    return {
      productId,
      productName,
      requestedQuantity: quantity,
      availableQuantity,
      unitPrice,
      totalAmount: unitPrice * quantity,
      costBasisTotal,
      lotsUsed: allocations.length,
      allocations: allocations.map(a => ({
        lotId: a.lot_id,
        producedAt: lots.find(l => l.id === a.lot_id)?.produced_at ?? new Date().toISOString(),
        quantity: a.quantity,
        remainingBefore: a.remaining_before,
        remainingAfter: a.remaining_after,
        sellingPrice: a.selling_price,
        costPerUnit: a.cost_per_unit,
      })),
    };
  }

  // ─── Queries ───────────────────────────────────────────────────────────────

  async findAll(limit = 50, offset = 0): Promise<SaleWithProduct[]> {
    const rows = await this.db.query<SaleWithProductRow>(
      `SELECT
         s.*,
         p.name       AS product_name,
         p.category   AS product_category,
         p.photo_path AS product_photo_path
       FROM sales s
       JOIN products p   ON p.id  = s.product_id
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
         p.photo_path AS product_photo_path
       FROM sales s
       JOIN products p ON p.id = s.product_id
       WHERE s.sold_at BETWEEN ? AND ?
       ORDER BY s.sold_at DESC`,
      [from, to]
    );
    return rows.map(r => this.toModelWithProduct(r));
  }

  async findToday(): Promise<SaleWithProduct[]> {
    const { start, end } = this.localDayRange();
    return this.findByDateRange(start, end);
  }

  // ─── Mutations ─────────────────────────────────────────────────────────────

  async create(dto: CreateSaleDto): Promise<Sale> {
    return this.registerFifoSale(dto);
  }

  async registerFifoSale(dto: CreateSaleDto): Promise<Sale> {
    if (dto.quantity <= 0) {
      throw new Error('La cantidad debe ser mayor a 0.');
    }

    return this.db.transaction(async () => {
      const preview = await this.previewFifoSale(dto.productId, dto.quantity);
      const soldAt = dto.soldAt ?? new Date().toISOString();
      const primaryLotId = preview.allocations[0]?.lotId ?? null;
      const unitCostApplied = this.quantityToUnitCost(preview.costBasisTotal, dto.quantity);
      const totalAmount = preview.totalAmount;

      const { lastId } = await this.db.execute(
        `INSERT INTO sales
           (lot_id, product_id, quantity, unit_price, total_amount, cost_basis_total,
            unit_cost_applied, price_policy, notes, sold_at, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          primaryLotId,
          dto.productId,
          dto.quantity,
          preview.unitPrice,
          totalAmount,
          preview.costBasisTotal,
          unitCostApplied,
          'FIFO_MAX',
          dto.notes ?? null,
          soldAt,
          dto.createdBy ?? 'app',
        ]
      );

      for (const allocation of preview.allocations) {
        const update = await this.db.execute(
          `UPDATE production_lots
           SET remaining_units = remaining_units - ?,
               status = CASE WHEN remaining_units - ? <= 0 THEN 'CERRADO' ELSE 'ABIERTO' END
           WHERE id = ? AND remaining_units >= ? AND status = 'ABIERTO'`,
          [allocation.quantity, allocation.quantity, allocation.lotId, allocation.quantity]
        );

        if (update.changes === 0) {
          throw new SaleStockInsufficientError(
            dto.productId,
            dto.quantity,
            preview.availableQuantity
          );
        }

        await this.db.execute(
          `INSERT INTO sale_lot_allocations
             (sale_id, lot_id, quantity, selling_price_snapshot, cost_per_unit_snapshot)
           VALUES (?, ?, ?, ?, ?)`,
          [
            lastId,
            allocation.lotId,
            allocation.quantity,
            allocation.sellingPrice,
            allocation.costPerUnit,
          ]
        );
      }

      const rows = await this.db.query<SaleRow>(`SELECT * FROM sales WHERE id = ?`, [lastId]);
      return this.toModel(rows[0]);
    });
  }

  async delete(_id: number): Promise<void> {
    throw new Error('La eliminacion de ventas no esta permitida.');
  }

  // ─── Agregaciones para Dashboard ──────────────────────────────────────────

  async getDailyRevenue(days = 7): Promise<DailyRevenue[]> {
    // El cutoff se calcula desde la medianoche local de hace N días para no
    // cortar el día a mitad según UTC. Guatemala es siempre GTM-6 sin DST.
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoff = new Date(
      cutoffDate.getFullYear(), cutoffDate.getMonth(), cutoffDate.getDate()
    ).toISOString();

    // strftime ajustado a GTM-6 para que las ventas nocturnas (18:00-23:59 local)
    // queden en el día correcto y no en el día UTC siguiente.
    const rows = await this.db.query<{
      date: string;
      total_sales: number;
      total_amount: number;
      total_cost: number;
    }>(
      `SELECT
         strftime('%Y-%m-%d', datetime(s.sold_at, '-6 hours')) AS date,
         COUNT(s.id)                                            AS total_sales,
         SUM(s.total_amount)                                    AS total_amount,
         COALESCE(SUM(s.cost_basis_total), 0)                  AS total_cost
       FROM sales s
       WHERE s.sold_at >= ?
       GROUP BY date
       ORDER BY date ASC`,
      [cutoff]
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
    const { start: monthStart, end: monthEnd } = this.localMonthRange(year, month);
    const rows = await this.db.query<{
      total_revenue: number;
      total_cost: number;
      total_units: number;
    }>(
      `SELECT
         SUM(s.total_amount)              AS total_revenue,
         COALESCE(SUM(s.cost_basis_total), 0) AS total_cost,
         SUM(s.quantity)                  AS total_units
       FROM sales s
       WHERE s.sold_at BETWEEN ? AND ?`,
      [monthStart, monthEnd]
    );

    const topRows = await this.db.query<{ product_name: string; total: number }>(
      `SELECT p.name AS product_name, SUM(s.quantity) AS total
       FROM sales s JOIN products p ON p.id = s.product_id
       WHERE s.sold_at BETWEEN ? AND ?
       GROUP BY s.product_id ORDER BY total DESC LIMIT 1`,
      [monthStart, monthEnd]
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
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoff = new Date(
      cutoffDate.getFullYear(), cutoffDate.getMonth(), cutoffDate.getDate()
    ).toISOString();

    const rows = await this.db.query<{
      product_id: number;
      product_name: string;
      total_sold: number;
      total_revenue: number;
    }>(
      `SELECT
         s.product_id,
         p.name              AS product_name,
         SUM(s.quantity)     AS total_sold,
         SUM(s.total_amount) AS total_revenue
       FROM sales s
       JOIN products p ON p.id = s.product_id
       WHERE s.sold_at >= ?
       GROUP BY s.product_id
       ORDER BY total_sold DESC
       LIMIT ?`,
      [cutoff, limit]
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
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const { start: todayStart, end: todayEnd } = this.localDayRange();
    const { start: monthStart, end: monthEnd } = this.localMonthRange(year, month);

    const [todayRows, monthRows, todayAdjustmentsRows, monthAdjustmentsRows, last7Days, topProducts, lowStock] =
      await Promise.all([
        this.db.query<{
          cnt: number; revenue: number; cost: number;
        }>(
          `SELECT
             COUNT(*) AS cnt,
             COALESCE(SUM(s.total_amount), 0)      AS revenue,
             COALESCE(SUM(s.cost_basis_total), 0)  AS cost
           FROM sales s
           WHERE s.sold_at BETWEEN ? AND ?`,
          [todayStart, todayEnd]
        ),
        this.db.query<{
          revenue: number; cost: number;
        }>(
          `SELECT
             COALESCE(SUM(s.total_amount), 0)     AS revenue,
             COALESCE(SUM(s.cost_basis_total), 0) AS cost
           FROM sales s
           WHERE s.sold_at BETWEEN ? AND ?`,
          [monthStart, monthEnd]
        ),
        this.db.query<{
          total_adjustments: number;
        }>(
          `SELECT
             COALESCE(SUM(ia.total_cost_snapshot), 0) AS total_adjustments
           FROM inventory_adjustments ia
           WHERE ia.created_at BETWEEN ? AND ? AND ia.status != 'REVERSED'`,
          [todayStart, todayEnd]
        ),
        this.db.query<{
          adj_cogs: number;
          adj_opex: number;
          adj_total: number;
        }>(
          `SELECT
             COALESCE(SUM(CASE WHEN ia.accounting_treatment = 'COGS' THEN ia.total_cost_snapshot ELSE 0 END), 0) AS adj_cogs,
             COALESCE(SUM(CASE WHEN ia.accounting_treatment = 'OPEX' THEN ia.total_cost_snapshot ELSE 0 END), 0) AS adj_opex,
             COALESCE(SUM(ia.total_cost_snapshot), 0)                                                            AS adj_total
           FROM inventory_adjustments ia
           WHERE ia.created_at BETWEEN ? AND ? AND ia.status != 'REVERSED'`,
          [monthStart, monthEnd]
        ),
        this.getDailyRevenue(7),
        this.getTopProducts(5, 30),
        this.getLowStockAlerts(1),
      ]);

    const t = todayRows[0] ?? { cnt: 0, revenue: 0, cost: 0 };
    const m = monthRows[0] ?? { revenue: 0, cost: 0 };
    const tAdj = todayAdjustmentsRows[0]?.total_adjustments ?? 0;
    const mAdj = monthAdjustmentsRows[0] ?? { adj_cogs: 0, adj_opex: 0, adj_total: 0 };
    const mProfit = m.revenue - m.cost;
    const todayNetProfitReal = t.revenue - t.cost - tAdj;
    const monthNetProfitReal = m.revenue - m.cost - mAdj.adj_total;

    return {
      todaySales: t.cnt,
      todayRevenue: t.revenue,
      todayCost: t.cost,
      todayProfit: t.revenue - t.cost,
      todayAdjustmentsCost: tAdj,
      todayNetProfitReal,
      monthRevenue: m.revenue,
      monthCost: m.cost,
      monthProfit: mProfit,
      monthProfitMargin: m.revenue > 0 ? (mProfit / m.revenue) * 100 : 0,
      monthAdjustmentsCogs: mAdj.adj_cogs,
      monthAdjustmentsOpex: mAdj.adj_opex,
      monthAdjustmentsTotal: mAdj.adj_total,
      monthNetProfitReal,
      monthNetMarginReal: m.revenue > 0 ? (monthNetProfitReal / m.revenue) * 100 : 0,
      last7Days,
      topProducts,
      lowStockMaterials: lowStock,
    };
  }

  private quantityToUnitCost(costBasisTotal: number, quantity: number): number {
    return quantity > 0 ? costBasisTotal / quantity : 0;
  }
}
