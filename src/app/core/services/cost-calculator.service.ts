import { Injectable } from '@angular/core';
import { DatabaseService } from '@db/database.service';
import { ProductRepository } from '@repos/product.repository';
import { ProductionLotRepository } from '@repos/production-lot.repository';
import { RecipeItemRepository } from '@repos/recipe-item.repository';
import {
  LotCostCalculation,
  CostBreakdownItem,
  StockWarning,
  CreateProductionLotDto,
  ProductionLot,
} from '@models/production-lot.model';

interface RawMaterialCostRow {
  material_id: number;
  material_name: string;
  unit: string;
  quantity: number;
  unit_cost: number;
  stock: number;
}

interface RawSubProductCostRow {
  sub_product_id: number;
  sub_product_name: string;
  quantity: number;
  unit_cost: number; // costo por unidad calculado de su propia receta
}

@Injectable({ providedIn: 'root' })
export class CostCalculatorService {
  constructor(
    private db: DatabaseService,
    private productRepo: ProductRepository,
    private lotRepo: ProductionLotRepository,
    private recipeRepo: RecipeItemRepository
  ) {}

  /**
   * Calcula el costo completo para un lote antes de confirmarlo.
   *
   * @param productId   ID del producto a producir
   * @param quantity    Total de unidades a producir (no lotes de receta)
   * @param marginPct   Margen de ganancia deseado en porcentaje (ej. 40 = 40%)
   */
  async calculateLotCost(
    productId: number,
    quantity: number,
    marginPct: number
  ): Promise<LotCostCalculation> {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new Error(`Producto #${productId} no encontrado`);

    // ─── Materiales directos de la receta ───────────────────────────────────
    const materialRows = await this.db.query<RawMaterialCostRow>(
      `SELECT
         ri.material_id,
         m.name       AS material_name,
         m.unit,
         ri.quantity,
         m.unit_cost,
         m.stock
       FROM recipe_items ri
       JOIN materials m ON m.id = ri.material_id
       WHERE ri.product_id = ? AND ri.material_id IS NOT NULL`,
      [productId]
    );

    // ─── Subproductos de la receta (con costo calculado) ─────────────────────
    const subProductRows = await this.db.query<RawSubProductCostRow>(
      `SELECT
         ri.sub_product_id,
         p.name AS sub_product_name,
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
       WHERE ri.product_id = ? AND ri.sub_product_id IS NOT NULL`,
      [productId]
    );

    if (materialRows.length === 0 && subProductRows.length === 0) {
      throw new Error(
        `El producto "${product.name}" no tiene ingredientes en su receta.`
      );
    }

    const yieldUnits = product.yieldUnits;
    const batchMultiplier = Math.ceil(quantity / yieldUnits);
    const totalUnits = batchMultiplier * yieldUnits;

    // ─── Desglose de costos ──────────────────────────────────────────────────
    const breakdown: CostBreakdownItem[] = [
      ...materialRows.map(row => {
        const quantityNeeded = row.quantity * batchMultiplier;
        return {
          materialId: row.material_id,
          materialName: row.material_name,
          unit: row.unit,
          quantityNeeded,
          unitCost: row.unit_cost,
          subtotal: quantityNeeded * row.unit_cost,
        };
      }),
      ...subProductRows.map(row => {
        const quantityNeeded = row.quantity * batchMultiplier;
        return {
          materialId: 0, // placeholder, es un subproducto
          materialName: `[Subproducto] ${row.sub_product_name}`,
          unit: 'unidad',
          quantityNeeded,
          unitCost: row.unit_cost,
          subtotal: quantityNeeded * row.unit_cost,
        };
      }),
    ];

    const recipeCostPerBatch =
      materialRows.reduce((sum, r) => sum + r.quantity * r.unit_cost, 0) +
      subProductRows.reduce((sum, r) => sum + r.quantity * r.unit_cost, 0);

    const totalMaterialsCost = breakdown.reduce((sum, b) => sum + b.subtotal, 0);
    const costPerUnit = totalUnits > 0 ? totalMaterialsCost / totalUnits : 0;

    const suggestedPrice =
      marginPct < 100
        ? costPerUnit / (1 - marginPct / 100)
        : costPerUnit * 2;

    // ─── Alertas de stock (solo materiales directos) ─────────────────────────
    const stockWarnings: StockWarning[] = materialRows
      .filter(row => row.stock < row.quantity * batchMultiplier)
      .map(row => ({
        materialId: row.material_id,
        materialName: row.material_name,
        available: row.stock,
        needed: row.quantity * batchMultiplier,
        deficit: row.quantity * batchMultiplier - row.stock,
      }));

    return {
      productId,
      productName: product.name,
      yieldUnits,
      batchMultiplier,
      totalUnits,
      recipeCostPerBatch,
      totalMaterialsCost,
      costPerUnit,
      desiredMarginPct: marginPct,
      suggestedPrice,
      breakdown,
      stockWarnings,
    };
  }

  /**
   * Confirma la creación del lote: guarda en DB y dispara los triggers
   * que descuentan el stock de materiales automáticamente.
   */
  async confirmLot(
    dto: CreateProductionLotDto,
    calculation: LotCostCalculation
  ): Promise<ProductionLot> {
    return this.lotRepo.create(
      dto,
      calculation.totalMaterialsCost,
      calculation.costPerUnit
    );
  }

  /**
   * Devuelve el precio de venta sugerido dado un costo unitario y margen.
   * Margen sobre precio de venta (markup sobre costo, no sobre precio).
   */
  suggestSellingPrice(costPerUnit: number, marginPct: number): number {
    if (marginPct >= 100 || marginPct < 0) return costPerUnit * 2;
    return costPerUnit / (1 - marginPct / 100);
  }

  /**
   * Calcula el margen real dado costo y precio de venta.
   */
  calculateActualMargin(costPerUnit: number, sellingPrice: number): number {
    if (sellingPrice <= 0) return 0;
    return ((sellingPrice - costPerUnit) / sellingPrice) * 100;
  }

  /**
   * Formatea un número como moneda en Quetzales guatemaltecos.
   */
  formatGTQ(amount: number): string {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 2,
    }).format(amount);
  }
}
