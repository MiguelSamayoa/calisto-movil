import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonButton, IonItem, IonLabel, IonInput,
  IonTextarea, IonIcon, IonCard, IonCardContent, IonNote,
  ToastController, LoadingController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';
import { ProductService } from '@services/product.service';
import { PhotoPickerComponent } from '@shared/components/photo-picker/photo-picker.component';
import { CreateProductDto } from '@models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonButton, IonItem, IonLabel, IonInput,
    IonTextarea, IonIcon, IonCard, IonCardContent, IonNote,
    PhotoPickerComponent,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start"><ion-back-button defaultHref="/tabs/products"></ion-back-button></ion-buttons>
        <ion-title>{{ isEdit ? 'Editar producto' : 'Nuevo producto' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="save()" [disabled]="saving" strong>
            <ion-icon slot="start" name="save-outline"></ion-icon>Guardar
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-card style="border-radius:16px;margin-bottom:12px">
        <ion-card-content style="display:flex;justify-content:center;padding:16px">
          <app-photo-picker [photoPath]="photoPath" entityType="product"
            [entityId]="productId" (photoChanged)="photoPath=$event"></app-photo-picker>
        </ion-card-content>
      </ion-card>
      <ion-card style="border-radius:16px;margin-bottom:12px">
        <ion-card-content>
          <ion-item lines="full">
            <ion-label position="stacked">Nombre *</ion-label>
            <ion-input [(ngModel)]="name" placeholder="Ej. Brownies de chocolate"
              [autofocus]="!isEdit" autocapitalize="words" clearInput></ion-input>
          </ion-item>
          <ion-item lines="full">
            <ion-label position="stacked">Categoría</ion-label>
            <ion-input [(ngModel)]="category" placeholder="Ej. Chocolates, Galletas, Tortas"></ion-input>
          </ion-item>
          <ion-item lines="full">
            <ion-label position="stacked">Descripción</ion-label>
            <ion-textarea [(ngModel)]="description" placeholder="Opcional" rows="2" autoGrow></ion-textarea>
          </ion-item>
          <ion-item lines="none">
            <ion-label position="stacked">Rendimiento (unidades por receta) *</ion-label>
            <ion-input [(ngModel)]="yieldUnits" type="number" inputmode="numeric"
              placeholder="12" min="1" step="1"></ion-input>
            <ion-note slot="helper">Cuántas unidades produce una receta base</ion-note>
          </ion-item>
        </ion-card-content>
      </ion-card>
      <ion-button expand="block" (click)="save()" [disabled]="saving"
        style="margin:16px 0 32px;height:52px;font-size:1rem">
        <ion-icon slot="start" name="save-outline"></ion-icon>
        {{ isEdit ? 'Actualizar producto' : 'Guardar producto' }}
      </ion-button>
    </ion-content>
  `,
})
export class ProductFormPage implements OnInit {
  isEdit = false;
  productId?: number;
  saving = false;
  name = '';
  description = '';
  category = 'General';
  yieldUnits: number | null = null;
  photoPath: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
  ) { addIcons({ saveOutline }); }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.productId = +id;
      const p = await this.productService.getById(this.productId);
      if (p) {
        this.name = p.name;
        this.description = p.description ?? '';
        this.category = p.category;
        this.yieldUnits = p.yieldUnits;
        this.photoPath = p.photoPath;
      }
    }
  }

  async save(): Promise<void> {
    if (!this.name.trim()) return this.toast('El nombre es requerido', 'warning');
    if (!this.yieldUnits || this.yieldUnits < 1) return this.toast('El rendimiento debe ser ≥ 1', 'warning');
    const loading = await this.loadingCtrl.create({ message: 'Guardando...' });
    await loading.present();
    this.saving = true;
    try {
      const dto: CreateProductDto = {
        name: this.name.trim(), description: this.description || undefined,
        category: this.category, yieldUnits: this.yieldUnits,
        photoPath: this.photoPath ?? undefined,
      };
      if (this.isEdit && this.productId) {
        await this.productService.update(this.productId, dto);
        this.toast('Producto actualizado', 'success');
      } else {
        const created = await this.productService.create(dto);
        this.toast('Producto creado — ahora define su receta', 'success');
        this.router.navigate(['/products', created.id, 'recipe']);
        return;
      }
      this.router.navigate(['/tabs/products']);
    } catch (e: unknown) {
      this.toast(e instanceof Error ? e.message : 'Error al guardar', 'danger');
    } finally { this.saving = false; await loading.dismiss(); }
  }

  private async toast(msg: string, color: string): Promise<void> {
    const t = await this.toastCtrl.create({ message: msg, duration: 2500, color, position: 'bottom' });
    t.present();
  }
}
