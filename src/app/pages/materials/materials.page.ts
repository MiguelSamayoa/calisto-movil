import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
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
import { Subject, takeUntil } from 'rxjs';

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
export class MaterialsPage implements OnInit, OnDestroy {
  @ViewChildren(IonItemSliding) slidingItems!: QueryList<IonItemSliding>;
  private readonly destroy$ = new Subject<void>();

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

  ngOnInit(): void {
    this.materialService.materialsChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        void this.load();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
      const previousById = new Map(this.materials.map(m => [m.id, m]));
      this.materials = await this.materialService.getAll();
      this.invalidatePhotoCache(previousById, this.materials);
      this.applyFilter();
      await this.loadPhotos();
    } finally {
      this.loading = false;
      if (showHint) this.showSwipeHintIfNeeded();
    }
  }

  private invalidatePhotoCache(previousById: Map<number, Material>, current: Material[]): void {
    const currentIds = new Set(current.map(m => m.id));

    for (const id of this.photoCache.keys()) {
      if (!currentIds.has(id)) {
        this.photoCache.delete(id);
      }
    }

    for (const material of current) {
      const previous = previousById.get(material.id);
      if (previous && previous.photoPath !== material.photoPath) {
        this.photoCache.delete(material.id);
      }
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
