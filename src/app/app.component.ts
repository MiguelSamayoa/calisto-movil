import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform, ToastController } from '@ionic/angular/standalone';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
})
export class AppComponent implements OnInit {
  private backPressedOnce = false;

  constructor(
    private platform: Platform,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit(): void {
    this.platform.backButton.subscribeWithPriority(10, async () => {
      // Si hay historial del router, navega atrás normalmente
      if (window.history.length > 1) {
        window.history.back();
        return;
      }

      // En la raíz: doble-tap para salir
      if (this.backPressedOnce) {
        App.minimizeApp();
        return;
      }

      this.backPressedOnce = true;
      const toast = await this.toastCtrl.create({
        message: 'Presiona atrás de nuevo para salir',
        duration: 2000,
        position: 'bottom',
      });
      await toast.present();
      await toast.onDidDismiss();
      this.backPressedOnce = false;
    });
  }
}
