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

// src/app/core/repositories/production-lot.repository.ts
var ProductionLotRepository = class _ProductionLotRepository {
  constructor(db) {
    this.db = db;
  }
  toModel(row) {
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
      createdAt: row.created_at
    };
  }
  toModelWithProduct(row) {
    return __spreadProps(__spreadValues({}, this.toModel(row)), {
      productName: row.product_name,
      productCategory: row.product_category,
      productPhotoPath: row.product_photo_path
    });
  }
  // ─── Queries ───────────────────────────────────────────────────────────────
  findAll(limit = 50, offset = 0) {
    return __async(this, null, function* () {
      const rows = yield this.db.query(`SELECT
         pl.*,
         p.name       AS product_name,
         p.category   AS product_category,
         p.photo_path AS product_photo_path
       FROM production_lots pl
       JOIN products p ON p.id = pl.product_id
       ORDER BY pl.produced_at DESC
       LIMIT ? OFFSET ?`, [limit, offset]);
      return rows.map((r) => this.toModelWithProduct(r));
    });
  }
  findById(id) {
    return __async(this, null, function* () {
      const rows = yield this.db.query(`SELECT
         pl.*,
         p.name       AS product_name,
         p.category   AS product_category,
         p.photo_path AS product_photo_path
       FROM production_lots pl
       JOIN products p ON p.id = pl.product_id
       WHERE pl.id = ?`, [id]);
      return rows[0] ? this.toModelWithProduct(rows[0]) : null;
    });
  }
  findByProduct(productId, limit = 20) {
    return __async(this, null, function* () {
      const rows = yield this.db.query(`SELECT * FROM production_lots WHERE product_id = ?
       ORDER BY produced_at DESC LIMIT ?`, [productId, limit]);
      return rows.map((r) => this.toModel(r));
    });
  }
  findWithStock(productId) {
    return __async(this, null, function* () {
      const base = `
      SELECT
        pl.*,
        p.name       AS product_name,
        p.category   AS product_category,
        p.photo_path AS product_photo_path
      FROM production_lots pl
      JOIN products p ON p.id = pl.product_id
      WHERE pl.remaining_units > 0`;
      const rows = productId ? yield this.db.query(`${base} AND pl.product_id = ? ORDER BY pl.produced_at ASC`, [productId]) : yield this.db.query(`${base} ORDER BY p.name, pl.produced_at ASC`);
      return rows.map((r) => this.toModelWithProduct(r));
    });
  }
  findByDateRange(from, to) {
    return __async(this, null, function* () {
      const rows = yield this.db.query(`SELECT
         pl.*,
         p.name       AS product_name,
         p.category   AS product_category,
         p.photo_path AS product_photo_path
       FROM production_lots pl
       JOIN products p ON p.id = pl.product_id
       WHERE pl.produced_at BETWEEN ? AND ?
       ORDER BY pl.produced_at DESC`, [from, to]);
      return rows.map((r) => this.toModelWithProduct(r));
    });
  }
  // ─── Mutations ─────────────────────────────────────────────────────────────
  create(dto, totalCost, costPerUnit) {
    return __async(this, null, function* () {
      const { lastId } = yield this.db.execute(`INSERT INTO production_lots
         (product_id, quantity, total_cost, cost_per_unit, selling_price,
          profit_margin, remaining_units, notes, produced_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
        dto.productId,
        dto.quantity,
        totalCost,
        costPerUnit,
        dto.sellingPrice,
        dto.profitMargin,
        dto.quantity,
        // inicialmente todos sin vender
        dto.notes ?? null,
        dto.producedAt ?? (/* @__PURE__ */ new Date()).toISOString()
      ]);
      const row = yield this.db.query(`SELECT * FROM production_lots WHERE id = ?`, [lastId]);
      return this.toModel(row[0]);
    });
  }
  updateSellingPrice(id, sellingPrice) {
    return __async(this, null, function* () {
      yield this.db.execute(`UPDATE production_lots SET selling_price = ? WHERE id = ?`, [sellingPrice, id]);
    });
  }
  delete(id) {
    return __async(this, null, function* () {
      yield this.db.execute(`DELETE FROM production_lots WHERE id = ?`, [id]);
    });
  }
  static {
    this.\u0275fac = function ProductionLotRepository_Factory(t) {
      return new (t || _ProductionLotRepository)(\u0275\u0275inject(DatabaseService));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ProductionLotRepository, factory: _ProductionLotRepository.\u0275fac, providedIn: "root" });
  }
};

export {
  ProductionLotRepository
};
//# sourceMappingURL=chunk-QX25LUL7.js.map
