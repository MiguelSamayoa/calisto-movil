import {
  PhotoService
} from "./chunk-4MPWN36N.js";
import {
  addIcons,
  cameraOutline,
  imageOutline,
  trashOutline
} from "./chunk-6DYLPT4U.js";
import {
  CommonModule,
  EventEmitter,
  IonButton,
  IonIcon,
  IonSpinner,
  NgIf,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
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
  ɵɵproperty,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-6GE63MYY.js";
import {
  __async
} from "./chunk-J4B6MK7R.js";

// src/app/shared/components/photo-picker/photo-picker.component.ts
function PhotoPickerComponent_img_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 9);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("src", ctx_r1.dataUrl, \u0275\u0275sanitizeUrl)("alt", "Foto de " + ctx_r1.entityType);
  }
}
function PhotoPickerComponent_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "ion-icon", 11);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Sin foto");
    \u0275\u0275elementEnd()();
  }
}
function PhotoPickerComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275element(1, "ion-spinner", 13);
    \u0275\u0275elementEnd();
  }
}
function PhotoPickerComponent_ion_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-button", 14);
    \u0275\u0275listener("click", function PhotoPickerComponent_ion_button_10_Template_ion_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.removePhoto());
    });
    \u0275\u0275element(1, "ion-icon", 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r1.loading);
  }
}
var PhotoPickerComponent = class _PhotoPickerComponent {
  constructor(photoService) {
    this.photoService = photoService;
    this.photoPath = null;
    this.entityType = "product";
    this.photoChanged = new EventEmitter();
    this.dataUrl = null;
    this.loading = false;
    addIcons({ cameraOutline, trashOutline, imageOutline });
  }
  ngOnInit() {
    return __async(this, null, function* () {
      yield this.loadPreview();
    });
  }
  ngOnChanges() {
    return __async(this, null, function* () {
      yield this.loadPreview();
    });
  }
  pickPhoto() {
    return __async(this, null, function* () {
      this.loading = true;
      try {
        const newPath = yield this.photoService.replacePhoto(this.photoPath, this.entityType, this.entityId);
        if (newPath) {
          this.photoPath = newPath;
          yield this.loadPreview();
          this.photoChanged.emit(newPath);
        }
      } finally {
        this.loading = false;
      }
    });
  }
  removePhoto() {
    return __async(this, null, function* () {
      this.loading = true;
      try {
        yield this.photoService.deletePhoto(this.photoPath);
        this.photoPath = null;
        this.dataUrl = null;
        this.photoChanged.emit(null);
      } finally {
        this.loading = false;
      }
    });
  }
  loadPreview() {
    return __async(this, null, function* () {
      this.dataUrl = yield this.photoService.getPhotoDataUrl(this.photoPath);
    });
  }
  static {
    this.\u0275fac = function PhotoPickerComponent_Factory(t) {
      return new (t || _PhotoPickerComponent)(\u0275\u0275directiveInject(PhotoService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PhotoPickerComponent, selectors: [["app-photo-picker"]], inputs: { photoPath: "photoPath", entityType: "entityType", entityId: "entityId" }, outputs: { photoChanged: "photoChanged" }, standalone: true, features: [\u0275\u0275NgOnChangesFeature, \u0275\u0275StandaloneFeature], decls: 11, vars: 6, consts: [["placeholder", ""], [1, "photo-picker"], [1, "photo-container", 3, "click"], ["class", "photo-preview", 3, "src", "alt", 4, "ngIf", "ngIfElse"], ["class", "photo-overlay", 4, "ngIf"], [1, "photo-actions"], ["fill", "outline", "size", "small", 3, "click", "disabled"], ["slot", "start", "name", "camera-outline"], ["fill", "clear", "size", "small", "color", "danger", 3, "disabled", "click", 4, "ngIf"], [1, "photo-preview", 3, "src", "alt"], [1, "photo-placeholder"], ["name", "image-outline", 1, "placeholder-icon"], [1, "photo-overlay"], ["name", "crescent", "color", "light"], ["fill", "clear", "size", "small", "color", "danger", 3, "click", "disabled"], ["slot", "icon-only", "name", "trash-outline"]], template: function PhotoPickerComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = \u0275\u0275getCurrentView();
        \u0275\u0275elementStart(0, "div", 1)(1, "div", 2);
        \u0275\u0275listener("click", function PhotoPickerComponent_Template_div_click_1_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.pickPhoto());
        });
        \u0275\u0275template(2, PhotoPickerComponent_img_2_Template, 1, 2, "img", 3)(3, PhotoPickerComponent_ng_template_3_Template, 4, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(5, PhotoPickerComponent_div_5_Template, 2, 0, "div", 4);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "div", 5)(7, "ion-button", 6);
        \u0275\u0275listener("click", function PhotoPickerComponent_Template_ion_button_click_7_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.pickPhoto());
        });
        \u0275\u0275element(8, "ion-icon", 7);
        \u0275\u0275text(9);
        \u0275\u0275elementEnd();
        \u0275\u0275template(10, PhotoPickerComponent_ion_button_10_Template, 2, 1, "ion-button", 8);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        const placeholder_r4 = \u0275\u0275reference(4);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.dataUrl)("ngIfElse", placeholder_r4);
        \u0275\u0275advance(3);
        \u0275\u0275property("ngIf", ctx.loading);
        \u0275\u0275advance(2);
        \u0275\u0275property("disabled", ctx.loading);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1(" ", ctx.dataUrl ? "Cambiar" : "Agregar foto", " ");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.dataUrl);
      }
    }, dependencies: [CommonModule, NgIf, IonButton, IonIcon, IonSpinner], styles: ["\n\n.photo-picker[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 8px;\n}\n.photo-container[_ngcontent-%COMP%] {\n  position: relative;\n  width: 120px;\n  height: 120px;\n  border-radius: 12px;\n  overflow: hidden;\n  cursor: pointer;\n  background: var(--ion-color-light);\n  border: 2px dashed var(--ion-color-medium);\n}\n.photo-preview[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.photo-placeholder[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n  color: var(--ion-color-medium);\n  gap: 4px;\n  font-size: 12px;\n}\n.placeholder-icon[_ngcontent-%COMP%] {\n  font-size: 36px;\n}\n.photo-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(0, 0, 0, 0.5);\n}\n.photo-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 4px;\n  align-items: center;\n}\n/*# sourceMappingURL=photo-picker.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PhotoPickerComponent, { className: "PhotoPickerComponent", filePath: "src\\app\\shared\\components\\photo-picker\\photo-picker.component.ts", lineNumber: 117 });
})();

export {
  PhotoPickerComponent
};
//# sourceMappingURL=chunk-ELYS6DDG.js.map
