import {
  ProductService
} from "./chunk-VVRUAT4U.js";
import {
  PhotoService
} from "./chunk-4MPWN36N.js";
import "./chunk-FA5W7VDN.js";
import {
  addIcons,
  addOutline,
  bagOutline,
  createOutline,
  readerOutline,
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
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
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
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
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

// src/app/pages/products/products.page.ts
var _c0 = (a0) => ["/products", a0, "recipe"];
var _c1 = (a0) => ["/products", a0, "edit"];
function ProductsPage_ion_list_9_ion_item_sliding_1_img_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 21);
  }
  if (rf & 2) {
    const url_r2 = ctx.ngIf;
    \u0275\u0275property("src", url_r2, \u0275\u0275sanitizeUrl);
  }
}
function ProductsPage_ion_list_9_ion_item_sliding_1_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22);
    \u0275\u0275element(1, "ion-icon", 23);
    \u0275\u0275elementEnd();
  }
}
function ProductsPage_ion_list_9_ion_item_sliding_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item-sliding")(1, "ion-item")(2, "ion-avatar", 11);
    \u0275\u0275template(3, ProductsPage_ion_list_9_ion_item_sliding_1_img_3_Template, 1, 1, "img", 12)(4, ProductsPage_ion_list_9_ion_item_sliding_1_ng_template_4_Template, 2, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "ion-label")(7, "h3");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p")(10, "ion-chip", 13);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "ion-item-options", 14)(14, "ion-item-option", 15);
    \u0275\u0275element(15, "ion-icon", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "ion-item-option", 17);
    \u0275\u0275element(17, "ion-icon", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "ion-item-option", 19);
    \u0275\u0275listener("click", function ProductsPage_ion_list_9_ion_item_sliding_1_Template_ion_item_option_click_18_listener() {
      const p_r3 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.confirmDelete(p_r3));
    });
    \u0275\u0275element(19, "ion-icon", 20);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const p_r3 = ctx.$implicit;
    const icon_r5 = \u0275\u0275reference(5);
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r3.getPhotoUrl(p_r3))("ngIfElse", icon_r5);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(p_r3.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", p_r3.category, " ");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" Rinde ", p_r3.yieldUnits, " unidades ");
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(7, _c0, p_r3.id));
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(9, _c1, p_r3.id));
  }
}
function ProductsPage_ion_list_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list", 9);
    \u0275\u0275template(1, ProductsPage_ion_list_9_ion_item_sliding_1_Template, 20, 11, "ion-item-sliding", 10);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r3.filtered);
  }
}
function ProductsPage_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275element(1, "ion-icon", 25);
    \u0275\u0275elementStart(2, "h3");
    \u0275\u0275text(3, "Sin productos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 26);
    \u0275\u0275text(5, "Crea tu primer producto y def\xEDnele una receta.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "ion-button", 27);
    \u0275\u0275element(7, "ion-icon", 28);
    \u0275\u0275text(8, " Agregar producto ");
    \u0275\u0275elementEnd()();
  }
}
var ProductsPage = class _ProductsPage {
  constructor(productService, photoService, alertCtrl, toastCtrl) {
    this.productService = productService;
    this.photoService = photoService;
    this.alertCtrl = alertCtrl;
    this.toastCtrl = toastCtrl;
    this.products = [];
    this.filtered = [];
    this.loading = true;
    this.photoCache = /* @__PURE__ */ new Map();
    addIcons({ addOutline, createOutline, trashOutline, bagOutline, readerOutline });
  }
  ionViewWillEnter() {
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
  onSearch(ev) {
    const t = (ev.detail.value ?? "").toLowerCase();
    this.filtered = t ? this.products.filter((p) => p.name.toLowerCase().includes(t)) : [...this.products];
  }
  load() {
    return __async(this, null, function* () {
      this.loading = true;
      try {
        this.products = yield this.productService.getAll();
        this.filtered = [...this.products];
        for (const p of this.products) {
          if (p.photoPath && !this.photoCache.has(p.id)) {
            const url = yield this.photoService.getPhotoDataUrl(p.photoPath);
            if (url)
              this.photoCache.set(p.id, url);
          }
        }
      } finally {
        this.loading = false;
      }
    });
  }
  getPhotoUrl(p) {
    return this.photoCache.get(p.id) ?? null;
  }
  confirmDelete(p) {
    return __async(this, null, function* () {
      const alert = yield this.alertCtrl.create({
        header: "Eliminar producto",
        message: `\xBFEliminar "${p.name}"?`,
        buttons: [
          { text: "Cancelar", role: "cancel" },
          { text: "Eliminar", role: "destructive", handler: () => __async(this, null, function* () {
            yield this.productService.delete(p.id);
            yield this.load();
            const t = yield this.toastCtrl.create({ message: "Producto eliminado", duration: 2e3, color: "success", position: "bottom" });
            t.present();
          }) }
        ]
      });
      yield alert.present();
    });
  }
  static {
    this.\u0275fac = function ProductsPage_Factory(t) {
      return new (t || _ProductsPage)(\u0275\u0275directiveInject(ProductService), \u0275\u0275directiveInject(PhotoService), \u0275\u0275directiveInject(AlertController), \u0275\u0275directiveInject(ToastController));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProductsPage, selectors: [["app-products"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 14, vars: 2, consts: [["icon", ""], ["color", "primary"], ["placeholder", "Buscar producto...", "debounce", "200", 3, "ionInput"], ["slot", "fixed", 3, "ionRefresh"], ["lines", "full", 4, "ngIf"], ["class", "empty-state", "style", "display:flex;flex-direction:column;align-items:center;padding:48px 24px;text-align:center", 4, "ngIf"], ["slot", "fixed", "vertical", "bottom", "horizontal", "end"], ["routerLink", "/products/new", "color", "primary"], ["name", "add-outline"], ["lines", "full"], [4, "ngFor", "ngForOf"], ["slot", "start"], [3, "src", 4, "ngIf", "ngIfElse"], ["color", "secondary", 2, "font-size", "10px", "height", "18px"], ["side", "end"], ["color", "tertiary", 3, "routerLink"], ["slot", "icon-only", "name", "reader-outline"], ["color", "primary", 3, "routerLink"], ["slot", "icon-only", "name", "create-outline"], ["color", "danger", 3, "click"], ["slot", "icon-only", "name", "trash-outline"], [3, "src"], [1, "icon-av"], ["name", "bag-outline"], [1, "empty-state", 2, "display", "flex", "flex-direction", "column", "align-items", "center", "padding", "48px 24px", "text-align", "center"], ["name", "bag-outline", 2, "font-size", "64px", "color", "var(--ion-color-medium)", "margin-bottom", "16px"], [2, "color", "var(--ion-color-medium)"], ["routerLink", "/products/new"], ["slot", "start", "name", "add-outline"]], template: function ProductsPage_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "ion-header")(1, "ion-toolbar", 1)(2, "ion-title");
        \u0275\u0275text(3, "Productos");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(4, "ion-toolbar")(5, "ion-searchbar", 2);
        \u0275\u0275listener("ionInput", function ProductsPage_Template_ion_searchbar_ionInput_5_listener($event) {
          return ctx.onSearch($event);
        });
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(6, "ion-content")(7, "ion-refresher", 3);
        \u0275\u0275listener("ionRefresh", function ProductsPage_Template_ion_refresher_ionRefresh_7_listener($event) {
          return ctx.handleRefresh($event);
        });
        \u0275\u0275element(8, "ion-refresher-content");
        \u0275\u0275elementEnd();
        \u0275\u0275template(9, ProductsPage_ion_list_9_Template, 2, 1, "ion-list", 4)(10, ProductsPage_div_10_Template, 9, 0, "div", 5);
        \u0275\u0275elementStart(11, "ion-fab", 6)(12, "ion-fab-button", 7);
        \u0275\u0275element(13, "ion-icon", 8);
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(9);
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
      IonChip
    ], styles: ["\n\n.icon-av[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  background: var(--ion-color-light);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: var(--ion-color-medium);\n  font-size: 22px;\n}\n/*# sourceMappingURL=products.page.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProductsPage, { className: "ProductsPage", filePath: "src\\app\\pages\\products\\products.page.ts", lineNumber: 105 });
})();
export {
  ProductsPage
};
//# sourceMappingURL=chunk-CPVBWNHK.js.map
