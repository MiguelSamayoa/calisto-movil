import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonButton, IonItem, IonLabel, IonInput,
  IonSelect, IonSelectOption, IonTextarea, IonNote,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList,
  IonIcon, IonBadge, IonChip, IonSpinner,
  ToastController, LoadingController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cashOutline, checkmarkOutline, layersOutline } from 'ionicons/icons';
import { SaleService } from '@services/sale.service';
import { ProductService } from '@services/product.service';
import { Product } from '@models/product.model';
import {
  CreateSaleDto,
  SalePreview,
  SaleStockInsufficientError,
} from '@models/sale.model';
import { GtqCurrencyPipe } from '@shared/pipes/gtq-currency.pipe';

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, GtqCurrencyPipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonButton, IonItem, IonLabel, IonInput,
    IonSelect, IonSelectOption, IonTextarea, IonNote,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList,
    IonIcon, IonBadge, IonChip, IonSpinner,
  ],
  templateUrl: './sale-form.page.html',
  styleUrls: ['./sale-form.page.scss'],
})
export class SaleFormPage implements OnInit {
  products: Product[] = [];

  selectedProductId: number | null = null;
  quantity: number | null = null;
  notes = '';
  preview: SalePreview | null = null;
  previewing = false;
  previewError = '';
  saving = false;

  private previewTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private router: Router,
    private saleService: SaleService,
    private productService: ProductService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ cashOutline, checkmarkOutline, layersOutline });
  }

  async ngOnInit(): Promise<void> {
    this.products = await this.productService.getAll();
  }

  onFormChange(): void {
    clearTimeout(this.previewTimer);
    this.previewError = '';
    this.preview = null;

    if (!this.selectedProductId || !this.quantity || this.quantity <= 0) {
      this.previewing = false;
      return;
    }

    this.previewing = true;
    this.previewTimer = setTimeout(() => {
      void this.loadPreview();
    }, 250);
  }

  get totalAmount(): number {
    return this.preview?.totalAmount ?? 0;
  }

  async save(): Promise<void> {
    if (!this.selectedProductId || !this.quantity) {
      this.showToast('Completa todos los campos requeridos', 'warning');
      return;
    }
    if (this.quantity <= 0) {
      this.showToast('La cantidad debe ser mayor a 0', 'warning');
      return;
    }
    if (!this.preview) {
      this.showToast('Calcula la disponibilidad antes de registrar la venta', 'warning');
      return;
    }
    if (this.previewError) {
      this.showToast('No hay stock suficiente para registrar la venta', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Registrando venta...' });
    await loading.present();
    this.saving = true;

    try {
      const dto: CreateSaleDto = {
        productId: this.selectedProductId,
        quantity: this.quantity,
        notes: this.notes || undefined,
      };

      await this.saleService.registerSale(dto);
      this.showToast('Venta registrada', 'success');
      this.router.navigate(['/tabs/sales']);
    } catch (err: unknown) {
      if (err instanceof SaleStockInsufficientError) {
        this.previewError = `Solicitaste ${err.requestedQuantity} y solo hay ${err.availableQuantity} disponibles.`;
        this.preview = null;
        this.showToast('Stock insuficiente para registrar la venta', 'warning');
      } else {
        this.showToast(
          err instanceof Error ? err.message : 'Error al registrar',
          'danger'
        );
      }
    } finally {
      this.saving = false;
      await loading.dismiss();
    }
  }

  private async loadPreview(): Promise<void> {
    if (!this.selectedProductId || !this.quantity || this.quantity <= 0) {
      this.previewing = false;
      return;
    }

    try {
      this.preview = await this.saleService.previewSale(this.selectedProductId, this.quantity);
      this.previewError = '';
    } catch (err: unknown) {
      this.preview = null;
      this.previewError = err instanceof Error ? err.message : 'No se pudo calcular la disponibilidad';
    } finally {
      this.previewing = false;
    }
  }

  private async showToast(msg: string, color: string): Promise<void> {
    const t = await this.toastCtrl.create({
      message: msg, duration: 2500, color, position: 'bottom',
    });
    await t.present();
  }
}
