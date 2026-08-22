# Reglas del proyecto Webtrova

## Sistema tipográfico de la web principal

La web principal utiliza exactamente cinco niveles tipográficos. La fuente de
verdad está en `assets/styles.css`, dentro de `@layer tokens`:

- `--type-1`: 12 px. Etiquetas, notas, metadatos y ayudas de tablas.
- `--type-2`: 16 px. Antetítulos editoriales, texto base, párrafos,
  formularios y navegación común.
- `--type-3`: 24 px. Destacados, botones grandes, títulos de tarjetas y cifras.
- `--type-4`: 32–52 px responsive. Títulos de sección y encabezados internos.
- `--type-5`: 52–112 px responsive. Portadas y títulos principales.

Al crear o modificar componentes de la web principal:

1. Usar siempre `font-size: var(--type-N)` con uno de esos cinco tokens.
2. No introducir valores tipográficos nuevos en px, rem, vw o `clamp()`.
3. Resolver el comportamiento responsive dentro de los tokens, no creando una
   escala adicional en media queries.
4. Mantener la jerarquía semántica: texto auxiliar → 1; antetítulo editorial
   y cuerpo → 2; destacado → 3; título de sección → 4; portada → 5.

### Patrón editorial global 2 → 4 → 2

Toda sección que combine antetítulo llamativo, título principal y descripción
debe usar esta estructura, también en responsive:

- Antetítulo o `eyebrow`: `--type-2`.
- Título de sección: `--type-4`.
- Descripción: `--type-2`.

El hero principal conserva su jerarquía específica de portada.

`trovito-chatbot.html` y el contenido interno de `<trovito-chat>` quedan fuera
de esta estandarización hasta que el usuario solicite trabajarlos expresamente.

### Asignaciones aprobadas de la portada

En el hero principal de `index.html`:

- “El auténtico helado artesanal desde 1934”: `--type-2`.
- “Todos los días, en la esquina más helada de Pocitos”: `--type-3`, en una
  sola línea por encima de 52 rem y con ajuste natural de línea en móvil.

En el bloque verde de productos de `index.html` mantener esta jerarquía:

- “Para todos los gustos”: `--type-2`.
- “Explorá nuestros productos y sabores”: `--type-4`.
- “Descubrí nuestra línea…”: `--type-2`.
