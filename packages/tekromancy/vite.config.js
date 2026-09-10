import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'tekromancy',
      fileName: (format) => {
        if (format === 'es') return 'index.js';
        if (format === 'umd') return 'tekromancy.umd.cjs';
        return `tekromancy.${format}.js`;
      },
      formats: ['es', 'umd', 'iife']
    },
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: false
  }
});
