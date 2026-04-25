# Calisto Móvil

Aplicación móvil híbrida para la **gestión de inventario, costos de producción y ventas** de una repostería artesanal. El proyecto está desarrollado con **Angular 17**, **Ionic 8** y **Capacitor 6**, con persistencia local en **SQLite** para Android.

## Descripción del proyecto

Calisto Móvil está orientado a controlar el flujo completo de producción y venta:

- Registro de **insumos/materiales** con stock, costo unitario y foto.
- Administración de **productos** con categoría, rendimiento y fotografía.
- Edición de **recetas/BOM** con materiales y subproductos.
- Creación de **lotes de producción** con cálculo automático de costo, precio sugerido y margen.
- Registro de **ventas** asociadas a lotes disponibles.
- Dashboard de inicio con métricas resumidas del negocio.

La aplicación arranca en una interfaz de pestañas con estas secciones principales:

- **Inicio**: resumen y métricas del negocio.
- **Insumos**: catálogo de materiales e inventario.
- **Productos**: catálogo de productos y editor de receta.
- **Lotes**: producción, cálculo de costos y detalle de cada lote.
- **Ventas**: registro y consulta de ventas.

## Tecnologías

- Angular 17
- Ionic 8
- Capacitor 6
- SQLite local con `@capacitor-community/sqlite`
- Chart.js para visualizaciones
- TypeScript y SCSS

## Requisitos previos

Antes de compilar o ejecutar el proyecto, instala lo siguiente:

- Node.js 18 LTS o superior
- npm
- Java 17 JDK
- Android Studio con SDK de Android instalado
- Variables de entorno configuradas: `JAVA_HOME` y `ANDROID_HOME`
- Un dispositivo Android físico o emulador, si vas a ejecutar la app móvil

## Instalación

1. Instala las dependencias del proyecto:

```bash
npm install
```

2. Si vas a trabajar con Android, asegúrate de tener sincronizada la plataforma:

```bash
npx cap sync android
```

## Scripts disponibles

El proyecto ya incluye scripts útiles en `package.json`:

- `npm run start`: levanta la app Angular en modo desarrollo.
- `npm run dev`: levanta Angular en `0.0.0.0:8100`, útil para pruebas en red local.
- `npm run build`: compila la aplicación.
- `npm run build:prod`: compila con configuración de producción.
- `npm run android`: ejecuta la app Android desde Ionic/Capacitor.
- `npm run android:build`: genera la compilación Android.
- `npm run android:live`: sincroniza Capacitor y ejecuta Android con live reload.
- `npm run sync`: sincroniza cambios web con Android.
- `npm run lint`: ejecuta el lint del proyecto.
- `npm run test`: ejecuta las pruebas unitarias.

## Cómo compilar el proyecto

### Compilación web

Para generar el build de producción de la app web:

```bash
npm run build:prod
```

El resultado se genera en `www/browser`, que es el directorio que usa Capacitor para empaquetar la app.

### Compilación Android

Para preparar el proyecto Android con los archivos web más recientes:

```bash
npm run build
npx cap sync android
```

Si quieres compilar el proyecto Android desde Ionic:

```bash
npm run android:build
```

## Cómo levantar el proyecto en desarrollo

### Ejecutar la app web

Para iniciar el servidor de desarrollo local:

```bash
npm run start
```

Por defecto Angular queda disponible en `http://localhost:4200`.

Si necesitas exponerlo en la red local para pruebas en un dispositivo Android, usa:

```bash
npm run dev
```

Esto levanta el servidor en `0.0.0.0:8100`.

### Ejecutar la app Android

Para correr la app en un dispositivo o emulador Android:

```bash
npm run android
```

Si quieres abrir Android Studio con el proyecto sincronizado:

```bash
npx cap open android
```

Desde Android Studio también puedes compilar, instalar y depurar la app de forma nativa.

## Cómo ejecutar con live reload

Para desarrollo móvil con recarga en caliente:

```bash
npm run android:live
```

Este flujo depende de la URL de servidor configurada en `capacitor.config.ts`.
Si cambias de red o de equipo, actualiza `server.url` con la IP correcta de tu máquina antes de probar el live reload.

## Cómo depurar

### Depuración web

1. Ejecuta la app con `npm run start` o `npm run dev`.
2. Abre el navegador y usa las DevTools para revisar consola, red y errores.
3. Si necesitas revisar problemas de compilación, usa:

```bash
npm run lint
npm run test
```

### Depuración Android

1. Sincroniza el proyecto:

```bash
npm run build
npx cap sync android
```

2. Abre Android Studio:

```bash
npx cap open android
```

3. Ejecuta la app desde Android Studio en un emulador o dispositivo físico.
4. Para depurar vistas web dentro de Android, usa Chrome DevTools con inspección remota o el inspector de WebView de Android Studio.

### Depuración con live reload

1. Levanta Angular con `npm run dev`.
2. Asegúrate de que el dispositivo Android pueda acceder a la IP configurada en `capacitor.config.ts`.
3. Ejecuta `npm run android:live`.
4. Revisa consola del navegador, logs de Android Studio y errores de Capacitor si la app no carga.

## Estructura general del proyecto

- `src/app/core`: servicios, base de datos, repositorios y modelos.
- `src/app/pages`: pantallas principales de la aplicación.
- `src/app/shared`: componentes y utilidades reutilizables.
- `src/theme`: variables visuales del tema Ionic.
- `android/`: proyecto nativo generado por Capacitor.
- `www/`: salida compilada de la aplicación web.

## Flujo funcional resumido

1. Registra insumos con su costo y stock.
2. Crea productos y define su receta.
3. Genera lotes de producción con cálculo automático de costos y margen.
4. Registra ventas desde los lotes disponibles.
5. Revisa el dashboard para consultar métricas generales.

## Notas importantes

- La base de datos se inicializa al arrancar la aplicación mediante `APP_INITIALIZER`.
- El proyecto usa SQLite en Android para persistencia local.
- Si cambias la configuración de red para live reload, revisa también `capacitor.config.ts`.
- Antes de generar una versión para dispositivo, recomienda ejecutar `npm run build:prod` y luego `npx cap sync android`.

## Soporte para Android

La configuración actual del proyecto está orientada a Android. Si necesitas abrir el proyecto en el IDE nativo:

```bash
npx cap open android
```

Desde ahí puedes ejecutar la app, revisar logs, configurar breakpoints y depurar el ciclo de vida nativo y web.
