import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore "use client" directive warnings from framer-motion and react-toastify
        if (
          warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
          typeof warning.message === 'string' &&
          warning.message.indexOf('use client') !== -1
        ) {
          return;
        }
        warn(warning);
      }
    }
  },
  // Add base path for GitHub Pages deployment
  base: './'
})
