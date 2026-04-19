import {
  ProductionLotRepository
} from "./chunk-QX25LUL7.js";
import {
  GtqCurrencyPipe
} from "./chunk-FA5W7VDN.js";
import {
  addIcons,
  addOutline,
  layersOutline
} from "./chunk-6DYLPT4U.js";
import "./chunk-SJAJ33WN.js";
import {
  CommonModule,
  DatePipe,
  DecimalPipe,
  IonBadge,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
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
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
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
  ɵɵpureFunction1,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate3
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

// src/app/pages/lots/lots.page.ts
var _c0 = (a0) => ["/lots", a0];
function LotsPage_ion_list_7_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-item", 9)(1, "ion-label")(2, "h3");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "gtq");
    \u0275\u0275pipe(7, "gtq");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 10);
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 11)(12, "ion-badge", 12);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275element(14, "br");
    \u0275\u0275elementStart(15, "ion-note", 13);
    \u0275\u0275text(16);
    \u0275\u0275pipe(17, "number");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const lot_r1 = ctx.$implicit;
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(19, _c0, lot_r1.id));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(lot_r1.productName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3(" ", lot_r1.quantity, " uds \xB7 Costo/u: ", \u0275\u0275pipeBind1(6, 9, lot_r1.costPerUnit), " \xB7 PVP: ", \u0275\u0275pipeBind1(7, 11, lot_r1.sellingPrice), " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(10, 13, lot_r1.producedAt, "dd/MM/yyyy"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275property("color", lot_r1.remainingUnits > 0 ? "success" : "medium");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", lot_r1.remainingUnits, " disp. ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(17, 16, lot_r1.profitMargin, "1.1-1"), "% margen");
  }
}
function LotsPage_ion_list_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list", 7);
    \u0275\u0275template(1, LotsPage_ion_list_7_ion_item_1_Template, 18, 21, "ion-item", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.lots);
  }
}
function LotsPage_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275element(1, "ion-icon", 15);
    \u0275\u0275elementStart(2, "h3");
    \u0275\u0275text(3, "Sin lotes registrados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 16);
    \u0275\u0275text(5, "Crea tu primer lote de producci\xF3n.");
    \u0275\u0275elementEnd()();
  }
}
var LotsPage = class _LotsPage {
  constructor(lotRepo) {
    this.lotRepo = lotRepo;
    this.lots = [];
    this.loading = true;
    addIcons({ addOutline, layersOutline });
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
        this.lots = yield this.lotRepo.findAll(100);
      } finally {
        this.loading = false;
      }
    });
  }
  static {
    this.\u0275fac = function LotsPage_Factory(t) {
      return new (t || _LotsPage)(\u0275\u0275directiveInject(ProductionLotRepository));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LotsPage, selectors: [["app-lots"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 12, vars: 2, consts: [["color", "primary"], ["slot", "fixed", 3, "ionRefresh"], ["lines", "full", 4, "ngIf"], ["style", "display:flex;flex-direction:column;align-items:center;padding:48px 24px;text-align:center", 4, "ngIf"], ["slot", "fixed", "vertical", "bottom", "horizontal", "end"], ["routerLink", "/lots/new", "color", "primary"], ["name", "add-outline"], ["lines", "full"], [3, "routerLink", 4, "ngFor", "ngForOf"], [3, "routerLink"], [2, "font-size", "0.75rem", "color", "var(--ion-color-medium)"], ["slot", "end", 2, "text-align", "right"], [3, "color"], [2, "font-size", "0.7rem"], [2, "display", "flex", "flex-direction", "column", "align-items", "center", "padding", "48px 24px", "text-align", "center"], ["name", "layers-outline", 2, "font-size", "64px", "color", "var(--ion-color-medium)", "margin-bottom", "16px"], [2, "color", "var(--ion-color-medium)"]], template: function LotsPage_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "ion-header")(1, "ion-toolbar", 0)(2, "ion-title");
        \u0275\u0275text(3, "Lotes de producci\xF3n");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(4, "ion-content")(5, "ion-refresher", 1);
        \u0275\u0275listener("ionRefresh", function LotsPage_Template_ion_refresher_ionRefresh_5_listener($event) {
          return ctx.handleRefresh($event);
        });
        \u0275\u0275element(6, "ion-refresher-content");
        \u0275\u0275elementEnd();
        \u0275\u0275template(7, LotsPage_ion_list_7_Template, 2, 1, "ion-list", 2)(8, LotsPage_div_8_Template, 6, 0, "div", 3);
        \u0275\u0275elementStart(9, "ion-fab", 4)(10, "ion-fab-button", 5);
        \u0275\u0275element(11, "ion-icon", 6);
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(7);
        \u0275\u0275property("ngIf", !ctx.loading && ctx.lots.length > 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading && ctx.lots.length === 0);
      }
    }, dependencies: [
      CommonModule,
      NgForOf,
      NgIf,
      DecimalPipe,
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
      IonBadge
    ], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LotsPage, { className: "LotsPage", filePath: "src\\app\\pages\\lots\\lots.page.ts", lineNumber: 77 });
})();
export {
  LotsPage
};
//# sourceMappingURL=chunk-IT6AGIME.js.map
