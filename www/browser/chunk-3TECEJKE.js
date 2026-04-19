import {
  addIcons,
  bagOutline,
  cashOutline,
  cubeOutline,
  gridOutline,
  layersOutline
} from "./chunk-6DYLPT4U.js";
import {
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-6GE63MYY.js";
import "./chunk-XYEOB6SJ.js";
import "./chunk-GSIZKSUC.js";
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
import "./chunk-J4B6MK7R.js";

// src/app/pages/tabs/tabs.page.ts
var TabsPage = class _TabsPage {
  constructor() {
    addIcons({ gridOutline, cubeOutline, bagOutline, layersOutline, cashOutline });
  }
  static {
    this.\u0275fac = function TabsPage_Factory(t) {
      return new (t || _TabsPage)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TabsPage, selectors: [["app-tabs"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 22, vars: 0, consts: [["slot", "bottom"], ["tab", "dashboard", "href", "/tabs/dashboard"], ["name", "grid-outline"], ["tab", "materials", "href", "/tabs/materials"], ["name", "cube-outline"], ["tab", "products", "href", "/tabs/products"], ["name", "bag-outline"], ["tab", "lots", "href", "/tabs/lots"], ["name", "layers-outline"], ["tab", "sales", "href", "/tabs/sales"], ["name", "cash-outline"]], template: function TabsPage_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "ion-tabs")(1, "ion-tab-bar", 0)(2, "ion-tab-button", 1);
        \u0275\u0275element(3, "ion-icon", 2);
        \u0275\u0275elementStart(4, "ion-label");
        \u0275\u0275text(5, "Inicio");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(6, "ion-tab-button", 3);
        \u0275\u0275element(7, "ion-icon", 4);
        \u0275\u0275elementStart(8, "ion-label");
        \u0275\u0275text(9, "Insumos");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(10, "ion-tab-button", 5);
        \u0275\u0275element(11, "ion-icon", 6);
        \u0275\u0275elementStart(12, "ion-label");
        \u0275\u0275text(13, "Productos");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(14, "ion-tab-button", 7);
        \u0275\u0275element(15, "ion-icon", 8);
        \u0275\u0275elementStart(16, "ion-label");
        \u0275\u0275text(17, "Lotes");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(18, "ion-tab-button", 9);
        \u0275\u0275element(19, "ion-icon", 10);
        \u0275\u0275elementStart(20, "ion-label");
        \u0275\u0275text(21, "Ventas");
        \u0275\u0275elementEnd()()()();
      }
    }, dependencies: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TabsPage, { className: "TabsPage", filePath: "src\\app\\pages\\tabs\\tabs.page.ts", lineNumber: 54 });
})();
export {
  TabsPage
};
//# sourceMappingURL=chunk-3TECEJKE.js.map
