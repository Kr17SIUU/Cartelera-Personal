# Backlog — Mi año en cine

## 1. Épica

**EP-A: Mi año en cine**

Como usuario de Mi Cartelera Personal, quiero consultar un resumen anual de las películas y series que he visto para conocer mis hábitos de consumo audiovisual.

El resumen deberá permitir cambiar de año, mostrar estadísticas y utilizar las obras que ya están guardadas.

## 2. Historias de usuario y criterios de aceptación

### HU-A.1 — Registrar fecha de visionado

Como usuario, quiero que la aplicación recuerde cuándo vi cada obra para que mis estadísticas sean correctas.

**CA-01 (D1): Registrar y actualizar fecha**

- **DADO** que una obra no está marcada como vista.
- **CUANDO** cambio su estado a vista.
- **ENTONCES** se guarda `vistaEn` mediante `serverTimestamp`.

Si deja de estar vista, la fecha vuelve a `null`. Si vuelve al estado vista, recibe una nueva fecha. Editar una calificación o comentario no cambia la fecha.

### HU-A.2 — Consultar resumen anual

Como usuario, quiero ver mis estadísticas anuales para conocer mi actividad.

**CA-02 (D7): Horas de cine**

- **DADO** que tengo películas y series vistas durante un año.
- **CUANDO** consulto el resumen.
- **ENTONCES** se muestran las obras totales y las horas de películas, con un decimal, sin sumar duración de series.

Las películas sin duración se contabilizan y se indica cuántas no aportaron horas.

**CA-03 (D8): Género más visto**

- **DADO** que mis obras tienen géneros asociados.
- **CUANDO** se calcula el género más visto.
- **ENTONCES** cada obra aporta una unidad a cada género y se aplican los desempates por promedio de calificación personal y orden alfabético.

**CA-04 (D9): Director más visto**

- **DADO** que tengo películas con directores.
- **CUANDO** consulto mis estadísticas.
- **ENTONCES** se muestra el director más frecuente, aplicando los mismos desempates que para géneros.

Si no existen datos suficientes, se informa al usuario.

**CA-05 (D10): Mes más activo**

- **DADO** que tengo obras vistas durante el año.
- **CUANDO** se calculan las estadísticas mensuales.
- **ENTONCES** aparecen los 12 meses, incluidos los que tienen cero obras.

Si dos meses empatan, gana el más reciente.

**CA-06 (D11): Obra destacada**

- **DADO** que tengo obras vistas con calificaciones personales.
- **CUANDO** consulto el resumen.
- **ENTONCES** se muestra la mejor calificada.

Si existe empate, gana la más recientemente vista. Si ninguna está calificada, se invita al usuario a calificar.

### HU-A.3 — Seleccionar un año

Como usuario, quiero cambiar de año para consultar estadísticas de diferentes períodos.

**CA-07 (D3): Clasificación anual**

- **DADO** que una obra tiene `vistaEn`.
- **CUANDO** se calcula el resumen de un año.
- **ENTONCES** la obra pertenece al año calendario de esa fecha según la hora local del teléfono y cuenta una sola vez.

**CA-08 (D4): Años disponibles**

- **DADO** que tengo obras vistas en distintos años.
- **CUANDO** abro el selector.
- **ENTONCES** aparecen los años con obras vistas y el actual, ordenados del más reciente al más antiguo.

El selector comienza en el año actual.

### HU-A.4 — Recuperar obras anteriores

Como usuario, quiero que mis obras anteriores a la actualización aparezcan en el resumen sin perder información.

**CA-09 (D2): Migración de fechas**

- **DADO** que una obra está vista y no tiene `vistaEn`.
- **CUANDO** abro Mi año en cine con conexión.
- **ENTONCES** se asigna `actualizadoEn` como fecha de visionado y se guarda en Firestore una sola vez.

**CA-10 (D5): Datos de TMDB**

- **DADO** que agrego una película o serie.
- **CUANDO** se guarda en Mi lista.
- **ENTONCES** se almacenan géneros en español, duración para películas y directores para películas, respetando los límites y valores nulos definidos en el PRD.

**CA-11 (D6): Completar información faltante**

- **DADO** que existen obras vistas sin información de TMDB.
- **CUANDO** abro el resumen de un año con conexión.
- **ENTONCES** se consulta TMDB secuencialmente, se guarda la información disponible y se muestra el progreso.

Si una consulta falla, la obra permanece en el total y se informa cuántas quedaron sin datos.

### HU-A.5 — Comprender estados especiales

Como usuario, quiero recibir mensajes claros cuando no existan estadísticas o los datos estén incompletos.

**CA-12 (D12): Año vacío**

- **DADO** que el año seleccionado no contiene obras vistas.
- **CUANDO** abro el resumen.
- **ENTONCES** aparece un estado vacío con el botón Ir a Mi lista.

**CA-13 (D13): Sin conexión**

- **DADO** que el teléfono no tiene conexión.
- **CUANDO** consulto Mi año en cine.
- **ENTONCES** se calcula el resumen utilizando AsyncStorage y aparece un aviso de información local.

No se ejecutan migraciones ni solicitudes a TMDB sin conexión.

## 3. Tickets de desarrollo

| Ticket | Trabajo | Historias |
|---|---|---|
| T-A01 | Ampliar el modelo y guardar `vistaEn` | HU-A.1 |
| T-A02 | Obtener y almacenar metadatos de TMDB | HU-A.4 |
| T-A03 | Implementar migración de fechas y datos | HU-A.4 |
| T-A04 | Crear funciones puras de resumen anual | HU-A.2, HU-A.3 |
| T-A05 | Implementar selector de año | HU-A.3 |
| T-A06 | Crear tarjetas y barras mensuales | HU-A.2 |
| T-A07 | Implementar estados especiales y caché | HU-A.5 |
| T-A08 | Actualizar y verificar reglas de Firestore | HU-A.1, HU-A.4 |
| T-A09 | Integrar la pestaña en React Navigation | HU-A.2 |
| T-A10 | Ejecutar pruebas y verificación manual | Todas |

## 4. Definition of Done

Un ticket se considera terminado cuando:

1. Su especificación está documentada antes del código.
2. Los criterios relacionados tienen una verificación asignada.
3. El código respeta la arquitectura y el sistema de diseño.
4. Se implementan los tests necesarios.
5. `npm test` pasa correctamente.
6. `npx tsc --noEmit` termina sin errores.
7. Se verifica la experiencia en Expo Go cuando corresponde.
8. Los cambios han sido revisados.
9. El commit sigue el formato establecido en español.

## 5. Puntos abiertos

Se mantienen los puntos abiertos del PRD relativos a fechas anteriores inválidas, ausencia de caché sin conexión y migraciones interrumpidas. Deben resolverse con el docente antes de implementar comportamientos que no estén definidos por las decisiones D1–D13.