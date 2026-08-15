import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    target: 'es2022',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          three: ['three'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
  },
});
