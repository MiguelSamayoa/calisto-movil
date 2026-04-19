import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonButton, IonItem, IonLabel, IonInput,
  IonSelect, IonSelectOption, IonTextarea, IonNote,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonIcon, IonBadge, IonChip, IonSpinner,
  ToastController, LoadingController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cashOutline, checkmarkOutline, layersOutline } from 'ionicons/icons';
import { SaleService } from '@services/sale.service';
import { ProductService } from '@services/product.service';
import { ProductionLotRepository } from '@repos/production-lot.repository';
import { Product } from '@models/product.model';
import { ProductionLotWithProduct } from '@models/production-lot.model';
import { CreateSaleDto } from '@models/sale.model';
import { GtqCurrencyPipe } from '@shared/pipes/gtq-currency.pipe';

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, GtqCurrencyPipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonButton, IonItem, IonLabel, IonInput,
    IonSelect, IonSelectOption, IonTextarea, IonNote,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonIcon, IonBadge, IonChip, IonSpinner,
  ],
  templateUrl: './sale-form.page.html',
  styleUrls: ['./sale-form.page.scss'],
})
export class SaleFormPage implements OnInit {
  products: Product[] = [];
  availableLots: ProductionLotWithProduct[] = [];

  selectedProductId: number | null = null;
  selectedLotId: number | null = null;
  quantity: number | null = null;
  unitPrice: number | null = null;
  notes = '';
  saving = false;

  constructor(
    private router: Router,
    private saleService: SaleService,
    private productService: ProductService,
    private lotRepo: ProductionLotRepository,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ cashOutline, checkmarkOutline, layersOutline });
  }

  async ngOnInit(): Promise<void> {
    this.products = await this.productService.getAll();
  }

  async onProductSelected(): Promise<void> {
    this.selectedLotId = null;
    this.unitPrice = null;

    if (!this.selectedProductId) return;

    this.availableLots = await this.lotRepo.findWithStock(this.selectedProductId);

    // Preseleccionar el lote más antiguo (FIFO)
    if (this.availableLots.length > 0) {
      this.selectedLotId = this.availableLots[0].id;
      this.onLotSelected();
    }
  }

  onLotSelected(): void {
    const lot = this.availableLots.find(l => l.id === this.selectedLotId);
    if (lot) {
      this.unitPrice = lot.sellingPrice;
    }
  }

  get totalAmount(): number {
    return (this.quantity ?? 0) * (this.unitPrice ?? 0);
  }

  get selectedLot(): ProductionLotWithProduct | undefined {
    return this.availableLots.find(l => l.id === this.selectedLotId);
  }

  async save(): Promise<void> {
    if (!this.selectedProductId || !this.quantity || !this.unitPrice) {
      this.showToast('Completa todos los campos requeridos', 'warning');
      return;
    }
    if (this.quantity <= 0) {
      this.showToast('La cantidad debe ser mayor a 0', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Registrando venta...' });
    await loading.present();
    this.saving = true;

    try {
      const dto: CreateSaleDto = {
        productId: this.selectedProductId,
        lotId: this.selectedLotId ?? undefined,
        quantity: this.quantity,
        unitPrice: this.unitPrice,
        notes: this.notes || undefined,
      };

      await this.saleService.registerSale(dto);
      this.showToast('Venta registrada', 'success');
      this.router.navigate(['/tabs/sales']);
    } catch (err: unknown) {
      this.showToast(
        err instanceof Error ? err.message : 'Error al registrar',
        'danger'
      );
    } finally {
      this.saving = false;
      await loading.dismiss();
    }
  }

  private async showToast(msg: string, color: string): Promise<void> {
    const t = await this.toastCtrl.create({
      message: msg, duration: 2500, color, position: 'bottom',
    });
    await t.present();
  }
}
