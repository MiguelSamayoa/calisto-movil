import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonItem, IonLabel, IonNote, IonCard,
  IonCardHeader, IonCardTitle, IonCardContent, IonBadge,
  IonButton, IonIcon, AlertController, ToastController,
  IonInput, IonSelect, IonSelectOption, IonTextarea,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { banOutline, flaskOutline } from 'ionicons/icons';
import { ProductionLotRepository } from '@repos/production-lot.repository';
import { CostCalculatorService } from '@services/cost-calculator.service';
import { OperatorService } from '@services/operator.service';
import {
  ProductionLotWithProduct,
  LotInventoryAdjustment,
  LotInventoryAdjustmentReason,
} from '@models/production-lot.model';
import { GtqCurrencyPipe } from '@shared/pipes/gtq-currency.pipe';

@Component({
  selector: 'app-lot-detail',
  standalone: true,
  imports: [
    CommonModule, FormsModule, GtqCurrencyPipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonItem, IonLabel, IonNote, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonBadge,
    IonButton, IonIcon, IonInput, IonSelect, IonSelectOption, IonTextarea,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start"><ion-back-button defaultHref="/tabs/lots"></ion-back-button></ion-buttons>
        <ion-title>Detalle de lote</ion-title>
        <ion-buttons slot="end">
          <ion-button color="warning" (click)="confirmVoid()" [disabled]="voiding">
            <ion-icon slot="icon-only" name="ban-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" *ngIf="lot">
      <ion-card style="border-radius:16px">
        <ion-card-header>
          <ion-card-title>{{ lot.productName }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item lines="full">
            <ion-label>Unidades producidas</ion-label>
            <ion-note slot="end"><strong>{{ lot.quantity }}</strong></ion-note>
          </ion-item>
          <ion-item lines="full">
            <ion-label>Costo total materiales</ion-label>
            <ion-note slot="end">{{ lot.totalCost | gtq }}</ion-note>
          </ion-item>
          <ion-item lines="full">
            <ion-label>Costo por unidad</ion-label>
            <ion-note slot="end">{{ lot.costPerUnit | gtq }}</ion-note>
          </ion-item>
          <ion-item lines="full">
            <ion-label>Precio de venta</ion-label>
            <ion-note slot="end" style="color:var(--ion-color-success)">
              <strong>{{ lot.sellingPrice | gtq }}</strong>
            </ion-note>
          </ion-item>
          <ion-item lines="full">
            <ion-label>Margen de ganancia</ion-label>
            <ion-note slot="end">{{ lot.profitMargin | number:'1.1-1' }}%</ion-note>
          </ion-item>
          <ion-item lines="full">
            <ion-label>Unidades disponibles</ion-label>
            <ion-badge [color]="lot.remainingUnits > 0 ? 'success' : 'medium'" slot="end">
              {{ lot.remainingUnits }}
            </ion-badge>
          </ion-item>
          <ion-item lines="none">
            <ion-label>Fecha de producción</ion-label>
            <ion-note slot="end">{{ lot.producedAt | date:'dd/MM/yyyy HH:mm' }}</ion-note>
          </ion-item>
          <ion-item *ngIf="lot.notes" lines="none">
            <ion-label>
              <h3>Notas</h3>
              <p>{{ lot.notes }}</p>
            </ion-label>
          </ion-item>
        </ion-card-content>
      </ion-card>

      <ion-card style="border-radius:16px">
        <ion-card-header>
          <ion-card-title>Ajuste de inventario</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item lines="full">
            <ion-label position="stacked">Cantidad a descontar</ion-label>
            <ion-input
              type="number"
              min="1"
              [max]="lot.remainingUnits"
              [(ngModel)]="adjustQuantity"
              placeholder="Ej. 3"
            ></ion-input>
          </ion-item>

          <ion-item lines="full">
            <ion-label position="stacked">Motivo</ion-label>
            <ion-select [(ngModel)]="adjustReason" interface="popover">
              <ion-select-option value="VENCIMIENTO">Vencimiento</ion-select-option>
              <ion-select-option value="MERMA">Merma</ion-select-option>
              <ion-select-option value="ERROR_PRODUCCION">Error de produccion</ion-select-option>
              <ion-select-option value="DESPERDICIO">Desperdicio</ion-select-option>
              <ion-select-option value="CORTESIA">Regalo / Cortesia</ion-select-option>
              <ion-select-option value="CONSUMO_INTERNO">Consumo interno</ion-select-option>
              <ion-select-option value="AJUSTE_MANUAL">Ajuste manual</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item lines="none">
            <ion-label position="stacked">Notas (opcional)</ion-label>
            <ion-textarea
              [(ngModel)]="adjustNotes"
              autoGrow="true"
              maxlength="250"
              placeholder="Ej. producto vencido el 25/04"
            ></ion-textarea>
          </ion-item>

          <ion-button
            expand="block"
            color="warning"
            [disabled]="adjusting || lot.remainingUnits <= 0"
            (click)="registerAdjustment()"
          >
            <ion-icon slot="start" name="flask-outline"></ion-icon>
            Registrar ajuste
          </ion-button>

          <ion-note *ngIf="lot.remainingUnits <= 0" color="medium">
            Este lote ya no tiene unidades disponibles para ajustar.
          </ion-note>
        </ion-card-content>
      </ion-card>

      <ion-card style="border-radius:16px" *ngIf="adjustments.length > 0">
        <ion-card-header>
          <ion-card-title>Historial de ajustes</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item lines="full" *ngFor="let item of adjustments">
            <ion-label>
              <h3>{{ reasonLabel(item.reason) }}: -{{ item.quantity }} uds</h3>
              <p>
                {{ item.accountingTreatment }} · {{ item.totalCostSnapshot | gtq }}
                ({{ item.unitCostSnapshot | gtq }}/u)
              </p>
              <p *ngIf="item.notes">{{ item.notes }}</p>
              <p style="font-size:0.75rem;color:var(--ion-color-medium)">
                {{ item.createdAt | date:'dd/MM/yyyy HH:mm' }} · {{ item.createdBy }}
              </p>
            </ion-label>
          </ion-item>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
})
export class LotDetailPage implements OnInit {
  lot: ProductionLotWithProduct | null = null;
  adjustments: LotInventoryAdjustment[] = [];
  adjustQuantity: number | null = null;
  adjustReason: LotInventoryAdjustmentReason = 'VENCIMIENTO';
  adjustNotes = '';
  adjusting = false;
  voiding = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lotRepo: ProductionLotRepository,
    private calculator: CostCalculatorService,
    private operatorService: OperatorService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) { addIcons({ banOutline, flaskOutline }); }

  async ngOnInit(): Promise<void> {
    await this.loadLot();
  }

  reasonLabel(reason: LotInventoryAdjustmentReason): string {
    switch (reason) {
      case 'VENCIMIENTO':
        return 'Vencimiento';
      case 'MERMA':
        return 'Merma';
      case 'ERROR_PRODUCCION':
        return 'Error de produccion';
      case 'DESPERDICIO':
        return 'Desperdicio';
      case 'CORTESIA':
        return 'Regalo / Cortesia';
      case 'CONSUMO_INTERNO':
        return 'Consumo interno';
      default:
        return 'Ajuste manual';
    }
  }

  async confirmVoid(): Promise<void> {
    if (!this.lot) return;
    if (this.lot.status === 'ANULADO') {
      await this.showToast('Este lote ya fue anulado.', 'medium');
      return;
    }
    if (this.lot.status === 'CERRADO') {
      await this.showToast(
        'No se puede anular un lote completamente vendido. Usa ajuste de inventario.',
        'warning'
      );
      return;
    }

    const soldUnits = this.lot.quantity - this.lot.remainingUnits;
    const message =
      `Se anulará el lote "<strong>${this.lot.productName}</strong>".<br><br>` +
      `• ${this.lot.remainingUnits} unidades disponibles serán devueltas al inventario de materiales.<br>` +
      (soldUnits > 0 ? `• ${soldUnits} unidades ya vendidas NO se revierten.<br><br>` : '<br>') +
      `Esta acción queda registrada en la bitácora y no se puede deshacer.`;

    const alert = await this.alertCtrl.create({
      header: 'Anular lote',
      message,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Anular lote',
          role: 'destructive',
          handler: () => { void this.executeVoid(); },
        },
      ],
    });
    await alert.present();
  }

  private async executeVoid(): Promise<void> {
    if (!this.lot) return;
    this.voiding = true;
    try {
      const actor = await this.operatorService.getName();
      await this.calculator.voidLot(this.lot.id, actor);
      await this.showToast('Lote anulado. Stock de materiales restaurado.', 'success');
      this.router.navigate(['/tabs/lots']);
    } catch (err: unknown) {
      await this.showToast(
        err instanceof Error ? err.message : 'No se pudo anular el lote.',
        'danger'
      );
    } finally {
      this.voiding = false;
    }
  }

  async registerAdjustment(): Promise<void> {
    if (!this.lot) return;

    const quantity = Number(this.adjustQuantity ?? 0);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      await this.showToast('Ingresa una cantidad valida mayor a 0.', 'warning');
      return;
    }
    if (quantity > this.lot.remainingUnits) {
      await this.showToast('La cantidad supera las unidades disponibles.', 'warning');
      return;
    }

    this.adjusting = true;
    try {
      const actor = await this.operatorService.getName();
      await this.lotRepo.registerInventoryAdjustment(this.lot.id, {
        quantity,
        reason: this.adjustReason,
        notes: this.adjustNotes?.trim() || undefined,
        createdBy: actor,
      });

      this.adjustQuantity = null;
      this.adjustReason = 'VENCIMIENTO';
      this.adjustNotes = '';
      await this.loadLot();
      await this.showToast('Ajuste de inventario registrado.', 'success');
    } catch (err: unknown) {
      await this.showToast(
        err instanceof Error ? err.message : 'No se pudo registrar el ajuste.',
        'danger'
      );
    } finally {
      this.adjusting = false;
    }
  }

  private async loadLot(): Promise<void> {
    const id = +(this.route.snapshot.paramMap.get('id') ?? '0');
    this.lot = await this.lotRepo.findById(id);
    this.adjustments = await this.lotRepo.listInventoryAdjustments(id);
  }

  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
