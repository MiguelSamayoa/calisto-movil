# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start          # dev server at localhost:4200
npm run dev            # dev server at 0.0.0.0:8100 (accessible on local network)
npm run build          # web build (output: www/browser)
npm run build:prod     # production build
npm run android        # run on Android device/emulator via Capacitor
npm run android:live   # Android with live reload (requires server.url in capacitor.config.ts)
npm run sync           # npx cap sync android
npm run lint           # ESLint
npm run test           # Jest unit tests
```

For Android with live reload, the `server.url` in `capacitor.config.ts` must match your machine's current IP on the network.

## Architecture

**Stack:** Angular 17 (standalone components) · Ionic 8 (mode: `md`) · Capacitor 6 · SQLite · Chart.js

### Layers

```
src/app/
├── core/
│   ├── database/          # DatabaseService + versioned migrations
│   ├── models/            # TypeScript interfaces + DTOs per entity
│   ├── repositories/      # One repository class per entity (SQL queries)
│   └── services/          # Cross-cutting services (PhotoService, CurrencyService)
├── pages/                 # Feature pages (tabs + detail/form routes)
└── shared/
    ├── components/        # Reusable standalone components (PhotoPickerComponent)
    └── pipes/             # GtqCurrencyPipe
```

### Database

`DatabaseService` (`@db/database.service`) is the single SQLite connection wrapper. It exposes three helpers used by all repositories:

- `query<T>(sql, params)` — SELECT, returns typed rows
- `execute(sql, params)` — INSERT/UPDATE/DELETE, returns `{ lastId, changes }`
- `transaction(fn)` — wraps `fn` in BEGIN/COMMIT, handles nested calls gracefully

The database is initialized before the app boots via `APP_INITIALIZER` in `app.config.ts`.

**Migrations** live in `src/app/core/database/migrations/` as `vN.migration.ts` files. Each exports a `VN_MIGRATION = { version: N, statements: string[] }` object. `DatabaseService.runMigrations()` applies them sequentially using `PRAGMA user_version` to track the current schema version. Currently at v8. To add a new migration, create `vN.migration.ts`, import it in `database.service.ts`, and add the corresponding `if (currentVersion < VN_MIGRATION.version)` block.

**SQLite PRAGMAs** must be set via `query()` (not `execute()`), because they return result rows — using `execute()` causes SQLITE_ROW error 100.

### Repository pattern

Each entity (`material`, `product`, `recipe_item`, `production_lot`, `sale`) has its own repository in `src/app/core/repositories/`. Repositories handle raw-row-to-model mapping internally. Pages and components inject repositories directly — there is no service layer between them.

### Routing

All routes use lazy-loaded standalone components. The main shell is a tabs layout (`/tabs/*`). Detail and form pages are top-level routes outside the tabs (e.g., `materials/new`, `products/:id/recipe`, `lots/:id`).

### Photos

`PhotoService` captures images via Capacitor Camera (quality 75, JPEG, Base64) and persists them to `Capacitor.Data / calisto_photos/`. Only the relative path is stored in SQLite. Use `PhotoPickerComponent` (`app-photo-picker`) in forms — it handles loading, preview, replace, and delete.

### Currency

All monetary values are in Guatemalan Quetzales (GTQ). Use `CurrencyService` in logic and `GtqCurrencyPipe` (`| gtq`) in templates. The pipe accepts an optional `compact` boolean parameter.

### TypeScript path aliases

Configured in `tsconfig.json`:

| Alias | Resolves to |
|---|---|
| `@db/*` | `src/app/core/database/*` |
| `@models/*` | `src/app/core/models/*` |
| `@repos/*` | `src/app/core/repositories/*` |
| `@services/*` | `src/app/core/services/*` |
| `@shared/*` | `src/app/shared/*` |
| `@core/*` | `src/app/core/*` |
| `@app/*` | `src/app/*` |
| `@env/*` | `src/environments/*` |

### Key SQLite triggers (defined in v1 migration)

- `trg_deduct_stock_on_lot` — auto-decrements material stock when a production lot is inserted
- `trg_deduct_lot_units_on_sale` — decrements `remaining_units` on the lot when a sale is recorded
