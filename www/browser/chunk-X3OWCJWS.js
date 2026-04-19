import {
  ProductionLotRepository
} from "./chunk-QX25LUL7.js";
import {
  DatabaseService
} from "./chunk-SJAJ33WN.js";
import {
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-6GE63MYY.js";
import {
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-J4B6MK7R.js";

// src/app/core/repositories/sale.repository.ts
var SaleRepository = class _SaleRepository {
  constructor(db) {
    this.db = db;
  }
  toModel(row) {
    return {
      id: row.id,
      lotId: row.lot_id,
      productId: row.product_id,
      quantity: row.quantity,
      unitPrice: row.unit_price,
      totalAmount: row.total_amount,
      notes: row.notes,
      soldAt: row.sold_at,
      createdAt: row.created_at
    };
  }
  toModelWithProduct(row) {
    const cost = row.cost_per_unit != null ? row.cost_per_unit * row.quantity : null;
    return __spreadProps(__spreadValues({}, this.toModel(row)), {
      productName: row.product_name,
      productCategory: row.product_category,
      productPhotoPath: row.product_photo_path,
      costPerUnit: row.cost_per_unit,
      profit: cost != null ? row.total_amount - cost : null
    });
  }
  // ─── Queries ───────────────────────────────────────────────────────────────
  findAll(limit = 50, offset = 0) {
    return __async(this, null, function* () {
      const rows = yield this.db.query(`SELECT
         s.*,
         p.name       AS product_name,
         p.category   AS product_category,
         p.photo_path AS product_photo_path,
         pl.cost_per_unit
       FROM sales s
       JOIN products p   ON p.id  = s.product_id
       LEFT JOIN production_lots pl ON pl.id = s.lot_id
       ORDER BY s.sold_at DESC
       LIMIT ? OFFSET ?`, [limit, offset]);
      return rows.map((r) => this.toModelWithProduct(r));
    });
  }
  findByDateRange(from, to) {
    return __async(this, null, function* () {
      const rows = yield this.db.query(`SELECT
         s.*,
         p.name       AS product_name,
         p.category   AS product_category,
         p.photo_path AS product_photo_path,
         pl.cost_per_unit
       FROM sales s
       JOIN products p ON p.id = s.product_id
       LEFT JOIN production_lots pl ON pl.id = s.lot_id
       WHERE s.sold_at BETWEEN ? AND ?
       ORDER BY s.sold_at DESC`, [from, to]);
      return rows.map((r) => this.toModelWithProduct(r));
    });
  }
  findToday() {
    return __async(this, null, function* () {
      const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      return this.findByDateRange(`${today}T00:00:00.000Z`, `${today}T23:59:59.999Z`);
    });
  }
  // ─── Mutations ─────────────────────────────────────────────────────────────
  create(dto) {
    return __async(this, null, function* () {
      const totalAmount = dto.quantity * dto.unitPrice;
      const { lastId } = yield this.db.execute(`INSERT INTO sales (lot_id, product_id, quantity, unit_price, total_amount, notes, sold_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, [
        dto.lotId ?? null,
        dto.productId,
        dto.quantity,
        dto.unitPrice,
        totalAmount,
        dto.notes ?? null,
        dto.soldAt ?? (/* @__PURE__ */ new Date()).toISOString()
      ]);
      const rows = yield this.db.query(`SELECT * FROM sales WHERE id = ?`, [lastId]);
      return this.toModel(rows[0]);
    });
  }
  delete(id) {
    return __async(this, null, function* () {
      yield this.db.execute(`DELETE FROM sales WHERE id = ?`, [id]);
    });
  }
  // ─── Agregaciones para Dashboard ──────────────────────────────────────────
  getDailyRevenue(days = 7) {
    return __async(this, null, function* () {
      const rows = yield this.db.query(`SELECT
         strftime('%Y-%m-%d', s.sold_at) AS date,
         COUNT(s.id)                     AS total_sales,
         SUM(s.total_amount)             AS total_amount,
         COALESCE(SUM(pl.cost_per_unit * s.quantity), 0) AS total_cost
       FROM sales s
       LEFT JOIN production_lots pl ON pl.id = s.lot_id
       WHERE s.sold_at >= datetime('now', '-' || ? || ' days')
       GROUP BY date
       ORDER BY date ASC`, [days]);
      return rows.map((r) => ({
        date: r.date,
        totalSales: r.total_sales,
        totalAmount: r.total_amount,
        totalCost: r.total_cost,
        grossProfit: r.total_amount - r.total_cost
      }));
    });
  }
  getMonthlySummary(year, month) {
    return __async(this, null, function* () {
      const ym = `${year}-${String(month).padStart(2, "0")}`;
      const rows = yield this.db.query(`SELECT
         SUM(s.total_amount) AS total_revenue,
         COALESCE(SUM(pl.cost_per_unit * s.quantity), 0) AS total_cost,
         SUM(s.quantity) AS total_units
       FROM sales s
       LEFT JOIN production_lots pl ON pl.id = s.lot_id
       WHERE strftime('%Y-%m', s.sold_at) = ?`, [ym]);
      const topRows = yield this.db.query(`SELECT p.name AS product_name, SUM(s.quantity) AS total
       FROM sales s JOIN products p ON p.id = s.product_id
       WHERE strftime('%Y-%m', s.sold_at) = ?
       GROUP BY s.product_id ORDER BY total DESC LIMIT 1`, [ym]);
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
        profitMargin: revenue > 0 ? profit / revenue * 100 : 0,
        totalUnitsSold: r.total_units ?? 0,
        topProduct: topRows[0]?.product_name ?? null
      };
    });
  }
  getTopProducts(limit = 5, days = 30) {
    return __async(this, null, function* () {
      const rows = yield this.db.query(`SELECT
         s.product_id,
         p.name  AS product_name,
         SUM(s.quantity)     AS total_sold,
         SUM(s.total_amount) AS total_revenue
       FROM sales s
       JOIN products p ON p.id = s.product_id
       WHERE s.sold_at >= datetime('now', '-' || ? || ' days')
       GROUP BY s.product_id
       ORDER BY total_sold DESC
       LIMIT ?`, [days, limit]);
      return rows.map((r) => ({
        productId: r.product_id,
        productName: r.product_name,
        totalSold: r.total_sold,
        totalRevenue: r.total_revenue
      }));
    });
  }
  getLowStockAlerts(threshold = 1) {
    return __async(this, null, function* () {
      const rows = yield this.db.query(`SELECT id, name, unit, stock
       FROM materials
       WHERE stock <= ? AND is_active = 1
       ORDER BY stock ASC`, [threshold]);
      return rows.map((r) => ({
        materialId: r.id,
        materialName: r.name,
        unit: r.unit,
        currentStock: r.stock
      }));
    });
  }
  getDashboardStats() {
    return __async(this, null, function* () {
      const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      const now = /* @__PURE__ */ new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const [todayRows, monthRows, last7Days, topProducts, lowStock] = yield Promise.all([
        this.db.query(`SELECT
             COUNT(*) AS cnt,
             COALESCE(SUM(s.total_amount), 0) AS revenue,
             COALESCE(SUM(pl.cost_per_unit * s.quantity), 0) AS cost
           FROM sales s
           LEFT JOIN production_lots pl ON pl.id = s.lot_id
           WHERE date(s.sold_at) = ?`, [today]),
        this.db.query(`SELECT
             COALESCE(SUM(s.total_amount), 0) AS revenue,
             COALESCE(SUM(pl.cost_per_unit * s.quantity), 0) AS cost
           FROM sales s
           LEFT JOIN production_lots pl ON pl.id = s.lot_id
           WHERE strftime('%Y-%m', s.sold_at) = ?`, [`${year}-${String(month).padStart(2, "0")}`]),
        this.getDailyRevenue(7),
        this.getTopProducts(5, 30),
        this.getLowStockAlerts(1)
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
        monthProfitMargin: m.revenue > 0 ? mProfit / m.revenue * 100 : 0,
        last7Days,
        topProducts,
        lowStockMaterials: lowStock
      };
    });
  }
  static {
    this.\u0275fac = function SaleRepository_Factory(t) {
      return new (t || _SaleRepository)(\u0275\u0275inject(DatabaseService));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SaleRepository, factory: _SaleRepository.\u0275fac, providedIn: "root" });
  }
};

// src/app/core/services/sale.service.ts
var SaleService = class _SaleService {
  constructor(repo, lotRepo) {
    this.repo = repo;
    this.lotRepo = lotRepo;
  }
  getAll(limit = 50, offset = 0) {
    return this.repo.findAll(limit, offset);
  }
  getToday() {
    return this.repo.findToday();
  }
  getByDateRange(from, to) {
    return this.repo.findByDateRange(from, to);
  }
  getDashboardStats() {
    return this.repo.getDashboardStats();
  }
  getMonthlySummary(year, month) {
    return this.repo.getMonthlySummary(year, month);
  }
  registerSale(dto) {
    return __async(this, null, function* () {
      if (dto.quantity <= 0)
        throw new Error("La cantidad debe ser mayor a 0.");
      if (dto.unitPrice < 0)
        throw new Error("El precio no puede ser negativo.");
      if (dto.lotId) {
        const lot = yield this.lotRepo.findById(dto.lotId);
        if (!lot)
          throw new Error("Lote no encontrado.");
        if (lot.remainingUnits < dto.quantity) {
          throw new Error(`Stock insuficiente en lote. Disponibles: ${lot.remainingUnits} unidades.`);
        }
      }
      return this.repo.create(dto);
    });
  }
  deleteSale(id) {
    return __async(this, null, function* () {
      return this.repo.delete(id);
    });
  }
  static {
    this.\u0275fac = function SaleService_Factory(t) {
      return new (t || _SaleService)(\u0275\u0275inject(SaleRepository), \u0275\u0275inject(ProductionLotRepository));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SaleService, factory: _SaleService.\u0275fac, providedIn: "root" });
  }
};

export {
  SaleService
};
//# sourceMappingURL=chunk-X3OWCJWS.js.map
