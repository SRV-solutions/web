import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { leerPromo } from './netlify/lib/promo.js';

// Promo con fecha desde la variable PROMO de Netlify (formato y reglas en netlify/lib/promo.js). Si está mal
// escrita, la publicación falla acá y sigue en línea la versión anterior, en vez de mostrar precios equivocados.
const PROMO = process.env.PROMO || '';
leerPromo(PROMO);

export default defineConfig({
  plugins: [react()],
  define: {
    __PROMO__: JSON.stringify(PROMO),
  },
  resolve: {
    alias: {
      'react-facebook-pixel': '/node_modules/react-facebook-pixel/dist/fb-pixel.js',
    },
  },
});
