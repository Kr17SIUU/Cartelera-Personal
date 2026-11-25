# Spec técnica — Mi año en cine

## Alcance
Nueva pestaña `MiAnio`, selector de años, métricas, migración de `vistaEn`, completado de TMDB, caché, mensajes de estados y reglas de Firestore. Fuera de alcance: revisionados, horas de series y compartir estadísticas.

## Documentos de origen
- `docs/prd/01_AnioCine.md`: decisiones D1–D13.
- `docs/backlog/01-historias-mi-anio.md`: HU-A.1 a HU-A.5.
- `DESIGN.md`: tokens, componentes y accesibilidad.

## Datos
`ItemLista`: `vistaEn?: string|null`, `generos?: string[]`, `duracionMin?: number|null`, `directores?: string[]`. Firestore mantiene timestamps para `vistaEn` y `actualizadoEn`. Las lecturas convierten timestamps a ISO para dominio/caché. Los campos ausentes de documentos antiguos son admitidos.

## Servicios
- `listaService.agregar`: conserva metadatos obtenidos al abrir detalle de TMDB.
- `listaService.actualizar`: al pasar a vista fija `serverTimestamp`; al salir elimina fecha con `null`; al editar comentario/calificación conserva fecha.
- `listaService.migrarFecha`: lectura/escritura transaccional de `actualizadoEn` si no hay fecha.
- `listaService.completarDatos`: TMDB de una en una, persiste géneros, duración y directores.
- `CarteleraContext`: consulta caché por usuario; evita Firebase en pantalla salvo por servicios.

## Dominio puro
`src/dominio/resumenAnual.ts`: `aniosDisponibles(items, anioActual)` y `resumenAnual(items, anio)`. Año y mes obtenidos con `getFullYear/getMonth`, relativos al huso del teléfono. Estadísticas y desempates no acceden a red ni al reloj.

## Reglas y seguridad
Ruta `usuarios/{uid}/mi_lista/{itemId}`; acceso exclusivo al titular; validar opcionales `vistaEn`, `generos`, `duracionMin` y `directores`. Publicar en Firebase después de probar emulador y permisos de dos cuentas.

## Criterio → verificación
| Decisión | Verificación |
|---|---|
| D1 | Marcar vista, salir, volver y editar valoración; comprobar timestamp en Firestore |
| D2 | Cargar obra antigua y comprobar migración una vez |
| D3 | Test de año local, fechas de borde |
| D4 | Test de selector incluyendo año actual y orden |
| D5 | Agregar película/serie y comprobar datos persistidos |
| D6 | Test de campos incompletos y ensayo de fallo TMDB |
| D7 | Test de redondeo de horas y películas sin duración |
| D8 | Test de género, desempates y alfabeto |
| D9 | Test de director solo películas |
| D10 | Test de doce meses y empate reciente |
| D11 | Test de obra con mayor nota y fecha reciente |
| D12 | Probar año vacío y botón de navegación |
| D13 | Desactivar red y comprobar caché y ausencia de mutaciones |

## Tickets
T-A01 a T-A10 descritos en `docs/backlog/01-historias-mi-anio.md`.

## Riesgos
Se requiere verificar en Firestore las reglas publicadas, compatibilidad con Expo Go y comportamiento de TMDB en la red real. La copia offline solo muestra fechas ya migradas, no puede inferir la fecha de un documento antiguo.
