/**
 * Migracion v7 - Correccion de catalogo de tipos de ajuste.
 * Inserta tipos faltantes para evitar errores de FK en bases ya migradas.
 */
export const V7_MIGRATION = {
  version: 7,
  statements: [
    `INSERT OR IGNORE INTO adjustment_type_catalog(code, label, accounting_treatment, is_active) VALUES
      ('VENCIMIENTO', 'Merma por vencimiento', 'COGS', 1),
      ('MERMA', 'Merma general', 'COGS', 1),
      ('ERROR_PRODUCCION', 'Error de produccion', 'COGS', 1),
      ('DESPERDICIO', 'Desperdicio operativo', 'COGS', 1),
      ('CORTESIA', 'Regalo/Cortesia', 'OPEX', 1),
      ('CONSUMO_INTERNO', 'Consumo interno', 'OPEX', 1),
      ('AJUSTE_MANUAL', 'Ajuste manual', 'OPEX', 1)`
  ],
};
