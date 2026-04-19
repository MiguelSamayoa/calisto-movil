import {
  PhotoPickerComponent
} from "./chunk-ELYS6DDG.js";
import {
  MaterialService
} from "./chunk-YY2WONY4.js";
import "./chunk-4MPWN36N.js";
import {
  addIcons,
  cameraOutline,
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
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  LoadingController,
  NgControlStatus,
  NgForOf,
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
  ɵɵtemplate,
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

// src/app/pages/materials/material-form/material-form.page.ts
function MaterialFormPage_ion_select_option_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-select-option", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const u_r1 = ctx.$implicit;
    \u0275\u0275property("value", u_r1.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", u_r1.label, " ");
  }
}
var UNITS = [
  { value: "kg", label: "Kilogramo (kg)" },
  { value: "g", label: "Gramo (g)" },
  { value: "L", label: "Litro (L)" },
  { value: "mL", label: "Mililitro (mL)" },
  { value: "lb", label: "Libra (lb)" },
  { value: "oz", label: "Onza (oz)" },
  { value: "unidad", label: "Unidad" },
  { value: "docena", label: "Docena" },
  { value: "caja", label: "Caja" }
];
var MaterialFormPage = class _MaterialFormPage {
  constructor(route, router, materialService, toastCtrl, loadingCtrl) {
    this.route = route;
    this.router = router;
    this.materialService = materialService;
    this.toastCtrl = toastCtrl;
    this.loadingCtrl = loadingCtrl;
    this.isEdit = false;
    this.loading = false;
    this.name = "";
    this.description = "";
    this.unit = "kg";
    this.unitCost = null;
    this.stock = null;
    this.photoPath = null;
    this.units = UNITS;
    addIcons({ saveOutline, cameraOutline });
  }
  ngOnInit() {
    return __async(this, null, function* () {
      const id = this.route.snapshot.paramMap.get("id");
      if (id) {
        this.isEdit = true;
        this.materialId = +id;
        yield this.loadMaterial(this.materialId);
      }
    });
  }
  loadMaterial(id) {
    return __async(this, null, function* () {
      const m = yield this.materialService.getById(id);
      if (!m) {
        yield this.showToast("Material no encontrado", "danger");
        this.router.navigate(["/tabs/materials"]);
        return;
      }
      this.name = m.name;
      this.description = m.description ?? "";
      this.unit = m.unit;
      this.unitCost = m.unitCost;
      this.stock = m.stock;
      this.photoPath = m.photoPath;
    });
  }
  onPhotoChanged(path) {
    this.photoPath = path;
  }
  save() {
    return __async(this, null, function* () {
      if (!this.name.trim()) {
        return this.showToast("El nombre es requerido", "warning");
      }
      if (this.unitCost === null || this.unitCost < 0) {
        return this.showToast("Ingresa un costo v\xE1lido", "warning");
      }
      const loading = yield this.loadingCtrl.create({ message: "Guardando..." });
      yield loading.present();
      this.loading = true;
      try {
        const dto = {
          name: this.name.trim(),
          description: this.description || void 0,
          unit: this.unit,
          unitCost: this.unitCost,
          stock: this.stock ?? 0,
          photoPath: this.photoPath ?? void 0
        };
        if (this.isEdit && this.materialId) {
          yield this.materialService.update(this.materialId, dto);
          this.showToast("Insumo actualizado", "success");
        } else {
          yield this.materialService.create(dto);
          this.showToast("Insumo creado", "success");
        }
        this.router.navigate(["/tabs/materials"]);
      } catch (err) {
        this.showToast(err instanceof Error ? err.message : "Error al guardar", "danger");
      } finally {
        this.loading = false;
        yield loading.dismiss();
      }
    });
  }
  showToast(message, color) {
    return __async(this, null, function* () {
      const toast = yield this.toastCtrl.create({
        message,
        duration: 2500,
        color,
        position: "bottom"
      });
      yield toast.present();
    });
  }
  static {
    this.\u0275fac = function MaterialFormPage_Factory(t) {
      return new (t || _MaterialFormPage)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(MaterialService), \u0275\u0275directiveInject(ToastController), \u0275\u0275directiveInject(LoadingController));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MaterialFormPage, selectors: [["app-material-form"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 44, vars: 15, consts: [["color", "primary"], ["slot", "start"], ["defaultHref", "/tabs/materials"], ["slot", "end"], ["strong", "", 3, "click", "disabled"], ["slot", "start", "name", "save-outline"], [1, "ion-padding"], [1, "photo-section"], ["entityType", "material", 3, "photoChanged", "photoPath", "entityId"], ["lines", "full"], ["position", "stacked"], ["placeholder", "Ej. Harina de trigo", "autocapitalize", "words", "inputmode", "text", "clearInput", "", 3, "ngModelChange", "ngModel", "autofocus"], ["placeholder", "Opcional", "rows", "2", "autoGrow", "", 3, "ngModelChange", "ngModel"], ["placeholder", "Seleccionar", "interface", "action-sheet", 3, "ngModelChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], ["type", "number", "inputmode", "decimal", "placeholder", "0.00", "min", "0", "step", "0.01", 3, "ngModelChange", "ngModel"], ["slot", "helper"], ["lines", "none"], ["type", "number", "inputmode", "decimal", "placeholder", "0", "min", "0", "step", "0.01", 3, "ngModelChange", "ngModel"], ["expand", "block", 1, "save-btn", 3, "click", "disabled"], [3, "value"]], template: function MaterialFormPage_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "ion-header")(1, "ion-toolbar", 0)(2, "ion-buttons", 1);
        \u0275\u0275element(3, "ion-back-button", 2);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "ion-title");
        \u0275\u0275text(5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "ion-buttons", 3)(7, "ion-button", 4);
        \u0275\u0275listener("click", function MaterialFormPage_Template_ion_button_click_7_listener() {
          return ctx.save();
        });
        \u0275\u0275element(8, "ion-icon", 5);
        \u0275\u0275text(9, " Guardar ");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(10, "ion-content", 6)(11, "ion-card")(12, "ion-card-content", 7)(13, "app-photo-picker", 8);
        \u0275\u0275listener("photoChanged", function MaterialFormPage_Template_app_photo_picker_photoChanged_13_listener($event) {
          return ctx.onPhotoChanged($event);
        });
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(14, "ion-card")(15, "ion-card-content")(16, "ion-item", 9)(17, "ion-label", 10);
        \u0275\u0275text(18, "Nombre *");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "ion-input", 11);
        \u0275\u0275twoWayListener("ngModelChange", function MaterialFormPage_Template_ion_input_ngModelChange_19_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.name, $event) || (ctx.name = $event);
          return $event;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(20, "ion-item", 9)(21, "ion-label", 10);
        \u0275\u0275text(22, "Descripci\xF3n");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "ion-textarea", 12);
        \u0275\u0275twoWayListener("ngModelChange", function MaterialFormPage_Template_ion_textarea_ngModelChange_23_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.description, $event) || (ctx.description = $event);
          return $event;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(24, "ion-item", 9)(25, "ion-label", 10);
        \u0275\u0275text(26, "Unidad de medida *");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(27, "ion-select", 13);
        \u0275\u0275twoWayListener("ngModelChange", function MaterialFormPage_Template_ion_select_ngModelChange_27_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.unit, $event) || (ctx.unit = $event);
          return $event;
        });
        \u0275\u0275template(28, MaterialFormPage_ion_select_option_28_Template, 2, 2, "ion-select-option", 14);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(29, "ion-item", 9)(30, "ion-label", 10);
        \u0275\u0275text(31);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(32, "ion-input", 15);
        \u0275\u0275twoWayListener("ngModelChange", function MaterialFormPage_Template_ion_input_ngModelChange_32_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.unitCost, $event) || (ctx.unitCost = $event);
          return $event;
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(33, "ion-note", 16);
        \u0275\u0275text(34, "Quetzales guatemaltecos");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(35, "ion-item", 17)(36, "ion-label", 10);
        \u0275\u0275text(37);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(38, "ion-input", 18);
        \u0275\u0275twoWayListener("ngModelChange", function MaterialFormPage_Template_ion_input_ngModelChange_38_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.stock, $event) || (ctx.stock = $event);
          return $event;
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(39, "ion-note", 16);
        \u0275\u0275text(40, "Cantidad disponible actualmente");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(41, "ion-button", 19);
        \u0275\u0275listener("click", function MaterialFormPage_Template_ion_button_click_41_listener() {
          return ctx.save();
        });
        \u0275\u0275element(42, "ion-icon", 5);
        \u0275\u0275text(43);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.isEdit ? "Editar insumo" : "Nuevo insumo");
        \u0275\u0275advance(2);
        \u0275\u0275property("disabled", ctx.loading);
        \u0275\u0275advance(6);
        \u0275\u0275property("photoPath", ctx.photoPath)("entityId", ctx.materialId);
        \u0275\u0275advance(6);
        \u0275\u0275twoWayProperty("ngModel", ctx.name);
        \u0275\u0275property("autofocus", !ctx.isEdit);
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.description);
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.unit);
        \u0275\u0275advance();
        \u0275\u0275property("ngForOf", ctx.units);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate1("Costo por ", ctx.unit, " (Q) *");
        \u0275\u0275advance();
        \u0275\u0275twoWayProperty("ngModel", ctx.unitCost);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate1("Stock actual (", ctx.unit, ")");
        \u0275\u0275advance();
        \u0275\u0275twoWayProperty("ngModel", ctx.stock);
        \u0275\u0275advance(3);
        \u0275\u0275property("disabled", ctx.loading);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1(" ", ctx.isEdit ? "Actualizar insumo" : "Guardar insumo", " ");
      }
    }, dependencies: [
      CommonModule,
      NgForOf,
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
      IonSelect,
      IonSelectOption,
      IonTextarea,
      IonIcon,
      IonCard,
      IonCardContent,
      IonNote,
      PhotoPickerComponent
    ], styles: ["\n\n.photo-section[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  padding: 16px;\n}\nion-card[_ngcontent-%COMP%] {\n  border-radius: 16px;\n  margin-bottom: 12px;\n}\n.save-btn[_ngcontent-%COMP%] {\n  margin: 16px 0 32px;\n  height: 52px;\n  font-size: 1rem;\n}\n/*# sourceMappingURL=material-form.page.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MaterialFormPage, { className: "MaterialFormPage", filePath: "src\\app\\pages\\materials\\material-form\\material-form.page.ts", lineNumber: 45 });
})();
export {
  MaterialFormPage
};
//# sourceMappingURL=chunk-MQIXAT5E.js.map
