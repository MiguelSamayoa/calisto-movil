import {
  PhotoService
} from "./chunk-4MPWN36N.js";
import {
  DatabaseService
} from "./chunk-SJAJ33WN.js";
import {
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-6GE63MYY.js";
import {
  __async
} from "./chunk-J4B6MK7R.js";

// src/app/core/repositories/material.repository.ts
var MaterialRepository = class _MaterialRepository {
  constructor(db) {
    this.db = db;
  }
  // ─── Mappers ───────────────────────────────────────────────────────────────
  toModel(row) {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      unit: row.unit,
      unitCost: row.unit_cost,
      stock: row.stock,
      photoPath: row.photo_path,
      isActive: row.is_active === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
  // ─── Queries ───────────────────────────────────────────────────────────────
  findAll(includeInactive = false) {
    return __async(this, null, function* () {
      const sql = includeInactive ? `SELECT * FROM materials ORDER BY name COLLATE NOCASE` : `SELECT * FROM materials WHERE is_active = 1 ORDER BY name COLLATE NOCASE`;
      const rows = yield this.db.query(sql);
      return rows.map((r) => this.toModel(r));
    });
  }
  findById(id) {
    return __async(this, null, function* () {
      const rows = yield this.db.query(`SELECT * FROM materials WHERE id = ?`, [id]);
      return rows[0] ? this.toModel(rows[0]) : null;
    });
  }
  findByName(name) {
    return __async(this, null, function* () {
      const rows = yield this.db.query(`SELECT * FROM materials WHERE name LIKE ? AND is_active = 1 ORDER BY name`, [`%${name}%`]);
      return rows.map((r) => this.toModel(r));
    });
  }
  findLowStock(threshold = 1) {
    return __async(this, null, function* () {
      const rows = yield this.db.query(`SELECT * FROM materials WHERE stock <= ? AND is_active = 1 ORDER BY stock ASC`, [threshold]);
      return rows.map((r) => this.toModel(r));
    });
  }
  // ─── Mutations ─────────────────────────────────────────────────────────────
  create(dto) {
    return __async(this, null, function* () {
      const { lastId } = yield this.db.execute(`INSERT INTO materials (name, description, unit, unit_cost, stock, photo_path)
       VALUES (?, ?, ?, ?, ?, ?)`, [
        dto.name,
        dto.description ?? null,
        dto.unit,
        dto.unitCost,
        dto.stock ?? 0,
        dto.photoPath ?? null
      ]);
      return yield this.findById(lastId);
    });
  }
  update(id, dto) {
    return __async(this, null, function* () {
      const current = yield this.findById(id);
      if (!current)
        throw new Error(`Material #${id} no encontrado`);
      yield this.db.execute(`UPDATE materials
       SET name = ?, description = ?, unit = ?, unit_cost = ?, stock = ?, photo_path = ?
       WHERE id = ?`, [
        dto.name ?? current.name,
        dto.description !== void 0 ? dto.description : current.description,
        dto.unit ?? current.unit,
        dto.unitCost ?? current.unitCost,
        dto.stock ?? current.stock,
        dto.photoPath !== void 0 ? dto.photoPath : current.photoPath,
        id
      ]);
      return yield this.findById(id);
    });
  }
  adjustStock(id, delta) {
    return __async(this, null, function* () {
      yield this.db.execute(`UPDATE materials SET stock = MAX(0, stock + ?) WHERE id = ?`, [delta, id]);
    });
  }
  softDelete(id) {
    return __async(this, null, function* () {
      yield this.db.execute(`UPDATE materials SET is_active = 0 WHERE id = ?`, [id]);
    });
  }
  hardDelete(id) {
    return __async(this, null, function* () {
      yield this.db.execute(`DELETE FROM materials WHERE id = ?`, [id]);
    });
  }
  static {
    this.\u0275fac = function MaterialRepository_Factory(t) {
      return new (t || _MaterialRepository)(\u0275\u0275inject(DatabaseService));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MaterialRepository, factory: _MaterialRepository.\u0275fac, providedIn: "root" });
  }
};

// src/app/core/services/material.service.ts
var MaterialService = class _MaterialService {
  constructor(repo, photoService) {
    this.repo = repo;
    this.photoService = photoService;
  }
  getAll(includeInactive = false) {
    return this.repo.findAll(includeInactive);
  }
  getById(id) {
    return this.repo.findById(id);
  }
  search(name) {
    return this.repo.findByName(name);
  }
  getLowStock(threshold = 1) {
    return this.repo.findLowStock(threshold);
  }
  create(dto) {
    return __async(this, null, function* () {
      if (!dto.name?.trim())
        throw new Error("El nombre del material es requerido.");
      if (dto.unitCost < 0)
        throw new Error("El costo no puede ser negativo.");
      dto.name = dto.name.trim();
      return this.repo.create(dto);
    });
  }
  update(id, dto) {
    return __async(this, null, function* () {
      if (dto.name !== void 0 && !dto.name.trim()) {
        throw new Error("El nombre no puede estar vac\xEDo.");
      }
      if (dto.unitCost !== void 0 && dto.unitCost < 0) {
        throw new Error("El costo no puede ser negativo.");
      }
      return this.repo.update(id, dto);
    });
  }
  updatePhoto(id, currentPath) {
    return __async(this, null, function* () {
      const newPath = yield this.photoService.replacePhoto(currentPath, "material", id);
      if (newPath) {
        yield this.repo.update(id, { photoPath: newPath });
      }
      return newPath;
    });
  }
  adjustStock(id, delta) {
    return __async(this, null, function* () {
      return this.repo.adjustStock(id, delta);
    });
  }
  delete(id) {
    return __async(this, null, function* () {
      const material = yield this.repo.findById(id);
      if (material?.photoPath) {
        yield this.photoService.deletePhoto(material.photoPath);
      }
      return this.repo.softDelete(id);
    });
  }
  /** Importación masiva de materiales (para carga inicial) */
  bulkCreate(items) {
    return __async(this, null, function* () {
      const results = [];
      for (const item of items) {
        results.push(yield this.create(item));
      }
      return results;
    });
  }
  static {
    this.\u0275fac = function MaterialService_Factory(t) {
      return new (t || _MaterialService)(\u0275\u0275inject(MaterialRepository), \u0275\u0275inject(PhotoService));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MaterialService, factory: _MaterialService.\u0275fac, providedIn: "root" });
  }
};

export {
  MaterialService
};
//# sourceMappingURL=chunk-YY2WONY4.js.map
