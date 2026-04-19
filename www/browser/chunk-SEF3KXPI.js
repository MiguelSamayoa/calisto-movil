import {
  ProductRepository,
  ProductService,
  RecipeItemRepository
} from "./chunk-VVRUAT4U.js";
import "./chunk-4MPWN36N.js";
import {
  ProductionLotRepository
} from "./chunk-QX25LUL7.js";
import {
  GtqCurrencyPipe
} from "./chunk-FA5W7VDN.js";
import {
  addIcons,
  alertCircleOutline,
  calculatorOutline,
  checkmarkCircleOutline,
  informationCircleOutline,
  layersOutline
} from "./chunk-6DYLPT4U.js";
import "./chunk-DJDVLERW.js";
import {
  DatabaseService
} from "./chunk-SJAJ33WN.js";
import {
  AlertController,
  CommonModule,
  DecimalPipe,
  FormsModule,
  IonAccordion,
  IonAccordionGroup,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonRange,
  IonSelect,
  IonSelectOption,
  IonSpinner,
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
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpropertyInterpolate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtextInterpolate5,
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

// src/app/core/services/cost-calculator.service.ts
var CostCalculatorService = class _CostCalculatorService {
  constructor(db, productRepo, lotRepo, recipeRepo) {
    this.db = db;
    this.productRepo = productRepo;
    this.lotRepo = lotRepo;
    this.recipeRepo = recipeRepo;
  }
  /**
   * Calcula el costo completo para un lote antes de confirmarlo.
   *
   * @param productId   ID del producto a producir
   * @param quantity    Total de unidades a producir (no lotes de receta)
   * @param marginPct   Margen de ganancia deseado en porcentaje (ej. 40 = 40%)
   */
  calculateLotCost(productId, quantity, marginPct) {
    return __async(this, null, function* () {
      const product = yield this.productRepo.findById(productId);
      if (!product)
        throw new Error(`Producto #${productId} no encontrado`);
      const materialRows = yield this.db.query(`SELECT
         ri.material_id,
         m.name       AS material_name,
         m.unit,
         ri.quantity,
         m.unit_cost,
         m.stock
       FROM recipe_items ri
       JOIN materials m ON m.id = ri.material_id
       WHERE ri.product_id = ? AND ri.material_id IS NOT NULL`, [productId]);
      const subProductRows = yield this.db.query(`SELECT
         ri.sub_product_id,
         p.name AS sub_product_name,
         ri.quantity,
         CASE
           WHEN p.yield_units > 0
           THEN COALESCE(
             (SELECT SUM(ri2.quantity * m2.unit_cost)
              FROM recipe_items ri2
              JOIN materials m2 ON m2.id = ri2.material_id
              WHERE ri2.product_id = ri.sub_product_id
                AND ri2.material_id IS NOT NULL),
             0
           ) / p.yield_units
           ELSE 0
         END AS unit_cost
       FROM recipe_items ri
       JOIN products p ON p.id = ri.sub_product_id
       WHERE ri.product_id = ? AND ri.sub_product_id IS NOT NULL`, [productId]);
      if (materialRows.length === 0 && subProductRows.length === 0) {
        throw new Error(`El producto "${product.name}" no tiene ingredientes en su receta.`);
      }
      const yieldUnits = product.yieldUnits;
      const batchMultiplier = Math.ceil(quantity / yieldUnits);
      const totalUnits = batchMultiplier * yieldUnits;
      const breakdown = [
        ...materialRows.map((row) => {
          const quantityNeeded = row.quantity * batchMultiplier;
          return {
            materialId: row.material_id,
            materialName: row.material_name,
            unit: row.unit,
            quantityNeeded,
            unitCost: row.unit_cost,
            subtotal: quantityNeeded * row.unit_cost
          };
        }),
        ...subProductRows.map((row) => {
          const quantityNeeded = row.quantity * batchMultiplier;
          return {
            materialId: 0,
            // placeholder, es un subproducto
            materialName: `[Subproducto] ${row.sub_product_name}`,
            unit: "unidad",
            quantityNeeded,
            unitCost: row.unit_cost,
            subtotal: quantityNeeded * row.unit_cost
          };
        })
      ];
      const recipeCostPerBatch = materialRows.reduce((sum, r) => sum + r.quantity * r.unit_cost, 0) + subProductRows.reduce((sum, r) => sum + r.quantity * r.unit_cost, 0);
      const totalMaterialsCost = breakdown.reduce((sum, b) => sum + b.subtotal, 0);
      const costPerUnit = totalUnits > 0 ? totalMaterialsCost / totalUnits : 0;
      const suggestedPrice = marginPct < 100 ? costPerUnit / (1 - marginPct / 100) : costPerUnit * 2;
      const stockWarnings = materialRows.filter((row) => row.stock < row.quantity * batchMultiplier).map((row) => ({
        materialId: row.material_id,
        materialName: row.material_name,
        available: row.stock,
        needed: row.quantity * batchMultiplier,
        deficit: row.quantity * batchMultiplier - row.stock
      }));
      return {
        productId,
        productName: product.name,
        yieldUnits,
        batchMultiplier,
        totalUnits,
        recipeCostPerBatch,
        totalMaterialsCost,
        costPerUnit,
        desiredMarginPct: marginPct,
        suggestedPrice,
        breakdown,
        stockWarnings
      };
    });
  }
  /**
   * Confirma la creación del lote: guarda en DB y dispara los triggers
   * que descuentan el stock de materiales automáticamente.
   */
  confirmLot(dto, calculation) {
    return __async(this, null, function* () {
      return this.lotRepo.create(dto, calculation.totalMaterialsCost, calculation.costPerUnit);
    });
  }
  /**
   * Devuelve el precio de venta sugerido dado un costo unitario y margen.
   * Margen sobre precio de venta (markup sobre costo, no sobre precio).
   */
  suggestSellingPrice(costPerUnit, marginPct) {
    if (marginPct >= 100 || marginPct < 0)
      return costPerUnit * 2;
    return costPerUnit / (1 - marginPct / 100);
  }
  /**
   * Calcula el margen real dado costo y precio de venta.
   */
  calculateActualMargin(costPerUnit, sellingPrice) {
    if (sellingPrice <= 0)
      return 0;
    return (sellingPrice - costPerUnit) / sellingPrice * 100;
  }
  /**
   * Formatea un número como moneda en Quetzales guatemaltecos.
   */
  formatGTQ(amount) {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
      minimumFractionDigits: 2
    }).format(amount);
  }
  static {
    this.\u0275fac = function CostCalculatorService_Factory(t) {
      return new (t || _CostCalculatorService)(\u0275\u0275inject(DatabaseService), \u0275\u0275inject(ProductRepository), \u0275\u0275inject(ProductionLotRepository), \u0275\u0275inject(RecipeItemRepository));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CostCalculatorService, factory: _CostCalculatorService.\u0275fac, providedIn: "root" });
  }
};

