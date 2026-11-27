import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// base './' deixa os caminhos do build relativos, para o site funcionar
// dentro de uma subpasta do GitHub Pages.
export default defineConfig({
  base: './',
  plugins: [react()],
});
