export interface Sale {
  id: number;
  lotId: number | null;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  notes: string | null;
  soldAt: string;
  createdAt: string;
}

export interface CreateSaleDto {
  lotId?: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  notes?: string;
  soldAt?: string;
}

/** Venta con datos expandidos del producto */
export interface SaleWithProduct extends Sale {
  productName: string;
  productCategory: string;
  productPhotoPath: string | null;
  costPerUnit: number | null;   // del lote asociado
  profit: number | null;        // totalAmount - (costPerUnit * quantity)
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
  monthRevenue: number;
  monthCost: number;
  monthProfit: number;
  monthProfitMargin: number;
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
