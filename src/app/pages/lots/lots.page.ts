import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonNote,
  IonFab, IonFabButton, IonIcon,
  IonRefresher, IonRefresherContent,
  IonBadge, IonChip, IonSkeletonText,
  RefresherCustomEvent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, layersOutline } from 'ionicons/icons';
import { ProductionLotRepository } from '@repos/production-lot.repository';
import { ProductionLotWithProduct } from '@models/production-lot.model';
import { GtqCurrencyPipe } from '@shared/pipes/gtq-currency.pipe';

@Component({
  selector: 'app-lots',
  standalone: true,
  imports: [
    CommonModule, RouterLink, GtqCurrencyPipe,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonNote,
    IonFab, IonFabButton, IonIcon,
    IonRefresher, IonRefresherContent,
    IonBadge, IonChip, IonSkeletonText,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Lotes de producción</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-refresher slot="fixed" (ionRefresh)="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-list *ngIf="!loading && lots.length > 0" lines="full">
        <ion-item *ngFor="let lot of lots" [routerLink]="['/lots', lot.id]">
          <ion-label>
            <h3>{{ lot.productName }}</h3>
            <p>
              {{ lot.quantity }} uds · Costo/u: {{ lot.costPerUnit | gtq }} ·
              PVP: {{ lot.sellingPrice | gtq }}
            </p>
            <p style="font-size:0.75rem;color:var(--ion-color-medium)">
              {{ lot.producedAt | date:'dd/MM/yyyy' }}
            </p>
          </ion-label>
          <div slot="end" style="text-align:right">
            <ion-badge [color]="lot.remainingUnits > 0 ? 'success' : 'medium'">
              {{ lot.remainingUnits }} disp.
            </ion-badge>
            <br/>
            <ion-note style="font-size:0.7rem">{{ lot.profitMargin | number:'1.1-1' }}% margen</ion-note>
          </div>
        </ion-item>
      </ion-list>

      <div *ngIf="!loading && lots.length === 0"
        style="display:flex;flex-direction:column;align-items:center;padding:48px 24px;text-align:center">
        <ion-icon name="layers-outline" style="font-size:64px;color:var(--ion-color-medium);margin-bottom:16px"></ion-icon>
        <h3>Sin lotes registrados</h3>
        <p style="color:var(--ion-color-medium)">Crea tu primer lote de producción.</p>
      </div>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button routerLink="/lots/new" color="primary">
          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
})
export class LotsPage implements OnInit {
  lots: ProductionLotWithProduct[] = [];
  loading = true;

  constructor(private lotRepo: ProductionLotRepository) {
    addIcons({ addOutline, layersOutline });
  }

  async ngOnInit(): Promise<void> { await this.load(); }

  async handleRefresh(e: RefresherCustomEvent): Promise<void> {
    await this.load(); e.detail.complete();
  }

  private async load(): Promise<void> {
    this.loading = true;
    try { this.lots = await this.lotRepo.findAll(100); }
    finally { this.loading = false; }
  }
}
