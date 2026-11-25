# DESIGN — Mi Cartelera Personal

## Principios
Cinematográfica, cercana y organizada. Conservar la identidad del Proyecto 3; interfaz oscura, acentos lavanda, jerarquía de cifras y lectura clara.

## Tokens
Única fuente para valores cromáticos, espacios y radios: `src/tema/index.ts`, que reutiliza los valores originales de `src/theme/index.ts` durante la migración.

| Token | Hex | Uso |
|---|---|---|
| bg | `#0B0E17` | Fondo |
| panel | `#151B2A` | Tarjetas |
| raised | `#1D2538` | Superficies elevadas |
| line | `#2D374D` | Bordes |
| text | `#F4F5FA` | Texto principal |
| muted | `#A4AEC4` | Texto secundario |
| accent | `#AEABFF` | Controles y datos |
| accentDark | `#34315C` | Selección |
| success | `#8DE0BD` | Vista / éxito |
| danger | `#FF9AAB` | Error |

Escala de espacios: 4, 8, 12, 16, 20, 22, 24, 32. Radios: 10, 12, 14, 20, 26. Tipografía del sistema con títulos 30/800, subtítulos 20/700, cuerpo 15 y cifras 23–38/800. Objetivos táctiles de 44 puntos como mínimo.

## Componentes
Conservar `Poster`, `TarjetaObra`, `Estrellas`, `SelectorEstado`, `Boton`, `Chip`, `Aviso` y `Vacio`. Nuevos: tarjeta de dato, selector de año, doce barras con View, obra destacada y estados de resumen.

## Pantallas
`Buscar`, `Mi lista` y `Acerca` conservan su identidad. `Mi año` se incorpora en las pestañas inferiores, con encabezado, selector, totales, horas, género y director, barras de meses y obra destacada.

## Voz
Mensajes directos y cercanos. Vacío: «Todavía no tienes obras vistas este año». Error: «No pudimos cargar tu resumen». Sin conexión: «Mostramos tu copia guardada».

## Accesibilidad
Contraste mínimo 4,5:1 para texto normal; acompañar todo color con texto; 44 puntos táctiles; etiqueta accesible por barra mensual; no usar solo color para el estado.

## Sí y no
| Sí | No |
|---|---|
| Reutilizar tokens de tema | Escribir hexadecimales nuevos en pantallas |
| Mostrar los 12 meses | Ocultar meses sin actividad |
| Mensajes de carga, vacío y error | Dejar áreas de pantalla en blanco |
| Barras con View | Añadir librerías de gráficas |
| Mantener atribución de TMDB | Usar TMDB como marca principal |

## Pendientes
Confirmar visualmente el brand board en navegador; probar contrastes y tamaños sobre teléfono real. Los valores se basan en el Proyecto 3.
