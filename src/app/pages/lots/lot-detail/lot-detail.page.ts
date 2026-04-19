import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonItem, IonLabel, IonNote, IonCard,
  IonCardHeader, IonCardTitle, IonCardContent, IonBadge,
  IonButton, IonIcon, AlertController, ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { ProductionLotRepository } from '@repos/production-lot.repository';
import { ProductionLotWithProduct } from '@models/production-lot.model';
import { GtqCurrencyPipe } from '@shared/pipes/gtq-currency.pipe';

@Component({
  selector: 'app-lot-detail',
  standalone: true,
  imports: [
    CommonModule, GtqCurrencyPipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonItem, IonLabel, IonNote, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonBadge,
    IonButton, IonIcon,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start"><ion-back-button defaultHref="/tabs/lots"></ion-back-button></ion-buttons>
        <ion-title>Detalle de lote</ion-title>
        <ion-buttons slot="end">
          <ion-button color="danger" (click)="confirmDelete()">
            <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
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
    </ion-content>
  `,
})
export class LotDetailPage implements OnInit {
  lot: ProductionLotWithProduct | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lotRepo: ProductionLotRepository,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) { addIcons({ trashOutline }); }

  async ngOnInit(): Promise<void> {
    const id = +(this.route.snapshot.paramMap.get('id') ?? '0');
    this.lot = await this.lotRepo.findById(id);
  }

  async confirmDelete(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar lote',
      message: '¿Eliminar este lote? No se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: async () => {
          await this.lotRepo.delete(this.lot!.id);
          const t = await this.toastCtrl.create({ message: 'Lote eliminado', duration: 2000, color: 'success', position: 'bottom' });
          t.present();
          this.router.navigate(['/tabs/lots']);
        }},
      ],
    });
    await alert.present();
  }
}
