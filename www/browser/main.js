import {
  DatabaseService
} from "./chunk-SJAJ33WN.js";
import {
  APP_INITIALIZER,
  IonApp,
  IonRouterOutlet,
  Platform,
  PreloadAllModules,
  ToastController,
  bootstrapApplication,
  provideIonicAngular,
  provideRouter,
  withPreloading,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart
} from "./chunk-6GE63MYY.js";
import "./chunk-XYEOB6SJ.js";
import "./chunk-GSIZKSUC.js";
import {
  registerPlugin
} from "./chunk-JLWWUAJ6.js";
import "./chunk-V5M5BKA2.js";
import "./chunk-DNEU4ANQ.js";
import "./chunk-DCMRRLJ2.js";
import "./chunk-5LKIWGND.js";
import "./chunk-6GY55RSK.js";
import "./chunk-NRJTWVP7.js";
import "./chunk-55ROKFMO.js";
import "./chunk-SY2CBALT.js";
import "./chunk-XZMMD2BH.js";
import "./chunk-HA22PO5Z.js";
import "./chunk-YAS4LRVC.js";
import {
  __async
} from "./chunk-J4B6MK7R.js";

// node_modules/@capacitor/app/dist/esm/index.js
var App = registerPlugin("App", {
  web: () => import("./chunk-ETEH4APO.js").then((m) => new m.AppWeb())
});

// src/app/app.component.ts
var AppComponent = class _AppComponent {
  constructor(platform, toastCtrl) {
    this.platform = platform;
    this.toastCtrl = toastCtrl;
    this.backPressedOnce = false;
  }
  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(10, () => __async(this, null, function* () {
      if (window.history.length > 1) {
        window.history.back();
        return;
      }
      if (this.backPressedOnce) {
        App.minimizeApp();
        return;
      }
      this.backPressedOnce = true;
      const toast = yield this.toastCtrl.create({
        message: "Presiona atr\xE1s de nuevo para salir",
        duration: 2e3,
        position: "bottom"
      });
      yield toast.present();
      yield toast.onDidDismiss();
      this.backPressedOnce = false;
    }));
  }
  static {
    this.\u0275fac = function AppComponent_Factory(t) {
      return new (t || _AppComponent)(\u0275\u0275directiveInject(Platform), \u0275\u0275directiveInject(ToastController));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 2, vars: 0, template: function AppComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "ion-app");
        \u0275\u0275element(1, "ion-router-outlet");
        \u0275\u0275elementEnd();
      }
    }, dependencies: [IonApp, IonRouterOutlet], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src\\app\\app.component.ts", lineNumber: 15 });
})();

// src/app/app.routes.ts
var routes = [
  {
    path: "",
    redirectTo: "tabs/dashboard",
    pathMatch: "full"
  },
  {
    path: "tabs",
    loadComponent: () => import("./chunk-3TECEJKE.js").then((m) => m.TabsPage),
    children: [
      {
        path: "dashboard",
        loadComponent: () => import("./chunk-422F2USG.js").then((m) => m.DashboardPage)
      },
      {
        path: "materials",
        loadComponent: () => import("./chunk-IABAE2OC.js").then((m) => m.MaterialsPage)
      },
      {
        path: "products",
        loadComponent: () => import("./chunk-CPVBWNHK.js").then((m) => m.ProductsPage)
      },
      {
        path: "lots",
        loadComponent: () => import("./chunk-IT6AGIME.js").then((m) => m.LotsPage)
      },
      {
        path: "sales",
        loadComponent: () => import("./chunk-P7I3KC6O.js").then((m) => m.SalesPage)
      }
    ]
  },
  // Rutas de detalle / formularios
  {
    path: "materials/new",
    loadComponent: () => import("./chunk-MQIXAT5E.js").then((m) => m.MaterialFormPage)
  },
  {
    path: "materials/:id/edit",
    loadComponent: () => import("./chunk-MQIXAT5E.js").then((m) => m.MaterialFormPage)
  },
  {
    path: "products/new",
    loadComponent: () => import("./chunk-LKUMV57F.js").then((m) => m.ProductFormPage)
  },
  {
    path: "products/:id/edit",
    loadComponent: () => import("./chunk-LKUMV57F.js").then((m) => m.ProductFormPage)
  },
  {
    path: "products/:id/recipe",
    loadComponent: () => import("./chunk-D47SNE7Y.js").then((m) => m.RecipeEditorPage)
  },
  {
    path: "lots/new",
    loadComponent: () => import("./chunk-SEF3KXPI.js").then((m) => m.LotFormPage)
  },
  {
    path: "lots/:id",
    loadComponent: () => import("./chunk-R62CNDMY.js").then((m) => m.LotDetailPage)
  },
  {
    path: "sales/new",
    loadComponent: () => import("./chunk-BZ37IU5D.js").then((m) => m.SaleFormPage)
  }
];

// src/app/app.config.ts
function initializeDatabase(db) {
  return () => db.initialize();
}
var appConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideIonicAngular({
      mode: "md",
      // Material Design — más consistente en Android
      animated: true
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeDatabase,
      deps: [DatabaseService],
      multi: true
    }
  ]
};

// src/main.ts
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
//# sourceMappingURL=main.js.map
