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
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-J4B6MK7R.js";

// src/app/core/repositories/product.repository.ts
var ProductRepository = class _ProductRepository {
  constructor(db) {
    this.db = db;
  }
  // ─── Mappers ───────────────────────────────────────────────────────────────
  toModel(row) {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category,
      photoPath: row.photo_path,
      yieldUnits: row.yield_units,
      suggestedPrice: row.suggested_price,
      isActive: row.is_active === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
  toRecipeDetail(row) {
    const subtotal = row.quantity * row.unit_cost;
    return {
      recipeItemId: row.recipe_item_id,
      type: row.item_type,
      materialId: row.material_id,
      subProductId: row.sub_product_id,
      materialName: row.material_name,
      materialUnit: row.material_unit,
      quantity: row.quantity,
      unitCost: row.unit_cost,
      subtotalCost: subtotal
    };
  }
  // ─── Queries ───────────────────────────────────────────────────────────────
  findAll(includeInactive = false) {
    return __async(this, null, function* () {
      const sql = includeInactive ? `SELECT * FROM products ORDER BY category, name COLLATE NOCASE` : `SELECT * FROM products WHERE is_active = 1 ORDER BY category, name COLLATE NOCASE`;
      const rows = yield this.db.query(sql);
      return rows.map((r) => this.toModel(r));
    });
  }
  findById(id) {
    return __async(this, null, function* () {
      const rows = yield this.db.query(`SELECT * FROM products WHERE id = ?`, [id]);
      return rows[0] ? this.toModel(rows[0]) : null;
    });
  }
  findByCategory(category) {
    return __async(this, null, function* () {
      const rows = yield this.db.query(`SELECT * FROM products WHERE category = ? AND is_active = 1 ORDER BY name`, [category]);
      return rows.map((r) => this.toModel(r));
    });
  }
  findCategories() {
    return __async(this, null, function* () {
      const rows = yield this.db.query(`SELECT DISTINCT category FROM products WHERE is_active = 1 ORDER BY category`);
      return rows.map((r) => r.category);
    });
  }
  /** Devuelve el producto con su receta completa y costos calculados */
  findWithRecipe(id) {
    return __async(this, null, function* () {
      const product = yield this.findById(id);
      if (!product)
        return null;
      const recipeRows = yield this.db.query(`SELECT
         ri.id        AS recipe_item_id,
         'material'   AS item_type,
         ri.material_id,
         NULL         AS sub_product_id,
         m.name       AS material_name,
         m.unit       AS material_unit,
         ri.quantity,
         m.unit_cost
       FROM recipe_items ri
       JOIN materials m ON m.id = ri.material_id
       WHERE ri.product_id = ? AND ri.material_id IS NOT NULL

       UNION ALL

       SELECT
         ri.id          AS recipe_item_id,
         'subproduct'   AS item_type,
         NULL           AS material_id,
         ri.sub_product_id,
         p.name         AS material_name,
         'unidad'       AS material_unit,
         ri.quantity,
         CASE
           WHEN p.yield_units > 0
           THEN COALESCE(
             (SELECT SUM(ri2.quantity * m2.unit_cost)
              FROM recipe_items ri2
              JOIN materials m2 ON m2.id = ri2.material_id
              WHERE ri2.product_id = ri.sub_product_id
                AND ri2.material_id IS NOT NULL),
             0
           ) / p.yield_units
           ELSE 0
         END AS unit_cost
       FROM recipe_items ri
       JOIN products p ON p.id = ri.sub_product_id
       WHERE ri.product_id = ? AND ri.sub_product_id IS NOT NULL

       ORDER BY material_name`, [id, id]);
      const recipe = recipeRows.map((r) => this.toRecipeDetail(r));
      const recipeCostPerBatch = recipe.reduce((sum, r) => sum + r.subtotalCost, 0);
      const recipeCostPerUnit = product.yieldUnits > 0 ? recipeCostPerBatch / product.yieldUnits : 0;
      return __spreadProps(__spreadValues({}, product), { recipe, recipeCostPerBatch, recipeCostPerUnit });
    });
  }
  // ─── Mutations ─────────────────────────────────────────────────────────────
  create(dto) {
    return __async(this, null, function* () {
      const { lastId } = yield this.db.execute(`INSERT INTO products (name, description, category, photo_path, yield_units, suggested_price)
       VALUES (?, ?, ?, ?, ?, ?)`, [
        dto.name,
        dto.description ?? null,
        dto.category ?? "General",
        dto.photoPath ?? null,
        dto.yieldUnits,
        dto.suggestedPrice ?? null
      ]);
      return yield this.findById(lastId);
    });
  }
  update(id, dto) {
    return __async(this, null, function* () {
      const current = yield this.findById(id);
      if (!current)
        throw new Error(`Producto #${id} no encontrado`);
      yield this.db.execute(`UPDATE products
       SET name = ?, description = ?, category = ?, photo_path = ?,
           yield_units = ?, suggested_price = ?
       WHERE id = ?`, [
        dto.name ?? current.name,
        dto.description !== void 0 ? dto.description : current.description,
        dto.category ?? current.category,
        dto.photoPath !== void 0 ? dto.photoPath : current.photoPath,
        dto.yieldUnits ?? current.yieldUnits,
        dto.suggestedPrice !== void 0 ? dto.suggestedPrice : current.suggestedPrice,
        id
      ]);
      return yield this.findById(id);
    });
  }
  softDelete(id) {
    return __async(this, null, function* () {
      yield this.db.execute(`UPDATE products SET is_active = 0 WHERE id = ?`, [id]);
    });
  }
  static {
    this.\u0275fac = function ProductRepository_Factory(t) {
      return new (t || _ProductRepository)(\u0275\u0275inject(DatabaseService));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ProductRepository, factory: _ProductRepository.\u0275fac, providedIn: "root" });
  }
};

