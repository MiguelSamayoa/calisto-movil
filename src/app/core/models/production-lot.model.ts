export interface ProductionLot {
  id: number;
  productId: number;
  quantity: number;
  totalCost: number;
  costPerUnit: number;
  sellingPrice: number;
  profitMargin: number;  // porcentaje
  remainingUnits: number;
  notes: string | null;
  producedAt: string;
  createdAt: string;
}

export interface CreateProductionLotDto {
  productId: number;
  quantity: number;
  sellingPrice: number;
  profitMargin: number;
  notes?: string;
  producedAt?: string;
}

/** Resultado del cálculo de costos antes de confirmar el lote */
export interface LotCostCalculation {
  productId: number;
  productName: string;
  yieldUnits: number;
  batchMultiplier: number;    // cuántas "recetas base" se hacen
  totalUnits: number;         // yieldUnits * batchMultiplier
  recipeCostPerBatch: number; // costo de una sola receta
  totalMaterialsCost: number; // costo total de materiales
  costPerUnit: number;
  desiredMarginPct: number;
  suggestedPrice: number;
  breakdown: CostBreakdownItem[];
  stockWarnings: StockWarning[];
}

export interface CostBreakdownItem {
  materialId: number;
  materialName: string;
  unit: string;
  quantityNeeded: number;
  unitCost: number;
  subtotal: number;
}

export interface StockWarning {
  materialId: number;
  materialName: string;
  unit: string;
  available: number;
  required: number;
  needed: number;
  deficit: number;
}

export class InventoryValidationError extends Error {
  constructor(public shortages: StockWarning[]) {
    super('Inventario insuficiente para iniciar la producción del lote.');
    this.name = 'InventoryValidationError';
  }
}

/** Lote con datos del producto expandidos */
export interface ProductionLotWithProduct extends ProductionLot {
  productName: string;
  productCategory: string;
  productPhotoPath: string | null;
}
