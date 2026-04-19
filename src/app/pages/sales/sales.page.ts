import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonNote, IonBadge,
  IonFab, IonFabButton, IonIcon,
  IonRefresher, IonRefresherContent, IonChip,
  AlertController, ToastController,
  IonItemSliding, IonItemOptions, IonItemOption,
  RefresherCustomEvent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, cashOutline, trashOutline } from 'ionicons/icons';
import { SaleService } from '@services/sale.service';
import { SaleWithProduct } from '@models/sale.model';
import { GtqCurrencyPipe } from '@shared/pipes/gtq-currency.pipe';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    CommonModule, RouterLink, GtqCurrencyPipe,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonNote, IonBadge,
    IonFab, IonFabButton, IonIcon,
    IonRefresher, IonRefresherContent, IonChip,
    IonItemSliding, IonItemOptions, IonItemOption,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Ventas</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-refresher slot="fixed" (ionRefresh)="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- Resumen del día -->
      <div *ngIf="!loading && sales.length > 0" class="day-summary"
        style="display:flex;justify-content:space-around;padding:12px 16px;background:var(--ion-color-light);margin-bottom:4px">
        <div style="text-align:center">
          <div style="font-size:1.1rem;font-weight:700;color:var(--ion-color-success)">{{ todayRevenue | gtq }}</div>
          <div style="font-size:0.7rem;color:var(--ion-color-medium)">Hoy</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:1.1rem;font-weight:700">{{ sales.length }}</div>
          <div style="font-size:0.7rem;color:var(--ion-color-medium)">Ventas cargadas</div>
        </div>
      </div>

      <ion-list *ngIf="!loading && sales.length > 0" lines="full">
        <ion-item-sliding *ngFor="let s of sales">
          <ion-item>
            <ion-label>
              <h3>{{ s.productName }}</h3>
              <p>{{ s.quantity }} × {{ s.unitPrice | gtq }}
                <ng-container *ngIf="s.profit != null">
                  · <span [style.color]="s.profit >= 0 ? '#388e3c' : '#c62828'">
                    {{ s.profit | gtq }} ganancia
                  </span>
                </ng-container>
              </p>
              <p style="font-size:0.72rem;color:var(--ion-color-medium)">
                {{ s.soldAt | date:'dd/MM/yyyy HH:mm' }}
              </p>
            </ion-label>
            <ion-note slot="end" style="font-weight:700;font-size:1rem">
              {{ s.totalAmount | gtq }}
            </ion-note>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" (click)="confirmDelete(s)">
              <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <div *ngIf="!loading && sales.length === 0"
        style="display:flex;flex-direction:column;align-items:center;padding:48px 24px;text-align:center">
        <ion-icon name="cash-outline" style="font-size:64px;color:var(--ion-color-medium);margin-bottom:16px"></ion-icon>
        <h3>Sin ventas registradas</h3>
        <p style="color:var(--ion-color-medium)">Registra tu primera venta.</p>
      </div>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button routerLink="/sales/new" color="success">
          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
})
export class SalesPage implements OnInit {
  sales: SaleWithProduct[] = [];
  loading = true;

  get todayRevenue(): number {
    const today = new Date().toISOString().slice(0, 10);
    return this.sales
      .filter(s => s.soldAt.startsWith(today))
      .reduce((sum, s) => sum + s.totalAmount, 0);
  }

  constructor(
    private saleService: SaleService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) { addIcons({ addOutline, cashOutline, trashOutline }); }

  async ngOnInit(): Promise<void> { await this.load(); }

  async handleRefresh(e: RefresherCustomEvent): Promise<void> {
    await this.load(); e.detail.complete();
  }

  private async load(): Promise<void> {
    this.loading = true;
    try { this.sales = await this.saleService.getAll(100); }
    finally { this.loading = false; }
  }

  async confirmDelete(s: SaleWithProduct): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar venta',
      message: '¿Eliminar este registro de venta?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: async () => {
          await this.saleService.deleteSale(s.id);
          await this.load();
          const t = await this.toastCtrl.create({ message: 'Venta eliminada', duration: 2000, color: 'success', position: 'bottom' });
          t.present();
        }},
      ],
    });
    await alert.present();
  }
}
