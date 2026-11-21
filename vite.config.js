import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { leerPromo } from './netlify/lib/promo.js';
import seoHtml from './scripts/seo-html.mjs';

// Promo con fecha desde la variable PROMO de Netlify (formato y reglas en netlify/lib/promo.js). Si está mal
// escrita, la publicación falla acá y sigue en línea la versión anterior, en vez de mostrar precios equivocados.
const PROMO = process.env.PROMO || '';
leerPromo(PROMO);

// Solo en `npm run dev`: atiende /.netlify/functions/validar-cupon con la misma función de Netlify, para probar los
// cupones en local. Toma ESTELLARIUM_URL y ESTELLARIUM_KEY del entorno o del .env (solo esas dos: el prefijo filtra
// el resto). Las demás funciones siguen sin andar en local (crear-preferencia usaría el token real de Mercado Pago).
function validarCuponLocal() {
  return {
    name: 'validar-cupon-local',
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), 'ESTELLARIUM_');
      for (const k of ['ESTELLARIUM_URL', 'ESTELLARIUM_KEY']) process.env[k] ??= env[k];
      server.middlewares.use('/.netlify/functions/validar-cupon', async (req, res) => {
        let body = '';
        for await (const parte of req) body += parte;
        const { handler } = await server.ssrLoadModule('/netlify/functions/validar-cupon.js');
        const r = await handler({ httpMethod: req.method, headers: req.headers, body });
        res.statusCode = r.statusCode;
        res.setHeader('Content-Type', 'application/json');
        res.end(r.body);
      });
    },
  };
}

export default defineConfig({
  // seoHtml: al compilar escribe un HTML por ruta con su título y su vista previa (scripts/seo-html.mjs)
  plugins: [react(), seoHtml({ promo: PROMO }), validarCuponLocal()],
  define: {
    __PROMO__: JSON.stringify(PROMO),
  },
  resolve: {
    alias: {
      'react-facebook-pixel': '/node_modules/react-facebook-pixel/dist/fb-pixel.js',
    },
  },
});
