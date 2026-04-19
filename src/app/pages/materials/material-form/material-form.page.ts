import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonButton, IonItem, IonLabel, IonInput,
  IonSelect, IonSelectOption, IonTextarea, IonIcon,
  IonCard, IonCardContent, IonNote, IonSpinner,
  ToastController, LoadingController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline, cameraOutline } from 'ionicons/icons';
import { MaterialService } from '@services/material.service';
import { PhotoService } from '@services/photo.service';
import { PhotoPickerComponent } from '@shared/components/photo-picker/photo-picker.component';
import { CreateMaterialDto, Material, MaterialUnit } from '@models/material.model';

const UNITS: { value: MaterialUnit; label: string }[] = [
  { value: 'kg',     label: 'Kilogramo (kg)' },
  { value: 'g',      label: 'Gramo (g)' },
  { value: 'L',      label: 'Litro (L)' },
  { value: 'mL',     label: 'Mililitro (mL)' },
  { value: 'lb',     label: 'Libra (lb)' },
  { value: 'oz',     label: 'Onza (oz)' },
  { value: 'unidad', label: 'Unidad' },
  { value: 'docena', label: 'Docena' },
  { value: 'caja',   label: 'Caja' },
];

@Component({
  selector: 'app-material-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonButton, IonItem, IonLabel, IonInput,
    IonSelect, IonSelectOption, IonTextarea, IonIcon,
    IonCard, IonCardContent, IonNote, IonSpinner,
    PhotoPickerComponent,
  ],
  templateUrl: './material-form.page.html',
  styleUrls: ['./material-form.page.scss'],
})
export class MaterialFormPage implements OnInit {
  isEdit = false;
  materialId?: number;
  loading = false;

  // ─── Modelo del formulario ─────────────────────────────────────────────────
  name = '';
  description = '';
  unit: MaterialUnit = 'kg';
  unitCost: number | null = null;
  stock: number | null = null;
  photoPath: string | null = null;

  units = UNITS;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private materialService: MaterialService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ saveOutline, cameraOutline });
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.materialId = +id;
      await this.loadMaterial(this.materialId);
    }
  }

  private async loadMaterial(id: number): Promise<void> {
    const m = await this.materialService.getById(id);
    if (!m) {
      await this.showToast('Material no encontrado', 'danger');
      this.router.navigate(['/tabs/materials']);
      return;
    }
    this.name = m.name;
    this.description = m.description ?? '';
    this.unit = m.unit;
    this.unitCost = m.unitCost;
    this.stock = m.stock;
    this.photoPath = m.photoPath;
  }

  onPhotoChanged(path: string | null): void {
    this.photoPath = path;
  }

  async save(): Promise<void> {
    if (!this.name.trim()) {
      return this.showToast('El nombre es requerido', 'warning');
    }
    if (this.unitCost === null || this.unitCost < 0) {
      return this.showToast('Ingresa un costo válido', 'warning');
    }

    const loading = await this.loadingCtrl.create({ message: 'Guardando...' });
    await loading.present();
    this.loading = true;

    try {
      const dto: CreateMaterialDto = {
        name: this.name.trim(),
        description: this.description || undefined,
        unit: this.unit,
        unitCost: this.unitCost,
        stock: this.stock ?? 0,
        photoPath: this.photoPath ?? undefined,
      };

      if (this.isEdit && this.materialId) {
        await this.materialService.update(this.materialId, dto);
        this.showToast('Insumo actualizado', 'success');
      } else {
        await this.materialService.create(dto);
        this.showToast('Insumo creado', 'success');
      }

      this.router.navigate(['/tabs/materials']);
    } catch (err: unknown) {
      this.showToast(
        err instanceof Error ? err.message : 'Error al guardar',
        'danger'
      );
    } finally {
      this.loading = false;
      await loading.dismiss();
    }
  }

  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message, duration: 2500, color, position: 'bottom',
    });
    await toast.present();
  }
}
