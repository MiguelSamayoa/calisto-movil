import {
  ɵɵdefineInjectable,
  ɵɵdefinePipe,
  ɵɵdirectiveInject
} from "./chunk-6GE63MYY.js";

// src/app/core/services/currency.service.ts
var CurrencyService = class _CurrencyService {
  constructor() {
    this.formatter = new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    this.compactFormatter = new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      notation: "compact"
    });
  }
  format(amount) {
    if (amount == null || isNaN(amount))
      return "Q 0.00";
    return this.formatter.format(amount);
  }
  formatCompact(amount) {
    if (amount == null || isNaN(amount))
      return "Q 0";
    return this.compactFormatter.format(amount);
  }
  /** Devuelve solo el número formateado sin símbolo de moneda */
  formatNumber(amount, decimals = 2) {
    if (amount == null || isNaN(amount))
      return "0.00";
    return new Intl.NumberFormat("es-GT", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(amount);
  }
  /** Parsea un string de texto en número (maneja comas como separador de miles) */
  parse(value) {
    const cleaned = value.replace(/[Q\s,]/g, "").replace(",", ".");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  static {
    this.\u0275fac = function CurrencyService_Factory(t) {
      return new (t || _CurrencyService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CurrencyService, factory: _CurrencyService.\u0275fac, providedIn: "root" });
  }
};

// src/app/shared/pipes/gtq-currency.pipe.ts
var GtqCurrencyPipe = class _GtqCurrencyPipe {
  constructor(cs) {
    this.cs = cs;
  }
  transform(value, compact = false) {
    return compact ? this.cs.formatCompact(value) : this.cs.format(value);
  }
  static {
    this.\u0275fac = function GtqCurrencyPipe_Factory(t) {
      return new (t || _GtqCurrencyPipe)(\u0275\u0275directiveInject(CurrencyService, 16));
    };
  }
  static {
    this.\u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "gtq", type: _GtqCurrencyPipe, pure: true, standalone: true });
  }
};

export {
  GtqCurrencyPipe
};
//# sourceMappingURL=chunk-FA5W7VDN.js.map
