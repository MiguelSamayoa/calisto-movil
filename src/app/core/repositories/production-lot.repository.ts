import { Injectable } from '@angular/core';
import { DatabaseService } from '@db/database.service';
import {
  ProductionLot,
  ProductionLotStatus,
  CreateProductionLotDto,
  ProductionLotWithProduct,
  CreateLotInventoryAdjustmentDto,
  LotInventoryAdjustment,
  LotInventoryAdjustmentReason,
  AccountingTreatment,
} from '@models/production-lot.model';

interface LotRow {
  id: number;
  product_id: number;
  quantity: number;
  total_cost: number;
  cost_per_unit: number;
  selling_price: number;
  profit_margin: number;
  remaining_units: number;
  status: string;
  notes: string | null;
  produced_at: string;
  created_at: string;
}

interface LotWithProductRow extends LotRow {
  product_name: string;
  product_category: string;
  product_photo_path: string | null;
}

interface LotInventoryAdjustmentRow {
  id: number;
  lot_id: number;
  product_id: number;
  quantity: number;
  adjustment_type: string;
  accounting_treatment: string;
  unit_cost_snapshot: number;
  total_cost_snapshot: number;
  created_by: string;
  reason_detail: string | null;
  created_at: string;
}

interface LotSnapshotRow {
  id: number;
  product_id: number;
  remaining_units: number;
  status: string;
  cost_per_unit: number;
}

@Injectable({ providedIn: 'root' })
export class ProductionLotRepository {
  constructor(private db: DatabaseService) {}

  private toModel(row: LotRow): ProductionLot {
    return {
      id: row.id,
      productId: row.product_id,
      quantity: row.quantity,
      totalCost: row.total_cost,
      costPerUnit: row.cost_per_unit,
      sellingPrice: row.selling_price,
      profitMargin: row.profit_margin,
      remainingUnits: row.remaining_units,
      status: row.status as ProductionLotStatus,
      notes: row.notes,
      producedAt: row.produced_at,
      createdAt: row.created_at,
    };
  }

  private toModelWithProduct(row: LotWithProductRow): ProductionLotWithProduct {
    return {
      ...this.toModel(row),
      productName: row.product_name,
      productCategory: row.product_category,
      productPhotoPath: row.product_photo_path,
    };
  }

  private toAdjustmentModel(row: LotInventoryAdjustmentRow): LotInventoryAdjustment {
    return {
      id: row.id,
      lotId: row.lot_id,
      productId: row.product_id,
      quantity: row.quantity,
      reason: row.adjustment_type as LotInventoryAdjustmentReason,
      accountingTreatment: row.accounting_treatment as AccountingTreatment,
      unitCostSnapshot: row.unit_cost_snapshot,
      totalCostSnapshot: row.total_cost_snapshot,
      createdBy: row.created_by,
      notes: row.reason_detail,
      createdAt: row.created_at,
    };
  }

  private resolveAccountingTreatment(reason: LotInventoryAdjustmentReason): AccountingTreatment {
    switch (reason) {
      case 'CORTESIA':
      case 'CONSUMO_INTERNO':
      case 'AJUSTE_MANUAL':
        return 'OPEX';
      default:
        return 'COGS';
    }
  }

  private reasonLabel(reason: LotInventoryAdjustmentReason): string {
    switch (reason) {
      case 'VENCIMIENTO':
        return 'Merma por vencimiento';
      case 'MERMA':
        return 'Merma general';
      case 'ERROR_PRODUCCION':
        return 'Error de produccion';
      case 'DESPERDICIO':
        return 'Desperdicio operativo';
      case 'CORTESIA':
        return 'Regalo/Cortesia';
      case 'CONSUMO_INTERNO':
        return 'Consumo interno';
      default:
        return 'Ajuste manual';
    }
  }

  private async ensureAdjustmentTypeExists(
    reason: LotInventoryAdjustmentReason,
    treatment: AccountingTreatment
  ): Promise<void> {
    await this.db.execute(
      `INSERT OR IGNORE INTO adjustment_type_catalog (code, label, accounting_treatment, is_active)
       VALUES (?, ?, ?, 1)`,
      [reason, this.reasonLabel(reason), treatment]
    );
  }

  private buildAdjustmentCode(): string {
    const rnd = Math.floor(Math.random() * 1_000_000).toString().padStart(6, '0');
    return `ADJ-${Date.now()}-${rnd}`;
  }

