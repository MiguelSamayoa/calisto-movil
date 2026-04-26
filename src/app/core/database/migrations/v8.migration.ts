/**
 * Migracion v8 - Restaura los triggers de inmutabilidad en adjustment_audit_log.
 * Los DROP/DELETE de datos que existían aquí fueron eliminados porque se ejecutaban
 * automáticamente en cualquier instalación con user_version < 8, borrando todos
 * los datos operativos de producción en producción. Solo se conserva la restauración
 * de los triggers de inmutabilidad (operación idempotente y segura).
 */
export const V8_MIGRATION = {
  version: 8,
  statements: [
    `DROP TRIGGER IF EXISTS trg_adjustment_audit_log_no_update`,
    `DROP TRIGGER IF EXISTS trg_adjustment_audit_log_no_delete`,

    `CREATE TRIGGER IF NOT EXISTS trg_adjustment_audit_log_no_update
      BEFORE UPDATE ON adjustment_audit_log
      BEGIN
        SELECT RAISE(ABORT, 'adjustment_audit_log es inmutable');
      END`,

    `CREATE TRIGGER IF NOT EXISTS trg_adjustment_audit_log_no_delete
      BEFORE DELETE ON adjustment_audit_log
      BEGIN
        SELECT RAISE(ABORT, 'adjustment_audit_log es inmutable');
      END`,
  ],
};
