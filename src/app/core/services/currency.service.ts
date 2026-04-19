import { Injectable } from '@angular/core';

/**
 * Servicio centralizado para formato de moneda en Quetzales guatemaltecos (GTQ).
 * Usado en pipes y componentes para consistencia visual.
 */
@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private readonly formatter = new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  private readonly compactFormatter = new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    notation: 'compact',
  });

  format(amount: number | null | undefined): string {
    if (amount == null || isNaN(amount)) return 'Q 0.00';
    return this.formatter.format(amount);
  }

  formatCompact(amount: number | null | undefined): string {
    if (amount == null || isNaN(amount)) return 'Q 0';
    return this.compactFormatter.format(amount);
  }

  /** Devuelve solo el número formateado sin símbolo de moneda */
  formatNumber(amount: number | null | undefined, decimals = 2): string {
    if (amount == null || isNaN(amount)) return '0.00';
    return new Intl.NumberFormat('es-GT', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  }

  /** Parsea un string de texto en número (maneja comas como separador de miles) */
  parse(value: string): number {
    const cleaned = value.replace(/[Q\s,]/g, '').replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
}