// src/app/core/repositories/recipe-item.repository.ts
var RecipeItemRepository = class _RecipeItemRepository {
  constructor(db) {
    this.db = db;
  }
  toModel(row) {
    return {
      id: row.id,
      productId: row.product_id,
      materialId: row.material_id,
      subProductId: row.sub_product_id,
      quantity: row.quantity
    };
  }
  findByProduct(productId) {
    return __async(this, null, function* () {
      const rows = yield this.db.query(`SELECT * FROM recipe_items WHERE product_id = ?`, [productId]);
      return rows.map((r) => this.toModel(r));
    });
  }
  /** Reemplaza toda la receta de un producto en una transacción */
  replaceRecipe(productId, items) {
    return __async(this, null, function* () {
      yield this.db.transaction(() => __async(this, null, function* () {
        yield this.db.execute(`DELETE FROM recipe_items WHERE product_id = ?`, [productId]);
        for (const item of items) {
          yield this.db.execute(`INSERT INTO recipe_items (product_id, material_id, sub_product_id, quantity)
           VALUES (?, ?, ?, ?)`, [productId, item.materialId, item.subProductId, item.quantity]);
        }
      }));
    });
  }
  update(id, dto) {
    return __async(this, null, function* () {
      yield this.db.execute(`UPDATE recipe_items SET quantity = ? WHERE id = ?`, [dto.quantity, id]);
    });
  }
  delete(id) {
    return __async(this, null, function* () {
      yield this.db.execute(`DELETE FROM recipe_items WHERE id = ?`, [id]);
    });
  }
  deleteByProduct(productId) {
    return __async(this, null, function* () {
      yield this.db.execute(`DELETE FROM recipe_items WHERE product_id = ?`, [productId]);
    });
  }
  static {
    this.\u0275fac = function RecipeItemRepository_Factory(t) {
      return new (t || _RecipeItemRepository)(\u0275\u0275inject(DatabaseService));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RecipeItemRepository, factory: _RecipeItemRepository.\u0275fac, providedIn: "root" });
  }
};

// src/app/core/services/product.service.ts
var ProductService = class _ProductService {
  constructor(repo, recipeRepo, photoService) {
    this.repo = repo;
    this.recipeRepo = recipeRepo;
    this.photoService = photoService;
  }
  getAll(includeInactive = false) {
    return this.repo.findAll(includeInactive);
  }
  getById(id) {
    return this.repo.findById(id);
  }
  getWithRecipe(id) {
    return this.repo.findWithRecipe(id);
  }
  getCategories() {
    return this.repo.findCategories();
  }
  create(dto) {
    return __async(this, null, function* () {
      if (!dto.name?.trim())
        throw new Error("El nombre del producto es requerido.");
      if (dto.yieldUnits <= 0)
        throw new Error("El rendimiento debe ser mayor a 0.");
      dto.name = dto.name.trim();
      return this.repo.create(dto);
    });
  }
  update(id, dto) {
    return __async(this, null, function* () {
      if (dto.name !== void 0 && !dto.name.trim()) {
        throw new Error("El nombre no puede estar vac\xEDo.");
      }
      return this.repo.update(id, dto);
    });
  }
  updatePhoto(id, currentPath) {
    return __async(this, null, function* () {
      const newPath = yield this.photoService.replacePhoto(currentPath, "product", id);
      if (newPath) {
        yield this.repo.update(id, { photoPath: newPath });
      }
      return newPath;
    });
  }
  saveRecipe(productId, items) {
    return __async(this, null, function* () {
      if (items.length === 0) {
        throw new Error("La receta debe tener al menos un ingrediente.");
      }
      return this.recipeRepo.replaceRecipe(productId, items);
    });
  }
  delete(id) {
    return __async(this, null, function* () {
      const product = yield this.repo.findById(id);
      if (product?.photoPath) {
        yield this.photoService.deletePhoto(product.photoPath);
      }
      return this.repo.softDelete(id);
    });
  }
  static {
    this.\u0275fac = function ProductService_Factory(t) {
      return new (t || _ProductService)(\u0275\u0275inject(ProductRepository), \u0275\u0275inject(RecipeItemRepository), \u0275\u0275inject(PhotoService));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ProductService, factory: _ProductService.\u0275fac, providedIn: "root" });
  }
};

export {
  ProductRepository,
  RecipeItemRepository,
  ProductService
};
//# sourceMappingURL=chunk-VVRUAT4U.js.map
