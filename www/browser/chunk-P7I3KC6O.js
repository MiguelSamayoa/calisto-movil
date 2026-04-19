import {
  SaleService
} from "./chunk-X3OWCJWS.js";
import "./chunk-QX25LUL7.js";
import {
  GtqCurrencyPipe
} from "./chunk-FA5W7VDN.js";
import {
  addIcons,
  addOutline,
  cashOutline,
  trashOutline
} from "./chunk-6DYLPT4U.js";
import "./chunk-SJAJ33WN.js";
import {
  AlertController,
  CommonModule,
  DatePipe,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonNote,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  NgForOf,
  NgIf,
  RouterLink,
  ToastController,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-6GE63MYY.js";
import "./chunk-XYEOB6SJ.js";
import "./chunk-GSIZKSUC.js";
import "./chunk-JLWWUAJ6.js";
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

// src/app/pages/sales/sales.page.ts
function SalesPage_div_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 9)(2, "div", 10);
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "gtq");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 11);
    \u0275\u0275text(6, "Hoy");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 9)(8, "div", 12);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 11);
    \u0275\u0275text(11, "Ventas cargadas");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 2, ctx_r0.todayRevenue));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.sales.length);
  }
}
function SalesPage_ion_list_8_ion_item_sliding_1_ng_container_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1, " \xB7 ");
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "gtq");
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const s_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("color", s_r3.profit >= 0 ? "#388e3c" : "#c62828");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(4, 3, s_r3.profit), " ganancia ");
  }
}
function SalesPage_ion_list_8_ion_item_sliding_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item-sliding")(1, "ion-item")(2, "ion-label")(3, "h3");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "gtq");
    \u0275\u0275template(8, SalesPage_ion_list_8_ion_item_sliding_1_ng_container_8_Template, 5, 5, "ng-container", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 16);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "ion-note", 17);
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "gtq");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "ion-item-options", 18)(16, "ion-item-option", 19);
    \u0275\u0275listener("click", function SalesPage_ion_list_8_ion_item_sliding_1_Template_ion_item_option_click_16_listener() {
      const s_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.confirmDelete(s_r3));
    });
    \u0275\u0275element(17, "ion-icon", 20);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const s_r3 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(s_r3.productName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", s_r3.quantity, " \xD7 ", \u0275\u0275pipeBind1(7, 6, s_r3.unitPrice), " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", s_r3.profit != null);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(11, 8, s_r3.soldAt, "dd/MM/yyyy HH:mm"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(14, 11, s_r3.totalAmount), " ");
  }
}
function SalesPage_ion_list_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list", 13);
    \u0275\u0275template(1, SalesPage_ion_list_8_ion_item_sliding_1_Template, 18, 13, "ion-item-sliding", 14);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.sales);
  }
}
function SalesPage_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275element(1, "ion-icon", 22);
    \u0275\u0275elementStart(2, "h3");
    \u0275\u0275text(3, "Sin ventas registradas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 23);
    \u0275\u0275text(5, "Registra tu primera venta.");
    \u0275\u0275elementEnd()();
  }
}
var SalesPage = class _SalesPage {
  get todayRevenue() {
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    return this.sales.filter((s) => s.soldAt.startsWith(today)).reduce((sum, s) => sum + s.totalAmount, 0);
  }
  constructor(saleService, alertCtrl, toastCtrl) {
    this.saleService = saleService;
    this.alertCtrl = alertCtrl;
    this.toastCtrl = toastCtrl;
    this.sales = [];
    this.loading = true;
    addIcons({ addOutline, cashOutline, trashOutline });
  }
  ngOnInit() {
    return __async(this, null, function* () {
      yield this.load();
    });
  }
  handleRefresh(e) {
    return __async(this, null, function* () {
      yield this.load();
      e.detail.complete();
    });
  }
  load() {
    return __async(this, null, function* () {
      this.loading = true;
      try {
        this.sales = yield this.saleService.getAll(100);
      } finally {
        this.loading = false;
      }
    });
  }
  confirmDelete(s) {
    return __async(this, null, function* () {
      const alert = yield this.alertCtrl.create({
        header: "Eliminar venta",
        message: "\xBFEliminar este registro de venta?",
        buttons: [
          { text: "Cancelar", role: "cancel" },
          { text: "Eliminar", role: "destructive", handler: () => __async(this, null, function* () {
            yield this.saleService.deleteSale(s.id);
            yield this.load();
            const t = yield this.toastCtrl.create({ message: "Venta eliminada", duration: 2e3, color: "success", position: "bottom" });
            t.present();
          }) }
        ]
      });
      yield alert.present();
    });
  }
  static {
    this.\u0275fac = function SalesPage_Factory(t) {
      return new (t || _SalesPage)(\u0275\u0275directiveInject(SaleService), \u0275\u0275directiveInject(AlertController), \u0275\u0275directiveInject(ToastController));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SalesPage, selectors: [["app-sales"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 13, vars: 3, consts: [["color", "primary"], ["slot", "fixed", 3, "ionRefresh"], ["class", "day-summary", "style", "display:flex;justify-content:space-around;padding:12px 16px;background:var(--ion-color-light);margin-bottom:4px", 4, "ngIf"], ["lines", "full", 4, "ngIf"], ["style", "display:flex;flex-direction:column;align-items:center;padding:48px 24px;text-align:center", 4, "ngIf"], ["slot", "fixed", "vertical", "bottom", "horizontal", "end"], ["routerLink", "/sales/new", "color", "success"], ["name", "add-outline"], [1, "day-summary", 2, "display", "flex", "justify-content", "space-around", "padding", "12px 16px", "background", "var(--ion-color-light)", "margin-bottom", "4px"], [2, "text-align", "center"], [2, "font-size", "1.1rem", "font-weight", "700", "color", "var(--ion-color-success)"], [2, "font-size", "0.7rem", "color", "var(--ion-color-medium)"], [2, "font-size", "1.1rem", "font-weight", "700"], ["lines", "full"], [4, "ngFor", "ngForOf"], [4, "ngIf"], [2, "font-size", "0.72rem", "color", "var(--ion-color-medium)"], ["slot", "end", 2, "font-weight", "700", "font-size", "1rem"], ["side", "end"], ["color", "danger", 3, "click"], ["slot", "icon-only", "name", "trash-outline"], [2, "display", "flex", "flex-direction", "column", "align-items", "center", "padding", "48px 24px", "text-align", "center"], ["name", "cash-outline", 2, "font-size", "64px", "color", "var(--ion-color-medium)", "margin-bottom", "16px"], [2, "color", "var(--ion-color-medium)"]], template: function SalesPage_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "ion-header")(1, "ion-toolbar", 0)(2, "ion-title");
        \u0275\u0275text(3, "Ventas");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(4, "ion-content")(5, "ion-refresher", 1);
        \u0275\u0275listener("ionRefresh", function SalesPage_Template_ion_refresher_ionRefresh_5_listener($event) {
          return ctx.handleRefresh($event);
        });
        \u0275\u0275element(6, "ion-refresher-content");
        \u0275\u0275elementEnd();
        \u0275\u0275template(7, SalesPage_div_7_Template, 12, 4, "div", 2)(8, SalesPage_ion_list_8_Template, 2, 1, "ion-list", 3)(9, SalesPage_div_9_Template, 6, 0, "div", 4);
        \u0275\u0275elementStart(10, "ion-fab", 5)(11, "ion-fab-button", 6);
        \u0275\u0275element(12, "ion-icon", 7);
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(7);
        \u0275\u0275property("ngIf", !ctx.loading && ctx.sales.length > 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading && ctx.sales.length > 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading && ctx.sales.length === 0);
      }
    }, dependencies: [
      CommonModule,
      NgForOf,
      NgIf,
      DatePipe,
      RouterLink,
      GtqCurrencyPipe,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonContent,
      IonList,
      IonItem,
      IonLabel,
      IonNote,
      IonFab,
      IonFabButton,
      IonIcon,
      IonRefresher,
      IonRefresherContent,
      IonItemSliding,
      IonItemOptions,
      IonItemOption
    ], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SalesPage, { className: "SalesPage", filePath: "src\\app\\pages\\sales\\sales.page.ts", lineNumber: 97 });
})();
export {
  SalesPage
};
//# sourceMappingURL=chunk-P7I3KC6O.js.map