  private async computeSha256(input: string): Promise<string> {
    const subtle = globalThis.crypto?.subtle;
    if (!subtle) {
      // WebCrypto es requerido para garantizar la integridad de la cadena de auditoría.
      // Un hash no criptográfico (ej. FNV-1a 32-bit) puede forjarse trivialmente,
      // invalidando todo el valor forense del audit log.
      throw new Error(
        'WebCrypto no está disponible. No se puede garantizar la integridad del registro de auditoría.'
      );
    }

    const digest = await subtle.digest('SHA-256', new TextEncoder().encode(input));
    const bytes = Array.from(new Uint8Array(digest));
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private getOrCreateDeviceKey(): string {
    const STORAGE_KEY = 'calisto_audit_hmac_key';
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const keyBytes = new Uint8Array(32);
    globalThis.crypto.getRandomValues(keyBytes);
    const key = Array.from(keyBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    localStorage.setItem(STORAGE_KEY, key);
    return key;
  }

  private async computeHmacSignature(payload: string): Promise<string> {
    const subtle = globalThis.crypto?.subtle;
    if (!subtle) throw new Error('WebCrypto no disponible.');
    const keyHex = this.getOrCreateDeviceKey();
    const keyBytes = new Uint8Array(keyHex.match(/.{2}/g)!.map(b => parseInt(b, 16)));
    const cryptoKey = await subtle.importKey(
      'raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const sig = await subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(payload));
    return `hmac-sha256:${Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')}`;
  }

  // ─── Queries ───────────────────────────────────────────────────────────────

  async findAll(limit = 50, offset = 0): Promise<ProductionLotWithProduct[]> {
    const rows = await this.db.query<LotWithProductRow>(
      `SELECT
         pl.*,
         p.name       AS product_name,
         p.category   AS product_category,
         p.photo_path AS product_photo_path
       FROM production_lots pl
       JOIN products p ON p.id = pl.product_id
       ORDER BY pl.produced_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows.map(r => this.toModelWithProduct(r));
  }

  async findById(id: number): Promise<ProductionLotWithProduct | null> {
    const rows = await this.db.query<LotWithProductRow>(
      `SELECT
         pl.*,
         p.name       AS product_name,
         p.category   AS product_category,
         p.photo_path AS product_photo_path
       FROM production_lots pl
       JOIN products p ON p.id = pl.product_id
       WHERE pl.id = ?`,
      [id]
    );
    return rows[0] ? this.toModelWithProduct(rows[0]) : null;
  }

  async findByProduct(productId: number, limit = 20): Promise<ProductionLot[]> {
    const rows = await this.db.query<LotRow>(
      `SELECT * FROM production_lots WHERE product_id = ?
       ORDER BY produced_at DESC LIMIT ?`,
      [productId, limit]
    );
    return rows.map(r => this.toModel(r));
  }

  async findWithStock(productId?: number): Promise<ProductionLotWithProduct[]> {
    const base = `
      SELECT
        pl.*,
        p.name       AS product_name,
        p.category   AS product_category,
        p.photo_path AS product_photo_path
      FROM production_lots pl
      JOIN products p ON p.id = pl.product_id
      WHERE pl.remaining_units > 0 AND pl.status = 'ABIERTO'`

    const rows = productId
      ? await this.db.query<LotWithProductRow>(
          `${base} AND pl.product_id = ? ORDER BY pl.produced_at ASC`,
          [productId]
        )
      : await this.db.query<LotWithProductRow>(
          `${base} ORDER BY p.name, pl.produced_at ASC`
        );

    return rows.map(r => this.toModelWithProduct(r));
  }

  async findByDateRange(from: string, to: string): Promise<ProductionLotWithProduct[]> {
    const rows = await this.db.query<LotWithProductRow>(
      `SELECT
         pl.*,
         p.name       AS product_name,
         p.category   AS product_category,
         p.photo_path AS product_photo_path
       FROM production_lots pl
       JOIN products p ON p.id = pl.product_id
       WHERE pl.produced_at BETWEEN ? AND ?
       ORDER BY pl.produced_at DESC`,
      [from, to]
    );
    return rows.map(r => this.toModelWithProduct(r));
  }

  // ─── Mutations ─────────────────────────────────────────────────────────────

  async create(
    dto: CreateProductionLotDto,
    totalCost: number,
    costPerUnit: number
  ): Promise<ProductionLot> {
    const { lastId } = await this.db.execute(
      `INSERT INTO production_lots
         (product_id, quantity, total_cost, cost_per_unit, selling_price,
          profit_margin, remaining_units, status, notes, produced_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dto.productId,
        dto.quantity,
        totalCost,
        costPerUnit,
        dto.sellingPrice,
        dto.profitMargin,
        dto.quantity,   // inicialmente todos sin vender
        'ABIERTO',
        dto.notes ?? null,
        dto.producedAt ?? new Date().toISOString(),
      ]
    );
    const row = await this.db.query<LotRow>(
      `SELECT * FROM production_lots WHERE id = ?`,
      [lastId]
    );
    return this.toModel(row[0]);
  }

  async updateSellingPrice(id: number, sellingPrice: number, actorId = 'app'): Promise<void> {
    const current = await this.db.query<{ selling_price: number }>(
      `SELECT selling_price FROM production_lots WHERE id = ?`,
      [id]
    );
    const oldPrice = current[0]?.selling_price ?? null;

    await this.db.execute(
      `UPDATE production_lots SET selling_price = ? WHERE id = ?`,
      [sellingPrice, id]
    );

    await this.db.execute(
      `INSERT INTO lot_audit_log (lot_id, event_type, old_value, new_value, actor_id)
       VALUES (?, 'PRICE_UPDATE', ?, ?, ?)`,
      [id, oldPrice?.toString() ?? null, sellingPrice.toString(), actorId]
    );
  }

  async listInventoryAdjustments(lotId: number): Promise<LotInventoryAdjustment[]> {
    const rows = await this.db.query<LotInventoryAdjustmentRow>(
      `SELECT * FROM (
         SELECT
           ia.id,
           ia.lot_id,
           ia.product_id,
           ia.quantity_total AS quantity,
           ia.adjustment_type,
           ia.accounting_treatment,
           COALESCE(
             (SELECT AVG(ial.unit_cost_snapshot)
              FROM inventory_adjustment_allocations ial
              WHERE ial.adjustment_id = ia.id AND ial.lot_id = ia.lot_id),
             0
           ) AS unit_cost_snapshot,
           ia.total_cost_snapshot,
           ia.created_by,
           ia.reason_detail,
           ia.created_at
         FROM inventory_adjustments ia
         WHERE ia.lot_id = ?

         UNION ALL

         SELECT
           -legacy.id AS id,
           legacy.lot_id,
           pl.product_id,
           legacy.quantity,
           legacy.reason AS adjustment_type,
           CASE
             WHEN legacy.reason IN ('CORTESIA', 'CONSUMO_INTERNO', 'AJUSTE_MANUAL') THEN 'OPEX'
             ELSE 'COGS'
           END AS accounting_treatment,
           pl.cost_per_unit AS unit_cost_snapshot,
           legacy.quantity * pl.cost_per_unit AS total_cost_snapshot,
           'legacy' AS created_by,
           legacy.notes AS reason_detail,
           legacy.created_at
         FROM lot_inventory_adjustments legacy
         JOIN production_lots pl ON pl.id = legacy.lot_id
         WHERE legacy.lot_id = ?
       )
       ORDER BY created_at DESC, id DESC`,
      [lotId, lotId]
    );
    return rows.map(r => this.toAdjustmentModel(r));
  }

  async registerInventoryAdjustment(
    lotId: number,
    dto: CreateLotInventoryAdjustmentDto
  ): Promise<void> {
    if (dto.quantity <= 0) {
      throw new Error('La cantidad del ajuste debe ser mayor a 0.');
    }

    // Todas las validaciones ocurren DENTRO de la transacción para eliminar
    // la ventana de tiempo entre leer el estado y modificarlo (TOCTOU).
    await this.db.transaction(async () => {
      const lotRows = await this.db.query<LotSnapshotRow>(
        `SELECT id, product_id, remaining_units, status, cost_per_unit
         FROM production_lots
         WHERE id = ?`,
        [lotId]
      );
      const lot = lotRows[0];
      if (!lot) {
        throw new Error('Lote no encontrado.');
      }
      if (lot.status !== 'ABIERTO') {
        throw new Error('Solo se pueden ajustar lotes en estado ABIERTO.');
      }

      const activeLotRows = await this.db.query<{ id: number }>(
        `SELECT id
         FROM production_lots
         WHERE product_id = ? AND status = 'ABIERTO' AND remaining_units > 0
         ORDER BY produced_at ASC, id ASC
         LIMIT 1`,
        [lot.product_id]
      );
      const activeLotId = activeLotRows[0]?.id ?? null;
      if (activeLotId == null || activeLotId !== lotId) {
        throw new Error('Debes ajustar primero el lote activo FIFO del producto.');
      }
      if (lot.remaining_units < dto.quantity) {
        throw new Error('No hay suficientes unidades disponibles para aplicar el ajuste.');
      }

      const treatment = this.resolveAccountingTreatment(dto.reason);
      const unitCostSnapshot = lot.cost_per_unit;
      const totalCostSnapshot = unitCostSnapshot * dto.quantity;
      const createdBy = dto.createdBy?.trim() || 'app';
      const adjustmentCode = this.buildAdjustmentCode();
      const nowIso = new Date().toISOString();

      await this.ensureAdjustmentTypeExists(dto.reason, treatment);

      const update = await this.db.execute(
        `UPDATE production_lots
         SET remaining_units = remaining_units - ?,
             status = CASE WHEN remaining_units - ? <= 0 THEN 'CERRADO' ELSE 'ABIERTO' END,
             closed_at = CASE WHEN remaining_units - ? <= 0 THEN ? ELSE closed_at END,
             closed_reason = CASE WHEN remaining_units - ? <= 0 THEN 'AJUSTE_TOTAL' ELSE closed_reason END,
             total_adjusted_units = total_adjusted_units + ?,
             total_adjusted_cost = total_adjusted_cost + ?
         WHERE id = ? AND remaining_units >= ? AND status != 'ANULADO'`,
        [
          dto.quantity,
          dto.quantity,
          dto.quantity,
          nowIso,
          dto.quantity,
          dto.quantity,
          totalCostSnapshot,
          lotId,
          dto.quantity,
        ]
      );

      if (update.changes === 0) {
        throw new Error('No hay suficientes unidades disponibles para aplicar el ajuste.');
      }

      const inserted = await this.db.execute(
        `INSERT INTO inventory_adjustments (
           adjustment_code, product_id, lot_id, quantity_total, adjustment_type,
           accounting_treatment, reason_detail, total_cost_snapshot,
           status, created_by, posted_at
         )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'POSTED', ?, ?)`,
        [
          adjustmentCode,
          lot.product_id,
          lotId,
          dto.quantity,
          dto.reason,
          treatment,
          dto.notes ?? null,
          totalCostSnapshot,
          createdBy,
          nowIso,
        ]
      );

      await this.db.execute(
        `INSERT INTO inventory_adjustment_allocations
           (adjustment_id, lot_id, quantity, unit_cost_snapshot, total_cost_snapshot)
         VALUES (?, ?, ?, ?, ?)`,
        [inserted.lastId, lotId, dto.quantity, unitCostSnapshot, totalCostSnapshot]
      );

      const prevLogRows = await this.db.query<{ event_hash: string }>(
        `SELECT event_hash FROM adjustment_audit_log ORDER BY id DESC LIMIT 1`
      );
      const previousHash = prevLogRows[0]?.event_hash ?? null;

      const payload = JSON.stringify({
        adjustmentId: inserted.lastId,
        adjustmentCode,
        lotId,
        productId: lot.product_id,
        quantity: dto.quantity,
        adjustmentType: dto.reason,
        accountingTreatment: treatment,
        unitCostSnapshot,
        totalCostSnapshot,
        reasonDetail: dto.notes ?? null,
        actorId: createdBy,
        createdAt: nowIso,
      });
      const hashInput = `${previousHash ?? ''}|${payload}`;
      const eventHash = await this.computeSha256(hashInput);
      const signature = await this.computeHmacSignature(payload);

      await this.db.execute(
        `INSERT INTO adjustment_audit_log
           (adjustment_id, event_type, payload_json, actor_id, previous_hash, event_hash, signature)
         VALUES (?, 'CREATE_ADJUSTMENT', ?, ?, ?, ?, ?)`,
        [inserted.lastId, payload, createdBy, previousHash, eventHash, signature]
      );
    });
  }

  /** @deprecated Usa CostCalculatorService.voidLot() para anular con trazabilidad y restauración de stock. */
  async delete(_id: number): Promise<void> {
    throw new Error(
      'La eliminación directa de lotes no está permitida. ' +
      'Usa CostCalculatorService.voidLot() para anular un lote con trazabilidad completa y restauración de inventario.'
    );
  }
}
