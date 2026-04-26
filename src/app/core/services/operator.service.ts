import { Injectable } from '@angular/core';
import { DatabaseService } from '@db/database.service';

const OPERATOR_NAME_KEY = 'operator_name';
const DEFAULT_OPERATOR = 'operador';

@Injectable({ providedIn: 'root' })
export class OperatorService {
  private cachedName: string | null = null;

  constructor(private db: DatabaseService) {}

  async getName(): Promise<string> {
    if (this.cachedName !== null) return this.cachedName;
    const rows = await this.db.query<{ value: string }>(
      `SELECT value FROM operator_settings WHERE key = ?`,
      [OPERATOR_NAME_KEY]
    );
    this.cachedName = rows[0]?.value ?? DEFAULT_OPERATOR;
    return this.cachedName;
  }

  async setName(name: string): Promise<void> {
    const trimmed = name.trim() || DEFAULT_OPERATOR;
    await this.db.execute(
      `INSERT INTO operator_settings (key, value)
       VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE
         SET value = excluded.value,
             updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')`,
      [OPERATOR_NAME_KEY, trimmed]
    );
    this.cachedName = trimmed;
  }
}
