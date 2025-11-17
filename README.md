# Sistema de Gestión de Control - UMP

Sitio estático (vanilla JS) pensado para ser desplegado como una SPA PWA.

Instrucciones rápidas para publicar (GitHub Pages via Actions):

1. Crea un repositorio en GitHub y añade el remoto (PowerShell):

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<TU_USUARIO>/<TU_REPO>.git
git push -u origin main
```

2. El workflow en `.github/workflows/deploy.yml` desplegará automáticamente el contenido del repositorio a la rama `gh-pages` cuando hagas push a `main` (o `master`). GitHub Pages servirá el contenido desde esa rama.

3. Alternativas:
- Netlify: arrastra la carpeta del proyecto o conecta el repo (deploy automático).
- Vercel: conectar repo y seleccionar configuración por defecto para sitio estático.

Notas importantes:
- No hay paso de build — los archivos `index.html`, `script.js`, `modules/` y `assets/` son estáticos.
- Asegúrate de que el `index.html` y los `script` tags mantengan el orden: `script.js` se carga antes que los módulos en `modules/`.
- Datos persistentes se guardan en `localStorage` bajo las claves: `datosControles`, `puntos`, `papelera`, `currentUser`, `darkMode`.

Si quieres, puedo también:
- Configurar un nombre de dominio (`CNAME`) y añadir el archivo.
- Preparar un deploy a Netlify/Vercel con una configuración paso a paso.
