# Mi Cartelera Personal

Aplicación móvil académica para buscar películas y series en TMDB y organizar una lista privada por usuario. Integra Expo, TypeScript, React Navigation, Context API, Firebase Auth, Firestore y AsyncStorage.

## Objetivo y pantallas

Registro / Login → pestañas Buscar, Mi lista, Mi año y Acerca de → Detalle y Editar entrada en una pila. La lista permite estados Por ver / Viendo / Vista, filtros, estrellas de 1 a 5 solo en Vista y comentarios de hasta 500 caracteres. Las eliminaciones requieren confirmación.

## Instalación

1. Instalar Node.js LTS e instalar Expo Go en el teléfono.
2. Abrir esta carpeta en Visual Studio Code y ejecutar `npm install`.
3. Copiar `.env.example` como `.env` y completar los valores de Firebase y el API Read Access Token de TMDB. No subir `.env` al repositorio.
4. Activar Email/Password en Firebase Authentication, crear Firestore y publicar `firestore.rules`.
5. Ejecutar `npm run dev` y escanear el QR con Expo Go, en la misma red Wi-Fi.

La guía completa y los casos de prueba se encuentran en `docs/GUIA_PASO_A_PASO.md` y `docs/PRUEBAS.md`.

## Variables necesarias

`EXPO_PUBLIC_TMDB_TOKEN`, `EXPO_PUBLIC_FIREBASE_API_KEY`, `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`, `EXPO_PUBLIC_FIREBASE_PROJECT_ID`, `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`, `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `EXPO_PUBLIC_FIREBASE_APP_ID`.

Los valores EXPO_PUBLIC se incluyen en la app. El token TMDB es visible para quien inspeccione el paquete; esto se acepta solo para el proyecto académico. Las reglas de Firestore y Firebase Auth protegen los datos privados; la configuración pública de Firebase no sustituye esas reglas. No se incluye un proxy Express, que el enunciado trata como opcional.

## Verificación

`npm run typecheck`, `npm run lint`, `npm test`, `npm run doctor`.

Las pruebas en un teléfono, las llamadas con credenciales reales y las capturas de Firebase requieren configurar las cuentas. El registro de pruebas distingue las comprobaciones ejecutadas de las pendientes. Se aprobaron 11 tests de lógica, 8 de reglas en el emulador, 20 comprobaciones de Expo y 10 escenarios de interfaz en navegador con servicios de prueba. Se generaron bundles Android, iOS y web; no se ha ejecutado la app en un dispositivo físico.

## Atribución

This product uses the TMDB API but is not endorsed or certified by TMDB.

Datos e imágenes de [TMDB](https://www.themoviedb.org/). Uso académico no comercial. Ver créditos dentro de la app.

## Proyecto 4: Mi año en cine

La pestaña **Mi año** muestra estadísticas por calendario local: películas, series, horas de cine, género, director, doce meses y obra destacada. `vistaEn` se registra al pasar a Vista, sin alterar al editar calificación/comentario. Las obras antiguas se migran cuando la pestaña se abre en línea. Los metadatos faltantes se completan desde TMDB. Sin conexión se muestra la copia local existente.

**Antes de abrir la pestaña nueva:** publicar la versión actualizada de `firestore.rules` desde Firebase Console → Firestore → Reglas. Primero verificar los permisos con el emulador y dos usuarios; las reglas que ya están publicadas no se modifican automáticamente al cambiar el archivo. No subir `.env` a GitHub; después de extraer el ZIP conservar el `.env` local que ya funciona.

**Calidad:** `npm install`, `npm run typecheck`, `npm test`, `npm run lint`, `npm run test:rules` (requiere emulador) y `npx expo start -c`. Las pruebas con Firebase real, capturas de pantalla y la columna de resultados obtenidos en `docs/VERIFICACION.md` deben completarse en el teléfono. Este paquete incluye tests `node:test` y un sensor de colores; la conversión a Vitest sigue pendiente si el docente mantiene esa exigencia.

**Documentos:** `docs/prd/`, `docs/backlog/`, `docs/diseno/`, `DESIGN.md`, `docs/specs/`, `docs/IA.md` y `docs/VERIFICACION.md`. El brand board se abre en el navegador mediante `docs/diseno/brand-board.html`.

**Git:** usar la rama `epica-mi-anio`. Registrar primero los cambios de documentación (`docs:`), luego los tests (`test:`) y finalmente implementación (`feat:`), revisando los archivos con `git diff --cached`. No publicar capturas con tokens ni claves.
