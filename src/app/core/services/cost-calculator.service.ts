import { Injectable } from '@angular/core';
import { DatabaseService } from '@db/database.service';
import { ProductRepository } from '@repos/product.repository';
import { ProductionLotRepository } from '@repos/production-lot.repository';
import {
  LotCostCalculation,
  CostBreakdownItem,
  StockWarning,
  CreateProductionLotDto,
  ProductionLot,
  InventoryValidationError,
} from '@models/production-lot.model';

interface ProductSnapshotRow {
  id: number;
  name: string;
  yield_units: number;
}

interface RecipeRow {
  material_id: number | null;
  sub_product_id: number | null;
  quantity: number;
}

interface MaterialSnapshotRow {
  id: number;
  name: string;
  unit: string;
  unit_cost: number;
  stock: number;
}

@Injectable({ providedIn: 'root' })
export class CostCalculatorService {
  constructor(
    private db: DatabaseService,
    private productRepo: ProductRepository,
    private lotRepo: ProductionLotRepository
  ) {}

  private async getProductSnapshot(productId: number): Promise<ProductSnapshotRow> {
    const rows = await this.db.query<ProductSnapshotRow>(
      `SELECT id, name, yield_units
       FROM products
       WHERE id = ?`,
      [productId]
    );

    const product = rows[0];
    if (!product) throw new Error(`Producto #${productId} no encontrado`);
    if (product.yield_units <= 0) {
      throw new Error(`El rendimiento del producto "${product.name}" no es válido.`);
    }
    return product;
  }

  private async getRecipeRows(productId: number): Promise<RecipeRow[]> {
    return this.db.query<RecipeRow>(
      `SELECT material_id, sub_product_id, quantity
       FROM recipe_items
       WHERE product_id = ?`,
      [productId]
    );
  }

  private async explodeBomToMaterials(
    productId: number,
    requiredUnits: number,
    chain: number[] = []
  ): Promise<Map<number, number>> {
    if (chain.includes(productId)) {
      const loop = [...chain, productId].join(' -> ');
      throw new Error(`La receta tiene una referencia circular entre subproductos (${loop}).`);
    }

    const product = await this.getProductSnapshot(productId);
    const recipeRows = await this.getRecipeRows(productId);
    if (recipeRows.length === 0) {
      throw new Error(`El producto "${product.name}" no tiene ingredientes en su receta.`);
    }

    const batches = requiredUnits / product.yield_units;
    const totals = new Map<number, number>();

    for (const row of recipeRows) {
      const qtyForCurrentRun = row.quantity * batches;
      if (row.material_id !== null) {
        totals.set(
          row.material_id,
          (totals.get(row.material_id) ?? 0) + qtyForCurrentRun
        );
        continue;
      }

      if (row.sub_product_id !== null) {
        const subTotals = await this.explodeBomToMaterials(
          row.sub_product_id,
          qtyForCurrentRun,
          [...chain, productId]
        );
        for (const [materialId, needed] of subTotals.entries()) {
          totals.set(materialId, (totals.get(materialId) ?? 0) + needed);
        }
      }
    }

    return totals;
  }

  private async getMaterialSnapshots(materialIds: number[]): Promise<MaterialSnapshotRow[]> {
    if (materialIds.length === 0) return [];

    const placeholders = materialIds.map(() => '?').join(', ');
    return this.db.query<MaterialSnapshotRow>(
      `SELECT id, name, unit, unit_cost, stock
       FROM materials
       WHERE id IN (${placeholders})`,
      materialIds
    );
  }

  private buildStockWarnings(
    requiredByMaterial: Map<number, number>,
    materials: MaterialSnapshotRow[]
  ): StockWarning[] {
    const byId = new Map(materials.map(m => [m.id, m]));
    const warnings: StockWarning[] = [];

    for (const [materialId, required] of requiredByMaterial.entries()) {
      const material = byId.get(materialId);
      if (!material) {
        throw new Error(`No se encontró el insumo #${materialId} en inventario.`);
      }

      if (material.stock < required) {
        warnings.push({
          materialId,
          materialName: material.name,
          unit: material.unit,
          available: material.stock,
          required,
          needed: required,
          deficit: required - material.stock,
        });
      }
    }

    return warnings.sort((a, b) => b.deficit - a.deficit);
  }

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
    const product = await this.getProductSnapshot(productId);

    const yieldUnits = product.yield_units;
    const batchMultiplier = Math.ceil(quantity / yieldUnits);
    const totalUnits = batchMultiplier * yieldUnits;
    const requiredByMaterial = await this.explodeBomToMaterials(productId, totalUnits);

    const materialRows = await this.getMaterialSnapshots([...requiredByMaterial.keys()]);
    if (materialRows.length === 0) {
      throw new Error(`El producto "${product.name}" no tiene insumos válidos para producir.`);
    }

