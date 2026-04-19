import {
  ProductService
} from "./chunk-VVRUAT4U.js";
import "./chunk-4MPWN36N.js";
import {
  SaleService
} from "./chunk-X3OWCJWS.js";
import {
  ProductionLotRepository
} from "./chunk-QX25LUL7.js";
import {
  GtqCurrencyPipe
} from "./chunk-FA5W7VDN.js";
import {
  addIcons,
  cashOutline,
  checkmarkOutline,
  layersOutline
} from "./chunk-6DYLPT4U.js";
import "./chunk-DJDVLERW.js";
import "./chunk-SJAJ33WN.js";
import {
  CommonModule,
  FormsModule,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  LoadingController,
  NgControlStatus,
  NgForOf,
  NgIf,
  NgModel,
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
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
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

// src/app/pages/sales/sale-form/sale-form.page.ts
function SaleFormPage_ion_select_option_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-select-option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r1 = ctx.$implicit;
    \u0275\u0275property("value", p_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", p_r1.name, " ");
  }
}
function SaleFormPage_ion_item_14_ion_select_option_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-select-option", 17);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "gtq");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const lot_r4 = ctx.$implicit;
    \u0275\u0275property("value", lot_r4.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" #", lot_r4.id, " \u2014 ", lot_r4.remainingUnits, " disponibles (", \u0275\u0275pipeBind1(2, 4, lot_r4.sellingPrice), "/u.) ");
  }
}
function SaleFormPage_ion_item_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item", 4)(1, "ion-label", 5);
    \u0275\u0275text(2, "Lote de producci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ion-select", 18);
    \u0275\u0275twoWayListener("ngModelChange", function SaleFormPage_ion_item_14_Template_ion_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.selectedLotId, $event) || (ctx_r2.selectedLotId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function SaleFormPage_ion_item_14_Template_ion_select_ngModelChange_3_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onLotSelected());
    });
    \u0275\u0275template(4, SaleFormPage_ion_item_14_ion_select_option_4_Template, 3, 6, "ion-select-option", 7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "ion-note", 19);
    \u0275\u0275text(6, " Selecciona el lote para llevar control de inventario ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.selectedLotId);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r2.availableLots);
  }
}
function SaleFormPage_div_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "ion-chip", 21);
    \u0275\u0275element(2, "ion-icon", 22);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r2.selectedLot.remainingUnits, " unidades disponibles ");
  }
}
function SaleFormPage_ion_card_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-card", 23)(1, "ion-card-content")(2, "div", 24)(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "gtq");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "strong", 25);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "gtq");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", ctx_r2.quantity, " \xD7 ", \u0275\u0275pipeBind1(5, 3, ctx_r2.unitPrice), "");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("= ", \u0275\u0275pipeBind1(8, 5, ctx_r2.totalAmount), "");
  }
}
var SaleFormPage = class _SaleFormPage {
  constructor(router, saleService, productService, lotRepo, toastCtrl, loadingCtrl) {
    this.router = router;
    this.saleService = saleService;
    this.productService = productService;
    this.lotRepo = lotRepo;
    this.toastCtrl = toastCtrl;
    this.loadingCtrl = loadingCtrl;
    this.products = [];
    this.availableLots = [];
    this.selectedProductId = null;
    this.selectedLotId = null;
    this.quantity = null;
    this.unitPrice = null;
    this.notes = "";
    this.saving = false;
    addIcons({ cashOutline, checkmarkOutline, layersOutline });
  }
  ngOnInit() {
    return __async(this, null, function* () {
      this.products = yield this.productService.getAll();
    });
  }
  onProductSelected() {
    return __async(this, null, function* () {
      this.selectedLotId = null;
      this.unitPrice = null;
      if (!this.selectedProductId)
        return;
      this.availableLots = yield this.lotRepo.findWithStock(this.selectedProductId);
      if (this.availableLots.length > 0) {
        this.selectedLotId = this.availableLots[0].id;
        this.onLotSelected();
      }
    });
  }
  onLotSelected() {
    const lot = this.availableLots.find((l) => l.id === this.selectedLotId);
    if (lot) {
      this.unitPrice = lot.sellingPrice;
    }
  }
  get totalAmount() {
    return (this.quantity ?? 0) * (this.unitPrice ?? 0);
  }
  get selectedLot() {
    return this.availableLots.find((l) => l.id === this.selectedLotId);
  }
  save() {
    return __async(this, null, function* () {
      if (!this.selectedProductId || !this.quantity || !this.unitPrice) {
        this.showToast("Completa todos los campos requeridos", "warning");
        return;
      }
      if (this.quantity <= 0) {
        this.showToast("La cantidad debe ser mayor a 0", "warning");
        return;
      }
      const loading = yield this.loadingCtrl.create({ message: "Registrando venta..." });
      yield loading.present();
      this.saving = true;
      try {
        const dto = {
          productId: this.selectedProductId,
          lotId: this.selectedLotId ?? void 0,
          quantity: this.quantity,
          unitPrice: this.unitPrice,
          notes: this.notes || void 0
        };
        yield this.saleService.registerSale(dto);
        this.showToast("Venta registrada", "success");
        this.router.navigate(["/tabs/sales"]);
      } catch (err) {
        this.showToast(err instanceof Error ? err.message : "Error al registrar", "danger");
      } finally {
        this.saving = false;
        yield loading.dismiss();
      }
    });
  }
  showToast(msg, color) {
    return __async(this, null, function* () {
      const t = yield this.toastCtrl.create({
        message: msg,
        duration: 2500,
        color,
        position: "bottom"
      });
      yield t.present();
    });
  }
  static {
    this.\u0275fac = function SaleFormPage_Factory(t) {
      return new (t || _SaleFormPage)(\u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(SaleService), \u0275\u0275directiveInject(ProductService), \u0275\u0275directiveInject(ProductionLotRepository), \u0275\u0275directiveInject(ToastController), \u0275\u0275directiveInject(LoadingController));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SaleFormPage, selectors: [["app-sale-form"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 37, vars: 13, consts: [["color", "primary"], ["slot", "start"], ["defaultHref", "/tabs/sales"], [1, "ion-padding"], ["lines", "full"], ["position", "stacked"], ["placeholder", "\xBFQu\xE9 se vendi\xF3?", "interface", "action-sheet", 3, "ngModelChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], ["lines", "full", 4, "ngIf"], ["class", "lot-info", 4, "ngIf"], ["type", "number", "inputmode", "numeric", "placeholder", "1", "min", "1", "step", "1", 3, "ngModelChange", "ngModel", "autofocus"], ["lines", "none"], ["type", "number", "inputmode", "decimal", "placeholder", "0.00", "min", "0", "step", "0.01", 3, "ngModelChange", "ngModel"], ["class", "total-card", 4, "ngIf"], ["placeholder", "Ej. Venta a cliente frecuente...", "rows", "2", "autoGrow", "", 3, "ngModelChange", "ngModel"], ["expand", "block", "color", "success", 1, "save-btn", 3, "click", "disabled"], ["slot", "start", "name", "checkmark-outline"], [3, "value"], ["interface", "action-sheet", 3, "ngModelChange", "ngModel"], ["slot", "helper"], [1, "lot-info"], ["color", "success"], ["name", "layers-outline"], [1, "total-card"], [1, "total-row"], [1, "total-amount"]], template: function SaleFormPage_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "ion-header")(1, "ion-toolbar", 0)(2, "ion-buttons", 1);
        \u0275\u0275element(3, "ion-back-button", 2);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "ion-title");
        \u0275\u0275text(5, "Registrar venta");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(6, "ion-content", 3)(7, "ion-card")(8, "ion-card-content")(9, "ion-item", 4)(10, "ion-label", 5);
        \u0275\u0275text(11, "Producto *");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "ion-select", 6);
        \u0275\u0275twoWayListener("ngModelChange", function SaleFormPage_Template_ion_select_ngModelChange_12_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.selectedProductId, $event) || (ctx.selectedProductId = $event);
          return $event;
        });
        \u0275\u0275listener("ngModelChange", function SaleFormPage_Template_ion_select_ngModelChange_12_listener() {
          return ctx.onProductSelected();
        });
        \u0275\u0275template(13, SaleFormPage_ion_select_option_13_Template, 2, 2, "ion-select-option", 7);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(14, SaleFormPage_ion_item_14_Template, 7, 2, "ion-item", 8)(15, SaleFormPage_div_15_Template, 4, 1, "div", 9);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(16, "ion-card")(17, "ion-card-content")(18, "ion-item", 4)(19, "ion-label", 5);
        \u0275\u0275text(20, "Cantidad vendida *");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(21, "ion-input", 10);
        \u0275\u0275twoWayListener("ngModelChange", function SaleFormPage_Template_ion_input_ngModelChange_21_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.quantity, $event) || (ctx.quantity = $event);
          return $event;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(22, "ion-item", 11)(23, "ion-label", 5);
        \u0275\u0275text(24, "Precio por unidad (Q) *");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(25, "ion-input", 12);
        \u0275\u0275twoWayListener("ngModelChange", function SaleFormPage_Template_ion_input_ngModelChange_25_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.unitPrice, $event) || (ctx.unitPrice = $event);
          return $event;
        });
        \u0275\u0275elementEnd()()()();
        \u0275\u0275template(26, SaleFormPage_ion_card_26_Template, 9, 7, "ion-card", 13);
        \u0275\u0275elementStart(27, "ion-card")(28, "ion-card-content")(29, "ion-item", 11)(30, "ion-label", 5);
        \u0275\u0275text(31, "Notas (opcional)");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(32, "ion-textarea", 14);
        \u0275\u0275twoWayListener("ngModelChange", function SaleFormPage_Template_ion_textarea_ngModelChange_32_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.notes, $event) || (ctx.notes = $event);
          return $event;
        });
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(33, "ion-button", 15);
        \u0275\u0275listener("click", function SaleFormPage_Template_ion_button_click_33_listener() {
          return ctx.save();
        });
        \u0275\u0275element(34, "ion-icon", 16);
        \u0275\u0275text(35);
        \u0275\u0275pipe(36, "gtq");
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(12);
        \u0275\u0275twoWayProperty("ngModel", ctx.selectedProductId);
        \u0275\u0275advance();
        \u0275\u0275property("ngForOf", ctx.products);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.availableLots.length > 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.selectedLot);
        \u0275\u0275advance(6);
        \u0275\u0275twoWayProperty("ngModel", ctx.quantity);
        \u0275\u0275property("autofocus", !!ctx.selectedProductId);
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.unitPrice);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.quantity && ctx.unitPrice);
        \u0275\u0275advance(6);
        \u0275\u0275twoWayProperty("ngModel", ctx.notes);
        \u0275\u0275advance();
        \u0275\u0275property("disabled", ctx.saving || !ctx.selectedProductId || !ctx.quantity || !ctx.unitPrice);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1(" Registrar venta \u2014 ", \u0275\u0275pipeBind1(36, 11, ctx.totalAmount), " ");
      }
    }, dependencies: [
      CommonModule,
      NgForOf,
      NgIf,
      FormsModule,
      NgControlStatus,
      NgModel,
      GtqCurrencyPipe,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonContent,
      IonButtons,
      IonBackButton,
      IonButton,
      IonItem,
      IonLabel,
      IonInput,
      IonSelect,
      IonSelectOption,
      IonTextarea,
      IonNote,
      IonCard,
      IonCardContent,
      IonIcon,
      IonChip
    ], styles: ["\n\nion-card[_ngcontent-%COMP%] {\n  border-radius: 16px;\n  margin-bottom: 12px;\n}\n.lot-info[_ngcontent-%COMP%] {\n  padding: 8px 0;\n}\n.total-card[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #1b5e20 0%,\n      #2e7d32 100%);\n}\n.total-card[_ngcontent-%COMP%]   .total-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  color: rgba(255, 255, 255, 0.8);\n}\n.total-card[_ngcontent-%COMP%]   .total-amount[_ngcontent-%COMP%] {\n  color: #b9f6ca;\n  font-size: 1.5rem;\n}\n.save-btn[_ngcontent-%COMP%] {\n  margin: 8px 0 32px;\n  height: 52px;\n  font-size: 1rem;\n}\n/*# sourceMappingURL=sale-form.page.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SaleFormPage, { className: "SaleFormPage", filePath: "src\\app\\pages\\sales\\sale-form\\sale-form.page.ts", lineNumber: 37 });
})();
export {
  SaleFormPage
};
//# sourceMappingURL=chunk-BZ37IU5D.js.map
