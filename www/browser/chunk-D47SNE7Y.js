import {
  MaterialService
} from "./chunk-YY2WONY4.js";
import {
  ProductService
} from "./chunk-VVRUAT4U.js";
import "./chunk-4MPWN36N.js";
import {
  GtqCurrencyPipe
} from "./chunk-FA5W7VDN.js";
import {
  addIcons,
  addOutline,
  bagOutline,
  cubeOutline,
  saveOutline,
  trashOutline
} from "./chunk-6DYLPT4U.js";
import "./chunk-DJDVLERW.js";
import "./chunk-SJAJ33WN.js";
import {
  ActivatedRoute,
  AlertController,
  CommonModule,
  FormsModule,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
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
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
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
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtextInterpolate4,
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

// src/app/pages/products/recipe-editor/recipe-editor.page.ts
function RecipeEditorPage_ion_card_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-card", 17)(1, "ion-card-content")(2, "div", 18)(3, "span");
    \u0275\u0275text(4, "Rendimiento por receta:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 18)(8, "span");
    \u0275\u0275text(9, "Costo total por receta:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "strong", 19);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "gtq");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 20)(14, "span");
    \u0275\u0275text(15, "Costo por unidad:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "strong", 21);
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "gtq");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", ctx_r0.product.yieldUnits, " unidades");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(12, 3, ctx_r0.totalCostPerBatch));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(18, 5, ctx_r0.costPerUnit));
  }
}
function RecipeEditorPage_ng_container_26_ion_select_option_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-select-option", 30);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "gtq");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r3 = ctx.$implicit;
    \u0275\u0275property("value", m_r3.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate4(" ", m_r3.name, " (", m_r3.unit, ") \u2014 ", \u0275\u0275pipeBind1(2, 5, m_r3.unitCost), "/", m_r3.unit, " ");
  }
}
function RecipeEditorPage_ng_container_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "ion-item", 22)(2, "ion-label", 23);
    \u0275\u0275text(3, "Material");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "ion-select", 24);
    \u0275\u0275twoWayListener("ngModelChange", function RecipeEditorPage_ng_container_26_Template_ion_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.newMaterialId, $event) || (ctx_r0.newMaterialId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275template(5, RecipeEditorPage_ng_container_26_ion_select_option_5_Template, 3, 7, "ion-select-option", 25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "ion-item", 26)(7, "ion-label", 23);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "ion-input", 27);
    \u0275\u0275twoWayListener("ngModelChange", function RecipeEditorPage_ng_container_26_Template_ion_input_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.newMaterialQty, $event) || (ctx_r0.newMaterialQty = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "ion-button", 28);
    \u0275\u0275listener("click", function RecipeEditorPage_ng_container_26_Template_ion_button_click_10_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.addMaterial());
    });
    \u0275\u0275element(11, "ion-icon", 29);
    \u0275\u0275text(12, " Agregar insumo ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.newMaterialId);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.availableMaterials);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Cantidad (", ctx_r0.selectedMaterialUnit, ")");
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.newMaterialQty);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r0.newMaterialId || !ctx_r0.newMaterialQty);
  }
}
function RecipeEditorPage_ng_container_27_ion_select_option_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-select-option", 30);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r5 = ctx.$implicit;
    \u0275\u0275property("value", p_r5.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", p_r5.name, " (", p_r5.category, ") ");
  }
}
function RecipeEditorPage_ng_container_27_ion_item_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-item", 22)(1, "ion-label")(2, "p");
    \u0275\u0275text(3, "Costo por unidad del subproducto:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "gtq");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 1, ctx_r0.newSubProductUnitCost));
  }
}
function RecipeEditorPage_ng_container_27_ion_item_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-item", 22)(1, "ion-note", 32);
    \u0275\u0275text(2, " Este subproducto no tiene receta definida a\xFAn \u2014 su costo ser\xE1 Q0.00 ");
    \u0275\u0275elementEnd()();
  }
}
function RecipeEditorPage_ng_container_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "ion-item", 22)(2, "ion-label", 23);
    \u0275\u0275text(3, "Subproducto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "ion-select", 31);
    \u0275\u0275twoWayListener("ngModelChange", function RecipeEditorPage_ng_container_27_Template_ion_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.newSubProductId, $event) || (ctx_r0.newSubProductId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ionChange", function RecipeEditorPage_ng_container_27_Template_ion_select_ionChange_4_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSubProductChange());
    });
    \u0275\u0275template(5, RecipeEditorPage_ng_container_27_ion_select_option_5_Template, 2, 3, "ion-select-option", 25);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(6, RecipeEditorPage_ng_container_27_ion_item_6_Template, 7, 3, "ion-item", 16)(7, RecipeEditorPage_ng_container_27_ion_item_7_Template, 3, 0, "ion-item", 16);
    \u0275\u0275elementStart(8, "ion-item", 26)(9, "ion-label", 23);
    \u0275\u0275text(10, "Cantidad (unidades)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "ion-input", 27);
    \u0275\u0275twoWayListener("ngModelChange", function RecipeEditorPage_ng_container_27_Template_ion_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.newSubProductQty, $event) || (ctx_r0.newSubProductQty = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "ion-button", 28);
    \u0275\u0275listener("click", function RecipeEditorPage_ng_container_27_Template_ion_button_click_12_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.addSubProduct());
    });
    \u0275\u0275element(13, "ion-icon", 29);
    \u0275\u0275text(14, " Agregar subproducto ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.newSubProductId);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.availableSubProducts);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.newSubProductId && ctx_r0.newSubProductUnitCost > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.newSubProductId && ctx_r0.newSubProductUnitCost === 0);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.newSubProductQty);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r0.newSubProductId || !ctx_r0.newSubProductQty);
  }
}
function RecipeEditorPage_ion_card_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-card", 33)(1, "ion-card-content");
    \u0275\u0275element(2, "ion-icon", 10);
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "Sin ingredientes. Agrega materiales o subproductos arriba.");
    \u0275\u0275elementEnd()()();
  }
}
function RecipeEditorPage_ion_list_31_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item")(1, "ion-label")(2, "h3")(3, "ion-chip", 35);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "gtq");
    \u0275\u0275elementStart(9, "strong");
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "gtq");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "ion-input", 36);
    \u0275\u0275twoWayListener("ngModelChange", function RecipeEditorPage_ion_list_31_ion_item_1_Template_ion_input_ngModelChange_12_listener($event) {
      const row_r7 = \u0275\u0275restoreView(_r6).$implicit;
      \u0275\u0275twoWayBindingSet(row_r7.quantity, $event) || (row_r7.quantity = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "ion-button", 37);
    \u0275\u0275listener("click", function RecipeEditorPage_ion_list_31_ion_item_1_Template_ion_button_click_13_listener() {
      const i_r8 = \u0275\u0275restoreView(_r6).index;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.removeRow(i_r8));
    });
    \u0275\u0275element(14, "ion-icon", 38);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r7 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275property("color", row_r7.type === "subproduct" ? "tertiary" : "primary");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r7.type === "subproduct" ? "Sub" : "Ins", " ");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r7.name, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3(" ", row_r7.quantity, " ", row_r7.unit, " \xD7 ", \u0275\u0275pipeBind1(8, 8, row_r7.unitCost), " = ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(11, 10, row_r7.quantity * row_r7.unitCost));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", row_r7.quantity);
  }
}
function RecipeEditorPage_ion_list_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list", 22);
    \u0275\u0275template(1, RecipeEditorPage_ion_list_31_ion_item_1_Template, 15, 12, "ion-item", 34);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.rows);
  }
}
var RecipeEditorPage = class _RecipeEditorPage {
  constructor(route, router, productService, materialService, toastCtrl, alertCtrl) {
    this.route = route;
    this.router = router;
    this.productService = productService;
    this.materialService = materialService;
    this.toastCtrl = toastCtrl;
    this.alertCtrl = alertCtrl;
    this.product = null;
    this.allMaterials = [];
    this.allProducts = [];
    this.rows = [];
    this.saving = false;
    this.newIngredientType = "material";
    this.newMaterialId = null;
    this.newMaterialQty = null;
    this.newSubProductId = null;
    this.newSubProductQty = null;
    this.newSubProductUnitCost = 0;
    addIcons({ addOutline, trashOutline, saveOutline, cubeOutline, bagOutline });
  }
  ngOnInit() {
    return __async(this, null, function* () {
      const id = +(this.route.snapshot.paramMap.get("id") ?? "0");
      const [product, materials, products] = yield Promise.all([
        this.productService.getWithRecipe(id),
        this.materialService.getAll(),
        this.productService.getAll()
      ]);
      if (!product) {
        this.showToast("Producto no encontrado", "danger");
        this.router.navigate(["/tabs/products"]);
        return;
      }
      this.product = product;
      this.allMaterials = materials;
      this.allProducts = products.filter((p) => p.id !== id);
      this.rows = product.recipe.map((r) => ({
        type: r.type,
        materialId: r.materialId,
        subProductId: r.subProductId,
        name: r.materialName,
        unit: r.materialUnit,
        unitCost: r.unitCost,
        quantity: r.quantity
      }));
    });
  }
  get totalCostPerBatch() {
    return this.rows.reduce((sum, r) => sum + r.quantity * r.unitCost, 0);
  }
  get costPerUnit() {
    const y = this.product?.yieldUnits ?? 0;
    return y > 0 ? this.totalCostPerBatch / y : 0;
  }
  get selectedMaterialUnit() {
    if (!this.newMaterialId)
      return "unidad";
    return this.allMaterials.find((m) => m.id === this.newMaterialId)?.unit ?? "unidad";
  }
  get availableMaterials() {
    const usedIds = new Set(this.rows.filter((r) => r.type === "material").map((r) => r.materialId));
    return this.allMaterials.filter((m) => !usedIds.has(m.id));
  }
  get availableSubProducts() {
    const usedIds = new Set(this.rows.filter((r) => r.type === "subproduct").map((r) => r.subProductId));
    return this.allProducts.filter((p) => !usedIds.has(p.id));
  }
  onSubProductChange() {
    return __async(this, null, function* () {
      if (!this.newSubProductId) {
        this.newSubProductUnitCost = 0;
        return;
      }
      const sp = yield this.productService.getWithRecipe(this.newSubProductId);
      this.newSubProductUnitCost = sp?.recipeCostPerUnit ?? 0;
    });
  }
  addMaterial() {
    if (!this.newMaterialId || !this.newMaterialQty || this.newMaterialQty <= 0) {
      this.showToast("Selecciona un material y cantidad", "warning");
      return;
    }
    const m = this.allMaterials.find((m2) => m2.id === this.newMaterialId);
    this.rows.push({
      type: "material",
      materialId: m.id,
      subProductId: null,
      name: m.name,
      unit: m.unit,
      unitCost: m.unitCost,
      quantity: this.newMaterialQty
    });
    this.newMaterialId = null;
    this.newMaterialQty = null;
  }
  addSubProduct() {
    if (!this.newSubProductId || !this.newSubProductQty || this.newSubProductQty <= 0) {
      this.showToast("Selecciona un subproducto y cantidad", "warning");
      return;
    }
    const p = this.allProducts.find((p2) => p2.id === this.newSubProductId);
    this.rows.push({
      type: "subproduct",
      materialId: null,
      subProductId: p.id,
      name: p.name,
      unit: "unidad",
      unitCost: this.newSubProductUnitCost,
      quantity: this.newSubProductQty
    });
    this.newSubProductId = null;
    this.newSubProductQty = null;
    this.newSubProductUnitCost = 0;
  }
  removeRow(index) {
    this.rows.splice(index, 1);
  }
  save() {
    return __async(this, null, function* () {
      if (!this.product)
        return;
      if (this.rows.length === 0) {
        this.showToast("Agrega al menos un ingrediente", "warning");
        return;
      }
      this.saving = true;
      try {
        yield this.productService.saveRecipe(this.product.id, this.rows.map((r) => ({
          materialId: r.materialId,
          subProductId: r.subProductId,
          quantity: r.quantity
        })));
        this.showToast("Receta guardada", "success");
        this.router.navigate(["/tabs/products"]);
      } catch (err) {
        this.showToast(err instanceof Error ? err.message : "Error al guardar receta", "danger");
      } finally {
        this.saving = false;
      }
    });
  }
  showToast(msg, color) {
    return __async(this, null, function* () {
      const t = yield this.toastCtrl.create({ message: msg, duration: 2e3, color, position: "bottom" });
      yield t.present();
    });
  }
  static {
    this.\u0275fac = function RecipeEditorPage_Factory(t) {
      return new (t || _RecipeEditorPage)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ProductService), \u0275\u0275directiveInject(MaterialService), \u0275\u0275directiveInject(ToastController), \u0275\u0275directiveInject(AlertController));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RecipeEditorPage, selectors: [["app-recipe-editor"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 32, vars: 9, consts: [["color", "primary"], ["slot", "start"], ["defaultHref", "/tabs/products"], ["slot", "end"], ["strong", "", 3, "click", "disabled"], ["slot", "start", "name", "save-outline"], [1, "ion-padding"], ["class", "cost-summary", 4, "ngIf"], [1, "ion-margin-bottom", 3, "ngModelChange", "ngModel"], ["value", "material"], ["name", "cube-outline"], ["value", "subproduct"], ["name", "bag-outline"], [4, "ngIf"], [1, "section-title"], ["class", "empty-recipe", 4, "ngIf"], ["lines", "full", 4, "ngIf"], [1, "cost-summary"], [1, "cost-row"], [1, "cost-value"], [1, "cost-row", "highlight"], [1, "cost-value-big"], ["lines", "full"], ["position", "stacked"], ["placeholder", "Seleccionar material", "interface", "action-sheet", 3, "ngModelChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], ["lines", "none"], ["type", "number", "inputmode", "decimal", "placeholder", "0.00", "min", "0.001", "step", "0.01", 3, "ngModelChange", "ngModel"], ["expand", "block", "fill", "outline", 1, "add-btn", 3, "click", "disabled"], ["slot", "start", "name", "add-outline"], [3, "value"], ["placeholder", "Seleccionar subproducto", "interface", "action-sheet", 3, "ngModelChange", "ionChange", "ngModel"], ["color", "warning"], [1, "empty-recipe"], [4, "ngFor", "ngForOf"], [2, "font-size", "10px", "height", "18px", "margin", "0 4px 0 0", 3, "color"], ["slot", "end", "type", "number", "inputmode", "decimal", "min", "0.001", "step", "0.01", 1, "qty-input", 3, "ngModelChange", "ngModel"], ["slot", "end", "fill", "clear", "color", "danger", 3, "click"], ["slot", "icon-only", "name", "trash-outline"]], template: function RecipeEditorPage_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "ion-header")(1, "ion-toolbar", 0)(2, "ion-buttons", 1);
        \u0275\u0275element(3, "ion-back-button", 2);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "ion-title");
        \u0275\u0275text(5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "ion-buttons", 3)(7, "ion-button", 4);
        \u0275\u0275listener("click", function RecipeEditorPage_Template_ion_button_click_7_listener() {
          return ctx.save();
        });
        \u0275\u0275element(8, "ion-icon", 5);
        \u0275\u0275text(9, " Guardar ");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(10, "ion-content", 6);
        \u0275\u0275template(11, RecipeEditorPage_ion_card_11_Template, 19, 7, "ion-card", 7);
        \u0275\u0275elementStart(12, "ion-card")(13, "ion-card-header")(14, "ion-card-title");
        \u0275\u0275text(15, "Agregar ingrediente");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(16, "ion-card-content")(17, "ion-segment", 8);
        \u0275\u0275twoWayListener("ngModelChange", function RecipeEditorPage_Template_ion_segment_ngModelChange_17_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.newIngredientType, $event) || (ctx.newIngredientType = $event);
          return $event;
        });
        \u0275\u0275elementStart(18, "ion-segment-button", 9);
        \u0275\u0275element(19, "ion-icon", 10);
        \u0275\u0275elementStart(20, "ion-label");
        \u0275\u0275text(21, "Insumo");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(22, "ion-segment-button", 11);
        \u0275\u0275element(23, "ion-icon", 12);
        \u0275\u0275elementStart(24, "ion-label");
        \u0275\u0275text(25, "Subproducto");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(26, RecipeEditorPage_ng_container_26_Template, 13, 5, "ng-container", 13)(27, RecipeEditorPage_ng_container_27_Template, 15, 6, "ng-container", 13);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(28, "h3", 14);
        \u0275\u0275text(29);
        \u0275\u0275elementEnd();
        \u0275\u0275template(30, RecipeEditorPage_ion_card_30_Template, 5, 0, "ion-card", 15)(31, RecipeEditorPage_ion_list_31_Template, 2, 1, "ion-list", 16);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate1("Receta: ", ctx.product == null ? null : ctx.product.name, "");
        \u0275\u0275advance(2);
        \u0275\u0275property("disabled", ctx.saving);
        \u0275\u0275advance(4);
        \u0275\u0275property("ngIf", ctx.product);
        \u0275\u0275advance(6);
        \u0275\u0275twoWayProperty("ngModel", ctx.newIngredientType);
        \u0275\u0275advance(9);
        \u0275\u0275property("ngIf", ctx.newIngredientType === "material");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.newIngredientType === "subproduct");
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1("Ingredientes (", ctx.rows.length, ")");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.rows.length === 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.rows.length > 0);
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
      IonIcon,
      IonList,
      IonCard,
      IonCardHeader,
      IonCardTitle,
      IonCardContent,
      IonNote,
      IonChip,
      IonSegment,
      IonSegmentButton,
      IonSelect,
      IonSelectOption
    ], styles: ["\n\n.cost-summary[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #1a237e 0%,\n      #283593 100%);\n  color: white;\n  border-radius: 16px;\n}\n.cost-summary[_ngcontent-%COMP%]   .cost-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 4px 0;\n  color: rgba(255, 255, 255, 0.85);\n  font-size: 0.9rem;\n}\n.cost-summary[_ngcontent-%COMP%]   .cost-row[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: white;\n}\n.cost-summary[_ngcontent-%COMP%]   .cost-row.highlight[_ngcontent-%COMP%] {\n  border-top: 1px solid rgba(255, 255, 255, 0.2);\n  margin-top: 8px;\n  padding-top: 12px;\n}\n.cost-summary[_ngcontent-%COMP%]   .cost-value[_ngcontent-%COMP%] {\n  color: #a5d6a7;\n}\n.cost-summary[_ngcontent-%COMP%]   .cost-value-big[_ngcontent-%COMP%] {\n  color: #69f0ae;\n  font-size: 1.2rem;\n}\n.add-btn[_ngcontent-%COMP%] {\n  margin-top: 12px;\n}\n.section-title[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n  font-weight: 700;\n  margin: 16px 0 4px;\n  color: var(--ion-color-dark);\n}\n.empty-recipe[_ngcontent-%COMP%]   ion-card-content[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 24px;\n}\n.empty-recipe[_ngcontent-%COMP%]   ion-card-content[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%] {\n  font-size: 48px;\n  color: var(--ion-color-medium);\n  display: block;\n  margin: 0 auto 8px;\n}\n.qty-input[_ngcontent-%COMP%] {\n  max-width: 80px;\n  text-align: right;\n  --padding-end: 0;\n}\n/*# sourceMappingURL=recipe-editor.page.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RecipeEditorPage, { className: "RecipeEditorPage", filePath: "src\\app\\pages\\products\\recipe-editor\\recipe-editor.page.ts", lineNumber: 45 });
})();
export {
  RecipeEditorPage
};
//# sourceMappingURL=chunk-D47SNE7Y.js.map
