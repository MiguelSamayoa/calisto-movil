import { Injectable } from '@angular/core';
import { DatabaseService } from '@db/database.service';
import {
  Material,
  CreateMaterialDto,
  UpdateMaterialDto,
  MaterialUnit,
} from '@models/material.model';

/** Fila cruda tal como la devuelve SQLite */
interface MaterialRow {
  id: number;
  name: string;
  description: string | null;
  unit: string;
  unit_cost: number;
  stock: number;
  photo_path: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class MaterialRepository {
  constructor(private db: DatabaseService) {}

  // ─── Mappers ───────────────────────────────────────────────────────────────

  private toModel(row: MaterialRow): Material {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      unit: row.unit as MaterialUnit,
      unitCost: row.unit_cost,
      stock: row.stock,
      photoPath: row.photo_path,
      isActive: row.is_active === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // ─── Queries ───────────────────────────────────────────────────────────────

  async findAll(includeInactive = false): Promise<Material[]> {
    const sql = includeInactive
      ? `SELECT * FROM materials ORDER BY name COLLATE NOCASE`
      : `SELECT * FROM materials WHERE is_active = 1 ORDER BY name COLLATE NOCASE`;
    const rows = await this.db.query<MaterialRow>(sql);
    return rows.map(r => this.toModel(r));
  }

  async findById(id: number): Promise<Material | null> {
    const rows = await this.db.query<MaterialRow>(
      `SELECT * FROM materials WHERE id = ?`,
      [id]
    );
    return rows[0] ? this.toModel(rows[0]) : null;
  }

  async findByName(name: string): Promise<Material[]> {
    const rows = await this.db.query<MaterialRow>(
      `SELECT * FROM materials WHERE name LIKE ? AND is_active = 1 ORDER BY name`,
      [`%${name}%`]
    );
    return rows.map(r => this.toModel(r));
  }

  async findLowStock(threshold = 1): Promise<Material[]> {
    const rows = await this.db.query<MaterialRow>(
      `SELECT * FROM materials WHERE stock <= ? AND is_active = 1 ORDER BY stock ASC`,
      [threshold]
    );
    return rows.map(r => this.toModel(r));
  }

  // ─── Mutations ─────────────────────────────────────────────────────────────

  async create(dto: CreateMaterialDto): Promise<Material> {
    const { lastId } = await this.db.execute(
      `INSERT INTO materials (name, description, unit, unit_cost, stock, photo_path)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        dto.name,
        dto.description ?? null,
        dto.unit,
        dto.unitCost,
        dto.stock ?? 0,
        dto.photoPath ?? null,
      ]
    );
    return (await this.findById(lastId))!;
  }

  async update(id: number, dto: UpdateMaterialDto): Promise<Material> {
    const current = await this.findById(id);
    if (!current) throw new Error(`Material #${id} no encontrado`);

    await this.db.execute(
      `UPDATE materials
       SET name = ?, description = ?, unit = ?, unit_cost = ?, stock = ?, photo_path = ?
       WHERE id = ?`,
      [
        dto.name ?? current.name,
        dto.description !== undefined ? dto.description : current.description,
        dto.unit ?? current.unit,
        dto.unitCost ?? current.unitCost,
        dto.stock ?? current.stock,
        dto.photoPath !== undefined ? dto.photoPath : current.photoPath,
        id,
      ]
    );
    return (await this.findById(id))!;
  }

  async adjustStock(id: number, delta: number): Promise<void> {
    await this.db.execute(
      `UPDATE materials SET stock = MAX(0, stock + ?) WHERE id = ?`,
      [delta, id]
    );
  }

  async softDelete(id: number): Promise<void> {
    await this.db.execute(
      `UPDATE materials SET is_active = 0 WHERE id = ?`,
      [id]
    );
  }

  async hardDelete(id: number): Promise<void> {
    await this.db.execute(`DELETE FROM materials WHERE id = ?`, [id]);
  }
}
