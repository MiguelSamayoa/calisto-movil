import {
  SaleService
} from "./chunk-X3OWCJWS.js";
import "./chunk-QX25LUL7.js";
import {
  GtqCurrencyPipe
} from "./chunk-FA5W7VDN.js";
import {
  addIcons,
  alertCircleOutline,
  cashOutline,
  layersOutline,
  storefrontOutline,
  trendingDownOutline,
  trendingUpOutline
} from "./chunk-6DYLPT4U.js";
import "./chunk-SJAJ33WN.js";
import {
  CommonModule,
  DecimalPipe,
  IonButton,
  IonCard,
  IonCardContent,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonTitle,
  IonToolbar,
  NgForOf,
  NgIf,
  RouterLink,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
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

// src/app/pages/dashboard/dashboard.page.ts
function DashboardPage_ion_grid_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-grid")(1, "ion-row")(2, "ion-col", 7)(3, "ion-card", 12)(4, "ion-card-content")(5, "div", 13);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "gtq");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 14);
    \u0275\u0275text(9, "Ingresos");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(10, "ion-col", 7)(11, "ion-card", 15)(12, "ion-card-content")(13, "div", 13);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 14);
    \u0275\u0275text(16, "Ventas");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(17, "ion-col", 7)(18, "ion-card", 16)(19, "ion-card-content")(20, "div", 13);
    \u0275\u0275text(21);
    \u0275\u0275pipe(22, "gtq");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "div", 14);
    \u0275\u0275text(24, "Costo");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(25, "ion-col", 7)(26, "ion-card", 17)(27, "ion-card-content")(28, "div", 13);
    \u0275\u0275text(29);
    \u0275\u0275pipe(30, "gtq");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 14);
    \u0275\u0275text(32, "Ganancia");
    \u0275\u0275elementEnd()()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(7, 8, ctx_r0.stats.todayRevenue));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r0.stats.todaySales);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(22, 10, ctx_r0.stats.todayCost));
    \u0275\u0275advance(5);
    \u0275\u0275classProp("stat-card--green", ctx_r0.stats.todayProfit >= 0)("stat-card--red", ctx_r0.stats.todayProfit < 0);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(30, 12, ctx_r0.stats.todayProfit));
  }
}
function DashboardPage_ion_card_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-card", 18)(1, "ion-card-content")(2, "ion-grid")(3, "ion-row")(4, "ion-col")(5, "div", 19)(6, "div", 20);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "gtq");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 21);
    \u0275\u0275text(10, "Ingresos");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "ion-col")(12, "div", 19)(13, "div", 20);
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "gtq");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 21);
    \u0275\u0275text(17, "Costos");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "ion-col")(19, "div", 19)(20, "div", 20);
    \u0275\u0275text(21);
    \u0275\u0275pipe(22, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "div", 21);
    \u0275\u0275text(24, "Margen");
    \u0275\u0275elementEnd()()()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 7, ctx_r0.stats.monthRevenue));
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(15, 9, ctx_r0.stats.monthCost));
    \u0275\u0275advance(6);
    \u0275\u0275classProp("profit-positive", ctx_r0.stats.monthProfit >= 0)("profit-negative", ctx_r0.stats.monthProfit < 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(22, 11, ctx_r0.stats.monthProfitMargin, "1.1-1"), "% ");
  }
}
function DashboardPage_ion_card_16_ion_item_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-item")(1, "ion-chip", 24);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ion-label")(4, "h3");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "gtq");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const p_r2 = ctx.$implicit;
    const i_r3 = ctx.index;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(i_r3 + 1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(p_r2.productName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", p_r2.totalSold, " unidades \xB7 ", \u0275\u0275pipeBind1(8, 4, p_r2.totalRevenue), "");
  }
}
function DashboardPage_ion_card_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-card")(1, "ion-list", 22);
    \u0275\u0275template(2, DashboardPage_ion_card_16_ion_item_2_Template, 9, 6, "ion-item", 23);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r0.stats.topProducts);
  }
}
function DashboardPage_ion_card_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-card")(1, "ion-card-content", 25);
    \u0275\u0275element(2, "ion-icon", 1);
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "Sin ventas en los \xFAltimos 30 d\xEDas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "ion-button", 26);
    \u0275\u0275text(6, " Registrar primera venta ");
    \u0275\u0275elementEnd()()();
  }
}
function DashboardPage_div_18_ion_item_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-item", 31);
    \u0275\u0275element(1, "ion-icon", 32);
    \u0275\u0275elementStart(2, "ion-label")(3, "h3");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "ion-button", 33);
    \u0275\u0275text(8, " Ver ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const m_r4 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(m_r4.materialName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("Disponible: ", m_r4.currentStock, " ", m_r4.unit, "");
  }
}
function DashboardPage_div_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "h2", 4);
    \u0275\u0275element(2, "ion-icon", 27);
    \u0275\u0275text(3, " Stock bajo ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "ion-card", 28)(5, "ion-list", 29);
    \u0275\u0275template(6, DashboardPage_div_18_ion_item_6_Template, 9, 3, "ion-item", 30);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275property("ngForOf", ctx_r0.stats.lowStockMaterials);
  }
}
var DashboardPage = class _DashboardPage {
  constructor(saleService) {
    this.saleService = saleService;
    this.stats = null;
    this.loading = true;
    addIcons({
      trendingUpOutline,
      trendingDownOutline,
      cashOutline,
      alertCircleOutline,
      storefrontOutline,
      layersOutline
    });
  }
  ngOnInit() {
    return __async(this, null, function* () {
      yield this.loadStats();
    });
  }
  handleRefresh(event) {
    return __async(this, null, function* () {
      yield this.loadStats();
      event.detail.complete();
    });
  }
  loadStats() {
    return __async(this, null, function* () {
      this.loading = true;
      try {
        this.stats = yield this.saleService.getDashboardStats();
      } finally {
        this.loading = false;
      }
    });
  }
  static {
    this.\u0275fac = function DashboardPage_Factory(t) {
      return new (t || _DashboardPage)(\u0275\u0275directiveInject(SaleService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DashboardPage, selectors: [["app-dashboard"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 31, vars: 5, consts: [["color", "primary"], ["name", "storefront-outline"], [1, "ion-padding"], ["slot", "fixed", 3, "ionRefresh"], [1, "section-title"], [4, "ngIf"], ["class", "month-card", 4, "ngIf"], ["size", "6"], ["expand", "block", "fill", "outline", "routerLink", "/sales/new"], ["slot", "start", "name", "cash-outline"], ["expand", "block", "fill", "outline", "routerLink", "/lots/new"], ["slot", "start", "name", "layers-outline"], [1, "stat-card", "stat-card--green"], [1, "stat-value"], [1, "stat-label"], [1, "stat-card", "stat-card--blue"], [1, "stat-card", "stat-card--orange"], [1, "stat-card"], [1, "month-card"], [1, "month-stat"], [1, "month-value"], [1, "month-label"], ["lines", "none"], [4, "ngFor", "ngForOf"], ["slot", "start", "color", "primary"], [1, "empty-state"], ["fill", "outline", "routerLink", "/sales/new"], ["name", "alert-circle-outline", "color", "warning"], ["color", "warning", 1, "alert-card"], ["lines", "full"], ["color", "warning", 4, "ngFor", "ngForOf"], ["color", "warning"], ["name", "alert-circle-outline", "slot", "start"], ["slot", "end", "fill", "clear", "routerLink", "/tabs/materials"]], template: function DashboardPage_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "ion-header")(1, "ion-toolbar", 0)(2, "ion-title");
        \u0275\u0275element(3, "ion-icon", 1);
        \u0275\u0275text(4, " Calisto ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(5, "ion-content", 2)(6, "ion-refresher", 3);
        \u0275\u0275listener("ionRefresh", function DashboardPage_Template_ion_refresher_ionRefresh_6_listener($event) {
          return ctx.handleRefresh($event);
        });
        \u0275\u0275element(7, "ion-refresher-content");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "h2", 4);
        \u0275\u0275text(9, "Hoy");
        \u0275\u0275elementEnd();
        \u0275\u0275template(10, DashboardPage_ion_grid_10_Template, 33, 14, "ion-grid", 5);
        \u0275\u0275elementStart(11, "h2", 4);
        \u0275\u0275text(12, "Este mes");
        \u0275\u0275elementEnd();
        \u0275\u0275template(13, DashboardPage_ion_card_13_Template, 25, 14, "ion-card", 6);
        \u0275\u0275elementStart(14, "h2", 4);
        \u0275\u0275text(15, "Top productos (30 d\xEDas)");
        \u0275\u0275elementEnd();
        \u0275\u0275template(16, DashboardPage_ion_card_16_Template, 3, 1, "ion-card", 5)(17, DashboardPage_ion_card_17_Template, 7, 0, "ion-card", 5)(18, DashboardPage_div_18_Template, 7, 1, "div", 5);
        \u0275\u0275elementStart(19, "h2", 4);
        \u0275\u0275text(20, "Acceso r\xE1pido");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(21, "ion-grid")(22, "ion-row")(23, "ion-col", 7)(24, "ion-button", 8);
        \u0275\u0275element(25, "ion-icon", 9);
        \u0275\u0275text(26, " Nueva venta ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(27, "ion-col", 7)(28, "ion-button", 10);
        \u0275\u0275element(29, "ion-icon", 11);
        \u0275\u0275text(30, " Nuevo lote ");
        \u0275\u0275elementEnd()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(10);
        \u0275\u0275property("ngIf", ctx.stats);
        \u0275\u0275advance(3);
        \u0275\u0275property("ngIf", ctx.stats);
        \u0275\u0275advance(3);
        \u0275\u0275property("ngIf", ctx.stats && ctx.stats.topProducts.length > 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.stats && ctx.stats.topProducts.length === 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.stats && ctx.stats.lowStockMaterials.length > 0);
      }
    }, dependencies: [
      CommonModule,
      NgForOf,
      NgIf,
      DecimalPipe,
      RouterLink,
      GtqCurrencyPipe,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonContent,
      IonCard,
      IonCardContent,
      IonGrid,
      IonRow,
      IonCol,
      IonItem,
      IonLabel,
      IonIcon,
      IonButton,
      IonRefresher,
      IonRefresherContent,
      IonList,
      IonChip
    ], styles: ["\n\n.section-title[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 700;\n  color: var(--ion-color-dark);\n  margin: 16px 0 4px;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n.stat-card[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  margin: 4px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n}\n.stat-card[_ngcontent-%COMP%]   ion-card-content[_ngcontent-%COMP%] {\n  padding: 12px;\n  text-align: center;\n}\n.stat-card--green[_ngcontent-%COMP%] {\n  background: #e8f5e9;\n}\n.stat-card--blue[_ngcontent-%COMP%] {\n  background: #e3f2fd;\n}\n.stat-card--orange[_ngcontent-%COMP%] {\n  background: #fff3e0;\n}\n.stat-card--red[_ngcontent-%COMP%] {\n  background: #ffebee;\n}\n.stat-value[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 700;\n  color: var(--ion-color-dark);\n}\n.stat-label[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: var(--ion-color-medium);\n  margin-top: 2px;\n}\n.month-card[_ngcontent-%COMP%] {\n  border-radius: 16px;\n  margin: 4px 0;\n}\n.month-stat[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.month-value[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 700;\n}\n.month-label[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  color: var(--ion-color-medium);\n}\n.profit-positive[_ngcontent-%COMP%] {\n  color: #388e3c;\n}\n.profit-negative[_ngcontent-%COMP%] {\n  color: #d32f2f;\n}\n.empty-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 24px;\n}\n.empty-state[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%] {\n  font-size: 48px;\n  color: var(--ion-color-medium);\n  display: block;\n  margin: 0 auto 12px;\n}\n.alert-card[_ngcontent-%COMP%] {\n  border-radius: 12px;\n}\n/*# sourceMappingURL=dashboard.page.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DashboardPage, { className: "DashboardPage", filePath: "src\\app\\pages\\dashboard\\dashboard.page.ts", lineNumber: 35 });
})();
export {
  DashboardPage
};
//# sourceMappingURL=chunk-422F2USG.js.map
