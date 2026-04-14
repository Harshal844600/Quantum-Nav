import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const terserConfig = {
  compress: {
    drop_console: true,
    drop_debugger: true,
  },
  mangle: true,
  format: {
    comments: false,
  },
}

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2019',
    minify: 'terser',
    terserOptions: terserConfig,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules/react')) return 'vendor-react';
          if (id.includes('node_modules/@mui')) return 'vendor-mui';
          if (id.includes('node_modules/react-router')) return 'vendor-router';
          if (id.includes('node_modules/framer-motion')) return 'vendor-animation';
          if (id.includes('node_modules/react-leaflet') || id.includes('node_modules/leaflet')) return 'vendor-map';
          return undefined;
        },
      },
    },
    sourcemap: false,
    reportCompressedSize: true,
  },
})
