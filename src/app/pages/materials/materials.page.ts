import { Component, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonSearchbar, IonList, IonItem, IonLabel, IonAvatar,
  IonButton, IonIcon, IonFab, IonFabButton,
  IonItemSliding, IonItemOptions, IonItemOption,
  IonBadge, IonRefresher, IonRefresherContent,
  IonChip, IonNote, IonSkeletonText,
  AlertController, ToastController,
  RefresherCustomEvent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline, cubeOutline, chevronBackOutline } from 'ionicons/icons';
import { MaterialService } from '@services/material.service';
import { PhotoService } from '@services/photo.service';
import { Material } from '@models/material.model';
import { GtqCurrencyPipe } from '@shared/pipes/gtq-currency.pipe';

const SWIPE_HINT_KEY = 'materials_swipe_hint_shown';

@Component({
  selector: 'app-materials',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule, GtqCurrencyPipe,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonSearchbar, IonList, IonItem, IonLabel, IonAvatar,
    IonButton, IonIcon, IonFab, IonFabButton,
    IonItemSliding, IonItemOptions, IonItemOption,
    IonBadge, IonRefresher, IonRefresherContent,
    IonChip, IonNote, IonSkeletonText,
  ],
  templateUrl: './materials.page.html',
  styleUrls: ['./materials.page.scss'],
})
export class MaterialsPage {
  @ViewChildren(IonItemSliding) slidingItems!: QueryList<IonItemSliding>;

  materials: Material[] = [];
  filtered: Material[] = [];
  searchTerm = '';
  loading = true;
  photoCache = new Map<number, string>();

  constructor(
    private materialService: MaterialService,
    private photoService: PhotoService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({ addOutline, createOutline, trashOutline, cubeOutline, chevronBackOutline });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.load(true);
  }

  private async showSwipeHintIfNeeded(): Promise<void> {
    if (localStorage.getItem(SWIPE_HINT_KEY) || this.filtered.length === 0) return;
    localStorage.setItem(SWIPE_HINT_KEY, '1');
    await new Promise(r => setTimeout(r, 400));
    const first = this.slidingItems.first;
    if (!first) return;
    await first.open('end');
    await new Promise(r => setTimeout(r, 1200));
    await first.close();
  }

  async handleRefresh(event: RefresherCustomEvent): Promise<void> {
    await this.load();
    event.detail.complete();
  }

  onSearch(event: CustomEvent): void {
    this.searchTerm = event.detail.value ?? '';
    this.applyFilter();
  }

  private applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filtered = term
      ? this.materials.filter(m => m.name.toLowerCase().includes(term))
      : [...this.materials];
  }

  private async load(showHint = false): Promise<void> {
    this.loading = true;
    try {
      this.materials = await this.materialService.getAll();
      this.applyFilter();
      await this.loadPhotos();
    } finally {
      this.loading = false;
      if (showHint) this.showSwipeHintIfNeeded();
    }
  }

  private async loadPhotos(): Promise<void> {
    for (const m of this.materials) {
      if (m.photoPath && !this.photoCache.has(m.id)) {
        const url = await this.photoService.getPhotoDataUrl(m.photoPath);
        if (url) this.photoCache.set(m.id, url);
      }
    }
  }

  getPhotoUrl(material: Material): string | null {
    return this.photoCache.get(material.id) ?? null;
  }

  async confirmDelete(material: Material): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar material',
      message: `¿Eliminar "${material.name}"? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.materialService.delete(material.id);
            await this.load();
            this.showToast(`"${material.name}" eliminado`, 'success');
          },
        },
      ],
    });
    await alert.present();
  }

  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
