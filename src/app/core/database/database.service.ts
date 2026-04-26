import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { V1_MIGRATION } from './migrations/v1.migration';
import { V2_MIGRATION } from './migrations/v2.migration';
import { V3_MIGRATION } from './migrations/v3.migration';
import { V4_MIGRATION } from './migrations/v4.migration';
import { V5_MIGRATION } from './migrations/v5.migration';
import { V6_MIGRATION } from './migrations/v6.migration';
import { V7_MIGRATION } from './migrations/v7.migration';
import { V8_MIGRATION } from './migrations/v8.migration';
import { V9_MIGRATION } from './migrations/v9.migration';

const DB_NAME = 'calisto_db';
const DB_VERSION = 9;

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private initialized = false;

  // ─── Bootstrap ────────────────────────────────────────────────────────────

  async initialize(): Promise<void> {
    if (this.initialized) return;

    await this.initializeWebLayer();
    await this.ensureConnection();
    await this.configurePragmas();  // PRAGMAs primero (antes de migraciones)
    await this.runMigrations();

    this.initialized = true;
  }

  private async initializeWebLayer(): Promise<void> {
    if (Capacitor.getPlatform() !== 'web') return;

    await customElements.whenDefined('jeep-sqlite');
    await this.sqlite.initWebStore();
  }

  private async ensureConnection(): Promise<void> {
    const ret = await this.sqlite.checkConnectionsConsistency();
    const isConn = (await this.sqlite.isConnection(DB_NAME, false)).result;

    if (ret.result && isConn) {
      this.db = await this.sqlite.retrieveConnection(DB_NAME, false);
    } else {
      this.db = await this.sqlite.createConnection(
        DB_NAME,
        false,
        'no-encryption',
        DB_VERSION,
        false
      );
    }

    await this.db.open();
  }

  private async configurePragmas(): Promise<void> {
    // Los PRAGMAs retornan filas de resultado, por eso usamos query()
    // en vez de run() (que lanza SQLITE_ROW error 100) o execute()
    // (que envuelve en transacción, incompatible con journal_mode).
    await this.db.query('PRAGMA journal_mode = WAL;');
    await this.db.query('PRAGMA foreign_keys = ON;');
    await this.db.query('PRAGMA synchronous = NORMAL;');
    await this.db.query('PRAGMA cache_size = 10000;');
  }

  private async runMigrations(): Promise<void> {
    const result = await this.db.query('PRAGMA user_version;');
    const currentVersion: number = result.values?.[0]?.user_version ?? 0;

    if (currentVersion < V1_MIGRATION.version) {
      for (const stmt of V1_MIGRATION.statements) {
        await this.db.execute(stmt);
      }
      await this.db.execute(`PRAGMA user_version = ${V1_MIGRATION.version};`);
    }

    if (currentVersion < V2_MIGRATION.version) {
      for (const stmt of V2_MIGRATION.statements) {
        await this.db.execute(stmt);
      }
      await this.db.execute(`PRAGMA user_version = ${V2_MIGRATION.version};`);
    }

    if (currentVersion < V3_MIGRATION.version) {
      for (const stmt of V3_MIGRATION.statements) {
        await this.db.execute(stmt);
      }
      await this.db.execute(`PRAGMA user_version = ${V3_MIGRATION.version};`);
    }

    if (currentVersion < V4_MIGRATION.version) {
      for (const stmt of V4_MIGRATION.statements) {
        await this.db.execute(stmt);
      }
      await this.db.execute(`PRAGMA user_version = ${V4_MIGRATION.version};`);
    }

    if (currentVersion < V5_MIGRATION.version) {
      for (const stmt of V5_MIGRATION.statements) {
        await this.db.execute(stmt);
      }
      await this.db.execute(`PRAGMA user_version = ${V5_MIGRATION.version};`);
    }

    if (currentVersion < V6_MIGRATION.version) {
      for (const stmt of V6_MIGRATION.statements) {
        await this.db.execute(stmt);
      }
      await this.db.execute(`PRAGMA user_version = ${V6_MIGRATION.version};`);
    }

    if (currentVersion < V7_MIGRATION.version) {
      for (const stmt of V7_MIGRATION.statements) {
        await this.db.execute(stmt);
      }
      await this.db.execute(`PRAGMA user_version = ${V7_MIGRATION.version};`);
    }

    if (currentVersion < V8_MIGRATION.version) {
      for (const stmt of V8_MIGRATION.statements) {
        await this.db.execute(stmt);
      }
      await this.db.execute(`PRAGMA user_version = ${V8_MIGRATION.version};`);
    }

    if (currentVersion < V9_MIGRATION.version) {
      for (const stmt of V9_MIGRATION.statements) {
        await this.db.execute(stmt);
      }
      await this.db.execute(`PRAGMA user_version = ${V9_MIGRATION.version};`);
    }
  }

  // ─── Acceso a la conexión ─────────────────────────────────────────────────

  getDb(): SQLiteDBConnection {
    if (!this.db) throw new Error('DatabaseService no inicializado. Llama initialize() primero.');
    return this.db;
  }

  // ─── Helpers de query ─────────────────────────────────────────────────────

  async query<T = Record<string, unknown>>(
    sql: string,
    params: (string | number | null)[] = []
  ): Promise<T[]> {
    const result = await this.db.query(sql, params);
    return (result.values ?? []) as T[];
  }

  async execute(
    sql: string,
    params: (string | number | null)[] = []
  ): Promise<{ lastId: number; changes: number }> {
    // run() abre transacción implícita por defecto; la desactivamos para
    // permitir uso seguro dentro de transaction() sin nested beginTransaction.
    const result = await this.db.run(sql, params, false);
    return {
      lastId: result.changes?.lastId ?? 0,
      changes: result.changes?.changes ?? 0,
    };
  }

  async transaction<T>(fn: () => Promise<T>): Promise<T> {
    let startedHere = false;

    try {
      await this.db.beginTransaction();
      startedHere = true;
    } catch (err: unknown) {
      // Si ya existe una transacción activa, continúa sin iniciar una nueva
      const errMsg = (err instanceof Error ? err.message : String(err)).toLowerCase();
      if (!errMsg.includes('already in transaction')) {
        throw err;
      }
    }

    try {
      const result = await fn();
      if (startedHere) {
        await this.db.commitTransaction();
      }
      return result;
    } catch (error) {
      if (startedHere) {
        await this.db.rollbackTransaction();
      }
      throw error;
    }
  }
}
