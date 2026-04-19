import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cameraOutline, trashOutline, imageOutline } from 'ionicons/icons';
import { PhotoService, PhotoEntityType } from '@services/photo.service';

@Component({
  selector: 'app-photo-picker',
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon, IonSpinner],
  template: `
    <div class="photo-picker">
      <!-- Preview -->
      <div class="photo-container" (click)="pickPhoto()">
        <img
          *ngIf="dataUrl; else placeholder"
          [src]="dataUrl"
          class="photo-preview"
          [alt]="'Foto de ' + entityType"
        />
        <ng-template #placeholder>
          <div class="photo-placeholder">
            <ion-icon name="image-outline" class="placeholder-icon"></ion-icon>
            <span>Sin foto</span>
          </div>
        </ng-template>

        <!-- Overlay loading -->
        <div *ngIf="loading" class="photo-overlay">
          <ion-spinner name="crescent" color="light"></ion-spinner>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="photo-actions">
        <ion-button
          fill="outline"
          size="small"
          (click)="pickPhoto()"
          [disabled]="loading"
        >
          <ion-icon slot="start" name="camera-outline"></ion-icon>
          {{ dataUrl ? 'Cambiar' : 'Agregar foto' }}
        </ion-button>

        <ion-button
          *ngIf="dataUrl"
          fill="clear"
          size="small"
          color="danger"
          (click)="removePhoto()"
          [disabled]="loading"
        >
          <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
        </ion-button>
      </div>
    </div>
  `,
  styles: [`
    .photo-picker {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .photo-container {
      position: relative;
      width: 120px;
      height: 120px;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      background: var(--ion-color-light);
      border: 2px dashed var(--ion-color-medium);
    }
    .photo-preview {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .photo-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--ion-color-medium);
      gap: 4px;
      font-size: 12px;
    }
    .placeholder-icon {
      font-size: 36px;
    }
    .photo-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.5);
    }
    .photo-actions {
      display: flex;
      gap: 4px;
      align-items: center;
    }
  `],
})
export class PhotoPickerComponent implements OnInit, OnChanges {
  @Input() photoPath: string | null = null;
  @Input() entityType: PhotoEntityType = 'product';
  @Input() entityId?: number;

  /** Emite la nueva ruta relativa cuando se selecciona/elimina foto */
  @Output() photoChanged = new EventEmitter<string | null>();

  dataUrl: string | null = null;
  loading = false;

  constructor(private photoService: PhotoService) {
    addIcons({ cameraOutline, trashOutline, imageOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.loadPreview();
  }

  async ngOnChanges(): Promise<void> {
    await this.loadPreview();
  }

  async pickPhoto(): Promise<void> {
    this.loading = true;
    try {
      const newPath = await this.photoService.replacePhoto(
        this.photoPath,
        this.entityType,
        this.entityId
      );
      if (newPath) {
        this.photoPath = newPath;
        await this.loadPreview();
        this.photoChanged.emit(newPath);
      }
    } finally {
      this.loading = false;
    }
  }

  async removePhoto(): Promise<void> {
    this.loading = true;
    try {
      await this.photoService.deletePhoto(this.photoPath);
      this.photoPath = null;
      this.dataUrl = null;
      this.photoChanged.emit(null);
    } finally {
      this.loading = false;
    }
  }

  private async loadPreview(): Promise<void> {
    this.dataUrl = await this.photoService.getPhotoDataUrl(this.photoPath);
  }
}
