import {
  MaterialService
} from "./chunk-YY2WONY4.js";
import {
  PhotoService
} from "./chunk-4MPWN36N.js";
import {
  GtqCurrencyPipe
} from "./chunk-FA5W7VDN.js";
import {
  addIcons,
  addOutline,
  chevronBackOutline,
  createOutline,
  cubeOutline,
  trashOutline
} from "./chunk-6DYLPT4U.js";
import "./chunk-DJDVLERW.js";
import "./chunk-SJAJ33WN.js";
import {
  AlertController,
  CommonModule,
  FormsModule,
  IonAvatar,
  IonButton,
  IonChip,
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
  IonSearchbar,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
  NgForOf,
  NgIf,
  RouterLink,
  ToastController,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate2,
  ɵɵviewQuery
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

// src/app/pages/materials/materials.page.ts
var _c0 = () => [1, 2, 3, 4, 5];
var _c1 = (a0) => ["/materials", a0, "edit"];
function MaterialsPage_ion_list_9_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-item")(1, "ion-avatar", 11);
    \u0275\u0275element(2, "ion-skeleton-text", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ion-label")(4, "h3");
    \u0275\u0275element(5, "ion-skeleton-text", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275element(7, "ion-skeleton-text", 14);
    \u0275\u0275elementEnd()()();
  }
}
function MaterialsPage_ion_list_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list");
    \u0275\u0275template(1, MaterialsPage_ion_list_9_ion_item_1_Template, 8, 0, "ion-item", 10);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", \u0275\u0275pureFunction0(1, _c0));
  }
}
function MaterialsPage_ion_list_10_ion_item_sliding_1_img_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 25);
  }
  if (rf & 2) {
    const url_r2 = ctx.ngIf;
    \u0275\u0275property("src", url_r2, \u0275\u0275sanitizeUrl);
  }
}
function MaterialsPage_ion_list_10_ion_item_sliding_1_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275element(1, "ion-icon", 27);
    \u0275\u0275elementEnd();
  }
}
function MaterialsPage_ion_list_10_ion_item_sliding_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item-sliding")(1, "ion-item", 16)(2, "ion-avatar", 11);
    \u0275\u0275template(3, MaterialsPage_ion_list_10_ion_item_sliding_1_img_3_Template, 1, 1, "img", 17)(4, MaterialsPage_ion_list_10_ion_item_sliding_1_ng_template_4_Template, 2, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "ion-label")(7, "h3");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p")(10, "ion-chip", 18);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "gtq");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "ion-note", 19);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "ion-item-options", 20)(17, "ion-item-option", 21);
    \u0275\u0275element(18, "ion-icon", 22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "ion-item-option", 23);
    \u0275\u0275listener("click", function MaterialsPage_ion_list_10_ion_item_sliding_1_Template_ion_item_option_click_19_listener() {
      const m_r3 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.confirmDelete(m_r3));
    });
    \u0275\u0275element(20, "ion-icon", 24);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const m_r3 = ctx.$implicit;
    const iconAvatar_r5 = \u0275\u0275reference(5);
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(14, _c1, m_r3.id));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r3.getPhotoUrl(m_r3))("ngIfElse", iconAvatar_r5);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(m_r3.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(m_r3.unit);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", \u0275\u0275pipeBind1(13, 12, m_r3.unitCost), "/", m_r3.unit, " ");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("stock-low", m_r3.stock <= 1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", m_r3.stock, " ", m_r3.unit, " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(16, _c1, m_r3.id));
  }
}
function MaterialsPage_ion_list_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list", 15);
    \u0275\u0275template(1, MaterialsPage_ion_list_10_ion_item_sliding_1_Template, 21, 18, "ion-item-sliding", 10);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r3.filtered);
  }
}
function MaterialsPage_div_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28);
    \u0275\u0275element(1, "ion-icon", 27);
    \u0275\u0275elementStart(2, "h3");
    \u0275\u0275text(3, "Sin insumos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5, "Agrega tus primeros ingredientes para comenzar a calcular costos.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "ion-button", 29);
    \u0275\u0275element(7, "ion-icon", 30);
    \u0275\u0275text(8, " Agregar insumo ");
    \u0275\u0275elementEnd()();
  }
}
var SWIPE_HINT_KEY = "materials_swipe_hint_shown";
var MaterialsPage = class _MaterialsPage {
  constructor(materialService, photoService, alertCtrl, toastCtrl) {
    this.materialService = materialService;
    this.photoService = photoService;
    this.alertCtrl = alertCtrl;
    this.toastCtrl = toastCtrl;
    this.materials = [];
    this.filtered = [];
    this.searchTerm = "";
    this.loading = true;
    this.photoCache = /* @__PURE__ */ new Map();
    addIcons({ addOutline, createOutline, trashOutline, cubeOutline, chevronBackOutline });
  }
  ionViewWillEnter() {
    return __async(this, null, function* () {
      yield this.load(true);
    });
  }
  showSwipeHintIfNeeded() {
    return __async(this, null, function* () {
      if (localStorage.getItem(SWIPE_HINT_KEY) || this.filtered.length === 0)
        return;
      localStorage.setItem(SWIPE_HINT_KEY, "1");
      yield new Promise((r) => setTimeout(r, 400));
      const first = this.slidingItems.first;
      if (!first)
        return;
      yield first.open("end");
      yield new Promise((r) => setTimeout(r, 1200));
      yield first.close();
    });
  }
  handleRefresh(event) {
    return __async(this, null, function* () {
      yield this.load();
      event.detail.complete();
    });
  }
  onSearch(event) {
    this.searchTerm = event.detail.value ?? "";
    this.applyFilter();
  }
  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filtered = term ? this.materials.filter((m) => m.name.toLowerCase().includes(term)) : [...this.materials];
  }
  load(showHint = false) {
    return __async(this, null, function* () {
      this.loading = true;
      try {
        this.materials = yield this.materialService.getAll();
        this.applyFilter();
        yield this.loadPhotos();
      } finally {
        this.loading = false;
        if (showHint)
          this.showSwipeHintIfNeeded();
      }
    });
  }
  loadPhotos() {
    return __async(this, null, function* () {
      for (const m of this.materials) {
        if (m.photoPath && !this.photoCache.has(m.id)) {
          const url = yield this.photoService.getPhotoDataUrl(m.photoPath);
          if (url)
            this.photoCache.set(m.id, url);
        }
      }
    });
  }
  getPhotoUrl(material) {
    return this.photoCache.get(material.id) ?? null;
  }
  confirmDelete(material) {
    return __async(this, null, function* () {
      const alert = yield this.alertCtrl.create({
        header: "Eliminar material",
        message: `\xBFEliminar "${material.name}"? Esta acci\xF3n no se puede deshacer.`,
        buttons: [
          { text: "Cancelar", role: "cancel" },
          {
            text: "Eliminar",
            role: "destructive",
            handler: () => __async(this, null, function* () {
              yield this.materialService.delete(material.id);
              yield this.load();
              this.showToast(`"${material.name}" eliminado`, "success");
            })
          }
        ]
      });
      yield alert.present();
    });
  }
  showToast(message, color) {
    return __async(this, null, function* () {
      const toast = yield this.toastCtrl.create({
        message,
        duration: 2e3,
        color,
        position: "bottom"
      });
      yield toast.present();
    });
  }
  static {
    this.\u0275fac = function MaterialsPage_Factory(t) {
      return new (t || _MaterialsPage)(\u0275\u0275directiveInject(MaterialService), \u0275\u0275directiveInject(PhotoService), \u0275\u0275directiveInject(AlertController), \u0275\u0275directiveInject(ToastController));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MaterialsPage, selectors: [["app-materials"]], viewQuery: function MaterialsPage_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(IonItemSliding, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.slidingItems = _t);
      }
    }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 15, vars: 3, consts: [["iconAvatar", ""], ["color", "primary"], ["placeholder", "Buscar insumo...", "debounce", "200", 3, "ionInput"], ["slot", "fixed", 3, "ionRefresh"], [4, "ngIf"], ["lines", "full", 4, "ngIf"], ["class", "empty-state", 4, "ngIf"], ["slot", "fixed", "vertical", "bottom", "horizontal", "end"], ["routerLink", "/materials/new", "color", "primary"], ["name", "add-outline"], [4, "ngFor", "ngForOf"], ["slot", "start"], ["animated", ""], ["animated", "", 2, "width", "60%"], ["animated", "", 2, "width", "40%"], ["lines", "full"], [3, "routerLink"], ["alt", "foto", 3, "src", 4, "ngIf", "ngIfElse"], ["color", "primary", 1, "chip-small"], ["slot", "end"], ["side", "end"], ["color", "primary", 3, "routerLink"], ["slot", "icon-only", "name", "create-outline"], ["color", "danger", 3, "click"], ["slot", "icon-only", "name", "trash-outline"], ["alt", "foto", 3, "src"], [1, "icon-avatar"], ["name", "cube-outline"], [1, "empty-state"], ["routerLink", "/materials/new"], ["slot", "start", "name", "add-outline"]], template: function MaterialsPage_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "ion-header")(1, "ion-toolbar", 1)(2, "ion-title");
        \u0275\u0275text(3, "Insumos");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(4, "ion-toolbar")(5, "ion-searchbar", 2);
        \u0275\u0275listener("ionInput", function MaterialsPage_Template_ion_searchbar_ionInput_5_listener($event) {
          return ctx.onSearch($event);
        });
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(6, "ion-content")(7, "ion-refresher", 3);
        \u0275\u0275listener("ionRefresh", function MaterialsPage_Template_ion_refresher_ionRefresh_7_listener($event) {
          return ctx.handleRefresh($event);
        });
        \u0275\u0275element(8, "ion-refresher-content");
        \u0275\u0275elementEnd();
        \u0275\u0275template(9, MaterialsPage_ion_list_9_Template, 2, 2, "ion-list", 4)(10, MaterialsPage_ion_list_10_Template, 2, 1, "ion-list", 5)(11, MaterialsPage_div_11_Template, 9, 0, "div", 6);
        \u0275\u0275elementStart(12, "ion-fab", 7)(13, "ion-fab-button", 8);
        \u0275\u0275element(14, "ion-icon", 9);
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(9);
        \u0275\u0275property("ngIf", ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading && ctx.filtered.length > 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading && ctx.filtered.length === 0);
      }
    }, dependencies: [
      CommonModule,
      NgForOf,
      NgIf,
      RouterLink,
      FormsModule,
      GtqCurrencyPipe,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonContent,
      IonSearchbar,
      IonList,
      IonItem,
      IonLabel,
      IonAvatar,
      IonButton,
      IonIcon,
      IonFab,
      IonFabButton,
      IonItemSliding,
      IonItemOptions,
      IonItemOption,
      IonRefresher,
      IonRefresherContent,
      IonChip,
      IonNote,
      IonSkeletonText
    ], styles: ["\n\n.icon-avatar[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  background: var(--ion-color-light);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: var(--ion-color-medium);\n  font-size: 22px;\n}\n.chip-small[_ngcontent-%COMP%] {\n  font-size: 10px;\n  height: 18px;\n  padding: 0 6px;\n  margin: 0 2px 0 0;\n}\nion-note[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  font-weight: 600;\n}\nion-note.stock-low[_ngcontent-%COMP%] {\n  color: var(--ion-color-danger);\n}\n.empty-state[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 48px 24px;\n  text-align: center;\n}\n.empty-state[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%] {\n  font-size: 64px;\n  color: var(--ion-color-medium);\n  margin-bottom: 16px;\n}\n.empty-state[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: var(--ion-color-dark);\n}\n.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--ion-color-medium);\n}\n/*# sourceMappingURL=materials.page.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MaterialsPage, { className: "MaterialsPage", filePath: "src\\app\\pages\\materials\\materials.page.ts", lineNumber: 39 });
})();
export {
  MaterialsPage
};
//# sourceMappingURL=chunk-IABAE2OC.js.map
