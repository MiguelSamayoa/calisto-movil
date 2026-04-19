import {
  PhotoPickerComponent
} from "./chunk-ELYS6DDG.js";
import {
  ProductService
} from "./chunk-VVRUAT4U.js";
import "./chunk-4MPWN36N.js";
import {
  addIcons,
  saveOutline
} from "./chunk-6DYLPT4U.js";
import "./chunk-DJDVLERW.js";
import "./chunk-SJAJ33WN.js";
import {
  ActivatedRoute,
  CommonModule,
  FormsModule,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonTextarea,
  IonTitle,
  IonToolbar,
  LoadingController,
  NgControlStatus,
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
  ɵɵlistener,
  ɵɵproperty,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
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

// src/app/pages/products/product-form/product-form.page.ts
var ProductFormPage = class _ProductFormPage {
  constructor(route, router, productService, toastCtrl, loadingCtrl) {
    this.route = route;
    this.router = router;
    this.productService = productService;
    this.toastCtrl = toastCtrl;
    this.loadingCtrl = loadingCtrl;
    this.isEdit = false;
    this.saving = false;
    this.name = "";
    this.description = "";
    this.category = "General";
    this.yieldUnits = null;
    this.photoPath = null;
    addIcons({ saveOutline });
  }
  ngOnInit() {
    return __async(this, null, function* () {
      const id = this.route.snapshot.paramMap.get("id");
      if (id) {
        this.isEdit = true;
        this.productId = +id;
        const p = yield this.productService.getById(this.productId);
        if (p) {
          this.name = p.name;
          this.description = p.description ?? "";
          this.category = p.category;
          this.yieldUnits = p.yieldUnits;
          this.photoPath = p.photoPath;
        }
      }
    });
  }
  save() {
    return __async(this, null, function* () {
      if (!this.name.trim())
        return this.toast("El nombre es requerido", "warning");
      if (!this.yieldUnits || this.yieldUnits < 1)
        return this.toast("El rendimiento debe ser \u2265 1", "warning");
      const loading = yield this.loadingCtrl.create({ message: "Guardando..." });
      yield loading.present();
      this.saving = true;
      try {
        const dto = {
          name: this.name.trim(),
          description: this.description || void 0,
          category: this.category,
          yieldUnits: this.yieldUnits,
          photoPath: this.photoPath ?? void 0
        };
        if (this.isEdit && this.productId) {
          yield this.productService.update(this.productId, dto);
          this.toast("Producto actualizado", "success");
        } else {
          const created = yield this.productService.create(dto);
          this.toast("Producto creado \u2014 ahora define su receta", "success");
          this.router.navigate(["/products", created.id, "recipe"]);
          return;
        }
        this.router.navigate(["/tabs/products"]);
      } catch (e) {
        this.toast(e instanceof Error ? e.message : "Error al guardar", "danger");
      } finally {
        this.saving = false;
        yield loading.dismiss();
      }
    });
  }
  toast(msg, color) {
    return __async(this, null, function* () {
      const t = yield this.toastCtrl.create({ message: msg, duration: 2500, color, position: "bottom" });
      t.present();
    });
  }
  static {
    this.\u0275fac = function ProductFormPage_Factory(t) {
      return new (t || _ProductFormPage)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ProductService), \u0275\u0275directiveInject(ToastController), \u0275\u0275directiveInject(LoadingController));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProductFormPage, selectors: [["app-product-form"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 37, vars: 11, consts: [["color", "primary"], ["slot", "start"], ["defaultHref", "/tabs/products"], ["slot", "end"], ["strong", "", 3, "click", "disabled"], ["slot", "start", "name", "save-outline"], [1, "ion-padding"], [2, "border-radius", "16px", "margin-bottom", "12px"], [2, "display", "flex", "justify-content", "center", "padding", "16px"], ["entityType", "product", 3, "photoChanged", "photoPath", "entityId"], ["lines", "full"], ["position", "stacked"], ["placeholder", "Ej. Brownies de chocolate", "autocapitalize", "words", "clearInput", "", 3, "ngModelChange", "ngModel", "autofocus"], ["placeholder", "Ej. Chocolates, Galletas, Tortas", 3, "ngModelChange", "ngModel"], ["placeholder", "Opcional", "rows", "2", "autoGrow", "", 3, "ngModelChange", "ngModel"], ["lines", "none"], ["type", "number", "inputmode", "numeric", "placeholder", "12", "min", "1", "step", "1", 3, "ngModelChange", "ngModel"], ["slot", "helper"], ["expand", "block", 2, "margin", "16px 0 32px", "height", "52px", "font-size", "1rem", 3, "click", "disabled"]], template: function ProductFormPage_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "ion-header")(1, "ion-toolbar", 0)(2, "ion-buttons", 1);
        \u0275\u0275element(3, "ion-back-button", 2);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "ion-title");
        \u0275\u0275text(5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "ion-buttons", 3)(7, "ion-button", 4);
        \u0275\u0275listener("click", function ProductFormPage_Template_ion_button_click_7_listener() {
          return ctx.save();
        });
        \u0275\u0275element(8, "ion-icon", 5);
        \u0275\u0275text(9, "Guardar ");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(10, "ion-content", 6)(11, "ion-card", 7)(12, "ion-card-content", 8)(13, "app-photo-picker", 9);
        \u0275\u0275listener("photoChanged", function ProductFormPage_Template_app_photo_picker_photoChanged_13_listener($event) {
          return ctx.photoPath = $event;
        });
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(14, "ion-card", 7)(15, "ion-card-content")(16, "ion-item", 10)(17, "ion-label", 11);
        \u0275\u0275text(18, "Nombre *");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "ion-input", 12);
        \u0275\u0275twoWayListener("ngModelChange", function ProductFormPage_Template_ion_input_ngModelChange_19_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.name, $event) || (ctx.name = $event);
          return $event;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(20, "ion-item", 10)(21, "ion-label", 11);
        \u0275\u0275text(22, "Categor\xEDa");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "ion-input", 13);
        \u0275\u0275twoWayListener("ngModelChange", function ProductFormPage_Template_ion_input_ngModelChange_23_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.category, $event) || (ctx.category = $event);
          return $event;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(24, "ion-item", 10)(25, "ion-label", 11);
        \u0275\u0275text(26, "Descripci\xF3n");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(27, "ion-textarea", 14);
        \u0275\u0275twoWayListener("ngModelChange", function ProductFormPage_Template_ion_textarea_ngModelChange_27_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.description, $event) || (ctx.description = $event);
          return $event;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(28, "ion-item", 15)(29, "ion-label", 11);
        \u0275\u0275text(30, "Rendimiento (unidades por receta) *");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(31, "ion-input", 16);
        \u0275\u0275twoWayListener("ngModelChange", function ProductFormPage_Template_ion_input_ngModelChange_31_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.yieldUnits, $event) || (ctx.yieldUnits = $event);
          return $event;
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(32, "ion-note", 17);
        \u0275\u0275text(33, "Cu\xE1ntas unidades produce una receta base");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(34, "ion-button", 18);
        \u0275\u0275listener("click", function ProductFormPage_Template_ion_button_click_34_listener() {
          return ctx.save();
        });
        \u0275\u0275element(35, "ion-icon", 5);
        \u0275\u0275text(36);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.isEdit ? "Editar producto" : "Nuevo producto");
        \u0275\u0275advance(2);
        \u0275\u0275property("disabled", ctx.saving);
        \u0275\u0275advance(6);
        \u0275\u0275property("photoPath", ctx.photoPath)("entityId", ctx.productId);
        \u0275\u0275advance(6);
        \u0275\u0275twoWayProperty("ngModel", ctx.name);
        \u0275\u0275property("autofocus", !ctx.isEdit);
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.category);
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.description);
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.yieldUnits);
        \u0275\u0275advance(3);
        \u0275\u0275property("disabled", ctx.saving);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1(" ", ctx.isEdit ? "Actualizar producto" : "Guardar producto", " ");
      }
    }, dependencies: [
      CommonModule,
      FormsModule,
      NgControlStatus,
      NgModel,
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
      IonTextarea,
      IonIcon,
      IonCard,
      IonCardContent,
      IonNote,
      PhotoPickerComponent
    ], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProductFormPage, { className: "ProductFormPage", filePath: "src\\app\\pages\\products\\product-form\\product-form.page.ts", lineNumber: 77 });
})();
export {
  ProductFormPage
};
//# sourceMappingURL=chunk-LKUMV57F.js.map
