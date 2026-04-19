export type MaterialUnit =
  | 'kg' | 'g' | 'lb' | 'oz'
  | 'L' | 'mL'
  | 'unidad' | 'docena' | 'caja';

export interface Material {
  id: number;
  name: string;
  description: string | null;
  unit: MaterialUnit;
  unitCost: number;     // Q por unidad
  stock: number;
  photoPath: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaterialDto {
  name: string;
  description?: string;
  unit: MaterialUnit;
  unitCost: number;
  stock?: number;
  photoPath?: string;
}

export interface UpdateMaterialDto extends Partial<CreateMaterialDto> {}

/** Material con costo calculado para un uso específico en receta */
export interface MaterialUsage {
  material: Material;
  quantity: number;
  subtotalCost: number;  // quantity * unitCost
}
