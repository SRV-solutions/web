# Web de WEARESRV (wearesrv.com)

React 18 + Vite 6, publicada en Netlify, con funciones en `netlify/functions`. Repo `github.com:SRV-solutions/web`;
Netlify publica `master`. Nada se sube ni se mergea sin el OK de Marcos.

- Correr en local: `npm run dev -- --port 3480` (el 3000 está ocupado en esta PC). Vite no corre las Netlify
  Functions: en local los botones de pago y los formularios que llaman a `/.netlify/functions/...` no funcionan.
- No leer `.env`: tiene tokens reales de Mercado Pago y Meta.
- Precios: lo que se MUESTRA está en `src/data/cursosGrabados.js` y `src/data/packs.js`; lo que se COBRA, en
  `netlify/lib/cursos.js` y `netlify/lib/intensivos.js`; el mínimo que acepta el webhook, en `appscript-cursos.gs`
  (Apps Script de Google, se implementa a mano). Un cambio de precio toca los tres.
- Datos legales (razón social, CUIT, domicilio, Data Fiscal) y promociones con sus fechas: `src/data/legal.js`.
  Páginas legales: `src/components/Legal/`.
- Apps Script de compras (proyecto «Cursos» de la cuenta de SRV): `appscript-cursos.gs` es su `Código.gs` y
  `appscript-estellarium.gs`, su `estellarium.gs` (alta de alumnos en E-stellarium). Iguales a Google al
  20/11/2026. Antes de subir cambios, comparar con lo que hay en Google y aplicar solo las diferencias: allá
  también se edita a mano.
- Amigo invisible (`/amigo-invisible`): todo el juego está en `appscript-amigo-invisible.gs`, un proyecto de Apps
  Script aparte con su propia Sheet. La página le habla por `netlify/functions/amigo-invisible.js`
  (`AMIGO_WEBHOOK_URL` y `AMIGO_WEBHOOK_SECRET`; con esas dos en `.env` también anda con `npm run dev`). Las reglas
  (5 pistas, 3 intentos) están en el `CONFIG` del script y repetidas en `src/components/AmigoInvisible/reglas.js`.
  No se borra ningún mail: todo queda en la planilla como registro de quienes lo usaron.
- Promo con fecha: variable `PROMO` de Netlify (`nombre;desde;hasta;porcentaje[;cursos]`, reglas en
  `netlify/lib/promo.js`); se carga y se vuelve a publicar. El webhook la acepta solo con el `appscript-cursos.gs`
  del 20/11/2026 pegado en Apps Script.
- Título, descripción y vista previa de cada página: `src/data/seo.js` (y `src/data/seoCursos.js` para el inicio
  y los cursos, con `tituloBusqueda` en `cursosGrabados.js`). Al compilar, `scripts/seo-html.mjs` escribe un HTML
  por ruta con esos tags. Una ruta nueva en `App.jsx` necesita su entrada ahí o una regla en `public/_redirects`,
  y las indexables van también en `public/sitemap.xml`: si falta, el build se corta.
- Plan de mejoras en curso: `docs/plan-mejoras-2027.md`, en la rama `mejoras-plan-2027`.
- Estilo: fondo negro, azul `#0b78fb`, naranja `#f6950a`, verde `#30a05a`. Textos en español rioplatense con voseo.
