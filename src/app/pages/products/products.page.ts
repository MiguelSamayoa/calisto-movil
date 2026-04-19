import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonSearchbar, IonList, IonItem, IonLabel, IonAvatar,
  IonButton, IonIcon, IonFab, IonFabButton,
  IonItemSliding, IonItemOptions, IonItemOption,
  IonNote, IonRefresher, IonRefresherContent,
  IonChip, IonSkeletonText,
  AlertController, ToastController,
  RefresherCustomEvent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline, bagOutline, readerOutline } from 'ionicons/icons';
import { ProductService } from '@services/product.service';
import { PhotoService } from '@services/photo.service';
import { Product } from '@models/product.model';
import { GtqCurrencyPipe } from '@shared/pipes/gtq-currency.pipe';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule, GtqCurrencyPipe,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonSearchbar, IonList, IonItem, IonLabel, IonAvatar,
    IonButton, IonIcon, IonFab, IonFabButton,
    IonItemSliding, IonItemOptions, IonItemOption,
    IonNote, IonRefresher, IonRefresherContent,
    IonChip, IonSkeletonText,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Productos</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar placeholder="Buscar producto..." debounce="200"
          (ionInput)="onSearch($event)"></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" (ionRefresh)="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-list *ngIf="!loading && filtered.length > 0" lines="full">
        <ion-item-sliding *ngFor="let p of filtered">
          <ion-item>
            <ion-avatar slot="start">
              <img *ngIf="getPhotoUrl(p) as url; else icon" [src]="url" />
              <ng-template #icon>
                <div class="icon-av"><ion-icon name="bag-outline"></ion-icon></div>
              </ng-template>
            </ion-avatar>
            <ion-label>
              <h3>{{ p.name }}</h3>
              <p>
                <ion-chip color="secondary" style="font-size:10px;height:18px">
                  {{ p.category }}
                </ion-chip>
                Rinde {{ p.yieldUnits }} unidades
              </p>
            </ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="tertiary"
              [routerLink]="['/products', p.id, 'recipe']">
              <ion-icon slot="icon-only" name="reader-outline"></ion-icon>
            </ion-item-option>
            <ion-item-option color="primary"
              [routerLink]="['/products', p.id, 'edit']">
              <ion-icon slot="icon-only" name="create-outline"></ion-icon>
            </ion-item-option>
            <ion-item-option color="danger" (click)="confirmDelete(p)">
              <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <div *ngIf="!loading && filtered.length === 0" class="empty-state"
        style="display:flex;flex-direction:column;align-items:center;padding:48px 24px;text-align:center">
        <ion-icon name="bag-outline" style="font-size:64px;color:var(--ion-color-medium);margin-bottom:16px"></ion-icon>
        <h3>Sin productos</h3>
        <p style="color:var(--ion-color-medium)">Crea tu primer producto y defínele una receta.</p>
        <ion-button routerLink="/products/new">
          <ion-icon slot="start" name="add-outline"></ion-icon>
          Agregar producto
        </ion-button>
      </div>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button routerLink="/products/new" color="primary">
          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styles: [`.icon-av{width:100%;height:100%;background:var(--ion-color-light);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--ion-color-medium);font-size:22px}`],
})
export class ProductsPage {
  products: Product[] = [];
  filtered: Product[] = [];
  loading = true;
  photoCache = new Map<number, string>();

  constructor(
    private productService: ProductService,
    private photoService: PhotoService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {
    addIcons({ addOutline, createOutline, trashOutline, bagOutline, readerOutline });
  }

  async ionViewWillEnter(): Promise<void> { await this.load(); }

  async handleRefresh(e: RefresherCustomEvent): Promise<void> {
    await this.load(); e.detail.complete();
  }

  onSearch(ev: CustomEvent): void {
    const t = (ev.detail.value ?? '').toLowerCase();
    this.filtered = t ? this.products.filter(p => p.name.toLowerCase().includes(t)) : [...this.products];
  }

  private async load(): Promise<void> {
    this.loading = true;
    try {
      this.products = await this.productService.getAll();
      this.filtered = [...this.products];
      for (const p of this.products) {
        if (p.photoPath && !this.photoCache.has(p.id)) {
          const url = await this.photoService.getPhotoDataUrl(p.photoPath);
          if (url) this.photoCache.set(p.id, url);
        }
      }
    } finally { this.loading = false; }
  }

  getPhotoUrl(p: Product): string | null { return this.photoCache.get(p.id) ?? null; }

  async confirmDelete(p: Product): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar producto',
      message: `¿Eliminar "${p.name}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: async () => {
          await this.productService.delete(p.id);
          await this.load();
          const t = await this.toastCtrl.create({ message: 'Producto eliminado', duration: 2000, color: 'success', position: 'bottom' });
          t.present();
        }},
      ],
    });
    await alert.present();
  }
}
