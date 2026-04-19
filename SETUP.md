# Calisto — Guía de Implementación

## Requisitos previos

- Node.js >= 18 LTS
- Android Studio (con SDK 34+)
- Java 17 (JDK)
- `ANDROID_HOME` y `JAVA_HOME` configurados en variables de entorno

---

## 1. Instalación inicial

```bash
# 1. Instalar dependencias
npm install

# 2. Instalar CLI de Ionic y Capacitor globalmente
npm install -g @ionic/cli @capacitor/cli

# 3. Agregar la plataforma Android
npx cap add android

# 4. Compilar y sincronizar
npm run build
npx cap sync android
```

---

## 2. Configuración de SQLite en Android

### 2.1 Archivo `android/app/src/main/AndroidManifest.xml`

Agregar permisos necesarios dentro de `<manifest>`:

```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.CAMERA"/>
```

### 2.2 Registrar plugin SQLite en `android/app/src/main/java/.../MainActivity.java`

```java
import com.getcapacitor.community.database.sqlite.CapacitorSQLite;

// Dentro del método init():
add(CapacitorSQLite.class);
```

> Si usas la versión moderna con `@capacitor/android` v6+, el plugin se
> registra automáticamente. Verifica que en `capacitor.config.ts` el
> `appId` coincida con el package name de Android.

---

## 3. Build y ejecución en Android

```bash
# Abrir Android Studio (recomendado para primera vez)
npx cap open android

# O ejecutar directamente en dispositivo conectado:
ionic capacitor run android --livereload --external
```

---

## 4. Guía de registro masivo de productos

### Opción A — Script de seed SQL (recomendada para carga inicial)

Crea el archivo `src/assets/seed-data.sql` y ejecútalo en el
`APP_INITIALIZER` de `app.config.ts`:

```sql
-- Ejemplo: carga inicial de materiales comunes para repostería
INSERT OR IGNORE INTO materials (name, unit, unit_cost, stock) VALUES
  ('Harina de trigo', 'kg',     5.50,  10),
  ('Azúcar blanca',   'kg',     4.00,  10),
  ('Mantequilla',     'kg',    28.00,   2),
  ('Huevos',          'docena', 18.00,  3),
  ('Leche',           'L',      8.50,   5),
  ('Cacao en polvo',  'kg',    45.00,   1),
  ('Vainilla',        'mL',     0.50, 100),
  ('Polvo de hornear','g',       0.08, 500),
  ('Sal',             'g',       0.01,1000),
  ('Chocolate chips', 'g',       0.12, 300);

-- Producto de ejemplo
INSERT OR IGNORE INTO products (name, category, yield_units) VALUES
  ('Brownies de chocolate', 'Chocolates', 12),
  ('Galletas de mantequilla', 'Galletas', 24),
  ('Torta básica', 'Tortas', 8);
```

### Opción B — Formulario de carga rápida (múltiples en secuencia)

La página `MaterialFormPage` está configurada con `autofocus` en el campo
nombre y el botón **Guardar** en la toolbar superior. El flujo sugerido:

1. Tap en **+** → se abre el formulario con cursor en el nombre
2. Llenar nombre → unidad → costo (3 taps + teclado numérico)
3. Tap en **Guardar** (arriba derecha) → regresa al listado
4. Tap en **+** de nuevo → repite el ciclo

Esto permite cargar un material en ~10 segundos.

---

## 5. Flujo de trabajo recomendado

