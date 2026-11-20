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
- Promo con fecha: variable `PROMO` de Netlify (`nombre;desde;hasta;porcentaje[;cursos]`, reglas en
  `netlify/lib/promo.js`); se carga y se vuelve a publicar. El webhook la acepta solo con el `appscript-cursos.gs`
  del 20/11/2026 pegado en Apps Script.
- Plan de mejoras en curso: `docs/plan-mejoras-2027.md`, en la rama `mejoras-plan-2027`.
- Estilo: fondo negro, azul `#0b78fb`, naranja `#f6950a`, verde `#30a05a`. Textos en español rioplatense con voseo.
