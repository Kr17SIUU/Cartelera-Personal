# Auditoría inicial — Mi Cartelera Personal

Fecha: 22 de noviembre de 2026  
Rama de trabajo prevista: `epica-mi-anio`

## Alcance y evidencia

Revisión estática del ZIP proporcionado, contrastado con la consigna del Proyecto 4 «Mi año en cine». Se revisaron `package.json`, `AGENTS.md`, tipos, servicios, contexto, navegación, reglas de Firestore, pruebas y diseño existente. **No se ejecutaron pruebas ni se verificó Firebase o Expo Go**: el ZIP no incluye `node_modules`, `.env` ni historial `.git`.

No aparece `SPEC.md` ni el documento de RF1–RF10 del Proyecto 3. Por ello esta es una auditoría preliminar respecto de la consigna nueva; la comparación histórica exigida por el docente queda pendiente de conseguir esos documentos.

## Hallazgos

| ID | Hallazgo | Evidencia (archivo y función o sección) | Gravedad | Decisión |
| --- | --- | --- | --- | --- |
| A-01 | La app aún no dispone de la pestaña «Mi año en cine». | `src/navigation/AppNavigation.tsx`, `InicioTabs`; `src/navigation/types.ts` | Alta | Corregir ahora, después de PRD/spec/diseño/tests |
| A-02 | `ItemLista` carece de `vistaEn`, `generos`, `duracionMin`, `directores`. | `src/types/index.ts`, `ItemLista` | Alta | Corregir ahora, después de spec |
| A-03 | Marcar una obra como vista no guarda `vistaEn`; regresar a otro estado no lo borra. | `src/services/listaService.ts`, `actualizar` | Alta | Corregir ahora, después de spec y tests |
| A-04 | No se persisten géneros, duración ni directores en el alta; el detalle TMDB tampoco proporciona directores. | `src/services/listaService.ts`, `agregar`; `src/services/tmdbService.ts`, `obtenerDetalle` | Alta | Corregir ahora, después de spec |
| A-05 | Las reglas de Firestore solo permiten diez campos y restringen los campos modificables: los nuevos serían rechazados. | `firestore.rules`, `valido`, `allow create`, `allow update` | Alta | Corregir ahora y probar con emulador antes de publicar |
| A-06 | Falta migración persistente de fechas y enriquecimiento por TMDB de obras antiguas. | `src/services/listaService.ts`; `src/context/CarteleraContext.tsx` | Alta | Corregir ahora, después de spec |
| A-07 | No existen `resumenAnual`, `aniosDisponibles` ni tests específicos de decisiones D1–D13. | Ausencia de `src/dominio/`; `tests/` | Alta | Corregir ahora, tests antes de implementación |
| A-08 | Los tests existentes usan `node:test`, no Vitest; `npm test` no cubre aún el dominio nuevo. | `package.json`, script `test`; `tests/validation.test.ts` | Media | Corregir ahora como parte del harness |
| A-09 | `AGENTS.md` existe pero no obliga a leer `DESIGN.md`; faltan `CLAUDE.md`, skill `/commit` y hook Prettier. | `AGENTS.md`; ausencia de archivos de harness | Media | Corregir ahora en Hito 1 y Hito 2 |
| A-10 | La paleta actual vive en `src/theme` y no hay `DESIGN.md`, `brand-board.html` ni `src/tema/`. | `src/theme/index.ts`; ausencia de artefactos | Media | Corregir en Hitos 2–4, respetando el orden |
| A-11 | El ZIP no contiene `.git`, etiqueta `p3-final` ni historial de commits verificable. | Contenido de la raíz del ZIP | Alta para la entrega | Corregir ahora en el repositorio Git original; no se puede reconstruir un historial auténtico desde este ZIP |
| A-12 | No se incluyeron `SPEC.md` ni RF1–RF10 originales, necesarios para la auditoría retrospectiva. | Archivos del ZIP | Media | Riesgo conocido hasta recuperar la especificación original |
| A-13 | El archivo `firebase/config.ts` ya lee las variables de entorno; no contiene un proyecto Firebase fijo que deba sustituirse. | `src/firebase/config.ts`, `firebaseConfig` | Informativa | Conservar; configurar Firebase propio en `.env` |
| A-14 | Hay caché por usuario y separación pantallas/servicios que conviene preservar. | `src/services/cacheService.ts`, `src/context/CarteleraContext.tsx`, `src/services/listaService.ts` | Informativa | Conservar comportamiento existente y verificar regresiones |

## Plan de resolución por orden de la consigna

1. Etiquetar el último commit del Proyecto 3 como `p3-final` y crear la rama `epica-mi-anio` en el repositorio **original**.
2. Revisar y completar esta auditoría contra `SPEC.md` y RF1–RF10 (si están disponibles).
3. Completar `AGENTS.md`, `CLAUDE.md`, skill `/commit`, hook Prettier y primer test Vitest.
4. Redactar PRD D1–D13, backlog, criterios, brief, brand board y `DESIGN.md`.
5. Redactar spec; guardar primero tests fallidos del dominio; luego implementar lógica pura.
6. Implementar persistencia, migraciones y reglas de Firestore; verificar aislamiento con dos usuarios.
7. Implementar tokens e interfaz; documentar verificación en teléfono, auditoría final, IA y demo.

## Estado inicial de verificación

| Comprobación | Resultado |
| --- | --- |
| Inspección estática de los archivos principales | Realizada |
| `npm test` | Pendiente; no ejecutado |
| `npx tsc --noEmit` | Pendiente; no ejecutado |
| Reglas publicadas en Firebase propio | Pendiente |
| Pruebas en Expo Go | Pendiente |
| Comparación con `SPEC.md` y RF1–RF10 | Bloqueada: archivos no presentes |
| Historial `git log`, etiqueta y rama | Pendiente en repositorio original |

## Cierre final

Pendiente del Hito 4: registrar fecha, hallazgos resueltos, riesgos remanentes, hallazgos nuevos y resultados reales de las verificaciones.

## Actualización de desarrollo — 24 de noviembre de 2026

Se prepararon en una copia de trabajo: pantalla `MiAnioScreen`, navegación, dominio puro, datos de TMDB, migraciones, tokens, brand board, `DESIGN.md`, spec, tests y nuevas reglas. Los hallazgos A-01 a A-07 y A-10 tienen **código de corrección propuesto**, pero no se consideran cerrados hasta ejecutar el proyecto en Expo Go, comprobar reglas y publicar los cambios. A-08 sigue parcialmente abierto por falta de Vitest. A-11 y A-12 requieren historial de Git y especificación original, respectivamente.

**Verificaciones ejecutadas en esta copia:** análisis sintáctico de 34 archivos TS/TSX sin errores de parseo; 7 tests nuevos de dominio aprobados al compilar únicamente ese módulo; sensor de colores sin hexadecimales fuera de `src/tema`. `npm test` completo, `tsc --noEmit`, emulador de Firestore y Expo Go **no se han ejecutado con éxito en este entorno** por falta de instalación de dependencias. No afirmar que están en verde hasta comprobarlos en el equipo de entrega.
