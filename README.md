# Trova 2026

Sitio web oficial de Heladería Los Trovadores.

## Vista previa local

No requiere instalación ni proceso de compilación. Desde la raíz del
repositorio, iniciar un servidor web local y abrir la dirección indicada:

```bash
python3 -m http.server 8000
```

Luego visitar `http://localhost:8000/`.

## Publicación

Los archivos HTML, CSS, JavaScript e imágenes se publican directamente desde
la raíz. Las reseñas de Google y el formulario de sugerencias requieren PHP y
variables privadas en el servidor; la configuración está documentada en
[`DEPLOY-RESENAS.md`](DEPLOY-RESENAS.md).

Las credenciales reales, cachés y materiales de producción locales están
excluidos mediante `.gitignore`.
