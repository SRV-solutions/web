import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-facebook-pixel': '/node_modules/react-facebook-pixel/dist/fb-pixel.js',
    },
  },
});
