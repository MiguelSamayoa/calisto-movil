import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MaterialRepository } from '@repos/material.repository';
import { PhotoService } from './photo.service';
import {
  Material,
  CreateMaterialDto,
  UpdateMaterialDto,
} from '@models/material.model';

@Injectable({ providedIn: 'root' })
export class MaterialService {
  private materialsChangedSubject = new Subject<void>();
  readonly materialsChanged$: Observable<void> = this.materialsChangedSubject.asObservable();

  constructor(
    private repo: MaterialRepository,
    private photoService: PhotoService
  ) {}

  private notifyMaterialsChanged(): void {
    this.materialsChangedSubject.next();
  }

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
    const created = await this.repo.create(dto);
    this.notifyMaterialsChanged();
    return created;
  }

  async update(id: number, dto: UpdateMaterialDto): Promise<Material> {
    if (dto.name !== undefined && !dto.name.trim()) {
      throw new Error('El nombre no puede estar vacío.');
    }
    if (dto.unitCost !== undefined && dto.unitCost < 0) {
      throw new Error('El costo no puede ser negativo.');
    }
    const updated = await this.repo.update(id, dto);
    this.notifyMaterialsChanged();
    return updated;
  }

  async updatePhoto(id: number, currentPath: string | null): Promise<string | null> {
    const newPath = await this.photoService.replacePhoto(currentPath, 'material', id);
    if (newPath) {
      await this.repo.update(id, { photoPath: newPath });
      this.notifyMaterialsChanged();
    }
    return newPath;
  }

  async adjustStock(id: number, delta: number): Promise<void> {
    await this.repo.adjustStock(id, delta);
    this.notifyMaterialsChanged();
  }

  async delete(id: number): Promise<void> {
    const material = await this.repo.findById(id);
    if (material?.photoPath) {
      await this.photoService.deletePhoto(material.photoPath);
    }
    await this.repo.softDelete(id);
    this.notifyMaterialsChanged();
  }

  /** Importación masiva de materiales (para carga inicial) */
  async bulkCreate(items: CreateMaterialDto[]): Promise<Material[]> {
    const results: Material[] = [];
    for (const item of items) {
      if (!item.name?.trim()) throw new Error('El nombre del material es requerido.');
      if (item.unitCost < 0) throw new Error('El costo no puede ser negativo.');
      item.name = item.name.trim();
      results.push(await this.repo.create(item));
    }
    this.notifyMaterialsChanged();
    return results;
  }
}
