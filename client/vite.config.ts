import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Define a custom Vite plugin
const brotliHeadersPlugin = () => ({
  name: 'brotli-headers',
  configureServer(server) {
    // Add middleware to set Content-Encoding: br for .br files
    server.middlewares.use((req, res, next) => {
      if (req.url?.endsWith('.br')) {
        res.setHeader('Content-Encoding', 'br');
        // Set the correct Content-Type based on the original file type
        if (req.url.includes('.js.br')) {
          res.setHeader('Content-Type', 'application/javascript');
        } else if (req.url.includes('.wasm.br')) {
          res.setHeader('Content-Type', 'application/wasm');
        } else if (req.url.includes('.data.br')) {
          res.setHeader('Content-Type', 'application/octet-stream');
        }

        // Important: Remove the proxy redirect and serve directly
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
      }
      next();
    });
  },
});

export default defineConfig({
  plugins: [
    react(),
    brotliHeadersPlugin()
  ],
  assetsInclude: ['**/*.br'],
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  css: {
    postcss: './postcss.config.mjs' // Aponta para o arquivo PostCSS
  },
});