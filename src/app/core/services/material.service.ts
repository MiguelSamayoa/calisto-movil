import { Injectable } from '@angular/core';
import { MaterialRepository } from '@repos/material.repository';
import { PhotoService } from './photo.service';
import {
  Material,
  CreateMaterialDto,
  UpdateMaterialDto,
} from '@models/material.model';

@Injectable({ providedIn: 'root' })
export class MaterialService {
  constructor(
    private repo: MaterialRepository,
    private photoService: PhotoService
  ) {}

  getAll(includeInactive = false): Promise<Material[]> {
    return this.repo.findAll(includeInactive);
  }

  getById(id: number): Promise<Material | null> {
    return this.repo.findById(id);
  }

  search(name: string): Promise<Material[]> {
    return this.repo.findByName(name);
  }

  getLowStock(threshold = 1): Promise<Material[]> {
    return this.repo.findLowStock(threshold);
  }

  async create(dto: CreateMaterialDto): Promise<Material> {
    if (!dto.name?.trim()) throw new Error('El nombre del material es requerido.');
    if (dto.unitCost < 0) throw new Error('El costo no puede ser negativo.');
    dto.name = dto.name.trim();
    return this.repo.create(dto);
  }

  async update(id: number, dto: UpdateMaterialDto): Promise<Material> {
    if (dto.name !== undefined && !dto.name.trim()) {
      throw new Error('El nombre no puede estar vacío.');
    }
    if (dto.unitCost !== undefined && dto.unitCost < 0) {
      throw new Error('El costo no puede ser negativo.');
    }
    return this.repo.update(id, dto);
  }

  async updatePhoto(id: number, currentPath: string | null): Promise<string | null> {
    const newPath = await this.photoService.replacePhoto(currentPath, 'material', id);
    if (newPath) {
      await this.repo.update(id, { photoPath: newPath });
    }
    return newPath;
  }

  async adjustStock(id: number, delta: number): Promise<void> {
    return this.repo.adjustStock(id, delta);
  }

  async delete(id: number): Promise<void> {
    const material = await this.repo.findById(id);
    if (material?.photoPath) {
      await this.photoService.deletePhoto(material.photoPath);
    }
    return this.repo.softDelete(id);
  }

  /** Importación masiva de materiales (para carga inicial) */
  async bulkCreate(items: CreateMaterialDto[]): Promise<Material[]> {
    const results: Material[] = [];
    for (const item of items) {
      results.push(await this.create(item));
    }
    return results;
  }
}
