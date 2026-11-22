# PRD — Mi año en cine

## 1. Descripción del producto

**Proyecto:** Mi Cartelera Personal  
**Épica:** Mi año en cine  
**Tecnologías:** React Native, Expo, TypeScript, Firebase, Firestore y TMDB.

Mi Cartelera Personal permite buscar películas y series, guardarlas en una lista personal, actualizar su estado, calificarlas y escribir comentarios.

La nueva funcionalidad **Mi año en cine** permitirá que cada usuario consulte un resumen anual de las películas y series que ha visto, utilizando la información almacenada en Firestore y los datos complementarios obtenidos de TMDB.

## 2. Objetivo

Implementar una nueva pestaña donde el usuario pueda visualizar sus estadísticas de consumo audiovisual por año, sin perder las funcionalidades existentes de la aplicación.

La nueva pantalla deberá mostrar:

- Número total de obras vistas.
- Cantidad de películas y series vistas.
- Horas acumuladas de películas.
- Género más visto.
- Director más visto.
- Mes de mayor actividad.
- Gráfico de actividad de enero a diciembre.
- Obra mejor calificada.
- Selector de año.

## 3. Historias de usuario

**HU-A.1 — Fecha de visionado:** Como usuario, quiero que la aplicación recuerde cuándo vi cada obra para que mis estadísticas sean correctas.

**HU-A.2 — Resumen anual:** Como usuario, quiero consultar mis estadísticas del año para conocer mis hábitos de consumo audiovisual.

**HU-A.3 — Selector de año:** Como usuario, quiero cambiar el año seleccionado para comparar mi actividad de distintos períodos.

**HU-A.4 — Compatibilidad con obras anteriores:** Como usuario, quiero que mis obras guardadas antes de esta actualización aparezcan en el resumen sin perder información.

**HU-A.5 — Estados y mensajes:** Como usuario, quiero entender cuándo mis estadísticas están vacías, incompletas o no disponibles.

## 4. Reglas de negocio

### D1. Fecha de visionado

Se incorpora el campo `vistaEn`. Cuando una obra pasa al estado `vista`, se registra la fecha mediante `serverTimestamp`.

Si deja de estar vista, `vistaEn` vuelve a `null`. Si vuelve a marcarse como vista, se registra una fecha nueva.

Editar una calificación o comentario no modifica `vistaEn`.

### D2. Migración de obras anteriores

Al abrir *Mi año en cine*, las obras que ya estaban en estado `vista` y no tengan `vistaEn` reciben como fecha el valor de `actualizadoEn`.

La migración se guarda en Firestore y no debe repetirse para los documentos ya migrados.

### D3. Año de una obra

Cada obra pertenece al año calendario correspondiente a `vistaEn`, utilizando la hora local del teléfono.

Cada obra se contabiliza una sola vez. No se consideran revisionados.

### D4. Años disponibles

El selector muestra los años con al menos una obra vista, además del año actual.

Los años se ordenan del más reciente al más antiguo. La pantalla abre inicialmente en el año actual.

### D5. Información de TMDB

Al agregar una obra se almacenan:

- `generos`: nombres en español, máximo 10.
- `duracionMin`: duración de películas; `null` para series.
- `directores`: lista de directores de películas, máximo 10; lista vacía para series.

### D6. Datos faltantes

Al abrir el resumen se completan desde TMDB los datos faltantes de las obras vistas del año seleccionado.

Las consultas se realizan de una en una, mostrando el progreso.

Si TMDB falla, la obra sigue contando en el total, pero no aporta información faltante a las estadísticas de horas, género o director.

La pantalla muestra cuántas obras quedaron sin datos.

### D7. Horas de cine

Se suman los minutos de las películas vistas y se convierten a horas con un decimal.

Las series cuentan como obras vistas, pero no suman horas.

Las películas sin duración no suman y se indica cuántas hay.

### D8. Género más visto

Cada obra suma una unidad a cada uno de sus géneros.

