/**
 * Migracion v3 — El descuento de stock deja de depender de trigger SQL.
 * Ahora se realiza de forma explicita en CostCalculatorService.confirmLot()
 * con validacion previa de faltantes y transaccion atomica.
 */
export const V3_MIGRATION = {
  version: 3,
  statements: [
    `DROP TRIGGER IF EXISTS trg_deduct_stock_on_lot`,
  ],
};
