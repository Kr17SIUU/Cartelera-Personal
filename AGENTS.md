This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- This academic project explicitly requires React Navigation with native stack and bottom tabs. Keep the typed navigators in `src/navigation/` and screens in `src/screens/`.
- Do not migrate to Expo Router without changing the course requirements.
- Screens access Firebase through services and Context; do not call the SDK directly in screens.
- Preserve the per-user cache and session generation guards when changing async flows.

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md


## Proyecto 4 — Mi año en cine

### Objetivo del proyecto

Mi Cartelera Personal es una aplicación móvil desarrollada con
React Native, Expo, TypeScript y Firebase.

Permite buscar películas y series utilizando TMDB,
guardarlas en una lista personal, gestionar su estado,
calificarlas y escribir comentarios.

La nueva épica "Mi año en cine" permitirá consultar
estadísticas anuales sobre las obras vistas.

### Arquitectura del proyecto

- src/screens/: pantallas de la aplicación.
- src/components/: componentes reutilizables.
- src/navigation/: navegación con React Navigation.
- src/services/: acceso a Firebase y TMDB.
- src/context/: estado global y sesión del usuario.
- src/firebase/: inicialización y configuración de Firebase.
- src/dominio/: funciones puras de lógica de negocio.
- src/tema/: tokens del sistema de diseño.
- docs/: auditorías, PRD, backlog, specs y verificaciones.
- tests/: pruebas automatizadas existentes.

Mantener la arquitectura y estructura original del Proyecto 3.
No migrar a Expo Router.

### Reglas obligatorias

1. Nunca leer, imprimir, copiar ni publicar el contenido de .env.
2. No incluir credenciales, tokens ni secretos en commits.
3. Las pantallas no deben acceder directamente a Firebase.
4. Utilizar servicios y Context para operaciones externas.
5. No utilizar `any` injustificados en TypeScript.
6. Antes de modificar pantallas o componentes, leer DESIGN.md.
7. Los colores, espacios y tamaños deben proceder de src/tema/.
8. No introducir colores hexadecimales fuera de src/tema/.
9. Mantener una altura táctil mínima de 44 puntos.
10. Conservar la atribución correspondiente a TMDB.
11. Mantener compatibilidad con Expo Go.
12. No instalar librerías de gráficas para el resumen anual.
13. Construir las barras mensuales utilizando View.
14. No desactivar ni eliminar tests para ocultar errores.
15. No implementar funcionalidades sin su spec correspondiente.

### Desarrollo guiado por especificaciones

Seguir siempre este orden:

1. Auditoría del código existente.
2. PRD con las decisiones D1 a D13.
3. Épica, historias de usuario y criterios de aceptación.
4. Tickets y Definition of Done.
5. Spec técnica de la funcionalidad.
6. Tests automatizados.
7. Implementación del código.
8. Verificación automática y manual.
9. Documentación final.

Los commits de documentación deben preceder a los de código.
Los tests del dominio deben existir antes de implementar
las funciones que verifican.

### Lógica de dominio

La lógica de "Mi año en cine" debe implementarse en
src/dominio/resumenAnual.ts.

Las funciones de dominio deben ser puras y no depender
directamente de Firebase, AsyncStorage ni de la fecha
actual del sistema.

El año actual debe recibirse como parámetro cuando corresponda.

### Comandos de verificación

Antes de cada commit de código ejecutar:

npm test
npx tsc --noEmit

También ejecutar cuando corresponda:

npx expo lint
npx expo-doctor

Todos los tests deben aprobarse.
No ignorar errores de TypeScript.

### Uso de inteligencia artificial

La IA debe implementar cambios pequeños y verificables.

Antes de modificar código:
- Consultar la spec correspondiente.
- Revisar DESIGN.md si se modifica una pantalla.
- Explicar qué archivos se cambiarán.

Después de modificar código:
- Ejecutar las verificaciones.
- Revisar los cambios.
- Registrar los momentos importantes en docs/IA.md.

No realizar cambios de arquitectura sin justificación.