    const breakdown: CostBreakdownItem[] = materialRows
      .map(row => {
        const quantityNeeded = requiredByMaterial.get(row.id) ?? 0;
        return {
          materialId: row.id,
          materialName: row.name,
          unit: row.unit,
          quantityNeeded,
          unitCost: row.unit_cost,
          subtotal: quantityNeeded * row.unit_cost,
        };
      })
      .sort((a, b) => a.materialName.localeCompare(b.materialName));

    const totalMaterialsCost = breakdown.reduce((sum, b) => sum + b.subtotal, 0);
    const recipeCostPerBatch = batchMultiplier > 0
      ? totalMaterialsCost / batchMultiplier
      : 0;
    const costPerUnit = totalUnits > 0 ? totalMaterialsCost / totalUnits : 0;

    const suggestedPrice =
      marginPct < 100
        ? costPerUnit / (1 - marginPct / 100)
        : costPerUnit * 2;

    const stockWarnings = this.buildStockWarnings(requiredByMaterial, materialRows);

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
   * Confirma la creación del lote dentro de una transacción:
   * 1) valida faltantes con inventario actual,
   * 2) descuenta stock de todos los insumos (incluye subproductos explotados),
   * 3) crea el lote.
   */
  async confirmLot(
    dto: CreateProductionLotDto,
    calculation: LotCostCalculation
  ): Promise<ProductionLot> {
    return this.db.transaction(async () => {
      const latest = await this.calculateLotCost(
        dto.productId,
        dto.quantity,
        calculation.desiredMarginPct
      );

      if (latest.stockWarnings.length > 0) {
        throw new InventoryValidationError(latest.stockWarnings);
      }

      for (const item of latest.breakdown) {
        const result = await this.db.execute(
          `UPDATE materials
           SET stock = stock - ?
           WHERE id = ? AND stock >= ?`,
          [item.quantityNeeded, item.materialId, item.quantityNeeded]
        );

        if (result.changes === 0) {
          const rows = await this.db.query<MaterialSnapshotRow>(
            `SELECT id, name, unit, stock FROM materials WHERE id = ?`,
            [item.materialId]
          );
          const material = rows[0];
          throw new InventoryValidationError([
            {
              materialId: item.materialId,
              materialName: material?.name ?? `Insumo #${item.materialId}`,
              unit: material?.unit ?? item.unit,
              available: material?.stock ?? 0,
              required: item.quantityNeeded,
              needed: item.quantityNeeded,
              deficit: Math.max(item.quantityNeeded - (material?.stock ?? 0), 0),
            },
          ]);
        }
      }

      return this.lotRepo.create(
        dto,
        latest.totalMaterialsCost,
        latest.costPerUnit
      );
    });
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
   * Anula un lote en estado ABIERTO:
   * 1) Verifica que el lote exista y esté ABIERTO.
   * 2) Restaura al inventario de materiales las unidades proporcionales a remaining_units.
   * 3) Marca el lote como ANULADO.
   * 4) Registra el evento en lot_audit_log.
   *
   * No se restaura el costo de las unidades ya vendidas (se mantienen en sales).
   */
  async voidLot(lotId: number, actorId: string): Promise<void> {
    return this.db.transaction(async () => {
      const lotRows = await this.db.query<{
        id: number;
        product_id: number;
        quantity: number;
        remaining_units: number;
        status: string;
      }>(
        `SELECT id, product_id, quantity, remaining_units, status
         FROM production_lots WHERE id = ?`,
        [lotId]
      );

      const lot = lotRows[0];
      if (!lot) throw new Error('Lote no encontrado.');
      if (lot.status === 'ANULADO') throw new Error('El lote ya fue anulado.');
      if (lot.status === 'CERRADO') {
        throw new Error(
          'No se puede anular un lote completamente vendido. ' +
          'Si hay diferencias de inventario usa un ajuste de inventario.'
        );
      }

      // Restaurar stock solo para las unidades que no se vendieron.
      if (lot.remaining_units > 0) {
        const requiredByMaterial = await this.explodeBomToMaterials(
          lot.product_id,
          lot.remaining_units
        );
        for (const [materialId, qty] of requiredByMaterial.entries()) {
          await this.db.execute(
            `UPDATE materials SET stock = stock + ? WHERE id = ?`,
            [qty, materialId]
          );
        }
      }

      const nowIso = new Date().toISOString();
      await this.db.execute(
        `UPDATE production_lots
         SET status = 'ANULADO', closed_at = ?, closed_reason = 'ANULADO_MANUAL'
         WHERE id = ?`,
        [nowIso, lotId]
      );

      const soldUnits = lot.quantity - lot.remaining_units;
      await this.db.execute(
        `INSERT INTO lot_audit_log
           (lot_id, event_type, old_value, new_value, actor_id, notes)
         VALUES (?, 'LOT_VOID', ?, 'ANULADO', ?, ?)`,
        [
          lotId,
          lot.status,
          actorId,
          `${lot.remaining_units} uds devueltas a inventario de materiales. ` +
          `${soldUnits} uds ya vendidas no se revierten.`,
        ]
      );
    });
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
