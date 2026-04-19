import {
  ProductionLotRepository
} from "./chunk-QX25LUL7.js";
import {
  GtqCurrencyPipe
} from "./chunk-FA5W7VDN.js";
import {
  addIcons,
  trashOutline
} from "./chunk-6DYLPT4U.js";
import "./chunk-SJAJ33WN.js";
import {
  ActivatedRoute,
  AlertController,
  CommonModule,
  DatePipe,
  DecimalPipe,
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonTitle,
  IonToolbar,
  NgIf,
  Router,
  ToastController,
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
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
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

// src/app/pages/lots/lot-detail/lot-detail.page.ts
function LotDetailPage_ion_content_9_ion_item_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-item", 12)(1, "ion-label")(2, "h3");
    \u0275\u0275text(3, "Notas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.lot.notes);
  }
}
function LotDetailPage_ion_content_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-content", 7)(1, "ion-card", 8)(2, "ion-card-header")(3, "ion-card-title");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "ion-card-content")(6, "ion-item", 9)(7, "ion-label");
    \u0275\u0275text(8, "Unidades producidas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "ion-note", 3)(10, "strong");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "ion-item", 9)(13, "ion-label");
    \u0275\u0275text(14, "Costo total materiales");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "ion-note", 3);
    \u0275\u0275text(16);
    \u0275\u0275pipe(17, "gtq");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "ion-item", 9)(19, "ion-label");
    \u0275\u0275text(20, "Costo por unidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "ion-note", 3);
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "gtq");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "ion-item", 9)(25, "ion-label");
    \u0275\u0275text(26, "Precio de venta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "ion-note", 10)(28, "strong");
    \u0275\u0275text(29);
    \u0275\u0275pipe(30, "gtq");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(31, "ion-item", 9)(32, "ion-label");
    \u0275\u0275text(33, "Margen de ganancia");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "ion-note", 3);
    \u0275\u0275text(35);
    \u0275\u0275pipe(36, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(37, "ion-item", 9)(38, "ion-label");
    \u0275\u0275text(39, "Unidades disponibles");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "ion-badge", 11);
    \u0275\u0275text(41);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "ion-item", 12)(43, "ion-label");
    \u0275\u0275text(44, "Fecha de producci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "ion-note", 3);
    \u0275\u0275text(46);
    \u0275\u0275pipe(47, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(48, LotDetailPage_ion_content_9_ion_item_48_Template, 6, 1, "ion-item", 13);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.lot.productName);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r0.lot.quantity);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(17, 10, ctx_r0.lot.totalCost));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(23, 12, ctx_r0.lot.costPerUnit));
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(30, 14, ctx_r0.lot.sellingPrice));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(36, 16, ctx_r0.lot.profitMargin, "1.1-1"), "%");
    \u0275\u0275advance(5);
    \u0275\u0275property("color", ctx_r0.lot.remainingUnits > 0 ? "success" : "medium");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.lot.remainingUnits, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(47, 19, ctx_r0.lot.producedAt, "dd/MM/yyyy HH:mm"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r0.lot.notes);
  }
}
var LotDetailPage = class _LotDetailPage {
  constructor(route, router, lotRepo, alertCtrl, toastCtrl) {
    this.route = route;
    this.router = router;
    this.lotRepo = lotRepo;
    this.alertCtrl = alertCtrl;
    this.toastCtrl = toastCtrl;
    this.lot = null;
    addIcons({ trashOutline });
  }
  ngOnInit() {
    return __async(this, null, function* () {
      const id = +(this.route.snapshot.paramMap.get("id") ?? "0");
      this.lot = yield this.lotRepo.findById(id);
    });
  }
  confirmDelete() {
    return __async(this, null, function* () {
      const alert = yield this.alertCtrl.create({
        header: "Eliminar lote",
        message: "\xBFEliminar este lote? No se puede deshacer.",
        buttons: [
          { text: "Cancelar", role: "cancel" },
          { text: "Eliminar", role: "destructive", handler: () => __async(this, null, function* () {
            yield this.lotRepo.delete(this.lot.id);
            const t = yield this.toastCtrl.create({ message: "Lote eliminado", duration: 2e3, color: "success", position: "bottom" });
            t.present();
            this.router.navigate(["/tabs/lots"]);
          }) }
        ]
      });
      yield alert.present();
    });
  }
  static {
    this.\u0275fac = function LotDetailPage_Factory(t) {
      return new (t || _LotDetailPage)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ProductionLotRepository), \u0275\u0275directiveInject(AlertController), \u0275\u0275directiveInject(ToastController));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LotDetailPage, selectors: [["app-lot-detail"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 10, vars: 1, consts: [["color", "primary"], ["slot", "start"], ["defaultHref", "/tabs/lots"], ["slot", "end"], ["color", "danger", 3, "click"], ["slot", "icon-only", "name", "trash-outline"], ["class", "ion-padding", 4, "ngIf"], [1, "ion-padding"], [2, "border-radius", "16px"], ["lines", "full"], ["slot", "end", 2, "color", "var(--ion-color-success)"], ["slot", "end", 3, "color"], ["lines", "none"], ["lines", "none", 4, "ngIf"]], template: function LotDetailPage_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "ion-header")(1, "ion-toolbar", 0)(2, "ion-buttons", 1);
        \u0275\u0275element(3, "ion-back-button", 2);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "ion-title");
        \u0275\u0275text(5, "Detalle de lote");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "ion-buttons", 3)(7, "ion-button", 4);
        \u0275\u0275listener("click", function LotDetailPage_Template_ion_button_click_7_listener() {
          return ctx.confirmDelete();
        });
        \u0275\u0275element(8, "ion-icon", 5);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275template(9, LotDetailPage_ion_content_9_Template, 49, 22, "ion-content", 6);
      }
      if (rf & 2) {
        \u0275\u0275advance(9);
        \u0275\u0275property("ngIf", ctx.lot);
      }
    }, dependencies: [
      CommonModule,
      NgIf,
      DecimalPipe,
      DatePipe,
      GtqCurrencyPipe,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonContent,
      IonButtons,
      IonBackButton,
      IonItem,
      IonLabel,
      IonNote,
      IonCard,
      IonCardHeader,
      IonCardTitle,
      IonCardContent,
      IonBadge,
      IonButton,
      IonIcon
    ], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LotDetailPage, { className: "LotDetailPage", filePath: "src\\app\\pages\\lots\\lot-detail\\lot-detail.page.ts", lineNumber: 87 });
})();
export {
  LotDetailPage
};
//# sourceMappingURL=chunk-R62CNDMY.js.map
