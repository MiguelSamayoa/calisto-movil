import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  gridOutline,
  cubeOutline,
  bagOutline,
  layersOutline,
  cashOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="dashboard" href="/tabs/dashboard">
          <ion-icon name="grid-outline"></ion-icon>
          <ion-label>Inicio</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="materials" href="/tabs/materials">
          <ion-icon name="cube-outline"></ion-icon>
          <ion-label>Insumos</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="products" href="/tabs/products">
          <ion-icon name="bag-outline"></ion-icon>
          <ion-label>Productos</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="lots" href="/tabs/lots">
          <ion-icon name="layers-outline"></ion-icon>
          <ion-label>Lotes</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="sales" href="/tabs/sales">
          <ion-icon name="cash-outline"></ion-icon>
          <ion-label>Ventas</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
})
export class TabsPage {
  constructor() {
    addIcons({ gridOutline, cubeOutline, bagOutline, layersOutline, cashOutline });
  }
}
