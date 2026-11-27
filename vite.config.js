import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { leerPromo } from './netlify/lib/promo.js';
import seoHtml from './scripts/seo-html.mjs';

// Promo con fecha desde la variable PROMO de Netlify (formato y reglas en netlify/lib/promo.js). Si está mal
// escrita, la publicación falla acá y sigue en línea la versión anterior, en vez de mostrar precios equivocados.
const PROMO = process.env.PROMO || '';
leerPromo(PROMO);

// Solo en `npm run dev`: atiende /.netlify/functions/<nombre> con la misma función de Netlify. Toma del entorno o
// del .env solo las variables que esa función necesita (el prefijo filtra el resto). Las demás funciones siguen sin
// andar en local (crear-preferencia usaría el token real de Mercado Pago).
//  - validar-cupon: para probar los cupones (ESTELLARIUM_URL y ESTELLARIUM_KEY).
//  - amigo-invisible: para probar el juego contra el Apps Script real (AMIGO_WEBHOOK_URL y AMIGO_WEBHOOK_SECRET).
//    Los grupos quedan en la planilla y los mails salen de verdad, con links a localhost.
function funcionLocal(nombre, prefijo, claves) {
  return {
    name: `${nombre}-local`,
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), prefijo);
      for (const k of claves) process.env[k] ??= env[k];
      server.middlewares.use(`/.netlify/functions/${nombre}`, async (req, res) => {
        let body = '';
        for await (const parte of req) body += parte;
        const { handler } = await server.ssrLoadModule(`/netlify/functions/${nombre}.js`);
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
  plugins: [
    react(),
    seoHtml({ promo: PROMO }),
    funcionLocal('validar-cupon', 'ESTELLARIUM_', ['ESTELLARIUM_URL', 'ESTELLARIUM_KEY']),
    funcionLocal('amigo-invisible', 'AMIGO_', ['AMIGO_WEBHOOK_URL', 'AMIGO_WEBHOOK_SECRET']),
  ],
  define: {
    __PROMO__: JSON.stringify(PROMO),
  },
  resolve: {
    alias: {
      'react-facebook-pixel': '/node_modules/react-facebook-pixel/dist/fb-pixel.js',
    },
  },
});
