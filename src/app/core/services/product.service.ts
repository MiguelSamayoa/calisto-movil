import { Injectable } from '@angular/core';
import { ProductRepository } from '@repos/product.repository';
import { RecipeItemRepository } from '@repos/recipe-item.repository';
import { PhotoService } from './photo.service';
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductWithRecipe,
} from '@models/product.model';
import { CreateRecipeItemDto } from '@models/recipe-item.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(
    private repo: ProductRepository,
    private recipeRepo: RecipeItemRepository,
    private photoService: PhotoService
  ) {}

  getAll(includeInactive = false): Promise<Product[]> {
    return this.repo.findAll(includeInactive);
  }

  getById(id: number): Promise<Product | null> {
    return this.repo.findById(id);
  }

  getWithRecipe(id: number): Promise<ProductWithRecipe | null> {
    return this.repo.findWithRecipe(id);
  }

  getCategories(): Promise<string[]> {
    return this.repo.findCategories();
  }

  async create(dto: CreateProductDto): Promise<Product> {
    if (!dto.name?.trim()) throw new Error('El nombre del producto es requerido.');
    if (dto.yieldUnits <= 0) throw new Error('El rendimiento debe ser mayor a 0.');
    dto.name = dto.name.trim();
    return this.repo.create(dto);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    if (dto.name !== undefined && !dto.name.trim()) {
      throw new Error('El nombre no puede estar vacío.');
    }
    return this.repo.update(id, dto);
  }

  async updatePhoto(id: number, currentPath: string | null): Promise<string | null> {
    const newPath = await this.photoService.replacePhoto(currentPath, 'product', id);
    if (newPath) {
      await this.repo.update(id, { photoPath: newPath });
    }
    return newPath;
  }

  async saveRecipe(
    productId: number,
    items: Array<{ materialId: number | null; subProductId: number | null; quantity: number }>
  ): Promise<void> {
    if (items.length === 0) {
      throw new Error('La receta debe tener al menos un ingrediente.');
    }
    return this.recipeRepo.replaceRecipe(productId, items);
  }

  async delete(id: number): Promise<void> {
    const product = await this.repo.findById(id);
    if (product?.photoPath) {
      await this.photoService.deletePhoto(product.photoPath);
    }
    return this.repo.softDelete(id);
  }
}
