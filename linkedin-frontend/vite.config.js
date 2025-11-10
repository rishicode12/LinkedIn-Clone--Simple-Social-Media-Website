import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(),tailwindcss()],
  server: {
    port: 5174,
    host: true,
    strictPort: false,
    open: false
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(-1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${assetInfo.name}`;
        },
      },
    },
  },
  publicDir: 'public',
  // Handle missing assets gracefully
  assetsInclude: ['**/*.woff', '**/*.woff2', '**/*.ttf'],
})