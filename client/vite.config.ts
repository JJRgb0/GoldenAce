import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react()
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  css: {
    postcss: './postcss.config.mjs' // Aponta para o arquivo PostCSS
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000', // Todas as chamadas /api vão para o backend
    },
  },
});