```
┌─────────────────────────────────────────────────────┐
│                   FLUJO DE USO                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. CONFIGURACIÓN INICIAL (una vez)                 │
│     Insumos → Agregar materiales con costos         │
│     Productos → Crear producto con foto             │
│     Productos → Definir receta (ingredientes)       │
│                                                     │
│  2. PRODUCCIÓN (cada vez que horneas)               │
│     Lotes → Nuevo lote → Seleccionar producto       │
│     → Ingresar cantidad → Ver cálculo automático    │
│     → Ajustar margen → Confirmar                    │
│     ↳ El stock de materiales se descuenta solo      │
│                                                     │
│  3. VENTAS (cada venta)                             │
│     Ventas → Nueva venta → Producto → Lote → Q      │
│     ↳ Se asocia al lote para tracking de ganancia   │
│                                                     │
│  4. SEGUIMIENTO                                     │
│     Inicio → Dashboard con ingresos del día/mes     │
│     Top productos · Alertas de stock bajo           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 6. Estructura de carpetas completa

```
src/
├── app/
│   ├── core/
│   │   ├── database/
│   │   │   ├── database.service.ts       ← Bootstrap SQLite + helpers
│   │   │   └── migrations/
│   │   │       └── v1.migration.ts       ← DDL completo + triggers
│   │   ├── models/
│   │   │   ├── material.model.ts
│   │   │   ├── product.model.ts
│   │   │   ├── recipe-item.model.ts
│   │   │   ├── production-lot.model.ts
│   │   │   └── sale.model.ts
│   │   ├── repositories/                 ← CRUD + queries SQL
│   │   │   ├── material.repository.ts
│   │   │   ├── product.repository.ts
│   │   │   ├── recipe-item.repository.ts
│   │   │   ├── production-lot.repository.ts
│   │   │   └── sale.repository.ts
│   │   └── services/                     ← Lógica de negocio
│   │       ├── cost-calculator.service.ts  ← Componente principal
│   │       ├── photo.service.ts
│   │       ├── currency.service.ts
│   │       ├── material.service.ts
│   │       ├── product.service.ts
│   │       └── sale.service.ts
│   ├── pages/
│   │   ├── tabs/tabs.page.ts
│   │   ├── dashboard/
│   │   │   ├── dashboard.page.ts
│   │   │   ├── dashboard.page.html
│   │   │   └── dashboard.page.scss
│   │   ├── materials/
│   │   │   ├── materials.page.ts/html/scss
│   │   │   └── material-form/
│   │   │       └── material-form.page.ts/html/scss
│   │   ├── products/
│   │   │   ├── products.page.ts/html/scss
│   │   │   ├── product-form/
│   │   │   └── recipe-editor/            ← Editor de receta con costos live
│   │   │       └── recipe-editor.page.ts/html/scss
│   │   ├── lots/
│   │   │   ├── lots.page.ts/html/scss
│   │   │   ├── lot-form/                 ← Cálculo de lote (componente clave)
│   │   │   └── lot-detail/
│   │   └── sales/
│   │       ├── sales.page.ts/html/scss
│   │       └── sale-form/
│   ├── shared/
│   │   ├── components/
│   │   │   └── photo-picker/             ← Captura de fotos reutilizable
│   │   └── pipes/
│   │       └── gtq-currency.pipe.ts      ← Formato Q1,234.50
│   ├── app.component.ts
│   ├── app.config.ts                     ← APP_INITIALIZER DB
│   └── app.routes.ts
├── theme/variables.scss                  ← Paleta de colores
├── global.scss
└── index.html
```

---

## 7. Esquema de base de datos (diagrama)

```
materials                products
─────────────────────    ─────────────────────────
id PK                    id PK
name                     name
unit (kg/g/L/...)        category
unit_cost (GTQ)          yield_units
stock                    suggested_price
photo_path               photo_path
is_active                is_active
                              │
              ┌───────────────┘
              │
         recipe_items
         ─────────────────────
         id PK
         product_id FK→products
         material_id FK→materials
         quantity
              │
              │ (1 producto → N lotes)
              ▼
    production_lots
    ─────────────────────────────────────────
    id PK
    product_id FK→products
    quantity          ← unidades producidas
    total_cost        ← calculado automático
    cost_per_unit     ← calculado automático
    selling_price     ← sugerido o manual
    profit_margin     ← porcentaje
    remaining_units   ← descontado por trigger
    produced_at
              │
              │ (1 lote → N ventas)
              ▼
         sales
         ─────────────────────────
         id PK
         lot_id FK→production_lots
         product_id FK→products
         quantity
         unit_price
         total_amount    ← calculado
         sold_at

TRIGGERS automáticos:
  • trg_deduct_stock_on_lot    → descuenta materiales al crear lote
  • trg_deduct_lot_units_on_sale → descuenta remaining_units al vender
```

---

## 8. Decisiones de arquitectura clave

| Decisión | Alternativa descartada | Razón |
|---|---|---|
| `@capacitor-community/sqlite` | Hive / Isar | JOINs nativos para dashboard, transacciones ACID en lotes |
| Standalone Components (Angular 17) | NgModules | Tree-shaking, carga lazy real por ruta |
| Triggers SQL para stock | Lógica en servicio | Atomicidad garantizada, no race conditions |
| Margen sobre precio de venta | Markup sobre costo | Más intuitivo para negocios pequeños (cómo lo reporta el SAT) |
| FIFO en ventas | Sin sugerencia | Evita lotes "olvidados" con precio desactualizado |
| Soft delete en materiales | Hard delete | Preserva integridad histórica de recetas y lotes anteriores |

---

## 9. Próximos pasos sugeridos

- [ ] Agregar exportación a CSV/PDF de reportes mensuales
- [ ] Implementar backup automático con `@capacitor/filesystem` + Google Drive
- [ ] Agregar categorías de gastos fijos (electricidad, gas) al costo del lote
- [ ] Gráfica de barras de ingresos con `chart.js` en el dashboard
- [ ] Modo oscuro completo
