export interface RecipeItem {
  id: number;
  productId: number;
  materialId: number | null;
  subProductId: number | null;
  quantity: number;
}

export interface CreateRecipeItemDto {
  productId: number;
  materialId: number | null;
  subProductId: number | null;
  quantity: number;
}

export interface UpdateRecipeItemDto {
  quantity: number;
}
