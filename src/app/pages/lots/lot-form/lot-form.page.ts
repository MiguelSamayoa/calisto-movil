import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonButton, IonItem, IonLabel, IonInput,
  IonSelect, IonSelectOption, IonIcon, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonNote, IonRange, IonBadge,
  IonAccordion, IonAccordionGroup, IonList, IonTextarea,
  IonSpinner, IonAlert,
  ToastController, LoadingController, AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calculatorOutline, checkmarkCircleOutline, alertCircleOutline,
  layersOutline, informationCircleOutline,
} from 'ionicons/icons';
import { CostCalculatorService } from '@services/cost-calculator.service';
import { ProductService } from '@services/product.service';
import { Product } from '@models/product.model';
import {
  LotCostCalculation,
  CreateProductionLotDto,
} from '@models/production-lot.model';
import { GtqCurrencyPipe } from '@shared/pipes/gtq-currency.pipe';

@Component({
  selector: 'app-lot-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, GtqCurrencyPipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonButton, IonItem, IonLabel, IonInput,
    IonSelect, IonSelectOption, IonIcon, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent, IonNote, IonRange, IonBadge,
    IonAccordion, IonAccordionGroup, IonList, IonTextarea,
    IonSpinner,
  ],
  templateUrl: './lot-form.page.html',
  styleUrls: ['./lot-form.page.scss'],
})
export class LotFormPage implements OnInit {
  products: Product[] = [];

  // ─── Parámetros de entrada ─────────────────────────────────────────────────
  selectedProductId: number | null = null;
  quantity: number | null = null;
  marginPct = 40;           // Margen por defecto 40%
  customSellingPrice: number | null = null;
  useCustomPrice = false;
  notes = '';

  // ─── Estado del cálculo ────────────────────────────────────────────────────
  calculation: LotCostCalculation | null = null;
  calculating = false;
  saving = false;
  calcError = '';

  // Debounce para recalcular al escribir
  private calcTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private router: Router,
    private productService: ProductService,
    private calculator: CostCalculatorService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    addIcons({
      calculatorOutline, checkmarkCircleOutline, alertCircleOutline,
      layersOutline, informationCircleOutline,
    });
  }

  async ngOnInit(): Promise<void> {
    this.products = await this.productService.getAll();
  }

  // ─── Cálculo reactivo ──────────────────────────────────────────────────────

  onInputChange(): void {
    clearTimeout(this.calcTimer);
    this.calculation = null;
    this.calcError = '';

    if (!this.selectedProductId || !this.quantity || this.quantity <= 0) return;

    this.calcTimer = setTimeout(() => this.calculate(), 400);
  }

  async calculate(): Promise<void> {
    if (!this.selectedProductId || !this.quantity) return;

    this.calculating = true;
    this.calcError = '';
    try {
      this.calculation = await this.calculator.calculateLotCost(
        this.selectedProductId,
        this.quantity,
        this.marginPct
      );
      // Si no hay precio personalizado, usar el sugerido
      if (!this.useCustomPrice) {
        this.customSellingPrice = this.calculation.suggestedPrice;
      }
    } catch (err: unknown) {
      this.calcError = err instanceof Error ? err.message : 'Error en el cálculo';
      this.calculation = null;
    } finally {
      this.calculating = false;
    }
  }

  get finalSellingPrice(): number {
    if (this.useCustomPrice && this.customSellingPrice) {
      return this.customSellingPrice;
    }
    return this.calculation?.suggestedPrice ?? 0;
  }

  get actualMargin(): number {
    if (!this.calculation) return 0;
    return this.calculator.calculateActualMargin(
      this.calculation.costPerUnit,
      this.finalSellingPrice
    );
  }

  get hasStockWarnings(): boolean {
    return (this.calculation?.stockWarnings?.length ?? 0) > 0;
  }

  // ─── Confirmar lote ───────────────────────────────────────────────────────

  async confirmLot(): Promise<void> {
    if (!this.calculation || !this.selectedProductId || !this.quantity) return;

    if (this.hasStockWarnings) {
      const alert = await this.alertCtrl.create({
        header: 'Advertencia de stock',
        message: '¿Confirmar de todas formas? El stock de algunos materiales será negativo.',
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Confirmar igual', handler: () => this.saveLot() },
        ],
      });
      await alert.present();
    } else {
      await this.saveLot();
    }
  }

  private async saveLot(): Promise<void> {
    if (!this.calculation) return;
    const loading = await this.loadingCtrl.create({ message: 'Creando lote...' });
    await loading.present();
    this.saving = true;

    try {
      const dto: CreateProductionLotDto = {
        productId: this.calculation.productId,
        quantity: this.calculation.totalUnits,
        sellingPrice: this.finalSellingPrice,
        profitMargin: this.actualMargin,
        notes: this.notes || undefined,
      };

      await this.calculator.confirmLot(dto, this.calculation);

      this.showToast(
        `Lote de ${this.calculation.totalUnits} unidades creado`,
        'success'
      );
      this.router.navigate(['/tabs/lots']);
    } catch (err: unknown) {
      this.showToast(
        err instanceof Error ? err.message : 'Error al crear lote',
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