En caso de empate, gana el género con mayor promedio de calificación personal entre las obras calificadas.

Un género sin obras calificadas pierde frente a uno con calificaciones.

Si persiste el empate, se utiliza el orden alfabético.

### D9. Director más visto

Se contabilizan únicamente los directores de películas.

El desempate sigue las mismas reglas de D8.

Si no existen películas con información de director, se muestra un mensaje indicando que no hay datos suficientes.

### D10. Mes más activo

Se contabilizan las obras vistas en cada uno de los 12 meses.

El mes con mayor cantidad es el más activo. En caso de empate, gana el mes más reciente.

El gráfico muestra todos los meses, incluidos aquellos sin actividad.

### D11. Obra destacada

Se selecciona la obra con mayor calificación personal.

Si existe empate, gana aquella cuya fecha `vistaEn` sea más reciente.

Si ninguna obra tiene calificación, se invita al usuario a calificar una obra.

### D12. Resumen vacío

Si el año seleccionado no contiene obras vistas, se muestra un estado vacío con el botón **Ir a Mi lista**.

### D13. Funcionamiento sin conexión

Cuando no existe conexión, se calcula el resumen utilizando la copia disponible en AsyncStorage.

Se muestra un aviso indicando que se está utilizando información local.

Sin conexión no se migran fechas ni se completan datos desde TMDB.

## 5. Cambios al modelo de datos

Se conserva la ruta de Firestore:

`usuarios/{uid}/mi_lista/{itemId}`

Se incorporan cuatro campos a los documentos:

| Campo | Tipo | Descripción |
|---|---|---|
| vistaEn | timestamp o null | Fecha de visionado |
| generos | string[] | Géneros en español |
| duracionMin | number o null | Duración de películas |
| directores | string[] | Directores de películas |

Las reglas de Firestore deberán aceptar documentos antiguos que todavía no tengan estos campos y validar los límites establecidos.

## 6. Requisitos técnicos

- Mantener la arquitectura original de React Navigation.
- Utilizar servicios para Firebase y TMDB.
- Implementar las estadísticas mediante funciones puras en `src/dominio/resumenAnual.ts`.
- Probar `resumenAnual` y `aniosDisponibles` utilizando Vitest.
- Utilizar tokens de `src/tema/` y las reglas de `DESIGN.md`.
- Construir las barras mensuales con componentes `View`, sin bibliotecas de gráficas.
- Mantener los datos aislados por usuario.
- Preservar la atribución de TMDB.
- Soportar los estados de carga, vacío, error, sin conexión y datos incompletos.

## 7. Fuera de alcance

- Registro de múltiples visionados de una misma obra.
- Estadísticas de duración de series.
- Comparaciones entre diferentes usuarios.
- Compartir automáticamente estadísticas en redes sociales.
- Incorporar bibliotecas externas de gráficos.

## 8. Criterios generales de aceptación

La funcionalidad se considerará completa cuando:

1. Se pueda marcar una obra como vista y registrar su fecha.
2. Las estadísticas anuales se calculen correctamente.
3. El selector de año funcione.
4. Las obras antiguas se migren sin pérdida de información.
5. Los datos faltantes puedan completarse desde TMDB.
6. Los estados vacíos, incompletos y sin conexión tengan mensajes claros.
7. Los tests automatizados pasen.
8. La nueva pantalla funcione en Expo Go.
9. Las reglas de Firestore protejan los datos de cada usuario.

## 9. Puntos abiertos

Las siguientes cuestiones deben aclararse antes de la implementación si no están definidas en las decisiones del cliente:

- ¿Cómo proceder si una obra antigua no contiene un `actualizadoEn` válido?
- ¿Qué comportamiento se espera cuando no existe una copia local en AsyncStorage y el dispositivo está sin conexión?
- ¿Cómo debe comportarse una migración parcialmente completada si se interrumpe la conexión?

Estos puntos no modifican las decisiones D1–D13 y deberán registrarse antes de resolverlos en código.
