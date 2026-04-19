export interface Product {
  id: number;
  name: string;
  description: string | null;
  category: string;
  photoPath: string | null;
  yieldUnits: number;      // unidades que produce la receta
  suggestedPrice: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  category?: string;
  photoPath?: string;
  yieldUnits: number;
  suggestedPrice?: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

/** Producto con receta completa expandida */
export interface ProductWithRecipe extends Product {
  recipe: RecipeItemDetail[];
  recipeCostPerBatch: number;  // costo total de una receta (1 lote)
  recipeCostPerUnit: number;   // costo por unidad = recipeCostPerBatch / yieldUnits
}

export interface RecipeItemDetail {
  recipeItemId: number;
  type: 'material' | 'subproduct';
  materialId: number | null;
  subProductId: number | null;
  materialName: string;
  materialUnit: string;
  quantity: number;
  unitCost: number;
  subtotalCost: number;
}
