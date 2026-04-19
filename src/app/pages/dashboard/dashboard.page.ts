import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonGrid, IonRow, IonCol, IonBadge, IonItem, IonLabel,
  IonIcon, IonButton, IonRefresher, IonRefresherContent,
  IonList, IonAvatar, IonNote, IonChip,
  RefresherCustomEvent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  trendingUpOutline, trendingDownOutline, cashOutline,
  alertCircleOutline, storefrontOutline, layersOutline,
} from 'ionicons/icons';
import { SaleService } from '@services/sale.service';
import { DashboardStats } from '@models/sale.model';
import { GtqCurrencyPipe } from '@shared/pipes/gtq-currency.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink, GtqCurrencyPipe,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonGrid, IonRow, IonCol, IonBadge, IonItem, IonLabel,
    IonIcon, IonButton, IonRefresher, IonRefresherContent,
    IonList, IonAvatar, IonNote, IonChip,
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;

  constructor(private saleService: SaleService) {
    addIcons({
      trendingUpOutline, trendingDownOutline, cashOutline,
      alertCircleOutline, storefrontOutline, layersOutline,
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadStats();
  }

  async handleRefresh(event: RefresherCustomEvent): Promise<void> {
    await this.loadStats();
    event.detail.complete();
  }

  private async loadStats(): Promise<void> {
    this.loading = true;
    try {
      this.stats = await this.saleService.getDashboardStats();
    } finally {
      this.loading = false;
    }
  }
}
