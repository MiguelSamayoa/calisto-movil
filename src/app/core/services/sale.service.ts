import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SaleRepository } from '@repos/sale.repository';
import { OperatorService } from '@services/operator.service';
import {
  Sale,
  CreateSaleDto,
  SaleWithProduct,
  DashboardStats,
  MonthlySummary,
  SalePreview,
} from '@models/sale.model';

@Injectable({ providedIn: 'root' })
export class SaleService {
  private readonly salesChangedSubject = new Subject<void>();
  readonly salesChanged$: Observable<void> = this.salesChangedSubject.asObservable();

  constructor(
    private repo: SaleRepository,
    private operatorService: OperatorService,
  ) {}

  private notifySalesChanged(): void {
    this.salesChangedSubject.next();
  }

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

  previewSale(productId: number, quantity: number): Promise<SalePreview> {
    return this.repo.previewFifoSale(productId, quantity);
  }

  async registerSale(dto: CreateSaleDto): Promise<Sale> {
    if (dto.quantity <= 0) throw new Error('La cantidad debe ser mayor a 0.');
    if (dto.unitPrice !== undefined && dto.unitPrice < 0) {
      throw new Error('El precio no puede ser negativo.');
    }

    const enriched: CreateSaleDto = {
      ...dto,
      createdBy: dto.createdBy ?? await this.operatorService.getName(),
    };
    const sale = await this.repo.create(enriched);
    this.notifySalesChanged();
    return sale;
  }

  async deleteSale(_id: number): Promise<void> {
    throw new Error('La eliminación de ventas está deshabilitada.');
  }
}
