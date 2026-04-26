export interface Sale {
  id: number;
  lotId: number | null;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  costBasisTotal: number;
  unitCostApplied: number;
  pricePolicy: SalePricePolicy;
  notes: string | null;
  soldAt: string;
  createdAt: string;
  createdBy: string;
}

export interface CreateSaleDto {
  lotId?: number;
  productId: number;
  quantity: number;
  unitPrice?: number;
  notes?: string;
  soldAt?: string;
  createdBy?: string;
}

export type SalePricePolicy = 'FIFO_MAX';

export interface SaleLotAllocationPreview {
  lotId: number;
  producedAt: string;
  quantity: number;
  remainingBefore: number;
  remainingAfter: number;
  sellingPrice: number;
  costPerUnit: number;
}

export interface SalePreview {
  productId: number;
  productName: string;
  requestedQuantity: number;
  availableQuantity: number;
  unitPrice: number;
  totalAmount: number;
  costBasisTotal: number;
  lotsUsed: number;
  allocations: SaleLotAllocationPreview[];
}

export class SaleStockInsufficientError extends Error {
  constructor(
    public productId: number,
    public requestedQuantity: number,
    public availableQuantity: number
  ) {
    super('Stock insuficiente para completar la venta.');
    this.name = 'SaleStockInsufficientError';
  }
}

/** Venta con datos expandidos del producto */
export interface SaleWithProduct extends Sale {
  productName: string;
  productCategory: string;
  productPhotoPath: string | null;
  costPerUnit: number | null;   // del lote asociado
  profit: number | null;        // totalAmount - costBasisTotal
}

// ─── Agregaciones para Dashboard ──────────────────────────────────────────────

export interface DailyRevenue {
  date: string;         // YYYY-MM-DD
  totalSales: number;
  totalAmount: number;
  totalCost: number;
  grossProfit: number;
}

export interface MonthlySummary {
  year: number;
  month: number;
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  profitMargin: number;  // porcentaje
  totalUnitsSold: number;
  topProduct: string | null;
}

export interface DashboardStats {
  todaySales: number;
  todayRevenue: number;
  todayCost: number;
  todayProfit: number;
  todayAdjustmentsCost: number;
  todayNetProfitReal: number;
  monthRevenue: number;
  monthCost: number;
  monthProfit: number;
  monthProfitMargin: number;
  monthAdjustmentsCogs: number;
  monthAdjustmentsOpex: number;
  monthAdjustmentsTotal: number;
  monthNetProfitReal: number;
  monthNetMarginReal: number;
  last7Days: DailyRevenue[];
  topProducts: TopProductStat[];
  lowStockMaterials: LowStockAlert[];
}

export interface TopProductStat {
  productId: number;
  productName: string;
  totalSold: number;
  totalRevenue: number;
}

export interface LowStockAlert {
  materialId: number;
  materialName: string;
  unit: string;
  currentStock: number;
}