// src/app/pages/lots/lot-form/lot-form.page.ts
function LotFormPage_ion_select_option_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-select-option", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r1 = ctx.$implicit;
    \u0275\u0275property("value", p_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", p_r1.name, " (rinde ", p_r1.yieldUnits, " u.) ");
  }
}
function LotFormPage_div_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275element(1, "ion-spinner", 16);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Calculando costos...");
    \u0275\u0275elementEnd()();
  }
}
function LotFormPage_ion_card_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-card", 17)(1, "ion-card-content");
    \u0275\u0275element(2, "ion-icon", 18);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.calcError, " ");
  }
}
function LotFormPage_ng_container_25_ion_card_1_li_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "number");
    \u0275\u0275pipe(3, "number");
    \u0275\u0275pipe(4, "number");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const w_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate5(" ", w_r4.materialName, ": necesitas ", \u0275\u0275pipeBind2(2, 5, w_r4.needed, "1.2-2"), " ", " ", "pero tienes ", \u0275\u0275pipeBind2(3, 8, w_r4.available, "1.2-2"), " (d\xE9ficit: ", \u0275\u0275pipeBind2(4, 11, w_r4.deficit, "1.2-2"), ") ");
  }
}
function LotFormPage_ng_container_25_ion_card_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-card", 49)(1, "ion-card-content")(2, "strong");
    \u0275\u0275text(3, "Advertencia de stock:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "ul");
    \u0275\u0275template(5, LotFormPage_ng_container_25_ion_card_1_li_5_Template, 5, 14, "li", 45);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngForOf", ctx_r1.calculation.stockWarnings);
  }
}
function LotFormPage_ng_container_25_ion_item_59_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item", 8)(1, "ion-label", 5);
    \u0275\u0275text(2, " Precio de venta personalizado (Q) ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ion-input", 50);
    \u0275\u0275pipe(4, "number");
    \u0275\u0275twoWayListener("ngModelChange", function LotFormPage_ng_container_25_ion_item_59_Template_ion_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.customSellingPrice, $event) || (ctx_r1.customSellingPrice = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275propertyInterpolate("placeholder", \u0275\u0275pipeBind2(4, 2, ctx_r1.calculation.suggestedPrice, "1.2-2"));
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.customSellingPrice);
  }
}
function LotFormPage_ng_container_25_ion_item_92_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-item")(1, "ion-label")(2, "h3");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "number");
    \u0275\u0275pipe(7, "gtq");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "ion-note", 29);
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "gtq");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const b_r6 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(b_r6.materialName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3(" ", \u0275\u0275pipeBind2(6, 5, b_r6.quantityNeeded, "1.3-3"), " ", b_r6.unit, " \xD7 ", \u0275\u0275pipeBind1(7, 8, b_r6.unitCost), " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(10, 10, b_r6.subtotal));
  }
}
function LotFormPage_ng_container_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, LotFormPage_ng_container_25_ion_card_1_Template, 6, 1, "ion-card", 19);
    \u0275\u0275elementStart(2, "ion-card", 20)(3, "ion-card-content")(4, "div", 21)(5, "span");
    \u0275\u0275text(6, "Producto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "strong");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 21)(10, "span");
    \u0275\u0275text(11, "Unidades a producir");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "strong");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 21)(15, "span");
    \u0275\u0275text(16, "Lotes de receta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "strong");
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 22)(20, "span");
    \u0275\u0275text(21, "Costo total materiales");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "strong");
    \u0275\u0275text(23);
    \u0275\u0275pipe(24, "gtq");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 23)(26, "span");
    \u0275\u0275text(27, "Costo por unidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "strong", 24);
    \u0275\u0275text(29);
    \u0275\u0275pipe(30, "gtq");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(31, "ion-card")(32, "ion-card-header")(33, "ion-card-title");
    \u0275\u0275text(34, "2. Margen de ganancia");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "ion-card-content")(36, "div", 25)(37, "span", 26);
    \u0275\u0275text(38);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "span", 27);
    \u0275\u0275text(40, "margen sobre precio de venta");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "ion-range", 28);
    \u0275\u0275twoWayListener("ngModelChange", function LotFormPage_ng_container_25_Template_ion_range_ngModelChange_41_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.marginPct, $event) || (ctx_r1.marginPct = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function LotFormPage_ng_container_25_Template_ion_range_ngModelChange_41_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onInputChange());
    });
    \u0275\u0275elementStart(42, "ion-label", 1);
    \u0275\u0275text(43, "0%");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "ion-label", 29);
    \u0275\u0275text(45, "80%");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "div", 30)(47, "div", 31);
    \u0275\u0275text(48, "Precio sugerido de venta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "div", 32);
    \u0275\u0275text(50);
    \u0275\u0275pipe(51, "gtq");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "div", 33);
    \u0275\u0275text(53, "por unidad");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(54, "ion-item", 34)(55, "ion-label");
    \u0275\u0275text(56, "Usar precio personalizado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "ion-button", 35);
    \u0275\u0275listener("click", function LotFormPage_ng_container_25_Template_ion_button_click_57_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.useCustomPrice = !ctx_r1.useCustomPrice);
    });
    \u0275\u0275text(58);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(59, LotFormPage_ng_container_25_ion_item_59_Template, 5, 5, "ion-item", 36);
    \u0275\u0275elementStart(60, "div", 37)(61, "div", 38)(62, "span");
    \u0275\u0275text(63, "Precio de venta final:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "strong", 39);
    \u0275\u0275text(65);
    \u0275\u0275pipe(66, "gtq");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(67, "div", 38)(68, "span");
    \u0275\u0275text(69, "Margen real:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(70, "strong");
    \u0275\u0275text(71);
    \u0275\u0275pipe(72, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(73, "div", 38)(74, "span");
    \u0275\u0275text(75, "Ganancia por unidad:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(76, "strong");
    \u0275\u0275text(77);
    \u0275\u0275pipe(78, "gtq");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(79, "div", 38)(80, "span");
    \u0275\u0275text(81, "Ganancia total del lote:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(82, "strong", 40);
    \u0275\u0275text(83);
    \u0275\u0275pipe(84, "gtq");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(85, "ion-accordion-group")(86, "ion-accordion", 41)(87, "ion-item", 42);
    \u0275\u0275element(88, "ion-icon", 43);
    \u0275\u0275elementStart(89, "ion-label");
    \u0275\u0275text(90, "Ver desglose de materiales");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(91, "ion-list", 44);
    \u0275\u0275template(92, LotFormPage_ng_container_25_ion_item_92_Template, 11, 12, "ion-item", 45);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(93, "ion-card")(94, "ion-card-header")(95, "ion-card-title");
    \u0275\u0275text(96, "3. Confirmar lote");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(97, "ion-card-content")(98, "ion-item", 8)(99, "ion-label", 5);
    \u0275\u0275text(100, "Notas (opcional)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(101, "ion-textarea", 46);
    \u0275\u0275twoWayListener("ngModelChange", function LotFormPage_ng_container_25_Template_ion_textarea_ngModelChange_101_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.notes, $event) || (ctx_r1.notes = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(102, "ion-button", 47);
    \u0275\u0275listener("click", function LotFormPage_ng_container_25_Template_ion_button_click_102_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.confirmLot());
    });
    \u0275\u0275element(103, "ion-icon", 48);
    \u0275\u0275text(104);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.hasStockWarnings);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r1.calculation.productName);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.calculation.totalUnits);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("\xD7 ", ctx_r1.calculation.batchMultiplier, "");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(24, 25, ctx_r1.calculation.totalMaterialsCost));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(30, 27, ctx_r1.calculation.costPerUnit));
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate1("", ctx_r1.marginPct, "%");
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.marginPct);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(51, 29, ctx_r1.calculation.suggestedPrice));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1(" ", ctx_r1.useCustomPrice ? "Cancelar" : "Cambiar", " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.useCustomPrice);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(66, 31, ctx_r1.finalSellingPrice));
    \u0275\u0275advance(5);
    \u0275\u0275classProp("margin-good", ctx_r1.actualMargin >= 30)("margin-ok", ctx_r1.actualMargin >= 15 && ctx_r1.actualMargin < 30)("margin-bad", ctx_r1.actualMargin < 15);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(72, 33, ctx_r1.actualMargin, "1.1-1"), "%");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(78, 36, ctx_r1.finalSellingPrice - ctx_r1.calculation.costPerUnit));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(84, 38, (ctx_r1.finalSellingPrice - ctx_r1.calculation.costPerUnit) * ctx_r1.calculation.totalUnits), " ");
    \u0275\u0275advance(9);
    \u0275\u0275property("ngForOf", ctx_r1.calculation.breakdown);
    \u0275\u0275advance(9);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.notes);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.saving || !ctx_r1.calculation);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Crear lote \u2014 ", ctx_r1.calculation.totalUnits, " unidades ");
  }
}
var LotFormPage = class _LotFormPage {
  constructor(router, productService, calculator, toastCtrl, loadingCtrl, alertCtrl) {
    this.router = router;
    this.productService = productService;
    this.calculator = calculator;
    this.toastCtrl = toastCtrl;
    this.loadingCtrl = loadingCtrl;
    this.alertCtrl = alertCtrl;
    this.products = [];
    this.selectedProductId = null;
    this.quantity = null;
    this.marginPct = 40;
    this.customSellingPrice = null;
    this.useCustomPrice = false;
    this.notes = "";
    this.calculation = null;
    this.calculating = false;
    this.saving = false;
    this.calcError = "";
    addIcons({
      calculatorOutline,
      checkmarkCircleOutline,
      alertCircleOutline,
      layersOutline,
      informationCircleOutline
    });
  }
  ngOnInit() {
    return __async(this, null, function* () {
      this.products = yield this.productService.getAll();
    });
  }
  // ─── Cálculo reactivo ──────────────────────────────────────────────────────
  onInputChange() {
    clearTimeout(this.calcTimer);
    this.calculation = null;
    this.calcError = "";
    if (!this.selectedProductId || !this.quantity || this.quantity <= 0)
      return;
    this.calcTimer = setTimeout(() => this.calculate(), 400);
  }
  calculate() {
    return __async(this, null, function* () {
      if (!this.selectedProductId || !this.quantity)
        return;
      this.calculating = true;
      this.calcError = "";
      try {
        this.calculation = yield this.calculator.calculateLotCost(this.selectedProductId, this.quantity, this.marginPct);
        if (!this.useCustomPrice) {
          this.customSellingPrice = this.calculation.suggestedPrice;
        }
      } catch (err) {
        this.calcError = err instanceof Error ? err.message : "Error en el c\xE1lculo";
        this.calculation = null;
      } finally {
        this.calculating = false;
      }
    });
  }
  get finalSellingPrice() {
    if (this.useCustomPrice && this.customSellingPrice) {
      return this.customSellingPrice;
    }
    return this.calculation?.suggestedPrice ?? 0;
  }
  get actualMargin() {
    if (!this.calculation)
      return 0;
    return this.calculator.calculateActualMargin(this.calculation.costPerUnit, this.finalSellingPrice);
  }
  get hasStockWarnings() {
    return (this.calculation?.stockWarnings?.length ?? 0) > 0;
  }
  // ─── Confirmar lote ───────────────────────────────────────────────────────
  confirmLot() {
    return __async(this, null, function* () {
      if (!this.calculation || !this.selectedProductId || !this.quantity)
        return;
      if (this.hasStockWarnings) {
        const alert = yield this.alertCtrl.create({
          header: "Advertencia de stock",
          message: "\xBFConfirmar de todas formas? El stock de algunos materiales ser\xE1 negativo.",
          buttons: [
            { text: "Cancelar", role: "cancel" },
            { text: "Confirmar igual", handler: () => this.saveLot() }
          ]
        });
        yield alert.present();
      } else {
        yield this.saveLot();
      }
    });
  }
  saveLot() {
    return __async(this, null, function* () {
      if (!this.calculation)
        return;
      const loading = yield this.loadingCtrl.create({ message: "Creando lote..." });
      yield loading.present();
      this.saving = true;
      try {
        const dto = {
          productId: this.calculation.productId,
          quantity: this.calculation.totalUnits,
          sellingPrice: this.finalSellingPrice,
          profitMargin: this.actualMargin,
          notes: this.notes || void 0
        };
        yield this.calculator.confirmLot(dto, this.calculation);
        this.showToast(`Lote de ${this.calculation.totalUnits} unidades creado`, "success");
        this.router.navigate(["/tabs/lots"]);
      } catch (err) {
        this.showToast(err instanceof Error ? err.message : "Error al crear lote", "danger");
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
    this.\u0275fac = function LotFormPage_Factory(t) {
      return new (t || _LotFormPage)(\u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ProductService), \u0275\u0275directiveInject(CostCalculatorService), \u0275\u0275directiveInject(ToastController), \u0275\u0275directiveInject(LoadingController), \u0275\u0275directiveInject(AlertController));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LotFormPage, selectors: [["app-lot-form"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 26, vars: 6, consts: [["color", "primary"], ["slot", "start"], ["defaultHref", "/tabs/lots"], [1, "ion-padding"], ["lines", "full"], ["position", "stacked"], ["placeholder", "Seleccionar producto", "interface", "action-sheet", 3, "ngModelChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], ["lines", "none"], ["type", "number", "inputmode", "numeric", "placeholder", "Ej. 24", "min", "1", "step", "1", 3, "ngModelChange", "ngModel"], ["slot", "helper"], ["class", "calculating-state", 4, "ngIf"], ["color", "danger", "class", "error-card", 4, "ngIf"], [4, "ngIf"], [3, "value"], [1, "calculating-state"], ["name", "crescent", "color", "primary"], ["color", "danger", 1, "error-card"], ["name", "alert-circle-outline"], ["color", "warning", "class", "warning-card", 4, "ngIf"], [1, "cost-card"], [1, "cost-row"], [1, "cost-row", "divider"], [1, "cost-row", "highlight"], [1, "cost-per-unit"], [1, "margin-display"], [1, "margin-value"], [1, "margin-label"], ["min", "0", "max", "80", "step", "5", "snaps", "true", "ticks", "true", "color", "primary", 3, "ngModelChange", "ngModel"], ["slot", "end"], [1, "suggested-price-box"], [1, "suggested-label"], [1, "suggested-value"], [1, "suggested-sublabel"], ["lines", "none", 1, "custom-price-toggle"], ["slot", "end", "fill", "outline", "size", "small", 3, "click"], ["lines", "none", 4, "ngIf"], [1, "price-summary"], [1, "price-row"], [1, "price-final"], [1, "price-total-profit"], ["value", "breakdown"], ["slot", "header", "color", "light"], ["slot", "start", "name", "information-circle-outline"], ["slot", "content", "lines", "full"], [4, "ngFor", "ngForOf"], ["placeholder", "Ej. Lote para evento del s\xE1bado...", "rows", "2", "autoGrow", "", 3, "ngModelChange", "ngModel"], ["expand", "block", "color", "success", 1, "confirm-btn", 3, "click", "disabled"], ["slot", "start", "name", "checkmark-circle-outline"], ["color", "warning", 1, "warning-card"], ["type", "number", "inputmode", "decimal", "min", "0", "step", "0.01", 3, "ngModelChange", "ngModel", "placeholder"]], template: function LotFormPage_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "ion-header")(1, "ion-toolbar", 0)(2, "ion-buttons", 1);
        \u0275\u0275element(3, "ion-back-button", 2);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "ion-title");
        \u0275\u0275text(5, "Nuevo lote de producci\xF3n");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(6, "ion-content", 3)(7, "ion-card")(8, "ion-card-header")(9, "ion-card-title");
        \u0275\u0275text(10, "1. \xBFQu\xE9 vas a producir?");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(11, "ion-card-content")(12, "ion-item", 4)(13, "ion-label", 5);
        \u0275\u0275text(14, "Producto *");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "ion-select", 6);
        \u0275\u0275twoWayListener("ngModelChange", function LotFormPage_Template_ion_select_ngModelChange_15_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.selectedProductId, $event) || (ctx.selectedProductId = $event);
          return $event;
        });
        \u0275\u0275listener("ngModelChange", function LotFormPage_Template_ion_select_ngModelChange_15_listener() {
          return ctx.onInputChange();
        });
        \u0275\u0275template(16, LotFormPage_ion_select_option_16_Template, 2, 3, "ion-select-option", 7);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(17, "ion-item", 8)(18, "ion-label", 5);
        \u0275\u0275text(19, "Unidades a producir *");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(20, "ion-input", 9);
        \u0275\u0275twoWayListener("ngModelChange", function LotFormPage_Template_ion_input_ngModelChange_20_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.quantity, $event) || (ctx.quantity = $event);
          return $event;
        });
        \u0275\u0275listener("ngModelChange", function LotFormPage_Template_ion_input_ngModelChange_20_listener() {
          return ctx.onInputChange();
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(21, "ion-note", 10);
        \u0275\u0275text(22, " N\xFAmero total de unidades finales ");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275template(23, LotFormPage_div_23_Template, 4, 0, "div", 11)(24, LotFormPage_ion_card_24_Template, 4, 1, "ion-card", 12)(25, LotFormPage_ng_container_25_Template, 105, 40, "ng-container", 13);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(15);
        \u0275\u0275twoWayProperty("ngModel", ctx.selectedProductId);
        \u0275\u0275advance();
        \u0275\u0275property("ngForOf", ctx.products);
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.quantity);
        \u0275\u0275advance(3);
        \u0275\u0275property("ngIf", ctx.calculating);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.calcError);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.calculation);
      }
    }, dependencies: [
      CommonModule,
      NgForOf,
      NgIf,
      DecimalPipe,
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
      IonIcon,
      IonCard,
      IonCardHeader,
      IonCardTitle,
      IonCardContent,
      IonNote,
      IonRange,
      IonAccordion,
      IonAccordionGroup,
      IonList,
      IonTextarea,
      IonSpinner
    ], styles: ["\n\nion-card[_ngcontent-%COMP%] {\n  border-radius: 16px;\n  margin-bottom: 12px;\n}\n.calculating-state[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  justify-content: center;\n  padding: 24px;\n  color: var(--ion-color-medium);\n}\n.error-card[_ngcontent-%COMP%]   ion-card-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.error-card[_ngcontent-%COMP%]   ion-card-content[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%] {\n  font-size: 20px;\n}\n.cost-card[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #1a237e 0%,\n      #283593 100%);\n  color: white;\n}\n.cost-card[_ngcontent-%COMP%]   .cost-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 4px 0;\n  color: rgba(255, 255, 255, 0.8);\n  font-size: 0.9rem;\n}\n.cost-card[_ngcontent-%COMP%]   .cost-row[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: white;\n}\n.cost-card[_ngcontent-%COMP%]   .cost-row.divider[_ngcontent-%COMP%] {\n  border-top: 1px solid rgba(255, 255, 255, 0.2);\n  margin-top: 8px;\n  padding-top: 8px;\n}\n.cost-card[_ngcontent-%COMP%]   .cost-row.highlight[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #69f0ae;\n}\n.cost-card[_ngcontent-%COMP%]   .cost-per-unit[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n}\n.margin-display[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 8px;\n}\n.margin-display[_ngcontent-%COMP%]   .margin-value[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 2.5rem;\n  font-weight: 700;\n  color: var(--ion-color-primary);\n}\n.margin-display[_ngcontent-%COMP%]   .margin-label[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: var(--ion-color-medium);\n}\n.suggested-price-box[_ngcontent-%COMP%] {\n  background: var(--ion-color-light);\n  border-radius: 12px;\n  padding: 16px;\n  text-align: center;\n  margin: 12px 0;\n}\n.suggested-price-box[_ngcontent-%COMP%]   .suggested-label[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: var(--ion-color-medium);\n}\n.suggested-price-box[_ngcontent-%COMP%]   .suggested-value[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  font-weight: 700;\n  color: var(--ion-color-success);\n}\n.suggested-price-box[_ngcontent-%COMP%]   .suggested-sublabel[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  color: var(--ion-color-medium);\n}\n.price-summary[_ngcontent-%COMP%] {\n  border-top: 1px solid var(--ion-color-light);\n  margin-top: 12px;\n  padding-top: 12px;\n}\n.price-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 4px 0;\n  font-size: 0.9rem;\n}\n.price-final[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  color: var(--ion-color-primary);\n}\n.price-total-profit[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  color: var(--ion-color-success);\n}\n.margin-good[_ngcontent-%COMP%] {\n  color: #388e3c;\n}\n.margin-ok[_ngcontent-%COMP%] {\n  color: #f57c00;\n}\n.margin-bad[_ngcontent-%COMP%] {\n  color: #d32f2f;\n}\n.warning-card[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  margin: 8px 0 0;\n  padding-left: 16px;\n}\n.confirm-btn[_ngcontent-%COMP%] {\n  margin-top: 16px;\n  height: 52px;\n  font-size: 1rem;\n}\n/*# sourceMappingURL=lot-form.page.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LotFormPage, { className: "LotFormPage", filePath: "src\\app\\pages\\lots\\lot-form\\lot-form.page.ts", lineNumber: 43 });
})();
export {
  LotFormPage
};
//# sourceMappingURL=chunk-SEF3KXPI.js.map
