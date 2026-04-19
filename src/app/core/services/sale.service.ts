import { Injectable } from '@angular/core';
import { SaleRepository } from '@repos/sale.repository';
import { ProductionLotRepository } from '@repos/production-lot.repository';
import {
  Sale,
  CreateSaleDto,
  SaleWithProduct,
  DashboardStats,
  MonthlySummary,
} from '@models/sale.model';

@Injectable({ providedIn: 'root' })
export class SaleService {
  constructor(
    private repo: SaleRepository,
    private lotRepo: ProductionLotRepository
  ) {}

  getAll(limit = 50, offset = 0): Promise<SaleWithProduct[]> {
    return this.repo.findAll(limit, offset);
  }

  getToday(): Promise<SaleWithProduct[]> {
    return this.repo.findToday();
  }

  getByDateRange(from: string, to: string): Promise<SaleWithProduct[]> {
    return this.repo.findByDateRange(from, to);
  }

  getDashboardStats(): Promise<DashboardStats> {
    return this.repo.getDashboardStats();
  }

  getMonthlySummary(year: number, month: number): Promise<MonthlySummary> {
    return this.repo.getMonthlySummary(year, month);
  }

  async registerSale(dto: CreateSaleDto): Promise<Sale> {
    if (dto.quantity <= 0) throw new Error('La cantidad debe ser mayor a 0.');
    if (dto.unitPrice < 0) throw new Error('El precio no puede ser negativo.');

    // Validar que haya stock en el lote si se especificó
    if (dto.lotId) {
      const lot = await this.lotRepo.findById(dto.lotId);
      if (!lot) throw new Error('Lote no encontrado.');
      if (lot.remainingUnits < dto.quantity) {
        throw new Error(
          `Stock insuficiente en lote. Disponibles: ${lot.remainingUnits} unidades.`
        );
      }
    }

    return this.repo.create(dto);
  }

  async deleteSale(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
